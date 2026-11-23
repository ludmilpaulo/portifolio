"use client";

import { useEffect, useState } from "react";
import { bookingCopy } from "@/lib/publicCopy";
import { cancelMeeting, fetchMeeting, formatWhen, type MeetingBooking } from "@/lib/meetings";
import type { PublicLocale } from "@/lib/localePaths";
import MeetingScheduler from "@/components/MeetingScheduler";

export default function ManageMeeting({ token }: { token: string }) {
  const [booking, setBooking] = useState<MeetingBooking | null>(null);
  const [error, setError] = useState("");
  const [changing, setChanging] = useState(false);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let active = true;
    fetchMeeting(token)
      .then((loaded) => {
        if (active) setBooking(loaded);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : "Meeting not found.");
      });
    return () => {
      active = false;
    };
  }, [token]);

  const locale: PublicLocale = booking?.locale === "pt" ? "pt" : "en";
  const copy = bookingCopy[locale];

  async function cancel() {
    setWorking(true);
    setError("");
    try {
      setBooking(await cancelMeeting(token));
      setChanging(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.loadError);
    } finally {
      setWorking(false);
    }
  }

  if (!booking && !error) {
    return <p className="text-slate-700">{copy.loading}</p>;
  }
  if (!booking) {
    return <p className="text-slate-700">{error}</p>;
  }

  const title = locale === "pt" ? booking.meetingNamePt : booking.meetingName;

  return (
    <div className="grid gap-8">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <h1 className="text-3xl font-bold text-slate-900 [font-family:var(--font-heading),sans-serif]">{title}</h1>
        {booking.status === "cancelled" ? <p className="mt-4 text-base text-slate-800">{copy.cancelled}</p> : null}
        {booking.status === "confirmed" ? (
          <>
            <p className="mt-4 text-base text-slate-800">{formatWhen(booking.startsAt, booking.visitorTimezone, locale)}</p>
            <p className="mt-1 text-sm text-slate-600">
              {copy.ownerTime}: {formatWhen(booking.startsAt, booking.ownerTimezone, locale)}
            </p>
            {booking.videoUrl ? (
              <a
                href={booking.videoUrl}
                className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-sky-800 px-5 py-3 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2"
              >
                {copy.video}
              </a>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setChanging((current) => !current)}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800"
              >
                {copy.reschedule}
              </button>
              <button
                type="button"
                onClick={() => void cancel()}
                disabled={working}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-red-700 px-5 py-3 font-semibold text-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-800 disabled:opacity-60"
              >
                {copy.cancel}
              </button>
            </div>
          </>
        ) : null}
        {error ? (
          <p role="alert" className="mt-3 text-sm font-medium text-red-800">
            {error}
          </p>
        ) : null}
      </div>
      {changing && booking.status === "confirmed" ? (
        <MeetingScheduler
          locale={locale}
          rescheduleToken={booking.token}
          lockedType={booking.meetingSlug}
          onBooked={(saved) => {
            setBooking(saved);
            setChanging(false);
          }}
        />
      ) : null}
    </div>
  );
}
