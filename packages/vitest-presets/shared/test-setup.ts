/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import "@testing-library/jest-dom";
import React from "react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

// Cast globalThis to access global property for test mocks
const globalObj = globalThis as typeof globalThis & { global: typeof globalThis };

// Mock `window.matchMedia`
Object.defineProperty(globalThis.window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock `ResizeObserver`
const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(globalThis.window, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: mockResizeObserver,
});

Object.defineProperty(globalObj.global, "ResizeObserver", {
  writable: true,
  configurable: true,
  value: mockResizeObserver,
});

// Mock `requestAnimationFrame`
globalObj.global.requestAnimationFrame = vi.fn(
  (callback: (time: number) => void) => {
    callback(0);
    return 1;
  }
);

// Mock `cancelAnimationFrame`
globalObj.global.cancelAnimationFrame = vi.fn();

// Mock `getComputedStyle`
Object.defineProperty(globalThis.window, "getComputedStyle", {
  value: vi.fn(() => ({
    getPropertyValue: vi.fn(),
  })),
});

// Mock console methods to reduce noise in tests
const originalConsole = { ...console };
beforeAll(() => {
  globalObj.global.console.warn = vi.fn();
  globalObj.global.console.error = vi.fn();
});

afterAll(() => {
  globalObj.global.console.warn = originalConsole.warn;
  globalObj.global.console.error = originalConsole.error;
});

// Reset modules and mocks between tests
afterEach(() => {
  vi.resetModules(); // Clear module cache
  vi.clearAllMocks(); // Clear mock call history
  vi.resetAllMocks(); // Reset mocks to original implementations
});

// Global mock for `next/navigation`
const mockBack = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => (globalThis as any).__TEST_PATHNAME__ ?? "/",
  useRouter: () => ({
    back: mockBack,
    push: vi.fn(),
    replace: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Export for tests to use
(globalThis as any).__MOCK_ROUTER_BACK__ = mockBack;

// Global mock for `next/image`
vi.mock("next/image", () => ({
  default: (props: any) =>
    React.createElement("div", {
      "data-testid": "mock-image",
      width: 64,
      height: 64,
      ...props,
    }),
}));

// Global mock for `next/link`
vi.mock("next/link", () => {
  const MockLink = React.forwardRef<HTMLAnchorElement, any>((props, ref) => {
    const { href, children, ...rest } = props;
    return React.createElement(
      "a",
      {
        ref,
        href,
        "data-testid": "mock-link",
        ...rest,
      },
      children
    );
  });
  MockLink.displayName = "MockNextLink";
  return { default: MockLink };
});

// Global mock for `@apollo/client`
vi.mock("@apollo/client", () => {
  const mockUseQuery = vi.fn(() => ({
    data: undefined,
    loading: false,
    error: undefined,
    refetch: vi.fn(),
  }));
  const mockUseMutation = vi.fn(() => [
    vi.fn(),
    {
      data: undefined,
      loading: false,
      error: undefined,
    },
  ]);
  const mockApolloClient = {
    query: vi.fn(),
    mutate: vi.fn(),
    readQuery: vi.fn(),
    writeQuery: vi.fn(),
    resetStore: vi.fn(),
  };
  return {
    ApolloProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, {}, children),
    useQuery: mockUseQuery,
    useMutation: mockUseMutation,
    useLazyQuery: vi.fn(),
    gql: vi.fn((strings: TemplateStringsArray) => strings.join("")),
    ApolloClient: vi.fn(() => mockApolloClient),
    InMemoryCache: vi.fn(),
    createHttpLink: vi.fn(),
    from: vi.fn(() => mockApolloClient),
  };
});

// Global mock for `@tanstack/react-query`
vi.mock("@tanstack/react-query", () => {
  const mockUseQuery = vi.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
    error: undefined,
    refetch: vi.fn(),
  }));
  const mockUseMutation = vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    error: undefined,
  }));
  return {
    QueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
      clear: vi.fn(),
    })),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, {}, children),
    useQuery: mockUseQuery,
    useMutation: mockUseMutation,
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
    })),
  };
});

// Global mock for `@mantine/core`
vi.mock("@mantine/core", () => {
  const createMockComponent = (tag: string, displayName: string) => {
    const Component = React.forwardRef<any, any>((props, ref) => {
      const { children, ...rest } = props;
      return React.createElement(
        tag,
        {
          ref,
          "data-testid": `mantine-${displayName.toLowerCase()}`,
          ...rest,
        },
        children
      );
    });
    Component.displayName = displayName;
    return Component;
  };
  return {
    MantineProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, {}, children),
    createTheme: vi.fn(() => ({})),
    Button: createMockComponent("button", "Button"),
    Container: createMockComponent("div", "Container"),
    Stack: createMockComponent("div", "Stack"),
    Group: createMockComponent("div", "Group"),
    Paper: createMockComponent("div", "Paper"),
    Text: createMockComponent("p", "Text"),
    Title: createMockComponent("h1", "Title"),
    Badge: createMockComponent("span", "Badge"),
    Alert: createMockComponent("div", "Alert"),
    Loader: createMockComponent("div", "Loader"),
    Menu: createMockComponent("div", "Menu"),
    ActionIcon: createMockComponent("button", "ActionIcon"),
  };
});

// Global mock for `@mantine/dates`
vi.mock("@mantine/dates", () => {
  const DateInput = React.forwardRef<any, any>((props, ref) => {
    const { children, ...rest } = props;
    return React.createElement("input", {
      ref,
      type: "date",
      "data-testid": "mantine-dateinput",
      ...rest,
    });
  });
  DateInput.displayName = "DateInput";
  return {
    DatesProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, {}, children),
    DateInput,
  };
});

// Global mock for `@mantine/form`
vi.mock("@mantine/form", () => ({
  useForm: vi.fn(() => ({
    values: {},
    errors: {},
    setFieldValue: vi.fn(),
    setFieldError: vi.fn(),
    onSubmit: vi.fn((handler) => (e: any) => {
      e?.preventDefault?.();
      return handler({});
    }),
    reset: vi.fn(),
    validate: vi.fn(),
    isValid: true,
  })),
}));

// Global mock for `@mantine/hooks`
vi.mock("@mantine/hooks", () => ({
  useDisclosure: vi.fn(() => [
    false,
    { open: vi.fn(), close: vi.fn(), toggle: vi.fn() },
  ]),
  useMediaQuery: vi.fn(() => false),
  useClickOutside: vi.fn(),
  useDebouncedValue: vi.fn((value) => [value, value]),
}));

// Global mock for `@mantine/notifications`
vi.mock("@mantine/notifications", () => ({
  notifications: {
    show: vi.fn(),
    hide: vi.fn(),
    clean: vi.fn(),
    update: vi.fn(),
  },
  Notifications: ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, {}, children),
}));

// Global mock for `@taskflow/shared`
vi.mock("@taskflow/shared", () => ({
  // Add shared utilities as needed
  // For now, export empty object - add specific mocks as needed
}));
