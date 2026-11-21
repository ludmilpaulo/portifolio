"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminRequest, asList, fieldClass, plainText } from "@/lib/adminApi";
import type { Education } from "@/hooks/types";

const EMPTY = { title: "", the_year: "", description: "" };

export default function EducationPage() {
  const [rows, setRows] = useState<Education[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRows(asList<Education>(await adminRequest<unknown>("education/")));
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load education");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        title: form.title.trim(),
        the_year: form.the_year.trim(),
        description: form.description.trim(),
      };
      if (editingId) {
        await adminRequest(`education/${editingId}/`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await adminRequest("education/", { method: "POST", body: JSON.stringify(payload) });
      }
      reset();
      setMessage("Education saved.");
      await load();
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save education");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this education entry?")) return;
    try {
      await adminRequest(`education/${id}/`, { method: "DELETE" });
      if (editingId === id) reset();
      await load();
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete education");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Education</h1>
        <p className="mt-1 text-gray-600">Manage the education history on the public page.</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input required value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Year
          <input required value={form.the_year} onChange={(event) => setForm((current) => ({ ...current, the_year: event.target.value }))} placeholder="2020 - 2024" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Description
          <textarea required rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={fieldClass} />
        </label>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={isSaving} className="rounded-lg bg-[#0093E9] px-5 py-3 font-semibold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : editingId ? "Save education" : "Add education"}
          </button>
          {editingId ? <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-5 py-3">Cancel</button> : null}
        </div>
      </form>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {isLoading ? <p className="text-sm text-gray-500">Loading education...</p> : null}
      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{row.title}</h2>
                <p className="text-sm text-slate-500">{row.the_year}</p>
                <p className="mt-2 text-sm text-slate-600">{plainText(row.description)}</p>
              </div>
              <div className="shrink-0">
                <button type="button" className="mr-3 text-[#0093E9]" onClick={() => { setEditingId(row.id); setForm({ title: row.title, the_year: row.the_year, description: plainText(row.description) }); }}>Edit</button>
                <button type="button" className="text-red-600" onClick={() => void remove(row.id)}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
