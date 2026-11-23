"use client";

import Link from "next/link";
import { MdEmail, MdPhone } from "react-icons/md";
import { AiOutlineWhatsApp } from "react-icons/ai";
import BookMeeting from "@/components/BookMeeting";
import { useGetMyInfoQuery } from "@/store/myInfoApi";
import type { PublicLocale } from "@/lib/localePaths";
import { contactCopy } from "@/lib/publicCopy";

export default function ContactView({ locale }: { locale: PublicLocale }) {
  const copy = contactCopy[locale];
  const { data, isLoading, isError } = useGetMyInfoQuery();
  const info = data?.info?.[0];
  const aboutHref = locale === "pt" ? "/pt/about" : "/about";
  const phone = info?.phone?.trim() || "";
  const email = info?.email?.trim() || "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="mx-auto max-w-3xl px-4 pb-4 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 [font-family:var(--font-heading),sans-serif]">
          {copy.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">{copy.intro}</p>
        {isLoading ? (
          <p className="mt-8 text-slate-600">{locale === "pt" ? "A carregar..." : "Loading..."}</p>
        ) : isError || (!email && !phone) ? (
          <p className="mt-8 text-slate-700">{copy.missing}</p>
        ) : (
          <ul className="mt-8 space-y-4 text-lg">
            {phone ? (
              <li className="flex items-center gap-3 text-slate-800">
                <MdPhone aria-hidden className="text-2xl text-sky-800" />
                <span>
                  <span className="mr-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{copy.phone}</span>
                  {phone}
                </span>
              </li>
            ) : null}
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-3 font-semibold text-sky-800 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2">
                  <MdEmail aria-hidden className="text-2xl" />
                  {copy.email}: {email}
                </a>
              </li>
            ) : null}
            {phone ? (
              <li>
                <a
                  href={`https://wa.me/${phone.replace(/[^\d]/g, "")}`}
                  className="inline-flex min-h-12 items-center gap-3 rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AiOutlineWhatsApp aria-hidden className="text-2xl" />
                  {copy.whatsapp}
                </a>
              </li>
            ) : null}
          </ul>
        )}
        <p className="mt-8 text-sm text-slate-700">
          <Link href={aboutHref} className="font-semibold text-sky-800 underline-offset-4 hover:underline">
            {locale === "pt" ? "Sobre" : "About"}
          </Link>
          <span className="mx-2 text-slate-400">·</span>
          <Link href="/projects" className="font-semibold text-sky-800 underline-offset-4 hover:underline">
            {locale === "pt" ? "Projetos" : "Projects"}
          </Link>
        </p>
      </div>
      <BookMeeting locale={locale} />
    </main>
  );
}
