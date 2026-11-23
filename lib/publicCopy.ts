import type { PublicLocale } from "@/lib/localePaths";

export type { PublicLocale };

export const homeCopy: Record<PublicLocale, {
  avatarAlt: string;
  heading: string;
  roles: string[];
  intro: string;
  closer: string;
  connect: string;
  work: string;
  start: string;
  loading: string;
  scroll: string;
  featuredTitle: string;
  featuredText: string;
  viewProject: string;
  testimonialsTitle: string;
  testimonialsText: string;
  footerRole: string;
  footerLinksLabel: string;
}> = {
  en: {
    avatarAlt: "Ludmil Paulo, software engineer and full-stack developer",
    heading: "Ludmil Paulo — Software Engineer & Full-Stack Developer",
    roles: [
      "Software Engineer",
      "Full-Stack Developer",
      "Python and Django",
      "Next.js and TypeScript",
      "API Development",
      "Technical Operations",
    ],
    intro: "I design and build software with Python, Django, Next.js, and TypeScript, from APIs to the product people use.",
    closer: "Based in Cape Town and open to international roles, projects, and partnerships.",
    connect: "Let’s Connect",
    work: "See My Work",
    start: "Start Project",
    loading: "Loading...",
    scroll: "Scroll down",
    featuredTitle: "Featured Projects",
    featuredText: "Selected case studies in software engineering, API development, and full-stack product work.",
    viewProject: "View case study",
    testimonialsTitle: "What clients and collaborators say",
    testimonialsText: "Notes from people I have worked with.",
    footerRole: "Software Engineer & Full-Stack Developer",
    footerLinksLabel: "Portfolio",
  },
  pt: {
    avatarAlt: "Ludmil Paulo, engenheiro de software e desenvolvedor full-stack",
    heading: "Ludmil Paulo — Engenheiro de Software e Desenvolvedor Full-Stack",
    roles: [
      "Engenheiro de Software",
      "Desenvolvedor Full-Stack",
      "Python e Django",
      "Next.js e TypeScript",
      "Desenvolvimento de APIs",
      "Operações técnicas",
    ],
    intro: "Desenho e construo software com Python, Django, Next.js e TypeScript, das APIs ao produto que as pessoas usam.",
    closer: "Estou na Cidade do Cabo e aberto a oportunidades, projetos e parcerias internacionais.",
    connect: "Vamos conversar",
    work: "Ver o meu trabalho",
    start: "Começar um projeto",
    loading: "A carregar...",
    scroll: "Deslize para baixo",
    featuredTitle: "Projetos em destaque",
    featuredText: "Estudos de caso em engenharia de software, APIs e produtos full-stack.",
    viewProject: "Ver estudo de caso",
    testimonialsTitle: "O que dizem clientes e parceiros",
    testimonialsText: "Notas de pessoas com quem trabalhei.",
    footerRole: "Engenheiro de Software e Desenvolvedor Full-Stack",
    footerLinksLabel: "Portfólio",
  },
};

export const aboutCopy: Record<PublicLocale, {
  heading: string;
  skills: string;
  years: string;
  projects: string;
  countries: string;
  whatsapp: string;
  cta: string;
  contact: string;
  projectsLink: string;
  loading: string;
  error: string;
}> = {
  en: {
    heading: "About Me",
    skills: "Tech stack and skills",
    years: "Years exp",
    projects: "Projects",
    countries: "Countries",
    whatsapp: "Chat on WhatsApp",
    cta: "Ready to collaborate or start your project?",
    contact: "Contact me",
    projectsLink: "See my projects",
    loading: "Loading your profile...",
    error: "Error loading data. Please try again later.",
  },
  pt: {
    heading: "Sobre mim",
    skills: "Tecnologias e competências",
    years: "Anos de experiência",
    projects: "Projetos",
    countries: "Países",
    whatsapp: "Falar no WhatsApp",
    cta: "Pronto para colaborar ou começar um projeto?",
    contact: "Fale comigo",
    projectsLink: "Ver os projetos",
    loading: "A carregar o perfil...",
    error: "Não foi possível carregar os dados. Tente novamente.",
  },
};

export const contactCopy: Record<PublicLocale, {
  title: string;
  intro: string;
  email: string;
  phone: string;
  whatsapp: string;
  missing: string;
}> = {
  en: {
    title: "Contact",
    intro: "I am based in Cape Town and open to international roles, projects, and partnerships. Write to me, or book a time below.",
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    missing: "Contact details are not available right now. You can still use the booking section if it is connected.",
  },
  pt: {
    title: "Contacto",
    intro: "Estou na Cidade do Cabo e aberto a oportunidades, projetos e parcerias internacionais. Escreva-me ou marque um horário abaixo.",
    email: "Email",
    phone: "Telefone",
    whatsapp: "WhatsApp",
    missing: "Os dados de contacto não estão disponíveis agora. Pode usar a marcação se estiver ligada.",
  },
};

export const bookingCopy: Record<PublicLocale, {
  title: string;
  intro: string;
  button: string;
  timezone: string;
  direct: string;
  email: string;
  unavailable: string;
  waiting: string;
  loading: string;
}> = {
  en: {
    title: "Book a meeting with me",
    intro: "Hiring for an engineering role, planning a software project, or exploring a partnership? Choose a time that works for you.",
    button: "View available times",
    timezone: "Times are shown in your local time zone. You can change it in the scheduler. My hours are set in Africa/Johannesburg.",
    direct: "Open the booking page",
    email: "Email me instead",
    unavailable: "The calendar is not connected yet. Email me and I will send times that work.",
    waiting: "The scheduler loads when you reach this section or choose View available times.",
    loading: "Loading available times...",
  },
  pt: {
    title: "Marque uma reunião comigo",
    intro: "Está a contratar para uma vaga de engenharia, a planear um projeto de software ou a explorar uma parceria? Escolha um horário que lhe sirva.",
    button: "Ver horários disponíveis",
    timezone: "Os horários aparecem no seu fuso horário. Pode mudá-lo no calendário. A minha disponibilidade está definida em Africa/Johannesburg.",
    direct: "Abrir a página de marcações",
    email: "Enviar um email",
    unavailable: "O calendário ainda não está ligado. Envie um email e eu indico horários.",
    waiting: "O calendário carrega quando chega a esta secção ou escolhe Ver horários disponíveis.",
    loading: "A carregar horários...",
  },
};

export const navCopy: Record<PublicLocale, { book: string; about: string; language: string }> = {
  en: { book: "Book a meeting", about: "About", language: "Language" },
  pt: { book: "Marcar reunião", about: "Sobre", language: "Idioma" },
};
