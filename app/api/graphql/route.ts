import { NextRequest, NextResponse } from 'next/server';

// Django backend URL - update this to match your Django server
const DJANGO_BASE_URL = 'http://localhost:8000/api/information';

// Helper function to make requests to Django backend with fallback
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
    if (!response.ok) {
      throw new Error(`Django API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Django request error:', error);
    // Return fallback data for testing when Django is not available
    return getFallbackData(endpoint, method, data);
  }
}

// Fallback data for when Django backend is not available
function getFallbackData(endpoint: string, method: string, data?: any) {
  console.log(`Using fallback data for ${method} ${endpoint}`);
  
  switch (endpoint) {
    case '/projects/':
      return [
        {
          id: '1',
          title: 'E-Commerce Platform',
          description: 'A full-stack e-commerce solution with React and Node.js',
          status: 'LIVE',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z',
          url: 'https://ecommerce-demo.com',
          githubUrl: 'https://github.com/ludmilpaulo/ecommerce'
        },
        {
          id: '2',
          title: 'Task Management App',
          description: 'A collaborative task management application',
          status: 'IN_PROGRESS',
          technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-15T00:00:00Z',
          githubUrl: 'https://github.com/ludmilpaulo/taskapp'
        }
      ];
    
    case '/get-project-inquiries/':
      return {
        data: [
          {
            id: '1',
            clientName: 'John Smith',
            clientEmail: 'john@example.com',
            clientPhone: '+1234567890',
            projectTitle: 'E-commerce Website Development',
            projectDescription: 'Need a full-stack e-commerce website with payment integration, inventory management, and admin dashboard.',
            projectType: 'e-commerce',
            budget: '$10,000 - $15,000',
            timeline: '3-4 months',
            status: 'in-progress',
            priority: 'high',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-02-15T14:20:00Z',
            estimatedCost: 12500,
            actualCost: 8500,
            progress: 75,
            messages: [
              {
                id: 1,
                sender: 'client',
                message: 'Hi, I\'m interested in developing an e-commerce website for my business.',
                timestamp: '2024-01-15T10:30:00Z'
              },
              {
                id: 2,
                sender: 'admin',
                message: 'Thank you for your inquiry! I\'d be happy to help you with your e-commerce project.',
                timestamp: '2024-01-15T11:00:00Z'
              }
            ],
            tasks: [
              {
                id: 1,
                title: 'Database Setup',
                description: 'Set up MongoDB database with user authentication',
                status: 'completed',
                assignedTo: 'admin',
                dueDate: '2024-01-20T00:00:00Z',
                createdAt: '2024-01-15T00:00:00Z',
                priority: 'high',
                projectId: 1
              },
              {
                id: 2,
                title: 'Payment Integration',
                description: 'Integrate Stripe payment gateway',
                status: 'in-progress',
                assignedTo: 'admin',
                dueDate: '2024-02-01T00:00:00Z',
                createdAt: '2024-01-20T00:00:00Z',
                priority: 'high',
                projectId: 1
              }
            ],
            invoices: [
              {
                id: 1,
                invoiceNumber: 'INV-001',
                amount: 5000,
                status: 'paid',
                dueDate: '2024-01-30T00:00:00Z',
                createdAt: '2024-01-15T00:00:00Z',
                description: 'Initial Payment - E-commerce Website',
                items: [
                  { description: 'Project Setup & Planning', quantity: 1, price: 2000 },
                  { description: 'Design & UI/UX', quantity: 1, price: 3000 }
                ]
              }
            ],
            documents: [
              {
                id: 1,
                title: 'Project Contract',
                type: 'contract',
                status: 'signed',
                createdAt: '2024-01-15T00:00:00Z',
                signedAt: '2024-01-16T00:00:00Z',
                downloadUrl: '/documents/contract-001.pdf',
                signedBy: 'John Smith',
                projectId: 1
              }
            ],
            teamMembers: [
              {
                id: 1,
                name: 'Ludmil Paulo',
                role: 'Lead Developer',
                email: 'ludmil@example.com',
                projectId: 1
              }
            ]
          }
        ]
      };
    
    case '/get-notifications/':
      return {
        data: [
          {
            id: '1',
            title: 'New Project Inquiry',
            message: 'John Smith submitted a new project inquiry for E-commerce Website Development',
            type: 'info',
            category: 'inquiry',
            isRead: false,
            createdAt: '2024-02-15T10:30:00Z',
            actionUrl: '/dashboard/client',
            actionText: 'View Inquiry'
          }
        ]
      };
    
    case '/login/':
      // Demo authentication for testing
      if (data.username === 'admin' && data.password === 'admin123') {
        return {
          success: true,
          token: 'demo-admin-token-123',
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@ludmilpaulo.co.za',
            first_name: 'Admin',
            last_name: 'User',
            user_type: 'admin',
            is_verified: true
          }
        };
      } else if (data.username === 'client@example.com' && data.password === 'client123') {
        return {
          success: true,
          token: 'demo-client-token-123',
          user: {
            id: 2,
            username: 'client@example.com',
            email: 'client@example.com',
            first_name: 'Client',
            last_name: 'User',
            user_type: 'client',
            is_verified: true
          }
        };
      } else {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

    case '/verify-token/':
      // Demo token verification
      if (data.token === 'demo-admin-token-123' || data.token === 'demo-client-token-123') {
        return {
          success: true,
          valid: true
        };
      } else {
        return {
          success: false,
          error: 'Invalid token'
        };
      }

    case '/get-user/':
      // Demo user data retrieval
      if (data.token === 'demo-admin-token-123') {
        return {
          id: 1,
          username: 'admin',
          email: 'admin@ludmilpaulo.co.za',
          first_name: 'Admin',
          last_name: 'User',
          user_type: 'admin',
          is_verified: true
        };
      } else if (data.token === 'demo-client-token-123') {
        return {
          id: 2,
          username: 'client@example.com',
          email: 'client@example.com',
          first_name: 'Client',
          last_name: 'User',
          user_type: 'client',
          is_verified: true
        };
      } else {
        throw new Error('Invalid token');
      }
    
    default:
      if (method === 'POST') {
        return {
          data: {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
      }
      return { data: [] };
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

          case 'login':
            const loginResult = await djangoRequest('/login/', 'POST', data);
            return NextResponse.json({ success: true, data: loginResult });

          case 'verify-token':
            // Verify token with Django backend
            const authHeader = request.headers.get('authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
              return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 });
            }
            
            const token = authHeader.substring(7);
            try {
              const verifyResult = await djangoRequest('/verify-token/', 'POST', { token });
              return NextResponse.json({ success: true, data: verifyResult });
            } catch (error) {
              return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
            }

          case 'get-user':
            // Get user data with token
            const userAuthHeader = request.headers.get('authorization');
            if (!userAuthHeader || !userAuthHeader.startsWith('Bearer ')) {
              return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 });
            }
            
            const userToken = userAuthHeader.substring(7);
            try {
              const userResult = await djangoRequest('/get-user/', 'POST', { token: userToken });
              return NextResponse.json({ success: true, data: userResult });
            } catch (error) {
              return NextResponse.json({ success: false, error: 'Failed to get user data' }, { status: 401 });
            }

          case 'forgot-password':
            const forgotResult = await djangoRequest('/forgot-password/', 'POST', data);
            return NextResponse.json({ success: true, data: forgotResult });

          case 'reset-password':
            const resetResult = await djangoRequest('/reset-password/', 'POST', data);
            return NextResponse.json({ success: true, data: resetResult });

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