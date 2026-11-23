"use client";

import { useEffect, useId, useState } from "react";
import type { PublicLocale } from "@/lib/localePaths";
import { bookingCopy } from "@/lib/publicCopy";
import {
  createMeeting,
  detectTimezone,
  fetchMeetingDays,
  fetchMeetingTypes,
  formatDay,
  formatWhen,
  rescheduleMeeting,
  timezoneChoices,
  type MeetingBooking,
  type MeetingDay,
  type MeetingTypeOption,
} from "@/lib/meetings";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800";

export default function MeetingScheduler({
  locale,
  rescheduleToken,
  lockedType,
  onBooked,
}: {
  locale: PublicLocale;
  rescheduleToken?: string;
  lockedType?: string;
  onBooked?: (booking: MeetingBooking) => void;
}) {
  const copy = bookingCopy[locale];
  const formId = useId();
  const [types, setTypes] = useState<MeetingTypeOption[]>([]);
  const [typeSlug, setTypeSlug] = useState(lockedType || "");
  const [timezone, setTimezone] = useState("Africa/Johannesburg");
  const [zones, setZones] = useState<string[]>(timezoneChoices("Africa/Johannesburg"));
  const [days, setDays] = useState<MeetingDay[]>([]);
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<MeetingBooking | null>(null);

  useEffect(() => {
    const detected = detectTimezone();
    setTimezone(detected);
    setZones(timezoneChoices(detected));
    let active = true;
    fetchMeetingTypes()
      .then((loaded) => {
        if (!active) return;
        setTypes(loaded);
        setTypeSlug((current) => current || lockedType || loaded[0]?.slug || "");
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(copy.loadError);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [copy.loadError, lockedType]);

  useEffect(() => {
    if (!typeSlug || !timezone) return;
    let active = true;
    setLoadingSlots(true);
    setError("");
    fetchMeetingDays(typeSlug, timezone, rescheduleToken)
      .then((loaded) => {
        if (!active) return;
        setDays(loaded);
        setDay((current) => (loaded.some((item) => item.date === current) ? current : loaded[0]?.date || ""));
        setSlot("");
        setLoadingSlots(false);
      })
      .catch(() => {
        if (!active) return;
        setDays([]);
        setError(copy.loadError);
        setLoadingSlots(false);
      });
    return () => {
      active = false;
    };
  }, [typeSlug, timezone, rescheduleToken, copy.loadError]);

  const selectedDay = days.find((item) => item.date === day);
  const meetingName = (item: MeetingTypeOption) => (locale === "pt" ? item.namePt : item.name);

  async function confirmBooking() {
    if (!slot || !typeSlug) return;
    setSaving(true);
    setError("");
    try {
      const saved = rescheduleToken
        ? await rescheduleMeeting(rescheduleToken, slot, timezone)
        : await createMeeting({
            type: typeSlug,
            startsAt: slot,
            timezone,
            name,
            email,
            company,
            notes,
            locale,
          });
      setBooking(saved);
      onBooked?.(saved);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : copy.taken;
      setError(message);
      if (typeSlug) {
        const loaded = await fetchMeetingDays(typeSlug, timezone, rescheduleToken).catch(() => []);
        setDays(loaded);
        setSlot("");
      }
    } finally {
      setSaving(false);
    }
  }

  if (booking) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
        <h3 className="text-xl font-bold text-slate-900 [font-family:var(--font-heading),sans-serif]">{copy.confirmedTitle}</h3>
        <p className="mt-3 text-base text-slate-800">
          {locale === "pt" ? booking.meetingNamePt : booking.meetingName}
          {" · "}
          {booking.durationMinutes} min
        </p>
        <p className="mt-2 text-base text-slate-800">{formatWhen(booking.startsAt, booking.visitorTimezone, locale)}</p>
        <p className="mt-1 text-sm text-slate-600">
          {copy.ownerTime}: {formatWhen(booking.startsAt, booking.ownerTimezone, locale)}
        </p>
        {booking.videoUrl ? (
          <a
            href={booking.videoUrl}
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-sky-800 px-5 py-3 text-base font-semibold text-white hover:bg-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2"
          >
            {copy.video}
          </a>
        ) : null}
        <p className="mt-4 text-sm leading-relaxed text-slate-700">{booking.emailSent ? copy.emailSent : copy.emailFailed}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      {loading ? <p className="text-base text-slate-700">{copy.loading}</p> : null}
      {!loading && error && types.length === 0 ? <p className="text-base leading-relaxed text-slate-700">{error}</p> : null}
      {types.length > 0 ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void confirmBooking();
          }}
        >
          {!rescheduleToken ? <fieldset>
            <legend className="text-sm font-semibold text-slate-800">{copy.typeLabel}</legend>
            <div className="mt-2 grid gap-2">
              {types.map((item) => (
                <label
                  key={item.slug}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-3 py-3 ${
                    typeSlug === item.slug ? "border-sky-800 bg-white" : "border-slate-200 bg-white/70"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`${formId}-type`}
                      value={item.slug}
                      checked={typeSlug === item.slug}
                      onChange={() => setTypeSlug(item.slug)}
                      className="h-4 w-4 accent-sky-800"
                    />
                    <span className="text-sm font-medium text-slate-900">{meetingName(item)}</span>
                  </span>
                  <span className="shrink-0 text-sm text-slate-600">{item.durationMinutes} min</span>
                </label>
              ))}
            </div>
          </fieldset> : null}

          <label className="mt-4 block text-sm font-semibold text-slate-800" htmlFor={`${formId}-zone`}>
            {copy.timezoneLabel}
            <select
              id={`${formId}-zone`}
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className={inputClass}
            >
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-4" role="group" aria-label={copy.slotsLabel}>
            <p className="text-sm font-semibold text-slate-800">{copy.slotsLabel}</p>
            {loadingSlots ? <p className="mt-2 text-sm text-slate-600">{copy.loading}</p> : null}
            {!loadingSlots && days.length === 0 ? <p className="mt-2 text-sm leading-relaxed text-slate-700">{copy.empty}</p> : null}
            {days.length > 0 ? (
              <>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {days.map((item) => (
                    <button
                      key={item.date}
                      type="button"
                      onClick={() => {
                        setDay(item.date);
                        setSlot("");
                      }}
                      aria-pressed={item.date === day}
                      className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 ${
                        item.date === day ? "bg-sky-800 text-white" : "bg-white text-slate-800"
                      }`}
                    >
                      {formatDay(item.date, locale)}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {selectedDay?.slots.map((item) => (
                    <button
                      key={item.start}
                      type="button"
                      onClick={() => setSlot(item.start)}
                      aria-pressed={slot === item.start}
                      className={`min-h-11 rounded-xl px-2 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 ${
                        slot === item.start ? "bg-sky-800 text-white" : "bg-white text-slate-900"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {slot && !rescheduleToken ? (
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-semibold text-slate-800" htmlFor={`${formId}-name`}>
                {copy.nameLabel}
                <input id={`${formId}-name`} required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
              </label>
              <label className="text-sm font-semibold text-slate-800" htmlFor={`${formId}-email`}>
                {copy.emailLabel}
                <input id={`${formId}-email`} type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
              </label>
              <label className="text-sm font-semibold text-slate-800" htmlFor={`${formId}-company`}>
                {copy.companyLabel}
                <input id={`${formId}-company`} autoComplete="organization" value={company} onChange={(event) => setCompany(event.target.value)} className={inputClass} />
              </label>
              <label className="text-sm font-semibold text-slate-800" htmlFor={`${formId}-notes`}>
                {copy.notesLabel}
                <textarea id={`${formId}-notes`} rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} className={inputClass} />
              </label>
            </div>
          ) : null}

          {error && types.length > 0 ? (
            <p role="alert" className="mt-3 text-sm font-medium text-red-800">
              {error}
            </p>
          ) : null}

          {slot ? (
            <button
              type="submit"
              disabled={saving}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sky-800 px-5 py-3 text-base font-semibold text-white hover:bg-sky-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-800 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {saving ? copy.submitting : rescheduleToken ? copy.changeTime : copy.submit}
            </button>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
