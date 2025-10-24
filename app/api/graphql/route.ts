import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with actual database
const projects = [
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

const testimonials = [
  {
    id: '1',
    name: 'John Doe',
    position: 'CEO, TechCorp',
    content: 'Ludmil delivered an exceptional project that exceeded our expectations.',
    rating: 5,
    avatar: '/testimonials/john.jpg',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    position: 'Product Manager, StartupXYZ',
    content: 'Professional, reliable, and incredibly talented developer.',
    rating: 5,
    avatar: '/testimonials/jane.jpg',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

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

const projectInquiries = [
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
      },
      {
        id: 3,
        title: 'Review Design Mockups',
        description: 'Please review the initial design mockups and provide feedback',
        status: 'pending',
        assignedTo: 'client',
        dueDate: '2024-02-05T00:00:00Z',
        createdAt: '2024-01-25T00:00:00Z',
        priority: 'medium',
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
      },
      {
        id: 2,
        invoiceNumber: 'INV-002',
        amount: 3500,
        status: 'sent',
        dueDate: '2024-02-15T00:00:00Z',
        createdAt: '2024-02-01T00:00:00Z',
        description: 'Development Phase 1 - E-commerce Website',
        items: [
          { description: 'Backend Development', quantity: 1, price: 2000 },
          { description: 'Frontend Development', quantity: 1, price: 1500 }
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
      },
      {
        id: 2,
        title: 'NDA Agreement',
        type: 'nda',
        status: 'pending-signature',
        createdAt: '2024-01-20T00:00:00Z',
        expiresAt: '2024-02-20T00:00:00Z',
        downloadUrl: '/documents/nda-001.pdf',
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
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        role: 'UI/UX Designer',
        email: 'sarah@example.com',
        projectId: 1
      }
    ]
  },
  {
    id: '2',
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@example.com',
    clientPhone: '+1987654321',
    projectTitle: 'Mobile App Development',
    projectDescription: 'Need a cross-platform mobile app for iOS and Android with real-time features.',
    projectType: 'mobile-app',
    budget: '$15,000 - $25,000',
    timeline: '4-6 months',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
    estimatedCost: 20000,
    actualCost: 0,
    progress: 0,
    messages: [
      {
        id: 3,
        sender: 'client',
        message: 'I need a mobile app for my business. Can you help?',
        timestamp: '2024-02-01T09:15:00Z'
      }
    ],
    tasks: [],
    invoices: [],
    documents: [],
    teamMembers: []
  }
];

const notifications = [
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
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'projects':
        return NextResponse.json({ success: true, data: projects });
      case 'testimonials':
        return NextResponse.json({ success: true, data: testimonials });
      case 'analytics':
        return NextResponse.json({ success: true, data: analytics });
      case 'inquiries':
        return NextResponse.json({ success: true, data: projectInquiries });
      case 'notifications':
        return NextResponse.json({ success: true, data: notifications });
      default:
        return NextResponse.json({ 
          success: true, 
          data: { projects, testimonials, analytics, inquiries: projectInquiries, notifications } 
        });
    }
  } catch (error) {
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
        const newProject = {
          id: String(projects.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        projects.push(newProject);
        return NextResponse.json({ success: true, data: newProject });

      case 'update-project':
        const projectIndex = projects.findIndex(p => p.id === data.id);
        if (projectIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Project not found' },
            { status: 404 }
          );
        }
        projects[projectIndex] = {
          ...projects[projectIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        return NextResponse.json({ success: true, data: projects[projectIndex] });

      case 'delete-project':
        const deleteIndex = projects.findIndex(p => p.id === data.id);
        if (deleteIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Project not found' },
            { status: 404 }
          );
        }
        projects.splice(deleteIndex, 1);
        return NextResponse.json({ success: true });

      case 'create-testimonial':
        const newTestimonial = {
          id: String(testimonials.length + 1),
          ...data,
          createdAt: new Date().toISOString()
        };
        testimonials.push(newTestimonial);
        return NextResponse.json({ success: true, data: newTestimonial });

      case 'update-testimonial':
        const testimonialIndex = testimonials.findIndex(t => t.id === data.id);
        if (testimonialIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Testimonial not found' },
            { status: 404 }
          );
        }
        testimonials[testimonialIndex] = {
          ...testimonials[testimonialIndex],
          ...data
        };
        return NextResponse.json({ success: true, data: testimonials[testimonialIndex] });

      case 'delete-testimonial':
        const deleteTestimonialIndex = testimonials.findIndex(t => t.id === data.id);
        if (deleteTestimonialIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Testimonial not found' },
            { status: 404 }
          );
        }
        testimonials.splice(deleteTestimonialIndex, 1);
        return NextResponse.json({ success: true });

      case 'create-inquiry':
        const newInquiry = {
          id: String(projectInquiries.length + 1),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: []
        };
        projectInquiries.push(newInquiry);
        
        // Create notification for new inquiry
        const newNotification = {
          id: String(notifications.length + 1),
          title: 'New Project Inquiry',
          message: `${data.clientName} submitted a new project inquiry for ${data.projectTitle}`,
          type: 'info',
          category: 'inquiry',
          isRead: false,
          createdAt: new Date().toISOString(),
          actionUrl: '/dashboard/client',
          actionText: 'View Inquiry'
        };
        notifications.push(newNotification);
        
        return NextResponse.json({ success: true, data: newInquiry });

      case 'update-inquiry':
        const inquiryIndex = projectInquiries.findIndex(i => i.id === data.id);
        if (inquiryIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        projectInquiries[inquiryIndex] = {
          ...projectInquiries[inquiryIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        return NextResponse.json({ success: true, data: projectInquiries[inquiryIndex] });

      case 'delete-inquiry':
        const deleteInquiryIndex = projectInquiries.findIndex(i => i.id === data.id);
        if (deleteInquiryIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        projectInquiries.splice(deleteInquiryIndex, 1);
        return NextResponse.json({ success: true });

      case 'add-message':
        const messageInquiryIndex = projectInquiries.findIndex(i => i.id === data.inquiryId);
        if (messageInquiryIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const newMessage = {
          id: Date.now(),
          sender: data.sender,
          message: data.message,
          timestamp: new Date().toISOString()
        };
        projectInquiries[messageInquiryIndex].messages.push(newMessage);
        projectInquiries[messageInquiryIndex].updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, data: newMessage });

      case 'mark-notification-read':
        const notificationIndex = notifications.findIndex(n => n.id === data.id);
        if (notificationIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Notification not found' },
            { status: 404 }
          );
        }
        notifications[notificationIndex].isRead = true;
        return NextResponse.json({ success: true });

      case 'delete-notification':
        const deleteNotificationIndex = notifications.findIndex(n => n.id === data.id);
        if (deleteNotificationIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Notification not found' },
            { status: 404 }
          );
        }
        notifications.splice(deleteNotificationIndex, 1);
        return NextResponse.json({ success: true });

      case 'add-task':
        const inquiryForTask = projectInquiries.find(i => i.id === data.inquiryId);
        if (!inquiryForTask) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const newTask = {
          id: Date.now(),
          title: data.title,
          description: data.description,
          status: 'pending',
          assignedTo: data.assignedTo,
          dueDate: data.dueDate,
          createdAt: new Date().toISOString(),
          priority: data.priority,
          projectId: parseInt(data.inquiryId)
        };
        inquiryForTask.tasks.push(newTask);
        inquiryForTask.updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, data: newTask });

      case 'update-task-status':
        const inquiryForTaskUpdate = projectInquiries.find(i => i.id === data.inquiryId);
        if (!inquiryForTaskUpdate) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const taskToUpdate = inquiryForTaskUpdate.tasks.find(t => t.id === data.taskId);
        if (!taskToUpdate) {
          return NextResponse.json(
            { success: false, error: 'Task not found' },
            { status: 404 }
          );
        }
        taskToUpdate.status = data.status;
        inquiryForTaskUpdate.updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, data: taskToUpdate });

      case 'add-document':
        const inquiryForDoc = projectInquiries.find(i => i.id === data.inquiryId);
        if (!inquiryForDoc) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const newDocument = {
          id: Date.now(),
          title: data.title,
          type: data.type,
          status: 'draft',
          createdAt: new Date().toISOString(),
          downloadUrl: data.downloadUrl,
          projectId: parseInt(data.inquiryId)
        };
        inquiryForDoc.documents.push(newDocument as any);
        inquiryForDoc.updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, data: newDocument });

      case 'sign-document':
        const inquiryForSign = projectInquiries.find(i => i.id === data.inquiryId);
        if (!inquiryForSign) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const docToSign = inquiryForSign.documents.find(d => d.id === data.documentId);
        if (!docToSign) {
          return NextResponse.json(
            { success: false, error: 'Document not found' },
            { status: 404 }
          );
        }
        docToSign.status = 'signed';
        docToSign.signedAt = new Date().toISOString();
        docToSign.signedBy = data.signedBy;
        inquiryForSign.updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, data: docToSign });

      case 'add-team-member':
        const inquiryForTeam = projectInquiries.find(i => i.id === data.inquiryId);
        if (!inquiryForTeam) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const newMember = {
          id: Date.now(),
          name: data.name,
          role: data.role,
          email: data.email,
          projectId: parseInt(data.inquiryId)
        };
        inquiryForTeam.teamMembers.push(newMember);
        inquiryForTeam.updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, data: newMember });

      case 'update-project-progress':
        const inquiryForProgress = projectInquiries.find(i => i.id === data.inquiryId);
        if (!inquiryForProgress) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        inquiryForProgress.progress = data.progress;
        inquiryForProgress.actualCost = data.actualCost;
        inquiryForProgress.updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, data: inquiryForProgress });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
