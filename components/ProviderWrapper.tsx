"use client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ToastProvider } from "@/contexts/ToastContext";

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </Provider>
  );
}
