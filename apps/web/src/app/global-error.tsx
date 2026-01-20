/**
 * @file global-error.tsx
 * @author Guy Romelle Magayano
 * @description Global error component for the application
 */

"use client";

import { memo, useMemo } from "react";

import { Alert, Container, Title } from "@mantine/core";

const TEXTS = {
  title: "Something went wrong",
  defaultMessage: "An unexpected error occurred",
  prefix: "Error:",
} as const;

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset?: () => void;
}

function GlobalErrorComponent({ error }: GlobalErrorProps) {
  const errorMessage = useMemo(() => {
    return error.message ? error.message : TEXTS.defaultMessage;
  }, [error.message]);

  return (
    <html lang="en">
      <body>
        <Container size="md" py="xl">
          <Title order={1} mb="md">
            {TEXTS.title}
          </Title>
          <Alert color="red" title={TEXTS.prefix}>
            {errorMessage}
            {error.digest ? (
              <div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                Error ID: {error.digest}
              </div>
            ) : null}
          </Alert>
        </Container>
      </body>
    </html>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(GlobalErrorComponent);
