import { promises as fs } from 'fs';
import path from 'path';

// Database file paths
const DB_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DB_DIR, 'projects.json');
const TESTIMONIALS_FILE = path.join(DB_DIR, 'testimonials.json');
const INQUIRIES_FILE = path.join(DB_DIR, 'inquiries.json');
const NOTIFICATIONS_FILE = path.join(DB_DIR, 'notifications.json');

// Ensure database directory exists
async function ensureDbDir() {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
}

// Generic database operations
async function readFromFile<T>(filePath: string, defaultValue: T[]): Promise<T[]> {
  try {
    await ensureDbDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, create it with default data
    await writeToFile(filePath, defaultValue);
    return defaultValue;
  }
}

async function writeToFile<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDbDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Project operations
export async function getProjects() {
  const defaultProjects = [
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
  return readFromFile(PROJECTS_FILE, defaultProjects);
}

export async function saveProjects(projects: any[]) {
  await writeToFile(PROJECTS_FILE, projects);
}

// Testimonial operations
export async function getTestimonials() {
  const defaultTestimonials = [
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
  return readFromFile(TESTIMONIALS_FILE, defaultTestimonials);
}

export async function saveTestimonials(testimonials: any[]) {
  await writeToFile(TESTIMONIALS_FILE, testimonials);
}

// Project Inquiry operations
export async function getProjectInquiries() {
  const defaultInquiries = [
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
  return readFromFile(INQUIRIES_FILE, defaultInquiries);
}

export async function saveProjectInquiries(inquiries: any[]) {
  await writeToFile(INQUIRIES_FILE, inquiries);
}

// Notification operations
export async function getNotifications() {
  const defaultNotifications = [
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
  return readFromFile(NOTIFICATIONS_FILE, defaultNotifications);
}

export async function saveNotifications(notifications: any[]) {
  await writeToFile(NOTIFICATIONS_FILE, notifications);
}

// Analytics operations
export async function getAnalytics() {
  return {
    totalViews: 15420,
    uniqueVisitors: 8930,
    projects: 28,
    testimonials: 15,
    viewsChange: 12.5,
    visitorsChange: 8.3,
    projectsChange: 25.0,
    testimonialsChange: 15.7
  };
}
