"use client";

import { useApiInfo } from "@/lib/api/queries";

export default function Home() {
  const { data: apiData, isLoading, error } = useApiInfo();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50">
            Welcome to TaskFlow
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A modern task management application built with Next.js and FastAPI.
          </p>

          <div className="mt-8 w-full">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
              API Connection Status
            </h2>
            {isLoading && (
              <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-red-600 dark:text-red-400">
                  Error:{" "}
                  {error instanceof Error ? error.message : "Failed to connect"}
                </p>
                <p className="mt-2 text-sm text-red-500 dark:text-red-500">
                  API URL:{" "}
                  {process.env.NEXT_PUBLIC_API_URL ||
                    "http://api.localhost:8000"}
                </p>
              </div>
            )}
            {apiData && (
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="font-semibold text-green-600 dark:text-green-400">
                  ✓ API Connected Successfully
                </p>
                <pre className="mt-2 overflow-auto text-sm text-zinc-700 dark:text-zinc-300">
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-8 w-full">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-zinc-50">
              Available Endpoints
            </h2>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="/api"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  /api - API Information
                </a>
              </li>
              <li>
                <a
                  href="http://api.localhost:8000/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  /health - Health Check
                </a>
              </li>
              <li>
                <a
                  href="http://api.localhost:8000/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  / - API Root
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
