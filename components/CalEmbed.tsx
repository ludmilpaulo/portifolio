"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    let active = true;
    (async () => {
      const cal = await getCalApi({ namespace: "portfolio" });
      if (!active) return;
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: {
          light: { "cal-brand": "#075985" },
          dark: { "cal-brand": "#075985" },
        },
        layout: "month_view",
      });
    })().catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <Cal
      namespace="portfolio"
      calLink={calLink}
      style={{ width: "100%", height: "100%", overflow: "auto" }}
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
