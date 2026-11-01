"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const PLACEHOLDER_AVATARS = new Set(["/testimonials/default.jpg"]);

export function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter((part) => part.length > 0);
  if (parts.length === 0) return "?";
  const word = parts[0];
  const first = word.charAt(0);
  const last =
    parts.length === 1 ? word.charAt(word.length - 1) : parts[parts.length - 1].charAt(0);
  if (parts.length === 1 && word.length < 2) return first.toUpperCase();
  return `${first}${last}`.toUpperCase();
}

export function hasTestimonialPhoto(src?: string | null): src is string {
  if (!src) return false;
  const value = src.trim();
  return value.length > 0 && !PLACEHOLDER_AVATARS.has(value);
}

export function TestimonialAvatar({
  name,
  src,
  size,
  imageClassName,
  fallbackClassName,
}: {
  name: string;
  src?: string | null;
  size: number;
  imageClassName: string;
  fallbackClassName: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!hasTestimonialPhoto(src) || failed) {
    return (
      <div className={fallbackClassName} aria-hidden="true">
        {nameInitials(name)}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={imageClassName}
      onError={() => setFailed(true)}
    />
  );
}
