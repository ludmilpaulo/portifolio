"use client";

import { useEffect, useMemo, useState } from "react";
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaShareAlt, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  SHARE_COPY,
  ShareLanguage,
  buildProjectShareText,
  projectShareUrl,
  projectSlug,
  shareTargets,
} from "@/lib/projectShare";

const ICONS = {
  WhatsApp: FaWhatsapp,
  Facebook: FaFacebook,
  LinkedIn: FaLinkedin,
  X: FaXTwitter,
  Telegram: FaTelegram,
  Email: FaEnvelope,
} as const;

interface ProjectShareProps {
  title: string;
  description: string;
  problem?: string;
  slug?: string;
  status?: number | string;
  demo?: string;
  compact?: boolean;
}

export default function ProjectShare({ title, description, problem, slug, status, demo, compact = false }: ProjectShareProps) {
  const [open, setOpen] = useState(!compact);
  const [language, setLanguage] = useState<ShareLanguage>("en");
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState<"message" | "link" | null>(null);
  const resolvedSlug = projectSlug(title, slug);
  const pageUrl = projectShareUrl(resolvedSlug);

  useEffect(() => {
    const saved = window.localStorage.getItem("app_language");
    if (saved === "en" || saved === "pt") setLanguage(saved);
  }, []);

  useEffect(() => {
    setDraft(buildProjectShareText({ title, description, problem, slug: resolvedSlug, status, demo, language }));
    setCopied(null);
  }, [title, description, problem, resolvedSlug, status, demo, language]);

  const targets = useMemo(() => shareTargets(draft, pageUrl), [draft, pageUrl]);

  const copyText = async (value: string, kind: "message" | "link") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
    } catch {
      setCopied(null);
    }
  };

  const shareMore = async () => {
    if (!navigator.share) {
      await copyText(draft, "message");
      return;
    }
    try {
      await navigator.share({ title, text: draft, url: pageUrl });
    } catch {
      /* The visitor closed the share sheet. */
    }
  };

  const shareInstagram = async () => {
    await copyText(draft, "message");
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <div onClick={(event) => event.stopPropagation()}>
      {compact ? (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0093E9]"
        >
          <FaShareAlt aria-hidden />
          {open ? "Hide share" : "Share"}
        </button>
      ) : (
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Share this project</h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose a language, adjust the message, then send it. Anyone who opens the page can share it too.
          </p>
        </div>
      )}
      {open ? (
        <div className={`${compact ? "mt-3" : ""} rounded-2xl border border-slate-200 bg-white p-4 shadow-sm`}>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SHARE_COPY) as ShareLanguage[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  language === code ? "bg-[#0093E9] text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {SHARE_COPY[code].name}
              </button>
            ))}
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={compact ? 6 : 8}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800"
            aria-label="Share message"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {targets.map((target) => {
              const Icon = ICONS[target.label as keyof typeof ICONS];
              return (
                <a
                  key={target.label}
                  href={target.href}
                  target={target.label === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-[#0093E9] hover:text-[#0093E9]"
                >
                  <Icon aria-hidden />
                  {target.label}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => void shareInstagram()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-[#0093E9] hover:text-[#0093E9]"
            >
              <FaInstagram aria-hidden />
              Instagram
            </button>
            <button
              type="button"
              onClick={() => void shareMore()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-[#0093E9] hover:text-[#0093E9]"
            >
              <FaShareAlt aria-hidden />
              More
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <button type="button" className="font-semibold text-[#0093E9]" onClick={() => void copyText(draft, "message")}>
              {copied === "message" ? "Message copied" : "Copy message"}
            </button>
            <button type="button" className="font-semibold text-slate-600" onClick={() => void copyText(pageUrl, "link")}>
              {copied === "link" ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
