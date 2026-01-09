"use client";

import { Component, ReactNode } from "react";
import { Button, Container, Title, Text } from "@mantine/core";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="md" py="xl">
          <Title order={1} mb="md">
            Something went wrong
          </Title>
          <Text c="dimmed" mb="lg">
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
          >
            Go to Home
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}
