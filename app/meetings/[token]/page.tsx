import type { Metadata } from "next";
import ManageMeeting from "@/components/ManageMeeting";

export const metadata: Metadata = {
  title: "Your meeting",
  robots: { index: false, follow: false },
};

export default async function MeetingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="min-h-screen bg-white px-4 py-28 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <ManageMeeting token={token} />
      </div>
    </main>
  );
}
