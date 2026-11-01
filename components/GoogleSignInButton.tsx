"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type: "standard";
          theme: "outline";
          size: "large";
          text: "continue_with";
          shape: "pill";
          width: number;
        }
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const SCRIPT_ID = "google-identity-services";

function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google script failed")));
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google script failed"));
    document.head.appendChild(script);
  });
}

export function GoogleSignInButton({
  role,
  onError,
}: {
  role: "admin" | "client";
  onError: (message: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onErrorRef = useRef(onError);
  const { loginWithGoogle } = useAuth();
  const loginRef = useRef(loginWithGoogle);
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  useEffect(() => {
    onErrorRef.current = onError;
    loginRef.current = loginWithGoogle;
  }, [onError, loginWithGoogle]);

  useEffect(() => {
    if (!clientId || !hostRef.current) return;
    let cancelled = false;
    const host = hostRef.current;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            const credential = response.credential;
            if (!credential) {
              onErrorRef.current("Google did not return a sign-in credential.");
              return;
            }
            void loginRef.current(credential, role).then((result) => {
              if (!result.success) {
                onErrorRef.current(result.error || "Google sign-in failed");
                return;
              }
              router.push(role === "admin" ? "/dashboard" : "/dashboard/client");
            });
          },
        });
        host.replaceChildren();
        window.google.accounts.id.renderButton(host, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          width: 320,
        });
      })
      .catch(() => {
        if (!cancelled) onErrorRef.current("Google sign-in could not be loaded.");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, role, router]);

  if (!clientId) return null;

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/20" />
        <span className="text-xs uppercase tracking-widest text-white/70">or</span>
        <div className="h-px flex-1 bg-white/20" />
      </div>
      <div ref={hostRef} className="flex min-h-11 justify-center" />
    </div>
  );
}
