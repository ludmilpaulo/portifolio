import { NextRequest, NextResponse } from 'next/server';
import { 
  getProjects, 
  saveProjects, 
  getTestimonials, 
  saveTestimonials, 
  getProjectInquiries, 
  saveProjectInquiries, 
  getNotifications, 
  saveNotifications, 
  getAnalytics 
} from '../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'projects':
        const projects = await getProjects();
        return NextResponse.json({ success: true, data: projects });

      case 'testimonials':
        const testimonials = await getTestimonials();
        return NextResponse.json({ success: true, data: testimonials });

      case 'inquiries':
        const inquiries = await getProjectInquiries();
        return NextResponse.json({ success: true, data: inquiries });

      case 'notifications':
        const notifications = await getNotifications();
        return NextResponse.json({ success: true, data: notifications });

      case 'analytics':
        const analytics = await getAnalytics();
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
        const projects = await getProjects();
        const newProject = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        projects.push(newProject);
        await saveProjects(projects);
        return NextResponse.json({ success: true, data: newProject });

      case 'update-project':
        const projectsToUpdate = await getProjects();
        const projectIndex = projectsToUpdate.findIndex(p => p.id === data.id);
        if (projectIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Project not found' },
            { status: 404 }
          );
        }
        projectsToUpdate[projectIndex] = {
          ...projectsToUpdate[projectIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        await saveProjects(projectsToUpdate);
        return NextResponse.json({ success: true, data: projectsToUpdate[projectIndex] });

      case 'delete-project':
        const projectsToDelete = await getProjects();
        const filteredProjects = projectsToDelete.filter(p => p.id !== data.id);
        await saveProjects(filteredProjects);
        return NextResponse.json({ success: true });

      case 'create-testimonial':
        const testimonials = await getTestimonials();
        const newTestimonial = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString()
        };
        testimonials.push(newTestimonial);
        await saveTestimonials(testimonials);
        return NextResponse.json({ success: true, data: newTestimonial });

      case 'update-testimonial':
        const testimonialsToUpdate = await getTestimonials();
        const testimonialIndex = testimonialsToUpdate.findIndex(t => t.id === data.id);
        if (testimonialIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Testimonial not found' },
            { status: 404 }
          );
        }
        testimonialsToUpdate[testimonialIndex] = {
          ...testimonialsToUpdate[testimonialIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        await saveTestimonials(testimonialsToUpdate);
        return NextResponse.json({ success: true, data: testimonialsToUpdate[testimonialIndex] });

      case 'delete-testimonial':
        const testimonialsToDelete = await getTestimonials();
        const filteredTestimonials = testimonialsToDelete.filter(t => t.id !== data.id);
        await saveTestimonials(filteredTestimonials);
        return NextResponse.json({ success: true });

      case 'create-inquiry':
        const inquiries = await getProjectInquiries();
        const newInquiry = {
          id: Date.now().toString(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          estimatedCost: 0,
          actualCost: 0,
          progress: 0,
          messages: [],
          tasks: [],
          invoices: [],
          documents: [],
          teamMembers: []
        };
        inquiries.push(newInquiry);
        await saveProjectInquiries(inquiries);
        
        // Create notification for new inquiry
        const notifications = await getNotifications();
        const newNotification = {
          id: Date.now().toString(),
          title: 'New Project Inquiry',
          message: `${data.clientName} submitted a new project inquiry: ${data.projectTitle}`,
          type: 'info',
          category: 'inquiry',
          isRead: false,
          createdAt: new Date().toISOString(),
          actionUrl: '/dashboard/client',
          actionText: 'View Inquiry'
        };
        notifications.push(newNotification);
        await saveNotifications(notifications);
        
        return NextResponse.json({ success: true, data: newInquiry });

      case 'update-inquiry':
        const inquiriesToUpdate = await getProjectInquiries();
        const inquiryIndex = inquiriesToUpdate.findIndex(i => i.id === data.id);
        if (inquiryIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        inquiriesToUpdate[inquiryIndex] = {
          ...inquiriesToUpdate[inquiryIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        await saveProjectInquiries(inquiriesToUpdate);
        return NextResponse.json({ success: true, data: inquiriesToUpdate[inquiryIndex] });

      case 'add-task':
        const inquiriesForTask = await getProjectInquiries();
        const inquiryForTask = inquiriesForTask.find(i => i.id === data.inquiryId);
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
          assignedTo: data.assignedTo || 'admin',
          dueDate: data.dueDate,
          createdAt: new Date().toISOString(),
          priority: data.priority || 'medium',
          projectId: parseInt(data.inquiryId)
        };
        inquiryForTask.tasks.push(newTask);
        inquiryForTask.updatedAt = new Date().toISOString();
        await saveProjectInquiries(inquiriesForTask);
        return NextResponse.json({ success: true, data: newTask });

      case 'update-task-status':
        const inquiriesForTaskUpdate = await getProjectInquiries();
        const inquiryForTaskUpdate = inquiriesForTaskUpdate.find(i => i.id === data.inquiryId);
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
        await saveProjectInquiries(inquiriesForTaskUpdate);
        return NextResponse.json({ success: true, data: taskToUpdate });

      case 'add-document':
        const inquiriesForDoc = await getProjectInquiries();
        const inquiryForDoc = inquiriesForDoc.find(i => i.id === data.inquiryId);
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
        await saveProjectInquiries(inquiriesForDoc);
        return NextResponse.json({ success: true, data: newDocument });

      case 'sign-document':
        const inquiriesForSign = await getProjectInquiries();
        const inquiryForSign = inquiriesForSign.find(i => i.id === data.inquiryId);
        if (!inquiryForSign) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const documentToSign = inquiryForSign.documents.find(d => d.id === data.documentId);
        if (!documentToSign) {
          return NextResponse.json(
            { success: false, error: 'Document not found' },
            { status: 404 }
          );
        }
        documentToSign.status = 'signed';
        documentToSign.signedAt = new Date().toISOString();
        documentToSign.signedBy = data.signedBy;
        inquiryForSign.updatedAt = new Date().toISOString();
        await saveProjectInquiries(inquiriesForSign);
        return NextResponse.json({ success: true, data: documentToSign });

      case 'add-team-member':
        const inquiriesForTeam = await getProjectInquiries();
        const inquiryForTeam = inquiriesForTeam.find(i => i.id === data.inquiryId);
        if (!inquiryForTeam) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const newTeamMember = {
          id: Date.now(),
          name: data.name,
          role: data.role,
          email: data.email,
          projectId: parseInt(data.inquiryId)
        };
        inquiryForTeam.teamMembers.push(newTeamMember);
        inquiryForTeam.updatedAt = new Date().toISOString();
        await saveProjectInquiries(inquiriesForTeam);
        return NextResponse.json({ success: true, data: newTeamMember });

      case 'update-project-progress':
        const inquiriesForProgress = await getProjectInquiries();
        const inquiryForProgress = inquiriesForProgress.find(i => i.id === data.inquiryId);
        if (!inquiryForProgress) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        inquiryForProgress.progress = data.progress;
        inquiryForProgress.actualCost = data.actualCost;
        inquiryForProgress.updatedAt = new Date().toISOString();
        await saveProjectInquiries(inquiriesForProgress);
        return NextResponse.json({ success: true, data: inquiryForProgress });

      case 'add-message':
        const inquiriesForMessage = await getProjectInquiries();
        const inquiryForMessage = inquiriesForMessage.find(i => i.id === data.inquiryId);
        if (!inquiryForMessage) {
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
        inquiryForMessage.messages.push(newMessage);
        inquiryForMessage.updatedAt = new Date().toISOString();
        await saveProjectInquiries(inquiriesForMessage);
        return NextResponse.json({ success: true, data: newMessage });

      case 'create-invoice':
        const inquiriesForInvoice = await getProjectInquiries();
        const inquiryForInvoice = inquiriesForInvoice.find(i => i.id === data.inquiryId);
        if (!inquiryForInvoice) {
          return NextResponse.json(
            { success: false, error: 'Inquiry not found' },
            { status: 404 }
          );
        }
        const newInvoice = {
          id: Date.now(),
          invoiceNumber: data.invoiceNumber,
          amount: data.amount,
          status: 'sent',
          dueDate: data.dueDate,
          createdAt: new Date().toISOString(),
          description: data.description,
          items: data.items || []
        };
        inquiryForInvoice.invoices.push(newInvoice);
        inquiryForInvoice.updatedAt = new Date().toISOString();
        await saveProjectInquiries(inquiriesForInvoice);
        return NextResponse.json({ success: true, data: newInvoice });

      case 'update-notification':
        const notificationsToUpdate = await getNotifications();
        const notificationIndex = notificationsToUpdate.findIndex(n => n.id === data.id);
        if (notificationIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Notification not found' },
            { status: 404 }
          );
        }
        notificationsToUpdate[notificationIndex] = {
          ...notificationsToUpdate[notificationIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        await saveNotifications(notificationsToUpdate);
        return NextResponse.json({ success: true, data: notificationsToUpdate[notificationIndex] });

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