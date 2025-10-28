"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes, FaExclamationTriangle } from "react-icons/fa";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle,
    warning: FaExclamationTriangle,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const Icon = icons[toast.type];
  const color = colors[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 300 }}
      exit={{ opacity: 0, x: 300 }}
      className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[300px] max-w-md"
    >
      <div className="flex items-start">
        <div className={`${color} p-2 rounded-lg mr-3`}>
          <Icon className="text-white text-lg" />
        </div>
        <div className="flex-1">
          <p className="text-gray-800 font-medium">{toast.message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300);
          }}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <FaTimes />
        </button>
      </div>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;

