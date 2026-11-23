import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectShare from "@/components/ProjectShare";
import { absoluteProjectUrl, loadPublicProject, loadPublicProjects, type PublicProject } from "@/lib/loadProject";
import { excerpt, projectStage } from "@/lib/projectShare";
import { absoluteUrl } from "@/lib/site";

const STATUS_LABEL = {
  live: "Live",
  upcoming: "Upcoming",
  progress: "In progress",
  clone: "Clone",
  other: "Project",
} as const;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function projectDescription(project: PublicProject): string {
  const fromBody = excerpt(project.description, 155);
  if (fromBody) return fromBody;
  if (project.problem) return excerpt(project.problem, 155);
  return `${project.title}, a software project by Ludmil Paulo, a full-stack developer in Cape Town.`;
}

function screenshotAlt(project: PublicProject): string {
  return project.imageAlt || `${project.title} project screenshot`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadPublicProject(slug);
  if (!project) {
    return { title: "Project", robots: { index: false, follow: false } };
  }
  const description = projectDescription(project);
  const url = absoluteProjectUrl(project.slug);
  const title = `${project.title} | Ludmil Paulo`;
  const image = `/projects/${encodeURIComponent(project.slug)}/opengraph-image`;
  return {
    title: { absolute: title },
    description,
    keywords: project.tools.map((tool) => tool.title),
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Ludmil Paulo",
      images: [{ url: image, width: 1200, height: 630, alt: `${project.title} — case study by Ludmil Paulo` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SharedProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await loadPublicProjects();
  const decoded = decodeURIComponent(slug);
  const project = projects.find((item) => item.slug === decoded || item.slug === slug);
  if (!project) notFound();

  const stage = projectStage(project.status);
  const descriptionText = excerpt(project.description, 280);
  const url = absoluteProjectUrl(project.slug);
  const related = projects.filter((item) => item.slug !== project.slug).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url,
    description: projectDescription(project),
    author: { "@type": "Person", name: "Ludmil Paulo", url: absoluteUrl("/") },
    ...(project.image ? { image: project.image } : {}),
    ...(project.tools.length > 0 ? { keywords: project.tools.map((tool) => tool.title).join(", ") } : {}),
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
            <Link href="/" className="font-semibold text-sky-800 underline-offset-4 hover:underline">Home</Link>
            <span className="mx-2" aria-hidden>/</span>
            <Link href="/projects" className="font-semibold text-sky-800 underline-offset-4 hover:underline">Projects</Link>
            <span className="mx-2" aria-hidden>/</span>
            <span className="text-slate-800">{project.title}</span>
          </nav>
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-800">{STATUS_LABEL[stage]}</p>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl [font-family:var(--font-heading),sans-serif]">{project.title}</h1>
            {project.role ? <p className="text-lg text-slate-700"><span className="font-semibold text-slate-900">Role. </span>{project.role}</p> : null}
          </header>
          {project.image ? (
            <figure className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl">
              <div className="relative h-72 w-full sm:h-96">
                <Image src={project.image} alt={screenshotAlt(project)} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 720px" priority />
              </div>
            </figure>
          ) : null}
          {project.problem ? (
            <section>
              <h2 className="text-2xl font-bold text-slate-900">The problem</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-700">{project.problem}</p>
            </section>
          ) : null}
          {descriptionText ? (
            <section>
              <h2 className="text-2xl font-bold text-slate-900">What I built</h2>
              <div className="prose mt-3 max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: project.description }} />
            </section>
          ) : null}
          {project.tools.length > 0 ? (
            <section>
              <h2 className="text-2xl font-bold text-slate-900">Technologies</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <li key={tool.id} className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
                    {tool.title}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {project.outcomes ? (
            <section>
              <h2 className="text-2xl font-bold text-slate-900">Outcomes</h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-700">{project.outcomes}</p>
            </section>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {project.demo ? (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="rounded-full bg-sky-800 px-5 py-2.5 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2">
                View the live project
              </a>
            ) : null}
            {project.github ? (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2">
                Source code
              </a>
            ) : null}
            <Link href="/projects" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2">
              All projects
            </Link>
            <Link href="/contact" className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2">
              Contact
            </Link>
          </div>
          {related.length > 0 ? (
            <section>
              <h2 className="text-xl font-bold text-slate-900">More projects</h2>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/projects/${item.slug}`} className="font-semibold text-sky-800 underline-offset-4 hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
        <ProjectShare
          title={project.title}
          description={project.description}
          slug={project.slug}
          status={project.status}
          demo={project.demo}
        />
      </article>
    </main>
  );
}
