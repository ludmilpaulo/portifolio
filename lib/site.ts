const PRODUCTION_SITE_URL = "https://www.ludmilpaulo.com";

export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (!configured) return PRODUCTION_SITE_URL;
  if (configured.includes("localhost") || configured.includes("127.0.0.1")) return PRODUCTION_SITE_URL;
  if (configured.includes("ludmilpaulo.co.za")) return PRODUCTION_SITE_URL;
  // The apex answers with a redirect. Facebook and other crawlers need the host that returns the page.
  if (configured === "https://ludmilpaulo.com" || configured === "http://ludmilpaulo.com") {
    return PRODUCTION_SITE_URL;
  }
  return configured;
}

export function absoluteUrl(path: string): string {
  if (path === "/") return siteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl()}${normalized}`;
}
