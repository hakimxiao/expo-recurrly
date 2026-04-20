import type { Router } from "expo-router";

type AuthField = "emailAddress" | "password" | "code";
type FieldErrors = Partial<Record<AuthField, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFICATION_CODE_REGEX = /^\d{6}$/;

export function normalizeEmailAddress(value: string) {
  return value.trim().toLowerCase();
}

export function validateSignInValues(values: {
  emailAddress: string;
  password: string;
}) {
  const errors: FieldErrors = {};

  if (!EMAIL_REGEX.test(normalizeEmailAddress(values.emailAddress))) {
    errors.emailAddress = "Enter a valid email address.";
  }

  if (values.password.trim().length < 8) {
    errors.password = "Enter your password to continue.";
  }

  return errors;
}

export function validateSignUpValues(values: {
  emailAddress: string;
  password: string;
}) {
  const errors = validateSignInValues(values);

  if (values.password.trim().length > 0 && values.password.trim().length < 8) {
    errors.password = "Use at least 8 characters for your password.";
  }

  return errors;
}

export function validateVerificationCode(code: string) {
  if (!VERIFICATION_CODE_REGEX.test(code.trim())) {
    return { code: "Enter the 6-digit code from your email." } satisfies FieldErrors;
  }

  return {};
}

function mapFieldName(value?: string): AuthField | null {
  switch (value) {
    case "emailAddress":
    case "email_address":
    case "identifier":
      return "emailAddress";
    case "password":
      return "password";
    case "code":
      return "code";
    default:
      return null;
  }
}

export function extractClerkError(error: unknown, fallback: string) {
  const fieldErrors: FieldErrors = {};
  const fallbackMessage =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : fallback;

  const rawErrors = Array.isArray(error)
    ? error
    : Array.isArray((error as { errors?: unknown[] } | null)?.errors)
      ? (error as { errors: unknown[] }).errors
      : error
        ? [error]
        : [];

  const globalMessages: string[] = [];

  rawErrors.forEach((entry) => {
    if (!entry || typeof entry !== "object") {
      if (typeof entry === "string") {
        globalMessages.push(entry);
      }
      return;
    }

    const candidate = entry as {
      field?: string;
      longMessage?: string;
      message?: string;
      meta?: { paramName?: string };
      paramName?: string;
    };

    const message = candidate.longMessage ?? candidate.message;
    if (!message) {
      return;
    }

    const field = mapFieldName(
      candidate.meta?.paramName ?? candidate.paramName ?? candidate.field,
    );

    if (field) {
      fieldErrors[field] = message;
      return;
    }

    globalMessages.push(message);
  });

  return {
    fieldErrors,
    globalError: globalMessages[0] ?? fallbackMessage,
  };
}

export async function finalizeAuthSession(
  resource: { finalize: (params?: { navigate?: (params: { session?: { currentTask?: unknown } }) => void }) => Promise<{ error: unknown }> },
  router: Router,
) {
  return resource.finalize({
    navigate: ({ session }) => {
      if (session?.currentTask) {
        router.replace("/onboarding");
        return;
      }

      router.replace("/(tabs)");
    },
  });
}
