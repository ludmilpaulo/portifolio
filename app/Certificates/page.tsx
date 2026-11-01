"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { FaAward, FaExternalLinkAlt, FaFilePdf, FaTimes } from "react-icons/fa";
import { useGetMyInfoQuery } from "@/store/myInfoApi";
import type { Certificate, CertificateCategory } from "@/hooks/types";

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  course: "Course",
  professional: "Professional",
  award: "Award",
};

const FILTERS: Array<{ id: "all" | CertificateCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "professional", label: "Professional" },
  { id: "course", label: "Courses" },
  { id: "award", label: "Awards" },
];

function formatDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isCategory(value: string): value is CertificateCategory {
  return value === "course" || value === "professional" || value === "award";
}

export default function CertificatesPage() {
  const { data, isLoading, isError } = useGetMyInfoQuery();
  const certificates = data?.certificates ?? [];
  const [filter, setFilter] = useState<"all" | CertificateCategory>("all");
  const [selected, setSelected] = useState<Certificate | null>(null);

  const visible = useMemo(() => {
    if (filter === "all") return certificates;
    return certificates.filter((item) => item.category === filter);
  }, [certificates, filter]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen py-24 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-16 -left-32 w-72 h-72 bg-gradient-to-br from-cyan-300/25 via-blue-200/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-tr from-blue-300/25 via-cyan-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center text-3xl font-bold uppercase tracking-[0.35em] text-blue-700 drop-shadow dark:text-cyan-200"
        >
          Certificates
        </motion.h1>
        <p className="mb-10 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-300 sm:text-base">
          Credentials and completed programs. Open a card to read the details, view the document, or verify the credential.
        </p>

        {isLoading ? (
          <div className="flex min-h-[220px] flex-col items-center">
            <div className="mb-4 h-14 w-14 animate-spin rounded-full border-b-4 border-t-4 border-blue-300" />
            <p className="font-semibold text-blue-700 dark:text-cyan-200">Loading certificates...</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-[220px] flex-col items-center text-center">
            <Image src="/error.svg" alt="" width={90} height={90} className="mb-4 opacity-60" unoptimized />
            <p className="mb-1 text-lg text-red-500">Error loading certificates.</p>
            <p className="text-sm text-gray-400">Please try again later.</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex w-full max-w-xl flex-col items-center rounded-3xl border border-dashed border-blue-200 bg-white/80 px-8 py-14 text-center shadow-sm dark:border-cyan-900 dark:bg-gray-900/70">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0093E9] to-[#80D0C7] text-white shadow-lg">
              <FaAward className="text-2xl" aria-hidden />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-800 dark:text-slate-100">No certificates published yet</h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Certificates appear here after they are added and published in the site admin. The gallery stays empty until then.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Certificate categories">
              {FILTERS.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(item.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-[#0093E9] text-white shadow"
                        : "bg-white/80 text-slate-600 hover:bg-white dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {visible.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No certificates in this category yet.</p>
            ) : (
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((certificate, index) => {
                  const category = isCategory(certificate.category) ? certificate.category : "professional";
                  return (
                    <motion.button
                      key={certificate.id}
                      type="button"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelected(certificate)}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white/90 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0093E9] dark:border-cyan-900 dark:bg-gray-900/80"
                    >
                      <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-[#0093E9]/15 via-white to-[#80D0C7]/30 dark:from-slate-800 dark:via-slate-900 dark:to-cyan-950">
                        {certificate.image ? (
                          <Image
                            src={certificate.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <FaAward className="text-5xl text-[#0093E9]/70 dark:text-cyan-300" aria-hidden />
                          </div>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0093E9] shadow-sm dark:bg-slate-900/90 dark:text-cyan-300">
                          {CATEGORY_LABELS[category]}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{certificate.title}</h2>
                        <p className="mt-1 text-sm text-slate-600 dark:text-cyan-100">{certificate.issuer}</p>
                        <p className="mt-3 text-xs font-medium tracking-wide text-blue-600 dark:text-cyan-400">
                          {formatDate(certificate.issued_on)}
                        </p>
                        {certificate.credential_id ? (
                          <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
                            ID {certificate.credential_id}
                          </p>
                        ) : null}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={selected !== null} onClose={() => setSelected(null)} className="relative z-[80]">
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" aria-hidden />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
            {selected ? (
              <div>
                <div className="relative aspect-[16/9] bg-slate-100 dark:bg-slate-800">
                  {selected.image ? (
                    <Image src={selected.image} alt="" fill className="object-contain" sizes="640px" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FaAward className="text-6xl text-[#0093E9]" aria-hidden />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-700 shadow"
                    aria-label="Close certificate"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0093E9]">
                    {CATEGORY_LABELS[isCategory(selected.category) ? selected.category : "professional"]}
                  </p>
                  <DialogTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {selected.title}
                  </DialogTitle>
                  <p className="text-slate-600 dark:text-slate-300">{selected.issuer}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Issued {formatDate(selected.issued_on)}
                    {selected.expires_on ? ` · Expires ${formatDate(selected.expires_on)}` : ""}
                  </p>
                  {selected.credential_id ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">Credential ID {selected.credential_id}</p>
                  ) : null}
                  {selected.description ? (
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {selected.description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {selected.document ? (
                      <a
                        href={selected.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white dark:bg-cyan-500 dark:text-slate-950"
                      >
                        <FaFilePdf aria-hidden />
                        View document
                      </a>
                    ) : null}
                    {selected.credential_url ? (
                      <a
                        href={selected.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[#0093E9] px-4 py-2 text-sm font-medium text-[#0093E9]"
                      >
                        <FaExternalLinkAlt aria-hidden />
                        Verify credential
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </DialogPanel>
        </div>
      </Dialog>
    </motion.section>
  );
}
