"use client";

import { useGetMyInfoQuery } from "@/store/myInfoApi";
import type { PublicLocale } from "@/lib/localePaths";
import { bookingCopy } from "@/lib/publicCopy";
import MeetingScheduler from "@/components/MeetingScheduler";

export default function BookMeeting({ locale }: { locale: PublicLocale }) {
  const copy = bookingCopy[locale];
  const { data } = useGetMyInfoQuery();
  const email = data?.info?.[0]?.email?.trim() || "";

  return (
    <section id="book" aria-labelledby="book-heading" className="scroll-mt-24 bg-white text-slate-900">
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
          {email ? (
            <a
              href={`mailto:${email}`}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2"
            >
              {copy.email}
            </a>
          ) : null}
        </div>
        <MeetingScheduler locale={locale} />
      </div>
    </section>
  );
}
