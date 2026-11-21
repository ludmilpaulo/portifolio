"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminRequest, asList, fieldClass, plainText } from "@/lib/adminApi";
import type { Competence } from "@/hooks/types";

const EMPTY = { title: "", percentage: "", description: "" };

export default function SkillsPage() {
  const [skills, setSkills] = useState<Competence[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setSkills(asList<Competence>(await adminRequest<unknown>("competence/")));
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load skills");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setForm(EMPTY);
    setImage(null);
    setEditingId(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId && !image) {
      setError("Choose an icon or image for a new skill.");
      return;
    }
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const body = new FormData();
      body.set("title", form.title.trim());
      body.set("percentage", form.percentage.trim());
      body.set("description", form.description.trim());
      if (image) body.set("image", image);
      if (editingId) {
        await adminRequest(`competence/${editingId}/`, { method: "PATCH", body });
      } else {
        await adminRequest("competence/", { method: "POST", body });
      }
      reset();
      setMessage("Skill saved.");
      await load();
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the skill");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    setError(null);
    try {
      await adminRequest(`competence/${id}/`, { method: "DELETE" });
      if (editingId === id) reset();
      await load();
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete the skill");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
        <p className="mt-1 text-gray-600">Add, edit, or remove the skills shown on the public site.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Level
          <input required value={form.percentage} onChange={(event) => setForm((current) => ({ ...current, percentage: event.target.value }))} placeholder="90%" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Description
          <textarea required rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Image
          <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} className="mt-1 block w-full text-sm" />
        </label>
        <div className="flex items-end gap-3">
          <button type="submit" disabled={isSaving} className="rounded-lg bg-[#0093E9] px-5 py-3 font-semibold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : editingId ? "Save skill" : "Add skill"}
          </button>
          {editingId ? <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-5 py-3">Cancel</button> : null}
        </div>
      </form>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {isLoading ? <p className="text-sm text-gray-500">Loading skills...</p> : null}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Skill</th>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{skill.title}</td>
                <td className="px-4 py-3 text-slate-600">{skill.percentage}</td>
                <td className="px-4 py-3 text-slate-600">{plainText(skill.description)}</td>
                <td className="px-4 py-3">
                  <button type="button" className="mr-3 text-[#0093E9]" onClick={() => { setEditingId(skill.id); setForm({ title: skill.title, percentage: skill.percentage, description: plainText(skill.description) }); }}>Edit</button>
                  <button type="button" className="text-red-600" onClick={() => void remove(skill.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
