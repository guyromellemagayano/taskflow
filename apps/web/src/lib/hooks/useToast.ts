/** Toast notification hook using Mantine notifications */

import { useCallback } from "react";

import { notifications } from "@mantine/notifications";

interface UseToastReturn {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const DEFAULT_TITLES = {
  success: "Success",
  error: "Error",
  info: "Info",
} as const;

const TOAST_COLORS = {
  success: "green",
  error: "red",
  info: "blue",
} as const;

// Toast notification hook using Mantine notifications
export function useToast(): UseToastReturn {
  // Show success toast
  const showSuccess = useCallback((message: string, title?: string) => {
    notifications.show({
      title: title || DEFAULT_TITLES.success,
      message,
      color: TOAST_COLORS.success,
    });
  }, []);

  // Show error toast
  const showError = useCallback((message: string, title?: string) => {
    notifications.show({
      title: title || DEFAULT_TITLES.error,
      message,
      color: TOAST_COLORS.error,
    });
  }, []);

  // Show info toast
  const showInfo = useCallback((message: string, title?: string) => {
    notifications.show({
      title: title || DEFAULT_TITLES.info,
      message,
      color: TOAST_COLORS.info,
    });
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
  };
}
