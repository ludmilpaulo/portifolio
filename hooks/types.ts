
export interface Competence {
    id: number;
    title: string;
    percentage: string;
    description: string;
    image: string;
    category: string;
  }

export interface Experience {
    id: number;
    stack: Competence[];
    title: string;
    company: string;
    logo: string | null;
    description: string;
    the_year: string;
  }

export interface Project {
    id: number;
    tools: Competence[];
    title: string;
    slug: string;
    description: string;
    image: string;
    status: number;
    demo: string;
    github: string;
    show_in_slider: boolean;
  }

export interface Info {
    id: number;
    name_complete: string;
    avatar: string;
    mini_about: string;
    about: string;
    born_date: string;
    address: string;
    phone: string;
    email: string;
    cv: string;
    github: string;
    linkedin: string;
    facebook: string;
    twitter: string;
    instagram: string;
  }

export interface Education {
    id: number;
    title: string;
    description: string;
    the_year: string;
  }

  export interface MyInfoResponse {
    competences: Competence[];
    experiences: Experience[];
    projects: Project[];
    info: Info[];
    education: Education[];
  }
