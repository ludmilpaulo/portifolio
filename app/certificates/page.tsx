import type { Metadata } from "next";
import CertificatesView from "./CertificatesView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Certificates",
  description: "Certificates and credentials of Ludmil Paulo, a software engineer and full-stack developer.",
  path: "/certificates",
});

export default function CertificatesPage() {
  return <CertificatesView />;
}
