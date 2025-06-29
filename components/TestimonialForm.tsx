"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaUser,
} from "react-icons/fa";
import { baseUrl } from "@/hooks/fetchData";

const API_URL =`${baseUrl}/testimonials/`;

export default function TestimonialForm() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    text: "",
    role: "",
    avatar: null as File | null,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm((f) => ({ ...f, avatar: file }));
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const data = new FormData();
    data.append("name", form.name);
    data.append("text", form.text);
    data.append("role", form.role);
    if (form.avatar) data.append("avatar", form.avatar);

    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        body: data,
      });
      if (resp.ok) {
        setSuccessMsg("🎉 Thank you! Your testimonial has been received.");
        setForm({ name: "", text: "", role: "", avatar: null });
        setAvatarPreview(null);
        formRef.current?.reset();
      } else {
        setErrorMsg("Could not send testimonial. Please try again.");
      }
    } catch (err) {
      setErrorMsg("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="max-w-xl mx-auto mt-20 mb-16 px-6 py-10
      bg-white/80 dark:bg-gray-900/85 shadow-2xl border-2 border-blue-100 dark:border-cyan-900
      rounded-3xl backdrop-blur-xl relative overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Decorative Gradient Orbs */}
      <span className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-300 via-cyan-300 to-transparent rounded-full blur-2xl opacity-40" />
      <span className="absolute -bottom-10 -right-12 w-40 h-40 bg-gradient-to-tr from-blue-400 via-cyan-200 to-transparent rounded-full blur-2xl opacity-40" />

      <h2 className="text-3xl font-extrabold text-center text-blue-700 dark:text-cyan-200 mb-2 tracking-wide drop-shadow">
        Leave a Testimonial
      </h2>
      <p className="mb-8 text-center text-gray-500 dark:text-cyan-200 font-medium">
        I appreciate your feedback and support!
      </p>

      {/* Success/Error messages */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4 shadow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <FaCheckCircle className="text-green-500" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 shadow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <FaExclamationCircle className="text-red-500" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-7"
        autoComplete="off"
      >
        <div className="flex flex-col gap-1">
          <label
            htmlFor="testimonial-name"
            className="font-semibold text-blue-700 dark:text-cyan-200"
          >
            Your Name*
          </label>
          <input
            name="name"
            id="testimonial-name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="off"
            className="p-3 rounded-xl border border-blue-100 dark:bg-gray-800 text-gray-800 dark:text-cyan-100 focus:border-blue-400 focus:ring-2 focus:ring-cyan-200 outline-none transition shadow"
            placeholder="e.g. Zanele M."
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="testimonial-role"
            className="font-semibold text-blue-700 dark:text-cyan-200"
          >
            Your Role / Company
          </label>
          <input
            name="role"
            id="testimonial-role"
            value={form.role}
            onChange={handleChange}
            autoComplete="off"
            className="p-3 rounded-xl border border-blue-100 dark:bg-gray-800 text-gray-800 dark:text-cyan-100 focus:border-blue-400 focus:ring-2 focus:ring-cyan-200 outline-none transition shadow"
            placeholder="e.g. CEO, Zani Digital"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="testimonial-text"
            className="font-semibold text-blue-700 dark:text-cyan-200"
          >
            Your Testimonial*
          </label>
          <textarea
            name="text"
            id="testimonial-text"
            value={form.text}
            onChange={handleChange}
            required
            rows={4}
            maxLength={500}
            className="p-3 rounded-xl border border-blue-100 dark:bg-gray-800 text-gray-800 dark:text-cyan-100 focus:border-blue-400 focus:ring-2 focus:ring-cyan-200 outline-none transition shadow"
            placeholder="How was your experience? (max 500 chars)"
          />
        </div>
        <div>
          <label className="font-semibold text-blue-700 dark:text-cyan-200 block mb-2">
            Your Photo (optional)
          </label>
          <div className="flex items-center gap-5">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-gray-600 dark:text-cyan-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: avatarPreview ? 1 : 0.9,
                opacity: avatarPreview ? 1 : 0,
              }}
              className="rounded-full border-2 border-blue-200 shadow min-w-[64px] min-h-[64px] flex items-center justify-center bg-white"
              style={{ width: 64, height: 64 }}
            >
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                  unoptimized // For blob preview, since it's not a remote/public asset
                />
              ) : (
                <FaUser className="w-10 h-10 text-gray-300 dark:text-cyan-800" />
              )}
            </motion.div>
          </div>
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          className="mt-2 flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-500 hover:scale-105 transition-all text-lg focus:ring-2 focus:ring-cyan-400 active:scale-95"
          whileHover={{ scale: 1.05, boxShadow: "0 8px 32px #0ea5e93b" }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? (
            <>
              <span className="animate-spin inline-block w-5 h-5 border-t-2 border-b-2 border-white rounded-full" />{" "}
              Sending...
            </>
          ) : (
            <>
              <FaPaperPlane /> Submit Testimonial
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
