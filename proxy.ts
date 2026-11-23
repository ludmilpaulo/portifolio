import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROOTS = new Set([
  "about",
  "experience",
  "skills",
  "projects",
  "education",
  "certificates",
  "contact",
]);

function localeFor(pathname: string): "en" | "pt" {
  return pathname === "/pt" || pathname.startsWith("/pt/") ? "pt" : "en";
}

function lowercasePublicPath(pathname: string): string | null {
  const parts = pathname.split("/");
  const first = parts[1];
  if (!first) return null;
  const root = first.toLowerCase();
  const canNormalize = PUBLIC_ROOTS.has(root) || root === "pt";
  if (!canNormalize) return null;
  const next = `/${parts.slice(1).map((part) => part.toLowerCase()).join("/")}`;
  return next === pathname ? null : next;
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  let redirecting = false;

  if (url.pathname.toLowerCase() === "/projectdetails") {
    const slug = url.searchParams.get("slug")?.trim();
    url.pathname = slug ? `/projects/${encodeURIComponent(slug.toLowerCase())}` : "/projects";
    url.search = "";
    redirecting = true;
  } else {
    const normalized = lowercasePublicPath(url.pathname);
    if (normalized) {
      url.pathname = normalized;
      redirecting = true;
    }
  }

  if (redirecting) {
    return NextResponse.redirect(url, 301);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", localeFor(url.pathname));
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
