import { siteUrl } from "@/lib/site";

export const PROJECT_SITE_URL = siteUrl();

export type ShareLanguage = "en" | "pt" | "es" | "fr" | "af";
export type ProjectStage = "live" | "upcoming" | "progress" | "clone" | "other";

export interface ShareCopy {
  name: string;
  intro: (title: string) => string;
  status: Record<ProjectStage, string>;
  pageLabel: string;
  demoLabel: string;
  passOn: string;
}

export const SHARE_COPY: Record<ShareLanguage, ShareCopy> = {
  en: {
    name: "English",
    intro: (title) => `Have a look at ${title}, a project by Ludmil Paulo.`,
    status: {
      live: "It is live, so you can open it and use it today.",
      upcoming: "It is on the way. Share it so people know what is coming.",
      progress: "It is being built right now. Share it and follow the progress.",
      clone: "This is a working version you can explore.",
      other: "Take a look and share it with someone who would use it.",
    },
    pageLabel: "Project page",
    demoLabel: "Use it here",
    passOn: "If you find it useful, send this on.",
  },
  pt: {
    name: "Português",
    intro: (title) => `Conheça ${title}, um projeto de Ludmil Paulo.`,
    status: {
      live: "Já está no ar. Você pode abrir e usar agora.",
      upcoming: "Está a caminho. Partilhe para as pessoas saberem o que vem aí.",
      progress: "Está a ser construído agora. Partilhe e acompanhe o progresso.",
      clone: "É uma versão funcional que você pode explorar.",
      other: "Veja e partilhe com quem possa usar.",
    },
    pageLabel: "Página do projeto",
    demoLabel: "Usar aqui",
    passOn: "Se for útil, envie para outra pessoa.",
  },
  es: {
    name: "Español",
    intro: (title) => `Mira ${title}, un proyecto de Ludmil Paulo.`,
    status: {
      live: "Ya está en línea. Puedes abrirlo y usarlo hoy.",
      upcoming: "Está en camino. Compártelo para que otras personas sepan lo que viene.",
      progress: "Se está construyendo ahora. Compártelo y sigue el avance.",
      clone: "Es una versión funcional que puedes explorar.",
      other: "Échale un vistazo y compártelo con quien pueda usarlo.",
    },
    pageLabel: "Página del proyecto",
    demoLabel: "Usarlo aquí",
    passOn: "Si te resulta útil, pásalo.",
  },
  fr: {
    name: "Français",
    intro: (title) => `Découvrez ${title}, un projet de Ludmil Paulo.`,
    status: {
      live: "Il est en ligne. Vous pouvez l'ouvrir et l'utiliser aujourd'hui.",
      upcoming: "Il arrive bientôt. Partagez-le pour que d'autres sachent ce qui vient.",
      progress: "Il est en cours de réalisation. Partagez-le et suivez l'avancement.",
      clone: "C'est une version fonctionnelle à explorer.",
      other: "Jetez-y un œil et partagez-le avec quelqu'un qui pourra l'utiliser.",
    },
    pageLabel: "Page du projet",
    demoLabel: "L'utiliser ici",
    passOn: "S'il vous est utile, transmettez-le.",
  },
  af: {
    name: "Afrikaans",
    intro: (title) => `Kyk na ${title}, 'n projek deur Ludmil Paulo.`,
    status: {
      live: "Dit is reeds aanlyn. Jy kan dit oopmaak en vandag gebruik.",
      upcoming: "Dit is op pad. Deel dit sodat mense weet wat kom.",
      progress: "Dit word nou gebou. Deel dit en volg die vordering.",
      clone: "Dit is 'n werkende weergawe wat jy kan verken.",
      other: "Kyk daarna en deel dit met iemand wat dit kan gebruik.",
    },
    pageLabel: "Projekblad",
    demoLabel: "Gebruik dit hier",
    passOn: "As dit nuttig is, stuur dit aan.",
  },
};

export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function projectStage(status: number | string | undefined): ProjectStage {
  const text = String(status ?? "").trim().toLowerCase();
  if (text === "2" || text === "live") return "live";
  if (text === "3" || text === "upcoming") return "upcoming";
  if (text === "4" || text === "in_progress" || text === "in-progress") return "progress";
  if (text === "1" || text === "clone") return "clone";
  return "other";
}

export function projectSlug(title: string, slug?: string): string {
  const existing = slug?.trim();
  if (existing) return existing;
  return title.trim().replace(/ /g, "_").toLowerCase();
}

export function projectShareUrl(slug: string): string {
  return `${PROJECT_SITE_URL}/projects/${encodeURIComponent(slug)}`;
}

export function excerpt(description: string, max = 160): string {
  const plain = stripHtml(description);
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max).trimEnd()}...`;
}

export function buildProjectShareText(input: {
  title: string;
  description: string;
  slug: string;
  status?: number | string;
  demo?: string;
  language: ShareLanguage;
}): string {
  const copy = SHARE_COPY[input.language];
  const slug = projectSlug(input.title, input.slug);
  const summary = excerpt(input.description);
  const lines = [
    copy.intro(input.title.trim() || "this project"),
    summary,
    copy.status[projectStage(input.status)],
    `${copy.pageLabel}: ${projectShareUrl(slug)}`,
  ];
  const demo = input.demo?.trim();
  if (demo) lines.push(`${copy.demoLabel}: ${demo}`);
  lines.push(copy.passOn);
  return lines.filter(Boolean).join("\n\n");
}

export function shareTargets(message: string, url: string): { label: string; href: string }[] {
  const text = encodeURIComponent(message);
  const link = encodeURIComponent(url);
  return [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${link}&quote=${text}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${text}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${link}&text=${text}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(message.split("\n")[0] || "A project by Ludmil Paulo")}&body=${text}` },
  ];
}
