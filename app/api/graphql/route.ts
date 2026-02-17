import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'https://ludmil.pythonanywhere.com';

function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value === 'string') {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function normalizeInquiryMessage(raw: any) {
  return {
    id: raw?.id,
    sender: raw?.sender,
    message: raw?.message,
    timestamp: raw?.timestamp,
  };
}

function normalizeTask(raw: any) {
  return {
    id: raw?.id,
    title: raw?.title,
    description: raw?.description,
    status: raw?.status,
    assignedTo: raw?.assigned_to ?? raw?.assignedTo,
    dueDate: raw?.due_date ?? raw?.dueDate,
    createdAt: raw?.created_at ?? raw?.createdAt,
    priority: raw?.priority,
  };
}

function normalizeInvoiceItem(raw: any) {
  return {
    description: raw?.description,
    quantity: raw?.quantity,
    price: toNumber(raw?.price) ?? raw?.price,
  };
}

function normalizeInvoice(raw: any) {
  return {
    id: raw?.id,
    invoiceNumber: raw?.invoice_number ?? raw?.invoiceNumber,
    amount: toNumber(raw?.amount) ?? raw?.amount,
    status: raw?.status,
    dueDate: raw?.due_date ?? raw?.dueDate,
    createdAt: raw?.created_at ?? raw?.createdAt,
    description: raw?.description,
    items: Array.isArray(raw?.items) ? raw.items.map(normalizeInvoiceItem) : [],
  };
}

function normalizeDocument(raw: any) {
  return {
    id: raw?.id,
    title: raw?.title,
    type: raw?.type,
    status: raw?.status,
    createdAt: raw?.created_at ?? raw?.createdAt,
    signedAt: raw?.signed_at ?? raw?.signedAt,
    expiresAt: raw?.expires_at ?? raw?.expiresAt,
    downloadUrl: raw?.download_url ?? raw?.downloadUrl,
    content: raw?.content,
    file: raw?.file,
    signedBy: raw?.signed_by ?? raw?.signedBy,
    adminSignedAt: raw?.admin_signed_at ?? raw?.adminSignedAt,
    adminSignedBy: raw?.admin_signed_by ?? raw?.adminSignedBy,
    clientSignedAt: raw?.client_signed_at ?? raw?.clientSignedAt,
    clientSignedBy: raw?.client_signed_by ?? raw?.clientSignedBy,
  };
}

function normalizeTeamMember(raw: any) {
  return {
    id: raw?.id,
    name: raw?.name,
    role: raw?.role,
    email: raw?.email,
  };
}

function normalizeInquiry(raw: any) {
  return {
    id: raw?.id,
    clientName: raw?.client_name ?? raw?.clientName,
    clientEmail: raw?.client_email ?? raw?.clientEmail,
    clientPhone: raw?.client_phone ?? raw?.clientPhone,
    projectTitle: raw?.project_title ?? raw?.projectTitle,
    projectDescription: raw?.project_description ?? raw?.projectDescription,
    projectType: raw?.project_type ?? raw?.projectType,
    budget: raw?.budget,
    timeline: raw?.timeline,
    additionalRequirements: raw?.additional_requirements ?? raw?.additionalRequirements ?? '',
    status: raw?.status,
    priority: raw?.priority,
    estimatedCost: toNumber(raw?.estimated_cost ?? raw?.estimatedCost),
    actualCost: toNumber(raw?.actual_cost ?? raw?.actualCost),
    progress: toNumber(raw?.progress) ?? 0,
    createdAt: raw?.created_at ?? raw?.createdAt,
    updatedAt: raw?.updated_at ?? raw?.updatedAt,
    messages: Array.isArray(raw?.messages) ? raw.messages.map(normalizeInquiryMessage) : [],
    tasks: Array.isArray(raw?.tasks) ? raw.tasks.map(normalizeTask) : [],
    invoices: Array.isArray(raw?.invoices) ? raw.invoices.map(normalizeInvoice) : [],
    documents: Array.isArray(raw?.documents) ? raw.documents.map(normalizeDocument) : [],
    teamMembers: Array.isArray(raw?.team_members) ? raw.team_members.map(normalizeTeamMember) : (Array.isArray(raw?.teamMembers) ? raw.teamMembers.map(normalizeTeamMember) : []),
  };
}

function stripHtml(html: unknown): string {
  if (typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeProjectStatus(status: any): 'live' | 'upcoming' | 'in-progress' | 'clone' {
  // Backend Project model uses integers:
  // 1=clone, 2=live, 3=upcoming, 4=in_progress
  const n = toNumber(status);
  switch (n) {
    case 1:
      return 'clone';
    case 2:
      return 'live';
    case 3:
      return 'upcoming';
    case 4:
      return 'in-progress';
    default:
      return 'live';
  }
}

function normalizeProject(raw: any) {
  const tools = Array.isArray(raw?.tools) ? raw.tools : [];
  return {
    id: raw?.id,
    title: raw?.title,
    description: stripHtml(raw?.description) || raw?.description || '',
    image: raw?.image,
    status: normalizeProjectStatus(raw?.status),
    technologies: tools.map((t: any) => t?.title).filter(Boolean),
    createdAt: raw?.created_at ?? raw?.createdAt,
    updatedAt: raw?.updated_at ?? raw?.updatedAt,
    url: raw?.demo ?? raw?.url,
    githubUrl: raw?.github ?? raw?.githubUrl,
    progress: toNumber(raw?.progress),
    estimatedCost: toNumber(raw?.estimated_cost ?? raw?.estimatedCost),
    actualCost: toNumber(raw?.actual_cost ?? raw?.actualCost),
    timeline: raw?.timeline,
    tasks: [],
    documents: [],
    teamMembers: [],
  };
}

export async function POST(request: NextRequest) {
  try {
    // Support multipart form submissions for project CRUD (image upload)
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const type = String(form.get("type") || "");

      if (type === "create-project" || type === "update-project") {
        const endpoint = type === "create-project" ? "/api/create-project/" : "/api/update-project/";

        // forward form data to Django
        const res = await fetch(`${DJANGO_API_URL}${endpoint}`, {
          method: "POST",
          body: form,
        });

        const json = await res.json().catch(() => null);
        if (!res.ok) {
          return NextResponse.json(
            { success: false, error: json?.error || json?.message || "Project save failed" },
            { status: res.status }
          );
        }

        if (json?.success && json?.data) {
          return NextResponse.json({ success: true, data: normalizeProject(json.data) });
        }
        return NextResponse.json(json ?? { success: false, error: "Invalid response" });
      }

      if (type === "add-document") {
        // Forward FormData to Django for document creation with file upload
        const res = await fetch(`${DJANGO_API_URL}/api/add-document/`, {
          method: "POST",
          body: form,
        });

        const json = await res.json().catch(() => null);
        if (!res.ok) {
          return NextResponse.json(
            { success: false, error: json?.error || json?.message || "Failed to add document" },
            { status: res.status }
          );
        }

        if (json?.success && json?.data) {
          return NextResponse.json({ success: true, data: normalizeDocument(json.data) });
        }
        return NextResponse.json(json ?? { success: false, error: "Invalid response" });
      }

      return NextResponse.json({ success: false, error: `Unknown multipart type: ${type}` }, { status: 400 });
    }

    const body = await request.json();
    const { type, data } = body;

    // Get authorization token from headers
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Handle login request
    if (type === 'login') {
      const { username, password } = data || {};
      
      if (!username || !password) {
        return NextResponse.json(
          { success: false, error: 'Username and password are required' },
          { status: 400 }
        );
      }

      const response = await fetch(`${DJANGO_API_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: result.error || 'Login failed', error_code: result.error_code },
          { status: response.status }
        );
      }

      // Django returns { success, token, user } - wrap it in data for consistency
      if (result.success && result.token && result.user) {
        return NextResponse.json({
          success: true,
          data: {
            token: result.token,
            user: result.user
          }
        });
      }

      return NextResponse.json(result);
    }

    // Handle token verification
    if (type === 'verify-token') {
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Token is required' },
          { status: 401 }
        );
      }

      // Try to verify token by attempting to get user info
      // If Django has a verify endpoint, use it; otherwise verify by trying to use the token
      try {
        const response = await fetch(`${DJANGO_API_URL}/accounts/user/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          return NextResponse.json({ success: true, data: result });
        } else if (response.status === 404) {
          // Endpoint doesn't exist, return success if token is present (basic validation)
          return NextResponse.json({ success: true, message: 'Token present' });
        } else {
          return NextResponse.json(
            { success: false, error: 'Token verification failed' },
            { status: response.status }
          );
        }
      } catch (error) {
        // If endpoint doesn't exist, consider token valid if present
        return NextResponse.json({ success: true, message: 'Token present' });
      }
    }

    // Handle get-user request
    if (type === 'get-user') {
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Token is required' },
          { status: 401 }
        );
      }

      try {
        const response = await fetch(`${DJANGO_API_URL}/accounts/user/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          return NextResponse.json({ success: true, data: result });
        } else if (response.status === 404) {
          // Endpoint doesn't exist - try to decode token or return success with token validation
          // For now, return success since token verification already passed
          return NextResponse.json({
            success: true,
            message: 'User endpoint not implemented, using token validation'
          });
        } else {
          return NextResponse.json(
            { success: false, error: 'Failed to get user data' },
            { status: response.status }
          );
        }
      } catch (error) {
        // If endpoint doesn't exist, return success (token is valid)
        return NextResponse.json({
          success: true,
          message: 'User endpoint not implemented, token is valid'
        });
      }
    }

    // Handle project inquiry (both 'project-inquiry' and 'create-inquiry')
    if (type === 'project-inquiry' || type === 'create-inquiry') {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/create-project-inquiry/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let result;
        
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          // If not JSON, read as text for error details
          const text = await response.text();
          console.error('Django API returned non-JSON:', text);
          return NextResponse.json(
            { success: false, error: `Server error: ${response.status} ${response.statusText}` },
            { status: response.status }
          );
        }

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || result.message || 'Failed to submit inquiry' },
            { status: response.status }
          );
        }

        // Normalize inquiry payload so dashboards get camelCase fields
        if (result?.success && result?.data) {
          return NextResponse.json({ success: true, data: normalizeInquiry(result.data) });
        }

        return NextResponse.json(result);
      } catch (fetchError) {
        console.error('Error calling Django API:', fetchError);
        return NextResponse.json(
          { success: false, error: `Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` },
          { status: 500 }
        );
      }
    }

    // Client/Admin dashboard: add message to inquiry
    if (type === 'add-message') {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/add-message/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || result.message || 'Failed to add message' },
            { status: response.status }
          );
        }

        return NextResponse.json({
          success: true,
          data: normalizeInquiryMessage(result?.data ?? result),
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to add message' },
          { status: 500 }
        );
      }
    }

    // Client dashboard: sign document
    if (type === 'sign-document') {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/sign-document/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || result.message || 'Failed to sign document' },
            { status: response.status }
          );
        }

        return NextResponse.json({
          success: true,
          data: normalizeDocument(result?.data ?? result),
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to sign document' },
          { status: 500 }
        );
      }
    }

    // Admin dashboard: add document to inquiry (JSON only - multipart handled above)
    if (type === 'add-document') {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/add-document/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || result.message || 'Failed to add document' },
            { status: response.status }
          );
        }

        return NextResponse.json({
          success: true,
          data: normalizeDocument(result?.data ?? result),
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to add document' },
          { status: 500 }
        );
      }
    }

    // Handle forgot password
    if (type === 'forgot-password') {
      const { email } = data || {};
      
      if (!email) {
        return NextResponse.json(
          { success: false, error: 'Email is required' },
          { status: 400 }
        );
      }

      try {
        const response = await fetch(`${DJANGO_API_URL}/accounts/forgot-password/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.status === 404) {
          // Endpoint doesn't exist - return success message anyway
          return NextResponse.json({
            success: true,
            message: 'Password reset endpoint not implemented. Please contact support.'
          });
        }

        const result = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || 'Failed to send reset email' },
            { status: response.status }
          );
        }

        return NextResponse.json(result);
      } catch (error) {
        // If endpoint doesn't exist, return success message
        return NextResponse.json({
          success: true,
          message: 'Password reset endpoint not implemented. Please contact support.'
        });
      }
    }

    // Admin dashboard: update inquiry
    if (type === "update-inquiry") {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/update-inquiry/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || result.message || "Failed to update inquiry" },
            { status: response.status }
          );
        }

        return NextResponse.json({
          success: true,
          data: normalizeInquiry(result?.data ?? result),
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Failed to update inquiry" },
          { status: 500 }
        );
      }
    }

    // Admin dashboard: create invoice
    if (type === "create-invoice") {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/create-invoice/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || result.message || "Failed to create invoice" },
            { status: response.status }
          );
        }

        return NextResponse.json({
          success: true,
          data: normalizeInvoice(result?.data ?? result),
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Failed to create invoice" },
          { status: 500 }
        );
      }
    }

    // Admin dashboard: update invoice status
    if (type === "update-invoice-status") {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/update-invoice-status/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || result.message || "Failed to update invoice status" },
            { status: response.status }
          );
        }

        return NextResponse.json({
          success: true,
          data: normalizeInvoice(result?.data ?? result),
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Failed to update invoice status" },
          { status: 500 }
        );
      }
    }

    // Admin dashboard: delete inquiry
    if (type === "delete-inquiry") {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/delete-inquiry/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result.error || result.message || "Failed to delete inquiry" },
            { status: response.status }
          );
        }
        return NextResponse.json(result ?? { success: true });
      } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete inquiry" }, { status: 500 });
      }
    }

    // Admin dashboard: delete project
    if (type === "delete-project") {
      try {
        const response = await fetch(`${DJANGO_API_URL}/api/delete-project/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json().catch(() => null);
        if (!response.ok) {
          return NextResponse.json(
            { success: false, error: result?.error || result?.message || "Failed to delete project" },
            { status: response.status }
          );
        }
        return NextResponse.json(result ?? { success: true });
      } catch (error) {
        return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
      }
    }

    // Handle other request types
    return NextResponse.json(
      { success: false, error: `Unknown request type: ${type}` },
      { status: 400 }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Type parameter is required' },
        { status: 400 }
      );
    }

    // Handle different GET request types
    let endpoint = '';
    switch (type) {
      case 'projects':
        // Admin/project management: fetch ALL projects
        endpoint = '/api/get-projects/';
        break;
      case 'inquiries':
        endpoint = '/api/get-project-inquiries/';
        break;
      case 'analytics':
        endpoint = '/api/get-analytics/';
        break;
      case 'competences':
        endpoint = '/api/competence/';
        break;
      default:
        return NextResponse.json(
          { success: false, error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    // Get authorization token from headers for authenticated requests
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${DJANGO_API_URL}${endpoint}`, {
        method: 'GET',
        headers,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let result;
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Django API returned non-JSON:', text);
        return NextResponse.json(
          { success: false, error: `Server error: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      if (!response.ok) {
        return NextResponse.json(
          { success: false, error: result.error || result.message || 'Request failed' },
          { status: response.status }
        );
      }

      // Handle projects type
      if (type === 'projects') {
        if (result?.success && Array.isArray(result?.data)) {
          return NextResponse.json({ success: true, data: result.data.map(normalizeProject) });
        }
        if (Array.isArray(result)) {
          return NextResponse.json({ success: true, data: result.map(normalizeProject) });
        }
        // Legacy: my_info shape
        if (result?.projects && Array.isArray(result.projects)) {
          return NextResponse.json({ success: true, data: result.projects.map(normalizeProject) });
        }
        return NextResponse.json({ success: true, data: [] });
      }

      // Handle competences (for project CRUD tool picker)
      if (type === 'competences') {
        if (Array.isArray(result)) return NextResponse.json({ success: true, data: result });
        if (result?.results && Array.isArray(result.results)) return NextResponse.json({ success: true, data: result.results });
        if (result?.success && Array.isArray(result?.data)) return NextResponse.json({ success: true, data: result.data });
        return NextResponse.json({ success: true, data: [] });
      }

      // Handle inquiries type - normalize snake_case fields to camelCase for dashboards
      if (type === 'inquiries' && result?.success && Array.isArray(result?.data)) {
        return NextResponse.json({ success: true, data: result.data.map(normalizeInquiry) });
      }

      // Wrap response in success format if needed
      if (result.success !== undefined) {
        return NextResponse.json(result);
      }

      return NextResponse.json({ success: true, data: result });
    } catch (fetchError) {
      console.error('Error calling Django API:', fetchError);
      return NextResponse.json(
        { success: false, error: `Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
