import { NextRequest, NextResponse } from 'next/server';

// Django backend URL - update this to match your Django server
const DJANGO_BASE_URL = 'http://localhost:8000/api/information';

// Helper function to make requests to Django backend
async function djangoRequest(endpoint: string, method: string = 'GET', data?: any) {
  try {
    const url = `${DJANGO_BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error('Django request error:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'projects':
        const projects = await djangoRequest('/projects/');
        return NextResponse.json({ success: true, data: projects });

      case 'testimonials':
        // For testimonials, we need to check if there's a testimonials app
        try {
          const testimonials = await djangoRequest('/testimonials/');
          return NextResponse.json({ success: true, data: testimonials });
        } catch {
          // Fallback to empty array if testimonials endpoint doesn't exist
          return NextResponse.json({ success: true, data: [] });
        }

      case 'inquiries':
        const inquiries = await djangoRequest('/get-project-inquiries/');
        return NextResponse.json({ success: true, data: inquiries.data || [] });

      case 'notifications':
        const notifications = await djangoRequest('/get-notifications/');
        return NextResponse.json({ success: true, data: notifications.data || [] });

      case 'analytics':
        // Return mock analytics for now
        const analytics = {
          totalViews: 15420,
          uniqueVisitors: 8930,
          projects: 28,
          testimonials: 15,
          viewsChange: 12.5,
          visitorsChange: 8.3,
          projectsChange: 25.0,
          testimonialsChange: 15.7
        };
        return NextResponse.json({ success: true, data: analytics });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'create-project':
        const newProject = await djangoRequest('/projects/', 'POST', data);
        return NextResponse.json({ success: true, data: newProject });

      case 'update-project':
        const updatedProject = await djangoRequest(`/projects/${data.id}/`, 'PUT', data);
        return NextResponse.json({ success: true, data: updatedProject });

      case 'delete-project':
        await djangoRequest(`/projects/${data.id}/`, 'DELETE');
        return NextResponse.json({ success: true });

      case 'create-testimonial':
        try {
          const newTestimonial = await djangoRequest('/testimonials/', 'POST', data);
          return NextResponse.json({ success: true, data: newTestimonial });
        } catch {
          return NextResponse.json({ success: false, error: 'Testimonials endpoint not available' });
        }

      case 'update-testimonial':
        try {
          const updatedTestimonial = await djangoRequest(`/testimonials/${data.id}/`, 'PUT', data);
          return NextResponse.json({ success: true, data: updatedTestimonial });
        } catch {
          return NextResponse.json({ success: false, error: 'Testimonials endpoint not available' });
        }

      case 'delete-testimonial':
        try {
          await djangoRequest(`/testimonials/${data.id}/`, 'DELETE');
          return NextResponse.json({ success: true });
        } catch {
          return NextResponse.json({ success: false, error: 'Testimonials endpoint not available' });
        }

      case 'create-inquiry':
        const newInquiry = await djangoRequest('/create-project-inquiry/', 'POST', data);
        return NextResponse.json({ success: true, data: newInquiry.data });

      case 'update-inquiry':
        const updatedInquiry = await djangoRequest(`/project-inquiries/${data.id}/`, 'PUT', data);
        return NextResponse.json({ success: true, data: updatedInquiry });

      case 'add-task':
        const newTask = await djangoRequest('/add-task/', 'POST', data);
        return NextResponse.json({ success: true, data: newTask.data });

      case 'update-task-status':
        const updatedTask = await djangoRequest('/update-task-status/', 'POST', data);
        return NextResponse.json({ success: true, data: updatedTask.data });

      case 'add-document':
        const newDocument = await djangoRequest('/add-document/', 'POST', data);
        return NextResponse.json({ success: true, data: newDocument.data });

      case 'sign-document':
        const signedDocument = await djangoRequest('/sign-document/', 'POST', data);
        return NextResponse.json({ success: true, data: signedDocument.data });

      case 'add-team-member':
        const newTeamMember = await djangoRequest('/add-team-member/', 'POST', data);
        return NextResponse.json({ success: true, data: newTeamMember.data });

      case 'update-project-progress':
        const updatedProgress = await djangoRequest('/update-project-progress/', 'POST', data);
        return NextResponse.json({ success: true, data: updatedProgress.data });

      case 'add-message':
        const newMessage = await djangoRequest('/add-message/', 'POST', data);
        return NextResponse.json({ success: true, data: newMessage.data });

      case 'create-invoice':
        const newInvoice = await djangoRequest('/create-invoice/', 'POST', data);
        return NextResponse.json({ success: true, data: newInvoice.data });

      case 'update-notification':
        const updatedNotification = await djangoRequest('/update-notification/', 'POST', data);
        return NextResponse.json({ success: true, data: updatedNotification.data });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}