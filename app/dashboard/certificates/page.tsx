"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Certificate, CertificateCategory } from "@/hooks/types";

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  course: "Course",
  professional: "Professional",
  award: "Award",
};

interface CertificateForm {
  title: string;
  issuer: string;
  issued_on: string;
  expires_on: string;
  category: CertificateCategory;
  credential_id: string;
  credential_url: string;
  description: string;
  sort_order: string;
  is_published: boolean;
}

const EMPTY_FORM: CertificateForm = {
  title: "",
  issuer: "",
  issued_on: "",
  expires_on: "",
  category: "professional",
  credential_id: "",
  credential_url: "",
  description: "",
  sort_order: "0",
  is_published: true,
};

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function DashboardCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CertificateForm>(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const loadCertificates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/graphql?type=certificates", { headers: authHeaders() });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not load certificates");
      }
      setCertificates(Array.isArray(result.data) ? result.data : []);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load certificates");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedMessage(null);
    setError(null);
    setIsSaving(true);
    try {
      const body = new FormData();
      body.set("type", "create-certificate");
      body.set("title", form.title.trim());
      body.set("issuer", form.issuer.trim());
      body.set("issued_on", form.issued_on);
      if (form.expires_on) body.set("expires_on", form.expires_on);
      body.set("category", form.category);
      body.set("credential_id", form.credential_id.trim());
      body.set("credential_url", form.credential_url.trim());
      body.set("description", form.description.trim());
      body.set("sort_order", form.sort_order || "0");
      body.set("is_published", form.is_published ? "true" : "false");
      if (image) body.set("image", image);
      if (documentFile) body.set("document", documentFile);

      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: authHeaders(),
        body,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not save the certificate");
      }
      setForm(EMPTY_FORM);
      setImage(null);
      setDocumentFile(null);
      setSavedMessage("Certificate saved. Published items show on the public Certificates page.");
      await loadCertificates();
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the certificate");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="mt-1 text-gray-600">Add a credential here. Published certificates appear on the public page.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Title
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Issuer
          <input
            required
            value={form.issuer}
            onChange={(event) => setForm((current) => ({ ...current, issuer: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Issued on
          <input
            required
            type="date"
            value={form.issued_on}
            onChange={(event) => setForm((current) => ({ ...current, issued_on: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Expires on
          <input
            type="date"
            value={form.expires_on}
            onChange={(event) => setForm((current) => ({ ...current, expires_on: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Category
          <select
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as CertificateCategory }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          >
            <option value="professional">Professional</option>
            <option value="course">Course</option>
            <option value="award">Award</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Sort order
          <input
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Credential ID
          <input
            value={form.credential_id}
            onChange={(event) => setForm((current) => ({ ...current, credential_id: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Credential URL
          <input
            type="url"
            value={form.credential_url}
            onChange={(event) => setForm((current) => ({ ...current, credential_url: event.target.value }))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 md:col-span-2">
          Description
          <textarea
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Image
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Document
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.checked }))}
          />
          Published on the public page
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-[#0093E9] px-5 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Add certificate"}
          </button>
        </div>
      </form>

      {savedMessage ? <p className="text-sm text-emerald-700">{savedMessage}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading certificates...</p>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-semibold text-gray-900">No certificates yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            Use the form above to add the first one.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Issuer</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Issued</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((certificate) => (
                <tr key={certificate.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">{certificate.title}</td>
                  <td className="px-4 py-3 text-slate-600">{certificate.issuer}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {CATEGORY_LABELS[certificate.category] ?? certificate.category}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(certificate.issued_on)}</td>
                  <td className="px-4 py-3 text-slate-600">{certificate.is_published === false ? "Draft" : "Published"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
