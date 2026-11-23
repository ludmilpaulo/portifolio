"use client";

import { useCallback, useEffect, useState } from "react";
import { adminRequest } from "@/lib/adminApi";
import { formatWhen } from "@/lib/meetings";

type MeetingFilter = "upcoming" | "past" | "cancelled";

interface AdminMeeting {
  id: number;
  status: "confirmed" | "cancelled";
  meetingName: string;
  name: string;
  email: string;
  company: string;
  notes: string;
  startsAt: string;
  visitorTimezone: string;
  ownerTimezone: string;
  videoUrl: string;
  manageUrl: string;
  emailSent: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseMeeting(value: unknown): AdminMeeting | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "number" || typeof value.starts_at !== "string") return null;
  if (value.status !== "confirmed" && value.status !== "cancelled") return null;
  return {
    id: value.id,
    status: value.status,
    meetingName: typeof value.meeting_name === "string" ? value.meeting_name : "Meeting",
    name: typeof value.name === "string" ? value.name : "",
    email: typeof value.email === "string" ? value.email : "",
    company: typeof value.company === "string" ? value.company : "",
    notes: typeof value.notes === "string" ? value.notes : "",
    startsAt: value.starts_at,
    visitorTimezone: typeof value.visitor_timezone === "string" ? value.visitor_timezone : "Africa/Johannesburg",
    ownerTimezone: typeof value.owner_timezone === "string" ? value.owner_timezone : "Africa/Johannesburg",
    videoUrl: typeof value.video_url === "string" ? value.video_url : "",
    manageUrl: typeof value.manage_url === "string" ? value.manage_url : "",
    emailSent: value.email_sent === true,
  };
}

function parseMeetings(payload: unknown): AdminMeeting[] {
  if (!isRecord(payload) || !Array.isArray(payload.meetings)) return [];
  return payload.meetings.flatMap((item) => {
    const meeting = parseMeeting(item);
    return meeting ? [meeting] : [];
  });
}

function actionMessage(payload: unknown, fallback: string): string {
  if (isRecord(payload) && typeof payload.message === "string" && payload.message.trim()) return payload.message;
  return fallback;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<AdminMeeting[]>([]);
  const [filter, setFilter] = useState<MeetingFilter>("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setMeetings(parseMeetings(await adminRequest<unknown>("meetings/admin/")));
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load meetings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const now = Date.now();
  const visible = meetings.filter((meeting) => {
    const when = new Date(meeting.startsAt).getTime();
    if (filter === "cancelled") return meeting.status === "cancelled";
    if (meeting.status !== "confirmed") return false;
    return filter === "upcoming" ? when >= now : when < now;
  });

  const cancel = async (meeting: AdminMeeting) => {
    if (!confirm(`Cancel ${meeting.name}'s ${meeting.meetingName}? They will be emailed.`)) return;
    setBusyId(meeting.id);
    setNotice(null);
    setError(null);
    try {
      const payload = await adminRequest<unknown>(`meetings/admin/${meeting.id}/cancel/`, { method: "POST" });
      setNotice(actionMessage(payload, "Meeting cancelled."));
      await load();
    } catch (cancelError: unknown) {
      setError(cancelError instanceof Error ? cancelError.message : "Could not cancel the meeting");
    } finally {
      setBusyId(null);
    }
  };

  const resend = async (meeting: AdminMeeting) => {
    setBusyId(meeting.id);
    setNotice(null);
    setError(null);
    try {
      const payload = await adminRequest<unknown>(`meetings/admin/${meeting.id}/resend/`, { method: "POST" });
      setNotice(actionMessage(payload, "Confirmation sent."));
      await load();
    } catch (sendError: unknown) {
      setError(sendError instanceof Error ? sendError.message : "Could not send the email");
    } finally {
      setBusyId(null);
    }
  };

  const filters: { id: MeetingFilter; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
        <p className="mt-1 text-gray-600">Bookings from the public site. Cancel a meeting or send the confirmation again.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === item.id ? "bg-sky-800 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {isLoading ? <p className="text-sm text-gray-500">Loading meetings...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-700">{notice}</p> : null}
      {!isLoading && visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-semibold text-gray-900">No {filter} meetings</h2>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((meeting) => (
            <article key={meeting.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">{meeting.meetingName}</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">{meeting.name}</h2>
                  <p className="text-sm text-slate-500">
                    <a className="underline-offset-2 hover:underline" href={`mailto:${meeting.email}`}>{meeting.email}</a>
                    {meeting.company ? ` · ${meeting.company}` : ""}
                  </p>
                  <p className="mt-3 text-sm text-slate-800">Cape Town: {formatWhen(meeting.startsAt, meeting.ownerTimezone, "en")}</p>
                  <p className="text-sm text-slate-600">Visitor: {formatWhen(meeting.startsAt, meeting.visitorTimezone, "en")}</p>
                  {meeting.notes ? <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{meeting.notes}</p> : null}
                  <p className="mt-2 text-xs text-slate-400">
                    {meeting.status === "confirmed" ? "Confirmed" : "Cancelled"}
                    {meeting.emailSent ? " · Email sent" : " · Email not sent"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3 text-sm font-semibold">
                  {meeting.videoUrl && meeting.status === "confirmed" ? (
                    <a className="text-sky-800" href={meeting.videoUrl} target="_blank" rel="noopener noreferrer">Join call</a>
                  ) : null}
                  {meeting.manageUrl ? (
                    <a className="text-slate-600" href={meeting.manageUrl} target="_blank" rel="noopener noreferrer">Visitor page</a>
                  ) : null}
                  {meeting.status === "confirmed" ? (
                    <button type="button" className="text-sky-800 disabled:opacity-50" disabled={busyId === meeting.id} onClick={() => void resend(meeting)}>
                      Resend email
                    </button>
                  ) : null}
                  {meeting.status === "confirmed" ? (
                    <button type="button" className="text-red-600 disabled:opacity-50" disabled={busyId === meeting.id} onClick={() => void cancel(meeting)}>
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
