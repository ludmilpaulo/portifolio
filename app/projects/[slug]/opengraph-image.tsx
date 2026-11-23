import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/ogCard";
import { loadPublicProject } from "@/lib/loadProject";

export const alt = "Case study by Ludmil Paulo, Software Engineer and Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

type ImageProps = { params: Promise<{ slug: string }> };

async function screenshotDataUrl(src: string | null): Promise<string | null> {
  if (!src) return null;
  try {
    const response = await fetch(src);
    if (!response.ok) return null;
    const type = response.headers.get("content-type") || "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const project = await loadPublicProject(slug);
  const title = project?.title ?? "Project case study";
  const imageSrc = await screenshotDataUrl(project?.image ?? null);

  return new ImageResponse(
    (
      <OgCard
        kicker="LUDMIL PAULO"
        title={title}
        subtitle="Software Engineer & Full-Stack Developer"
        detail="Case study · Cape Town"
        imageSrc={imageSrc}
      />
    ),
    { ...size },
  );
}
