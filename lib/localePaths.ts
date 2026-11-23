export type PublicLocale = "en" | "pt";

export function localeFromPath(pathname: string): PublicLocale {
  const path = pathname.split("?")[0] || "/";
  return path === "/pt" || path.startsWith("/pt/") ? "pt" : "en";
}

export function languageSwitchTarget(pathname: string, target: PublicLocale): string {
  const path = pathname.split("?")[0] || "/";
  if (target === "pt") {
    if (path === "/") return "/pt";
    if (path === "/about") return "/pt/about";
    if (path === "/contact") return "/pt/contact";
    if (path === "/pt" || path.startsWith("/pt/")) return path;
    return "/pt";
  }
  if (path === "/pt") return "/";
  if (path === "/pt/about") return "/about";
  if (path === "/pt/contact") return "/contact";
  if (path.startsWith("/pt/")) return "/";
  return path;
}

export function bookHref(locale: PublicLocale): string {
  return locale === "pt" ? "/pt#book" : "/#book";
}
