/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import React from "react";

import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import "@testing-library/jest-dom";

const globalObj = globalThis as typeof globalThis & {
  global: typeof globalThis;
};

Object.defineProperty(globalThis.window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

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

globalObj.global.requestAnimationFrame = vi.fn(
  (callback: (time: number) => void) => {
    callback(0);
    return 1;
  }
);
globalObj.global.cancelAnimationFrame = vi.fn();

Object.defineProperty(globalThis.window, "getComputedStyle", {
  value: vi.fn(() => ({
    getPropertyValue: vi.fn(),
  })),
});

const originalConsole = { ...globalObj.global.console };
beforeAll(() => {
  globalObj.global.console.warn = vi.fn();
  globalObj.global.console.error = vi.fn();
});

afterAll(() => {
  globalObj.global.console.warn = originalConsole.warn;
  globalObj.global.console.error = originalConsole.error;
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  (globalThis as any).__TEST_PATHNAME__ = "/";
  (globalThis as any).__TEST_SEARCH_PARAMS__ = "";
  cachedSearchParamsValue = "";
  cachedSearchParams = null;
});

const mockBack = vi.fn();
const mockForward = vi.fn();
const mockRefresh = vi.fn();
const mockPrefetch = vi.fn();
let cachedSearchParamsValue: string | URLSearchParams = "";
let cachedSearchParams: URLSearchParams | null = null;

function applyMockNavigation(href: unknown) {
  if (typeof href !== "string") {
    return;
  }

  const url = new URL(href, "http://localhost");
  (globalThis as any).__TEST_PATHNAME__ = url.pathname;
  (globalThis as any).__TEST_SEARCH_PARAMS__ = url.search.replace(/^\?/, "");
}

const mockPush = vi.fn((href: unknown) => {
  applyMockNavigation(href);
});
const mockReplace = vi.fn((href: unknown) => {
  applyMockNavigation(href);
});

vi.mock("next/navigation", () => ({
  usePathname: () => (globalThis as any).__TEST_PATHNAME__ ?? "/",
  useSearchParams: () => {
    const value = (globalThis as any).__TEST_SEARCH_PARAMS__ ?? "";
    if (value instanceof URLSearchParams) {
      if (cachedSearchParamsValue !== value) {
        cachedSearchParamsValue = value;
        cachedSearchParams = value;
      }
      return cachedSearchParams;
    }

    if (cachedSearchParams === null || cachedSearchParamsValue !== value) {
      cachedSearchParamsValue = value;
      cachedSearchParams = new URLSearchParams(value);
    }

    return cachedSearchParams;
  },
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: mockReplace,
    forward: mockForward,
    refresh: mockRefresh,
    prefetch: mockPrefetch,
  }),
}));

(globalThis as any).__MOCK_ROUTER_BACK__ = mockBack;
(globalThis as any).__MOCK_ROUTER_PUSH__ = mockPush;
(globalThis as any).__MOCK_ROUTER_REPLACE__ = mockReplace;

vi.mock("next/image", () => ({
  default: (props: any) =>
    React.createElement("div", {
      "data-testid": "mock-image",
      width: 64,
      height: 64,
      ...props,
    }),
}));

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

const mockApolloQueryHook = vi.fn(() => ({
  data: undefined,
  loading: false,
  error: undefined,
  refetch: vi.fn(),
  fetchMore: vi.fn(),
}));
const mockApolloMutationHook = vi.fn(() => [
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

vi.mock("@apollo/client", () => ({
  gql: vi.fn((strings: TemplateStringsArray) => strings.join("")),
  ApolloClient: vi.fn(() => mockApolloClient),
  InMemoryCache: vi.fn(),
  createHttpLink: vi.fn(),
  from: vi.fn(() => mockApolloClient),
}));

vi.mock("@apollo/client/react", () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, {}, children),
  useQuery: mockApolloQueryHook,
  useMutation: mockApolloMutationHook,
  useLazyQuery: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  QueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
    clear: vi.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, {}, children),
  useQuery: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
    error: undefined,
    refetch: vi.fn(),
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    error: undefined,
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  })),
}));

