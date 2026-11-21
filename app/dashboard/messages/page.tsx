"use client";

import { useCallback, useEffect, useState } from "react";
import { adminRequest, asList } from "@/lib/adminApi";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  send_time: string;
  is_read: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setMessages(asList<ContactMessage>(await adminRequest<unknown>("messages/")));
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Could not load messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = async (message: ContactMessage) => {
    try {
      await adminRequest(`messages/${message.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: !message.is_read }),
      });
      await load();
    } catch (updateError: unknown) {
      setError(updateError instanceof Error ? updateError.message : "Could not update the message");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await adminRequest(`messages/${id}/`, { method: "DELETE" });
      await load();
    } catch (deleteError: unknown) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete the message");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-gray-600">Contact form messages sent from the site.</p>
      </div>
      {isLoading ? <p className="text-sm text-gray-500">Loading messages...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {!isLoading && messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-semibold text-gray-900">No messages yet</h2>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <article key={message.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900">{message.name}</h2>
                  <p className="text-sm text-slate-500">{message.email}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{message.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{message.is_read ? "Read" : "Unread"} · {new Date(message.send_time).toLocaleString()}</p>
                </div>
                <div className="shrink-0">
                  <button type="button" className="mr-3 text-[#0093E9]" onClick={() => void markRead(message)}>
                    {message.is_read ? "Mark unread" : "Mark read"}
                  </button>
                  <button type="button" className="text-red-600" onClick={() => void remove(message.id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
