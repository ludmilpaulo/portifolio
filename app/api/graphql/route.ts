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
      default:
        return NextResponse.json({ 
          success: true, 
          data: { projects, testimonials, analytics } 
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
