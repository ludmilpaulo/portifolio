"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminRequest, asList, fieldClass, plainText } from "@/lib/adminApi";
import type { Competence, Experience } from "@/hooks/types";

interface ExperienceForm {
  title: string;
  company: string;
  the_year: string;
  description: string;
  stackIds: number[];
}

const EMPTY: ExperienceForm = { title: "", company: "", the_year: "", description: "", stackIds: [] };

export default function ExperienceAdminPage() {
  const [rows, setRows] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Competence[]>([]);
  const [form, setForm] = useState<ExperienceForm>(EMPTY);
  const [logo, setLogo] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [experiencePayload, skillPayload] = await Promise.all([
        adminRequest<unknown>("experience/"),
        adminRequest<unknown>("competence/"),
      ]);
      setRows(asList<Experience>(experiencePayload));
      setSkills(asList<Competence>(skillPayload));
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load experience");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setForm(EMPTY);
    setLogo(null);
    setEditingId(null);
  };

  const toggleSkill = (id: number) => {
    setForm((current) => ({
      ...current,
      stackIds: current.stackIds.includes(id)
        ? current.stackIds.filter((skillId) => skillId !== id)
        : [...current.stackIds, id],
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        the_year: form.the_year.trim(),
        description: form.description.trim(),
        stack_ids: form.stackIds,
      };
      const saved = editingId
        ? await adminRequest<Experience>(`experience/${editingId}/`, { method: "PATCH", body: JSON.stringify(payload) })
        : await adminRequest<Experience>("experience/", { method: "POST", body: JSON.stringify(payload) });
      if (logo && saved.id) {
        const body = new FormData();
        body.set("logo", logo);
        await adminRequest(`experience/${saved.id}/`, { method: "PATCH", body });
      }
      reset();
      setMessage("Experience saved.");
      await load();
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save experience");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await adminRequest(`experience/${id}/`, { method: "DELETE" });
      if (editingId === id) reset();
      await load();
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete experience");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Experience</h1>
        <p className="mt-1 text-gray-600">Manage roles shown on the experience page.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Role
          <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Company
          <input required value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Year
          <input required value={form.the_year} onChange={(event) => setForm((current) => ({ ...current, the_year: event.target.value }))} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Logo
          <input type="file" accept="image/*" onChange={(event) => setLogo(event.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
        </label>
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Description
          <textarea required rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={fieldClass} />
        </label>
        <fieldset className="md:col-span-2">
          <legend className="text-sm font-medium text-slate-700">Skills used</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <label key={skill.id} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm">
                <input type="checkbox" checked={form.stackIds.includes(skill.id)} onChange={() => toggleSkill(skill.id)} />
                {skill.title}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSaving} className="rounded-lg bg-[#0093E9] px-5 py-3 font-semibold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : editingId ? "Save experience" : "Add experience"}
          </button>
          {editingId ? <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-5 py-3">Cancel</button> : null}
        </div>
      </form>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {isLoading ? <p className="text-sm text-gray-500">Loading experience...</p> : null}
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{row.title}</h2>
                <p className="text-sm text-slate-500">{row.company} · {row.the_year}</p>
                <p className="mt-2 text-sm text-slate-600">{plainText(row.description)}</p>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  className="mr-3 text-[#0093E9]"
                  onClick={() => {
                    setEditingId(row.id);
                    setForm({
                      title: row.title,
                      company: row.company,
                      the_year: row.the_year,
                      description: plainText(row.description),
                      stackIds: (row.stack || []).map((skill) => skill.id),
                    });
                  }}
                >
                  Edit
                </button>
                <button type="button" className="text-red-600" onClick={() => void remove(row.id)}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