vi.mock("@mantine/core", () => {
  const createMockComponent = (tag: string, displayName: string) => {
    const Component = React.forwardRef<any, any>((props, ref) => {
      const { children, component, ...rest } = props;
      const resolvedTag = component || tag;
      return React.createElement(
        resolvedTag,
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

  const createInputComponent = (
    tag: "input" | "textarea",
    displayName: string
  ) => {
    const Component = React.forwardRef<any, any>((props, ref) => {
      const { label, description, error, ...rest } = props;
      const input = React.createElement(tag, {
        ref,
        "data-testid": `mantine-${displayName.toLowerCase()}`,
        ...rest,
      });

      if (!label) {
        return input;
      }

      return React.createElement(
        "label",
        {},
        label,
        input,
        description ? React.createElement("span", {}, description) : null,
        error ? React.createElement("span", {}, error) : null
      );
    });
    Component.displayName = displayName;
    return Component;
  };

  const Button = React.forwardRef<any, any>((props, ref) => {
    const { children, leftSection, rightSection, loading, ...rest } = props;
    return React.createElement(
      "button",
      {
        ref,
        "data-testid": "mantine-button",
        "data-loading": loading ? "true" : "false",
        ...rest,
      },
      leftSection,
      children,
      rightSection
    );
  });
  Button.displayName = "Button";

  const ActionIcon = React.forwardRef<any, any>((props, ref) => {
    const { children, ...rest } = props;
    return React.createElement(
      "button",
      {
        ref,
        "data-testid": "mantine-actionicon",
        ...rest,
      },
      children
    );
  });
  ActionIcon.displayName = "ActionIcon";

  const Select = React.forwardRef<any, any>((props, ref) => {
    const {
      label,
      data = [],
      placeholder,
      value,
      onChange,
      clearable,
      ...rest
    } = props;

    const options = data.map((item: any) => {
      if (typeof item === "string") {
        return { value: item, label: item };
      }
      return item;
    });

    const select = React.createElement(
      "select",
      {
        ref,
        value: value ?? "",
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
          const nextValue = event.target.value;
          onChange?.(nextValue || null);
        },
        "data-testid": "mantine-select",
        ...rest,
      },
      placeholder || clearable
        ? React.createElement("option", { value: "" }, placeholder || "")
        : null,
      ...options.map((option: { value: string; label: string }) =>
        React.createElement(
          "option",
          { key: option.value, value: option.value },
          option.label
        )
      )
    );

    if (!label) {
      return select;
    }

    return React.createElement("label", {}, label, select);
  });
  Select.displayName = "Select";

  const Skeleton = React.forwardRef<any, any>((props, ref) => {
    const { children, visible, ...rest } = props;
    return React.createElement(
      "div",
      {
        ref,
        "data-testid": "mantine-skeleton",
        "data-visible": visible ? "true" : "false",
        ...rest,
      },
      children
    );
  });
  Skeleton.displayName = "Skeleton";

  const MenuRoot = ({ children }: { children: React.ReactNode }) =>
    React.createElement("div", { "data-testid": "mantine-menu" }, children);
  const MenuTarget = ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, {}, children);
  const MenuDropdown = ({ children }: { children: React.ReactNode }) =>
    React.createElement(
      "div",
      { "data-testid": "mantine-menu-dropdown" },
      children
    );
  const MenuItem = React.forwardRef<any, any>((props, ref) => {
    const { children, leftSection, ...rest } = props;
    return React.createElement(
      "button",
      {
        ref,
        type: "button",
        "data-testid": "mantine-menu-item",
        ...rest,
      },
      leftSection,
      children
    );
  });
  MenuItem.displayName = "MenuItem";

  const Menu = Object.assign(MenuRoot, {
    Target: MenuTarget,
    Dropdown: MenuDropdown,
    Item: MenuItem,
  });

  return {
    MantineProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, {}, children),
    createTheme: vi.fn(() => ({})),
    Button,
    Container: createMockComponent("div", "Container"),
    Stack: createMockComponent("div", "Stack"),
    Group: createMockComponent("div", "Group"),
    Paper: createMockComponent("div", "Paper"),
    Text: createMockComponent("p", "Text"),
    Title: createMockComponent("h1", "Title"),
    Badge: createMockComponent("span", "Badge"),
    Alert: createMockComponent("div", "Alert"),
    Loader: createMockComponent("div", "Loader"),
    Menu,
    ActionIcon,
    TextInput: createInputComponent("input", "TextInput"),
    Textarea: createInputComponent("textarea", "Textarea"),
    PasswordInput: createInputComponent("input", "PasswordInput"),
    Select,
    Skeleton,
  };
});

vi.mock("@mantine/dates", () => {
  const DateInput = React.forwardRef<any, any>((props, ref) => {
    const { label, value, onChange, ...rest } = props;
    const formattedValue =
      value instanceof Date && !Number.isNaN(value.getTime())
        ? value.toISOString().split("T")[0]
        : typeof value === "string"
          ? value
          : "";

    const input = React.createElement("input", {
      ref,
      type: "date",
      value: formattedValue,
      "data-testid": "mantine-dateinput",
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;
        onChange?.(nextValue ? new Date(`${nextValue}T00:00:00`) : null);
      },
      ...rest,
    });

    if (!label) {
      return input;
    }

    return React.createElement("label", {}, label, input);
  });
  DateInput.displayName = "DateInput";
  return {
    DatesProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, {}, children),
    DateInput,
  };
});

