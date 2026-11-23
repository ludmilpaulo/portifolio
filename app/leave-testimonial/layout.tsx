import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Leave a testimonial",
  description: "Leave a testimonial about working with Ludmil Paulo, a software engineer and full-stack developer in Cape Town.",
  path: "/leave-testimonial",
});

export default function LeaveTestimonialLayout({ children }: { children: React.ReactNode }) {
  return children;
}
