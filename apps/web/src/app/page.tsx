/**
 * @file page.tsx
 * @author Guy Romelle Magayano
 * @description Home page with API connection status
 */

"use client";

import { useMemo } from "react";

import { useApiInfo } from "@web/lib/api/queries";

const TEXTS = {
  title: "Welcome to TaskFlow",
  description:
    "A modern task management application built with Next.js and FastAPI.",
  apiStatusTitle: "API Connection Status",
  loading: "Loading...",
  errorPrefix: "Error:",
  failedToConnect: "Failed to connect",
  apiUrlPrefix: "API URL:",
  apiConnected: "✓ API Connected Successfully",
  endpointsTitle: "Available Endpoints",
  apiInfo: "/api - API Information",
  healthCheck: "/health - Health Check",
  apiRoot: "/ - API Root",
} as const;

const ENDPOINTS = {
  api: "/api",
  health: "http://api.localhost:8000/health",
  root: "http://api.localhost:8000/",
} as const;

const DEFAULT_API_URL = "http://api.localhost:8000";
const API_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
    : DEFAULT_API_URL;

export default function Home() {
  const { data: apiData, isLoading, error } = useApiInfo();

  // Memoize error message to avoid recreation
  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }
    return error instanceof Error ? error.message : TEXTS.failedToConnect;
  }, [error]);

  // Memoize formatted API data to avoid JSON.stringify on every render
  const formattedApiData = useMemo(() => {
    if (!apiData) {
      return null;
    }
    return JSON.stringify(apiData, null, 2);
  }, [apiData]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
            {TEXTS.title}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {TEXTS.description}
          </p>

          <div className="mt-8 w-full">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
              {TEXTS.apiStatusTitle}
            </h2>
            {isLoading ? (
              <p className="text-zinc-600 dark:text-zinc-400">
                {TEXTS.loading}
              </p>
            ) : null}
            {error ? (
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-red-600 dark:text-red-400">
                  {TEXTS.errorPrefix} {errorMessage}
                </p>
                <p className="mt-2 text-sm text-red-500 dark:text-red-500">
                  {TEXTS.apiUrlPrefix} {API_URL}
                </p>
              </div>
            ) : null}
            {apiData ? (
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {TEXTS.apiConnected}
                </p>
                <pre className="mt-2 overflow-auto text-sm text-zinc-700 dark:text-zinc-300">
                  {formattedApiData}
                </pre>
              </div>
            ) : null}
          </div>

          <div className="mt-8 w-full">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
              {TEXTS.endpointsTitle}
            </h2>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href={ENDPOINTS.api}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {TEXTS.apiInfo}
                </a>
              </li>
              <li>
                <a
                  href={ENDPOINTS.health}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {TEXTS.healthCheck}
                </a>
              </li>
              <li>
                <a
                  href={ENDPOINTS.root}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {TEXTS.apiRoot}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
