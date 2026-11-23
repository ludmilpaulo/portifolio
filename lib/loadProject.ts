import { PROJECT_SITE_URL } from "@/lib/projectShare";

export interface PublicProject {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  imageAlt: string;
  problem: string;
  role: string;
  outcomes: string;
  demo: string;
  github: string;
  status: number | string;
  tools: { id: number; title: string }[];
}

function textField(row: Record<string, unknown>, key: string): string {
  return typeof row[key] === "string" ? row[key].trim() : "";
}

function asProject(value: unknown): PublicProject | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.title !== "string" || typeof row.slug !== "string") return null;
  const tools = Array.isArray(row.tools)
    ? row.tools.flatMap((tool) => {
        if (!tool || typeof tool !== "object") return [];
        const item = tool as Record<string, unknown>;
        if (typeof item.title !== "string") return [];
        return [{ id: Number(item.id ?? 0), title: item.title }];
      })
    : [];
  return {
    id: Number(row.id ?? 0),
    title: row.title,
    slug: row.slug,
    description: typeof row.description === "string" ? row.description : "",
    image: typeof row.image === "string" ? row.image : null,
    imageAlt: textField(row, "image_alt"),
    problem: textField(row, "problem"),
    role: textField(row, "role"),
    outcomes: textField(row, "outcomes"),
    demo: typeof row.demo === "string" ? row.demo : "",
    github: typeof row.github === "string" ? row.github : "",
    status: typeof row.status === "number" || typeof row.status === "string" ? row.status : "",
    tools,
  };
}

export async function loadPublicProjects(): Promise<PublicProject[]> {
  const base = (process.env.DJANGO_API_URL || "https://ludmil.pythonanywhere.com").replace(/\/$/, "");
  const response = await fetch(`${base}/my_info/`, { next: { revalidate: 300 } });
  if (!response.ok) return [];
  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !Array.isArray((payload as { projects?: unknown }).projects)) return [];
  return (payload as { projects: unknown[] }).projects.flatMap((project) => {
    const parsed = asProject(project);
    return parsed ? [parsed] : [];
  });
}

export async function loadPublicProject(slug: string): Promise<PublicProject | null> {
  const projects = await loadPublicProjects();
  const decoded = decodeURIComponent(slug);
  return projects.find((project) => project.slug === decoded || project.slug === slug) ?? null;
}

export function absoluteProjectUrl(slug: string): string {
  return `${PROJECT_SITE_URL}/projects/${encodeURIComponent(slug)}`;
}
