"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<{
    loading: boolean;
    data: any;
    error: string | null;
  }>({ loading: true, data: null, error: null });

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";
    
    fetch(`${apiUrl}/api`)
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({ loading: false, data, error: null });
      })
      .catch((err) => {
        setApiStatus({
          loading: false,
          data: null,
          error: err.message,
        });
      });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to TaskFlow
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A modern task management application built with Next.js and FastAPI.
          </p>
          
          <div className="mt-8 w-full">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
              API Connection Status
            </h2>
            {apiStatus.loading && (
              <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
            )}
            {apiStatus.error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-600 dark:text-red-400">
                  Error: {apiStatus.error}
                </p>
                <p className="text-sm text-red-500 dark:text-red-500 mt-2">
                  API URL: {process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000"}
                </p>
              </div>
            )}
            {apiStatus.data && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  ✓ API Connected Successfully
                </p>
                <pre className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 overflow-auto">
                  {JSON.stringify(apiStatus.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-8 w-full">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
              Available Endpoints
            </h2>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href="/api"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  /api - API Information
                </a>
              </li>
              <li>
                <a
                  href="http://api.localhost:8000/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  /health - Health Check
                </a>
              </li>
              <li>
                <a
                  href="http://api.localhost:8000/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
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
