"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { adminRequest, asList, fieldClass } from "@/lib/adminApi";
import type { Resume } from "@/hooks/types";

const EMPTY = { title: "", sort_order: "0", is_published: true };

export default function CvsPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setResumes(asList<Resume>(await adminRequest<unknown>("resumes/")));
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load CVs");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reset = () => {
    setForm(EMPTY);
    setFile(null);
    setEditingId(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId && !file) {
      setError("Choose a PDF for a new CV.");
      return;
    }
    setIsSaving(true);
    setError(null);
    setMessage(null);
    try {
      const body = new FormData();
      body.set("title", form.title.trim());
      body.set("sort_order", form.sort_order || "0");
      body.set("is_published", form.is_published ? "true" : "false");
      if (file) body.set("file", file);
      if (editingId) {
        await adminRequest(`resumes/${editingId}/`, { method: "PATCH", body });
      } else {
        await adminRequest("resumes/", { method: "POST", body });
      }
      reset();
      setMessage("CV saved. Published CVs appear on the About page.");
      await load();
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the CV");
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this CV?")) return;
    setError(null);
    try {
      await adminRequest(`resumes/${id}/`, { method: "DELETE" });
      if (editingId === id) reset();
      await load();
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete the CV");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">CVs</h1>
        <p className="mt-1 text-gray-600">
          Upload a separate CV for each role, such as software engineer, technical operations, front end, or full stack.
        </p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Role title
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Software Engineer"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Sort order
          <input
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          PDF
          <input
            type="file"
            accept=".pdf,application/pdf"
            required={!editingId}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </label>
        <label className="flex items-center gap-2 self-end text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.checked }))}
          />
          Published on the About page
        </label>
        <div className="flex items-center gap-3 md:col-span-2">
          <button type="submit" disabled={isSaving} className="rounded-lg bg-[#0093E9] px-5 py-3 font-semibold text-white disabled:opacity-60">
            {isSaving ? "Saving..." : editingId ? "Save CV" : "Add CV"}
          </button>
          {editingId ? (
            <button type="button" onClick={reset} className="rounded-lg border border-slate-200 px-5 py-3">
              Cancel
            </button>
          ) : null}
        </div>
      </form>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {isLoading ? <p className="text-sm text-gray-500">Loading CVs...</p> : null}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">File</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{resume.title}</td>
                <td className="px-4 py-3">{resume.is_published ? "Published" : "Hidden"}</td>
                <td className="px-4 py-3">
                  {resume.file ? (
                    <a href={resume.file} target="_blank" rel="noreferrer" className="text-[#0093E9]">
                      Open PDF
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="mr-3 text-[#0093E9]"
                    onClick={() => {
                      setEditingId(resume.id);
                      setForm({
                        title: resume.title,
                        sort_order: String(resume.sort_order ?? 0),
                        is_published: resume.is_published,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="text-red-600" onClick={() => void remove(resume.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && resumes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-slate-500">
                  No CVs yet. Add the first role-specific CV above.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
