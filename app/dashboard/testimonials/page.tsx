"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { baseUrl } from "@/hooks/fetchData";
import { adminAuthHeaders } from "@/lib/adminApi";
import { TestimonialAvatar } from "@/components/TestimonialAvatar";

const TESTIMONIAL_LINK = "https://www.ludmilpaulo.com/leave-testimonial";
const SHARE_TEXT = `I'd value a short testimonial about working together. You can leave it here: ${TESTIMONIAL_LINK}`;

const SHARE_LINKS = [
  {
    label: "Email",
    href: `mailto:?subject=${encodeURIComponent("Could you leave a testimonial?")}&body=${encodeURIComponent(SHARE_TEXT)}`,
    icon: FaEnvelope,
  },
  {
    label: "LinkedIn",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(TESTIMONIAL_LINK)}`,
    icon: FaLinkedin,
  },
  {
    label: "X",
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`,
    icon: FaXTwitter,
  },
  {
    label: "Facebook",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(TESTIMONIAL_LINK)}`,
    icon: FaFacebook,
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`,
    icon: FaWhatsapp,
  },
];

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string | null;
  created_at: string;
}

const EMPTY = { name: "", role: "", text: "" };

function asRows(payload: unknown): Testimonial[] {
  const rows = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as { results?: unknown }).results)
      ? (payload as { results: unknown[] }).results
      : [];
  return rows.map((row) => {
    const item = row as Partial<Testimonial>;
    return {
      id: Number(item.id ?? 0),
      name: item.name || "",
      role: item.role || "",
      text: item.text || "",
      avatar: item.avatar || null,
      created_at: item.created_at || "",
    };
  });
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(TESTIMONIAL_LINK);
      setCopied(true);
    } catch {
      setCopied(false);
      setError("Could not copy the link. Select it and copy it manually.");
    }
  };

  const shareOnInstagram = async () => {
    try {
      await navigator.clipboard.writeText(`${SHARE_TEXT}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}testimonials/`);
      if (!response.ok) throw new Error("Could not load testimonials");
      setTestimonials(asRows(await response.json()));
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load testimonials");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setForm(EMPTY);
    setAvatar(null);
    setEditingId(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const body = new FormData();
      body.set("name", form.name.trim());
      body.set("role", form.role.trim());
      body.set("text", form.text.trim());
      if (avatar) body.set("avatar", avatar);
      const response = await fetch(editingId ? `${baseUrl}testimonials/${editingId}/` : `${baseUrl}testimonials/`, {
        method: editingId ? "PATCH" : "POST",
        headers: editingId ? adminAuthHeaders() : undefined,
        body,
      });
      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const detail = payload && typeof payload === "object" && "detail" in payload ? String((payload as { detail: unknown }).detail) : "Could not save the testimonial";
        throw new Error(detail);
      }
      reset();
      setMessage(editingId ? "Testimonial updated." : "Testimonial published.");
      await load();
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    setError(null);
    try {
      const response = await fetch(`${baseUrl}testimonials/${id}/`, {
        method: "DELETE",
        headers: adminAuthHeaders(),
      });
      if (!response.ok) throw new Error("Could not delete the testimonial");
      if (editingId === id) reset();
      await load();
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete the testimonial");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
        <p className="mt-1 text-gray-600">Create, edit, and delete the reviews shown on the site.</p>
      </div>
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Ask for a testimonial</h2>
        <p className="mt-1 text-sm text-slate-600">
          Share this link by email or on social media. Anyone with the link can leave a review.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input readOnly value={TESTIMONIAL_LINK} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" />
          <button type="button" onClick={() => void copyLink()} className="rounded-lg bg-[#0093E9] px-4 py-2 font-semibold text-white">
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {SHARE_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#0093E9] hover:text-[#0093E9]"
            >
              <item.icon />
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => void shareOnInstagram()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-[#0093E9] hover:text-[#0093E9]"
          >
            <FaInstagram />
            Instagram
          </button>
        </div>
      </section>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Name
          <input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Role
          <input value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Review
          <textarea required rows={4} value={form.text} onChange={(event) => setForm((current) => ({ ...current, text: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Photo
          <input type="file" accept="image/*" onChange={(event) => setAvatar(event.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
        </label>
        <div className="flex items-end gap-3">
          <button type="submit" disabled={isSaving} className="rounded-lg bg-[#0093E9] px-5 py-3 font-semibold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : editingId ? "Save testimonial" : "Add testimonial"}
          </button>
          {editingId ? <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-5 py-3">Cancel</button> : null}
        </div>
      </form>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {isLoading ? <p className="text-sm text-gray-500">Loading testimonials...</p> : null}
      <div className="space-y-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.id} className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex gap-4">
              <TestimonialAvatar name={testimonial.name} src={testimonial.avatar} size={48} imageClassName="h-12 w-12 rounded-full object-cover" fallbackClassName="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700" />
              <div>
                <h2 className="font-semibold text-slate-900">{testimonial.name}</h2>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
                <p className="mt-2 text-sm text-slate-700">{testimonial.text}</p>
              </div>
            </div>
            <div className="shrink-0">
              <button type="button" className="mr-3 text-[#0093E9]" onClick={() => { setEditingId(testimonial.id); setForm({ name: testimonial.name, role: testimonial.role, text: testimonial.text }); }}>Edit</button>
              <button type="button" className="text-red-600" onClick={() => void remove(testimonial.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
