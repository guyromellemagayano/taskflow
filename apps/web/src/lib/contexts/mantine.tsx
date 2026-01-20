/**
 * @file mantine.tsx
 * @author Guy Romelle Magayano
 * @description Mantine UI providers (theme, dates, modals, notifications)
 */

"use client";

import { type ReactNode } from "react";

import { createTheme, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

/** Mantine theme configuration */
const theme = createTheme({
  primaryColor: "blue",
  defaultRadius: "md",
});

/** Dates provider settings */
const datesSettings = { firstDayOfWeek: 0 } as const;

export interface MantineProvidersProps {
  children: ReactNode;
}

export function MantineProviders({ children }: MantineProvidersProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <DatesProvider settings={datesSettings}>
        <ModalsProvider>
          <Notifications />
          {children}
        </ModalsProvider>
      </DatesProvider>
    </MantineProvider>
  );
}
