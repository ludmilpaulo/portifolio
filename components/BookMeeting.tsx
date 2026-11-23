"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useGetMyInfoQuery } from "@/store/myInfoApi";
import type { PublicLocale } from "@/lib/localePaths";
import { bookingCopy } from "@/lib/publicCopy";

const CalEmbed = dynamic(() => import("@/components/CalEmbed"), { ssr: false });

export default function BookMeeting({ locale }: { locale: PublicLocale }) {
  const copy = bookingCopy[locale];
  const { data } = useGetMyInfoQuery();
  const email = data?.info?.[0]?.email?.trim() || "";
  const username = process.env.NEXT_PUBLIC_CAL_USERNAME?.trim() || "";
  const sectionRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const reveal = () => setOpen(true);
    if (window.location.hash === "#book") reveal();
    window.addEventListener("hashchange", reveal);
    const node = sectionRef.current;
    if (!node) {
      return () => window.removeEventListener("hashchange", reveal);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", reveal);
    };
  }, []);

  const bookingUrl = username ? `https://cal.com/${username}` : "";

  return (
    <section
      id="book"
      ref={sectionRef}
      aria-labelledby="book-heading"
      className="scroll-mt-24 bg-white text-slate-900"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div>
          <h2
            id="book-heading"
            className="text-3xl font-bold tracking-tight text-slate-900 [font-family:var(--font-heading),sans-serif] sm:text-4xl"
          >
            {copy.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">{copy.intro}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{copy.timezone}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {username ? (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-sky-800 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2"
              >
                {copy.button}
              </button>
            ) : null}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2"
              >
                {copy.email}
              </a>
            ) : null}
          </div>
        </div>
        <div className="min-h-[280px] rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
          {username && open ? (
            <div className="h-[680px] overflow-hidden rounded-2xl bg-white">
              <p className="sr-only">{copy.loading}</p>
              <CalEmbed calLink={username} />
            </div>
          ) : (
            <p className="text-base leading-relaxed text-slate-700">{username ? copy.waiting : copy.unavailable}</p>
          )}
          {bookingUrl ? (
            <p className="mt-4 text-sm text-slate-700">
              <a
                href={bookingUrl}
                className="font-semibold text-sky-800 underline decoration-sky-800/40 underline-offset-4 hover:decoration-sky-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2"
              >
                {copy.direct}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
