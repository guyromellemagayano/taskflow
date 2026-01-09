"use client";

import { useAuth } from "@/lib/auth/context";
import {
  Alert,
  Button,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // Navigation handled by AuthProvider
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to login. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="md">
        Welcome back
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
        Sign in to your account
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert color="red" mb="md">
              {error}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb="md"
          />

          <TextInput
            label="Password"
            placeholder="Your password"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb="md"
          />

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          Don&apos;t have an account?{" "}
          <Text
            component="a"
            href="/signup"
            c="blue"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();
              router.push("/signup");
            }}
          >
            Sign up
          </Text>
        </Text>
      </Paper>
    </Container>
  );
}
