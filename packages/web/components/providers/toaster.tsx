"use client";

import { useToast, type ToastData } from "@/lib/hooks/use-toast";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { variant = "default", title, description, action } = toast;

  const variantStyles = {
    default: "border-border bg-background text-foreground",
    success: "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400",
    error: "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400",
    warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    info: "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  const Icon = {
    default: null,
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }[variant];

  return (
    <div
      className={`pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-full ${variantStyles[variant]}`}
      role="alert"
    >
      {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0" />}
      <div className="flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 inline-flex h-8 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary"
          >
            {action.label}
          </button>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
