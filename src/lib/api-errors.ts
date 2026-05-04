import { ApiError, type ApiErrorPayload } from "@/api/client";

export interface ParsedApiFormError {
  fieldErrors: Record<string, string>;
  nonFieldErrors: string[];
  message: string;
  statusCode?: number;
  code?: string;
}

interface ParseApiFormErrorOptions {
  fieldAliases?: Record<string, string>;
}

const GENERAL_KEYS = new Set([
  "success",
  "message",
  "statusCode",
  "status_code",
  "status",
  "code",
  "error",
  "data",
  "detail",
  "non_field_errors",
  "__all__",
]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item : String(item)))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  if (value === undefined || value === null) {
    return [];
  }

  const normalized = String(value).trim();
  return normalized ? [normalized] : [];
}

function addUniqueMessage(target: string[], values: string[]) {
  for (const value of values) {
    if (!target.includes(value)) {
      target.push(value);
    }
  }
}

function extractFieldErrorsFromArray(
  input: unknown[],
  fieldAliases: Record<string, string>,
  fieldErrors: Record<string, string>,
  nonFieldErrors: string[]
) {
  for (const item of input) {
    if (!isObjectRecord(item)) {
      addUniqueMessage(nonFieldErrors, toStringList(item));
      continue;
    }

    const pathValue = item.path;
    const messageValue = item.message ?? item.msg ?? item.detail;
    const messages = toStringList(messageValue);

    const firstPathEntry = Array.isArray(pathValue) ? pathValue[0] : pathValue;
    const resolvedKey =
      typeof firstPathEntry === "string" && firstPathEntry.trim().length > 0
        ? fieldAliases[firstPathEntry] ?? firstPathEntry
        : "";

    if (resolvedKey && messages.length > 0) {
      fieldErrors[resolvedKey] = messages[0];
      continue;
    }

    addUniqueMessage(nonFieldErrors, messages);
  }
}

function extractFromObject(
  input: Record<string, unknown>,
  fieldAliases: Record<string, string>,
  fieldErrors: Record<string, string>,
  nonFieldErrors: string[]
) {
  if (typeof input.detail === "string") {
    addUniqueMessage(nonFieldErrors, toStringList(input.detail));
  }

  addUniqueMessage(nonFieldErrors, toStringList(input.non_field_errors));
  addUniqueMessage(nonFieldErrors, toStringList(input.__all__));

  for (const [key, rawValue] of Object.entries(input)) {
    if (GENERAL_KEYS.has(key)) {
      continue;
    }

    const resolvedKey = fieldAliases[key] ?? key;

    // If the value is itself an object (e.g. DRF `details: { email: [...] }`),
    // iterate nested entries and map them to field errors.
    if (isObjectRecord(rawValue)) {
      for (const [nestedKey, nestedValue] of Object.entries(rawValue)) {
        const nestedResolvedKey = fieldAliases[nestedKey] ?? nestedKey;
        const nestedMessages = toStringList(nestedValue);
        if (nestedMessages.length > 0 && !fieldErrors[nestedResolvedKey]) {
          fieldErrors[nestedResolvedKey] = nestedMessages[0];
        }
      }
      continue;
    }

    const messages = toStringList(rawValue);

    if (messages.length > 0) {
      fieldErrors[resolvedKey] = messages[0];
    }
  }
}

function extractPayload(error: unknown): {
  payload?: ApiErrorPayload;
  statusCode?: number;
  message?: string;
} {
  if (error instanceof ApiError) {
    return {
      payload: error.payload,
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  if (isObjectRecord(error)) {
    const payload = isObjectRecord(error.payload)
      ? (error.payload as ApiErrorPayload)
      : isObjectRecord(error.response) && isObjectRecord(error.response.data)
        ? (error.response.data as ApiErrorPayload)
        : isObjectRecord(error)
          ? (error as ApiErrorPayload)
          : undefined;

    const statusCodeValue =
      typeof error.statusCode === "number"
        ? error.statusCode
        : isObjectRecord(error.response) && typeof error.response.status === "number"
          ? error.response.status
          : undefined;

    const messageValue = typeof error.message === "string" ? error.message : undefined;

    return {
      payload,
      statusCode: statusCodeValue,
      message: messageValue,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return {
    message: "Request failed",
  };
}

export function parseApiFormError(
  error: unknown,
  options: ParseApiFormErrorOptions = {}
): ParsedApiFormError {
  const aliases = options.fieldAliases ?? {};
  const fieldErrors: Record<string, string> = {};
  const nonFieldErrors: string[] = [];

  const { payload, statusCode, message } = extractPayload(error);

  let code: string | undefined;
  const sources: unknown[] = [];

  if (payload) {
    sources.push(payload);

    if (isObjectRecord(payload.error)) {
      const payloadErrorCode = payload.error.code;
      if (typeof payloadErrorCode === "string") {
        code = payloadErrorCode;
      }

      sources.push(payload.error);

      if (isObjectRecord(payload.error.upstream)) {
        sources.push(payload.error.upstream);

        // If upstream contains its own error object (e.g. DRF validation), include it
        if (isObjectRecord(payload.error.upstream.error)) {
          sources.push(payload.error.upstream.error);

          // DRF often places field maps under `details` or `detail`
          if (isObjectRecord(payload.error.upstream.error.details)) {
            sources.push(payload.error.upstream.error.details);
          }
          if (isObjectRecord(payload.error.upstream.error.detail)) {
            sources.push(payload.error.upstream.error.detail);
          }
        }
      }

      if (Array.isArray(payload.error.upstream)) {
        sources.push(payload.error.upstream);
      }
    }

    if (Array.isArray(payload.error)) {
      sources.push(payload.error);
    }

    if (isObjectRecord(payload.data)) {
      sources.push(payload.data);
    }
  }

  for (const source of sources) {
    if (Array.isArray(source)) {
      extractFieldErrorsFromArray(source, aliases, fieldErrors, nonFieldErrors);
      continue;
    }

    if (isObjectRecord(source)) {
      extractFromObject(source, aliases, fieldErrors, nonFieldErrors);
    }
  }

  const fallbackMessage =
    (payload?.message && typeof payload.message === "string" ? payload.message : undefined) ||
    message ||
    "Request failed";

  return {
    fieldErrors,
    nonFieldErrors,
    message: nonFieldErrors[0] || fallbackMessage,
    statusCode,
    code,
  };
}
