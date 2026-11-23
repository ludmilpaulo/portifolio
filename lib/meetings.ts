import { baseUrl } from "@/hooks/fetchData";

export type MeetingTypeOption = {
  slug: string;
  name: string;
  namePt: string;
  durationMinutes: number;
};

export type MeetingSlot = {
  start: string;
  label: string;
};

export type MeetingDay = {
  date: string;
  slots: MeetingSlot[];
};

export type MeetingBooking = {
  token: string;
  status: "confirmed" | "cancelled";
  meetingSlug: string;
  meetingName: string;
  meetingNamePt: string;
  durationMinutes: number;
  name: string;
  email: string;
  company: string;
  notes: string;
  startsAt: string;
  endsAt: string;
  visitorTimezone: string;
  ownerTimezone: string;
  videoUrl: string;
  locale: string;
  emailSent: boolean;
};

export type MeetingDraft = {
  type: string;
  startsAt: string;
  timezone: string;
  name: string;
  email: string;
  company: string;
  notes: string;
  locale: "en" | "pt";
};

const TIMEZONES = [
  "Africa/Johannesburg",
  "Europe/Lisbon",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
  "UTC",
] as const;

export function timezoneChoices(detected: string): string[] {
  if (TIMEZONES.includes(detected as (typeof TIMEZONES)[number])) return [...TIMEZONES];
  return [detected, ...TIMEZONES];
}

export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Johannesburg";
  } catch {
    return "Africa/Johannesburg";
  }
}

export function formatWhen(iso: string, timeZone: string, locale: "en" | "pt"): string {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return iso;
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(value);
}

export function formatDay(date: string, locale: "en" | "pt"): string {
  const value = new Date(`${date}T12:00:00Z`);
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function messageFrom(body: unknown, fallback: string): string {
  if (isRecord(body) && typeof body.message === "string" && body.message.trim()) return body.message;
  return fallback;
}

async function readBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function parseType(value: unknown): MeetingTypeOption | null {
  if (!isRecord(value)) return null;
  if (typeof value.slug !== "string" || typeof value.name !== "string") return null;
  if (typeof value.duration_minutes !== "number") return null;
  return {
    slug: value.slug,
    name: value.name,
    namePt: typeof value.name_pt === "string" && value.name_pt ? value.name_pt : value.name,
    durationMinutes: value.duration_minutes,
  };
}

function parseSlot(value: unknown): MeetingSlot | null {
  if (!isRecord(value)) return null;
  if (typeof value.start !== "string" || typeof value.label !== "string") return null;
  return { start: value.start, label: value.label };
}

function parseBooking(value: unknown): MeetingBooking | null {
  if (!isRecord(value)) return null;
  if (typeof value.token !== "string" || typeof value.starts_at !== "string") return null;
  if (value.status !== "confirmed" && value.status !== "cancelled") return null;
  return {
    token: value.token,
    status: value.status,
    meetingSlug: typeof value.meeting_slug === "string" ? value.meeting_slug : "",
    meetingName: typeof value.meeting_name === "string" ? value.meeting_name : "",
    meetingNamePt: typeof value.meeting_name_pt === "string" ? value.meeting_name_pt : "",
    durationMinutes: typeof value.duration_minutes === "number" ? value.duration_minutes : 0,
    name: typeof value.name === "string" ? value.name : "",
    email: typeof value.email === "string" ? value.email : "",
    company: typeof value.company === "string" ? value.company : "",
    notes: typeof value.notes === "string" ? value.notes : "",
    startsAt: value.starts_at,
    endsAt: typeof value.ends_at === "string" ? value.ends_at : value.starts_at,
    visitorTimezone: typeof value.visitor_timezone === "string" ? value.visitor_timezone : "Africa/Johannesburg",
    ownerTimezone: typeof value.owner_timezone === "string" ? value.owner_timezone : "Africa/Johannesburg",
    videoUrl: typeof value.video_url === "string" ? value.video_url : "",
    locale: value.locale === "pt" ? "pt" : "en",
    emailSent: value.email_sent === true,
  };
}

export async function fetchMeetingTypes(): Promise<MeetingTypeOption[]> {
  const response = await fetch(`${baseUrl}api/meetings/types/`);
  const body = await readBody(response);
  if (!response.ok || !isRecord(body) || !Array.isArray(body.types)) {
    throw new Error(messageFrom(body, "Could not load meeting types."));
  }
  return body.types.map(parseType).filter((item): item is MeetingTypeOption => item !== null);
}

export async function fetchMeetingDays(type: string, timezone: string, ignore?: string): Promise<MeetingDay[]> {
  const params = new URLSearchParams({ type, timezone });
  if (ignore) params.set("ignore", ignore);
  const response = await fetch(`${baseUrl}api/meetings/slots/?${params.toString()}`);
  const body = await readBody(response);
  if (!response.ok || !isRecord(body) || !Array.isArray(body.days)) {
    throw new Error(messageFrom(body, "Could not load available times."));
  }
  return body.days.flatMap((day) => {
    if (!isRecord(day) || typeof day.date !== "string" || !Array.isArray(day.slots)) return [];
    const slots = day.slots.map(parseSlot).filter((slot): slot is MeetingSlot => slot !== null);
    return slots.length ? [{ date: day.date, slots }] : [];
  });
}

export async function createMeeting(draft: MeetingDraft): Promise<MeetingBooking> {
  const response = await fetch(`${baseUrl}api/meetings/book/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: draft.type,
      starts_at: draft.startsAt,
      timezone: draft.timezone,
      name: draft.name,
      email: draft.email,
      company: draft.company,
      notes: draft.notes,
      locale: draft.locale,
    }),
  });
  const body = await readBody(response);
  const booking = isRecord(body) ? parseBooking(body.booking) : null;
  if (!response.ok || !booking) throw new Error(messageFrom(body, "Could not book that time."));
  return booking;
}

export async function fetchMeeting(token: string): Promise<MeetingBooking> {
  const response = await fetch(`${baseUrl}api/meetings/${token}/`);
  const body = await readBody(response);
  const booking = isRecord(body) ? parseBooking(body.booking) : null;
  if (!response.ok || !booking) throw new Error(messageFrom(body, "Meeting not found."));
  return booking;
}

export async function cancelMeeting(token: string): Promise<MeetingBooking> {
  const response = await fetch(`${baseUrl}api/meetings/${token}/cancel/`, { method: "POST" });
  const body = await readBody(response);
  const booking = isRecord(body) ? parseBooking(body.booking) : null;
  if (!response.ok || !booking) throw new Error(messageFrom(body, "Could not cancel the meeting."));
  return booking;
}

export async function rescheduleMeeting(token: string, startsAt: string, timezone: string): Promise<MeetingBooking> {
  const response = await fetch(`${baseUrl}api/meetings/${token}/reschedule/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ starts_at: startsAt, timezone }),
  });
  const body = await readBody(response);
  const booking = isRecord(body) ? parseBooking(body.booking) : null;
  if (!response.ok || !booking) throw new Error(messageFrom(body, "Could not change that time."));
  return booking;
}
