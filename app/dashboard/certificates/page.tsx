"use client";

import { useGetMyInfoQuery } from "@/store/myInfoApi";
import { baseUrl } from "@/hooks/fetchData";
import type { CertificateCategory } from "@/hooks/types";

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  course: "Course",
  professional: "Professional",
  award: "Award",
};

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function DashboardCertificatesPage() {
  const { data, isLoading, isError } = useGetMyInfoQuery();
  const certificates = data?.certificates ?? [];
  const adminUrl = `${baseUrl}admin/information/certificate/add/`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
          <p className="mt-1 text-gray-600">Published credentials from the public portfolio.</p>
        </div>
        <a
          href={adminUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-[#0093E9] px-5 py-3 font-semibold text-white hover:bg-blue-600"
        >
          Add in admin
        </a>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading certificates...</p>
      ) : isError ? (
        <p className="text-sm text-red-600">Could not load certificates.</p>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-semibold text-gray-900">No certificates published yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            Upload a certificate in Django admin and mark it published. It will appear here and on the public Certificates page.
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
