/**
 * @file layout.tsx
 * @author Guy Romelle Magayano
 * @description Root layout for the application
 */

import { type ReactNode } from "react";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";

import { Providers } from "@web/lib/contexts/providers";

import "@mantine/core/styles.css";

const HTML_LANG = "en";
const FAVICON_PATH = "/favicon.ico";
const VIEWPORT_CONTENT =
  "minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "TaskFlow",
  description: "A modern task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang={HTML_LANG} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href={FAVICON_PATH} />
        <meta name="viewport" content={VIEWPORT_CONTENT} />
      </head>
      <body>
        {/* TODO: Add ErrorBoundary component here */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
