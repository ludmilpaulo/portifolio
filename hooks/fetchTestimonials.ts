import { baseUrl } from "./fetchData";

// hooks/fetchTestimonials.ts
export interface Testimonial {
  id: number;
  name: string;
  avatar: string; // URL
  text: string;
  role: string;
  created_at: string;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${baseUrl}` + "testimonials/", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  return await res.json();
}
