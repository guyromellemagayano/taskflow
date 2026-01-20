/**
 * @file providers.tsx
 * @author Guy Romelle Magayano
 * @description Root providers component that composes all application providers
 */

"use client";

import { type ReactNode } from "react";

import { AuthProvider } from "../auth/context";
import { ApiProviders } from "./api";
import { MantineProviders } from "./mantine";

export interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MantineProviders>
      <ApiProviders>
        <AuthProvider>{children}</AuthProvider>
      </ApiProviders>
    </MantineProviders>
  );
}
