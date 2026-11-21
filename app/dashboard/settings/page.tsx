"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { adminRequest, asList, fieldClass } from "@/lib/adminApi";

interface SiteProfile {
  id?: number;
  name_complete: string;
  email: string;
  phone: string;
  address: string;
  born_date: string;
  mini_about: string;
  about: string;
  github: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  instagram: string;
  avatar: string | null;
  cv: string | null;
}

const EMPTY: SiteProfile = {
  name_complete: "",
  email: "",
  phone: "",
  address: "",
  born_date: "",
  mini_about: "",
  about: "",
  github: "",
  linkedin: "",
  facebook: "",
  twitter: "",
  instagram: "",
  avatar: null,
  cv: null,
};

const SOCIAL_FIELDS: Array<{ key: keyof SiteProfile; label: string }> = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "twitter", label: "X / Twitter" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
];

export default function SiteSettingsPage() {
  const [profile, setProfile] = useState<SiteProfile>(EMPTY);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const payload = await adminRequest<unknown>("information/");
        const rows = asList<SiteProfile>(payload);
        if (!cancelled && rows[0]) {
          setProfile({ ...EMPTY, ...rows[0], born_date: rows[0].born_date || "" });
        }
      } catch (loadError: unknown) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Could not load the site profile");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (key: keyof SiteProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      const body = new FormData();
      body.set("name_complete", profile.name_complete.trim());
      body.set("email", profile.email.trim());
      body.set("phone", profile.phone.trim());
      body.set("address", profile.address.trim());
      if (profile.born_date) body.set("born_date", profile.born_date);
      body.set("mini_about", profile.mini_about);
      body.set("about", profile.about);
      SOCIAL_FIELDS.forEach(({ key }) => body.set(key, String(profile[key] || "").trim()));
      if (avatar) body.set("avatar", avatar);
      const saved = profile.id
        ? await adminRequest<SiteProfile>(`information/${profile.id}/`, { method: "PATCH", body })
        : await adminRequest<SiteProfile>("information/", { method: "POST", body });
      setProfile({ ...EMPTY, ...saved, born_date: saved.born_date || "" });
      setAvatar(null);
      setMessage("Site profile saved. The public pages use these details and social links.");
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the site profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Site & social</h1>
        <p className="mt-1 text-gray-600">
          This is the profile shown across the portfolio: name, about text, contact details, and social links. Role-specific CVs are managed separately.
        </p>
      </div>
      {isLoading ? <p className="text-sm text-gray-500">Loading profile...</p> : null}
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input required value={profile.name_complete} onChange={(event) => setField("name_complete", event.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input type="email" value={profile.email} onChange={(event) => setField("email", event.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Phone
          <input value={profile.phone} onChange={(event) => setField("phone", event.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Address
          <input value={profile.address} onChange={(event) => setField("address", event.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Born
          <input type="date" value={profile.born_date || ""} onChange={(event) => setField("born_date", event.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Avatar
          <input type="file" accept="image/*" onChange={(event) => setAvatar(event.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
          {profile.avatar ? <span className="mt-1 block text-xs text-slate-500">Current photo stays unless you choose a new file.</span> : null}
        </label>
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Short intro
          <textarea required rows={3} value={profile.mini_about} onChange={(event) => setField("mini_about", event.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          About
          <textarea required rows={6} value={profile.about} onChange={(event) => setField("about", event.target.value)} className={fieldClass} />
        </label>
        {SOCIAL_FIELDS.map((field) => (
          <label key={field.key} className="block text-sm font-medium text-slate-700">
            {field.label}
            <input type="url" value={String(profile[field.key] || "")} onChange={(event) => setField(field.key, event.target.value)} placeholder="https://" className={fieldClass} />
          </label>
        ))}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:col-span-2">
          <p className="font-medium text-slate-900">Multiple CVs</p>
          <p className="mt-1">Add a CV for each role, such as software engineer, technical operations, front end, or full stack.</p>
          <Link href="/dashboard/cvs" className="mt-2 inline-block font-semibold text-[#0093E9]">Manage CVs</Link>
        </div>
        <div className="md:col-span-2">
          <button type="submit" disabled={isSaving || isLoading} className="rounded-lg bg-[#0093E9] px-5 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-60">
            {isSaving ? "Saving..." : "Save site profile"}
          </button>
        </div>
      </form>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