vi.mock("@mantine/form", () => ({
  useForm: vi.fn(
    ({
      initialValues = {},
      validate = {},
    }: {
      initialValues?: Record<string, any>;
      validate?: Record<string, (value: any) => string | null>;
    } = {}) => {
      const [values, setValues] = React.useState(initialValues);
      const [errors, setErrors] = React.useState<Record<string, string | null>>(
        {}
      );

      const validateField = (field: string, value: any) => {
        const validator = validate[field];
        return typeof validator === "function" ? validator(value) : null;
      };

      const setFieldValue = vi.fn((field: string, value: any) => {
        setValues((previous) => ({
          ...previous,
          [field]: value,
        }));
        setErrors((previous) => ({
          ...previous,
          [field]: validateField(field, value),
        }));
      });

      const setFieldError = vi.fn((field: string, error: string | null) => {
        setErrors((previous) => ({
          ...previous,
          [field]: error,
        }));
      });

      const getInputProps = (field: string) => ({
        name: field,
        value: values[field] ?? "",
        error: errors[field] ?? null,
        onChange: (eventOrValue: any) => {
          const nextValue =
            eventOrValue &&
            typeof eventOrValue === "object" &&
            "target" in eventOrValue
              ? (
                  eventOrValue.target as
                    | HTMLInputElement
                    | HTMLTextAreaElement
                    | HTMLSelectElement
                ).value
              : eventOrValue;
          setFieldValue(field, nextValue);
        },
      });

      const validateForm = vi.fn(() => {
        const nextErrors = Object.fromEntries(
          Object.keys(validate).map((field) => [
            field,
            validateField(field, values[field]),
          ])
        );
        setErrors(nextErrors);

        return {
          hasErrors: Object.values(nextErrors).some(Boolean),
          errors: nextErrors,
        };
      });

      const reset = vi.fn(() => {
        setValues(initialValues);
        setErrors({});
      });

      const onSubmit = vi.fn((handler) => async (event: any) => {
        event?.preventDefault?.();
        const result = validateForm();
        if (!result.hasErrors) {
          return handler(values);
        }
        return undefined;
      });

      return {
        values,
        errors,
        getInputProps,
        setFieldValue,
        setFieldError,
        onSubmit,
        reset,
        validate: validateForm,
        isValid: Object.values(errors).every((value) => !value),
      };
    }
  ),
}));

vi.mock("@mantine/hooks", () => ({
  useDisclosure: vi.fn(() => [
    false,
    { open: vi.fn(), close: vi.fn(), toggle: vi.fn() },
  ]),
  useMediaQuery: vi.fn(() => false),
  useClickOutside: vi.fn(),
  useDebouncedValue: vi.fn((value) => [value, value]),
}));

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
