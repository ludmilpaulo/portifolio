import type { MetadataRoute } from "next";
import { loadPublicProjects } from "@/lib/loadProject";
import { absoluteUrl } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/about",
  "/projects",
  "/experience",
  "/skills",
  "/education",
  "/certificates",
  "/contact",
  "/pt",
  "/pt/about",
  "/pt/contact",
  "/project-inquiry",
  "/leave-testimonial",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" || path === "/projects" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/projects" || path === "/contact" ? 0.9 : 0.7,
  }));

  const projects = await loadPublicProjects();
  for (const project of projects) {
    if (!project.slug) continue;
    pages.push({
      url: absoluteUrl(`/projects/${encodeURIComponent(project.slug)}`),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
