const EVENT_TIME_OFFSET_MINUTES = 180;
const EVENT_TIME_OFFSET_MS = EVENT_TIME_OFFSET_MINUTES * 60 * 1000;

function parseDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function shiftToEventTime(value?: string | null) {
  const parsed = parseDate(value);
  if (!parsed) {
    return null;
  }

  return new Date(parsed.getTime() + EVENT_TIME_OFFSET_MS);
}

function formatShiftedDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions) {
  const shifted = shiftToEventTime(value);
  if (!shifted) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    ...options,
    timeZone: "UTC",
  }).format(shifted);
}

export function utcToEventDateTime(value?: string | null) {
  const shifted = shiftToEventTime(value);
  if (!shifted) {
    return "";
  }

  return shifted.toISOString().slice(0, 16);
}

export function eventDateTimeToUtc(value?: string | null) {
  if (!value) {
    return "";
  }

  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) {
    return "";
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  if ([year, month, day, hours, minutes].some((part) => Number.isNaN(part))) {
    return "";
  }

  return new Date(Date.UTC(year, month - 1, day, hours, minutes) - EVENT_TIME_OFFSET_MS).toISOString();
}

export function formatEventDateLabel(value?: string | null) {
  return formatShiftedDate(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) || "TBD";
}

export function formatEventDateParts(value?: string | null) {
  const shifted = shiftToEventTime(value);
  if (!shifted) {
    return { day: "--", month: "TBD" };
  }

  return {
    day: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      timeZone: "UTC",
    }).format(shifted),
    month: new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "UTC",
    }).format(shifted).toUpperCase(),
  };
}

export function formatEventTimeRange(start?: string | null, end?: string | null) {
  if (!start || !end) {
    return "TBD";
  }

  return `${formatShiftedDate(start, {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${formatShiftedDate(end, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function formatEventDateTime(value?: string | null) {
  return formatShiftedDate(value, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }) || "Not set";
}