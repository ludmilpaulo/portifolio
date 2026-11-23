import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/ogCard";
import { HOME_OG_ALT } from "@/lib/seo";

export const alt = HOME_OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        kicker="LUDMIL PAULO"
        title="Software Engineer & Full-Stack Developer"
        subtitle="Python · Django · Next.js · TypeScript"
        detail="Cape Town · Open to international opportunities"
      />
    ),
    { ...size },
  );
}
