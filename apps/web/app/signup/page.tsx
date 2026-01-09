"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Paper, Title, Text, Container, Alert, PasswordInput } from "@mantine/core";
import { useAuth } from "@/lib/auth/context";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      // Navigation handled by AuthProvider
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="md">
        Create account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5} mb={30}>
        Sign up to get started
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

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb="md"
            description="At least 8 characters with uppercase, lowercase, number, and special character"
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            mb="md"
          />

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign up
          </Button>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          Already have an account?{" "}
          <Text
            component="a"
            href="/login"
            c="blue"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();
              router.push("/login");
            }}
          >
            Sign in
          </Text>
        </Text>
      </Paper>
    </Container>
  );
}
