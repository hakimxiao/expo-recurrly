export type CurrencyCode = "IDR" | (string & {});

export type CurrencyFormatVariant = "full" | "compact" | "smart" | "number";

export interface CurrencyFormatOptions {
  currency?: CurrencyCode;
  locale?: string;
  variant?: CurrencyFormatVariant;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compactThreshold?: number;
  fallback?: string;
}

const DEFAULT_CURRENCY: CurrencyCode = "IDR";
const DEFAULT_LOCALE = "id-ID";
const DEFAULT_FALLBACK = "-";
const DEFAULT_COMPACT_THRESHOLD = 1_000_000;

const COMPACT_UNITS = [
  { value: 1_000_000_000_000, suffix: "T" },
  { value: 1_000_000_000, suffix: "M" },
  { value: 1_000_000, suffix: "jt" },
  { value: 1_000, suffix: "rb" },
] as const;

const isFiniteAmount = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const normalizeAmount = (value: number): number => (Object.is(value, -0) ? 0 : value);

const formatNumber = (
  value: number,
  locale: string,
  minimumFractionDigits = 0,
  maximumFractionDigits = 0
): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

const formatFullCurrency = (
  value: number,
  { currency, locale, minimumFractionDigits, maximumFractionDigits }: Required<
    Pick<
      CurrencyFormatOptions,
      "currency" | "locale" | "minimumFractionDigits" | "maximumFractionDigits"
    >
  >
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

const formatCompactCurrency = (
  value: number,
  { currency, locale, minimumFractionDigits, maximumFractionDigits }: Required<
    Pick<
      CurrencyFormatOptions,
      "currency" | "locale" | "minimumFractionDigits" | "maximumFractionDigits"
    >
  >
): string => {
  if (currency !== "IDR") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  const absoluteValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const matchedUnit = COMPACT_UNITS.find((unit) => absoluteValue >= unit.value);

  if (!matchedUnit) {
    return formatFullCurrency(value, {
      currency,
      locale,
      minimumFractionDigits,
      maximumFractionDigits,
    });
  }

  const scaledValue = absoluteValue / matchedUnit.value;
  const resolvedMaximumFractionDigits =
    maximumFractionDigits === 0 && scaledValue < 100
      ? 1
      : maximumFractionDigits;

  return `${sign}Rp${formatNumber(
    scaledValue,
    locale,
    minimumFractionDigits,
    resolvedMaximumFractionDigits
  )} ${matchedUnit.suffix}`;
};

export function formatCurrency(
  value: number,
  currency?: CurrencyCode
): string;
export function formatCurrency(
  value: number,
  options?: CurrencyFormatOptions
): string;
export function formatCurrency(
  value: number,
  currencyOrOptions: CurrencyCode | CurrencyFormatOptions = DEFAULT_CURRENCY
): string {
  const options =
    typeof currencyOrOptions === "string"
      ? { currency: currencyOrOptions }
      : currencyOrOptions;

  const currency = options.currency ?? DEFAULT_CURRENCY;
  const locale = options.locale ?? DEFAULT_LOCALE;
  const variant = options.variant ?? "full";
  const minimumFractionDigits = options.minimumFractionDigits ?? 0;
  const maximumFractionDigits = options.maximumFractionDigits ?? 0;
  const compactThreshold =
    options.compactThreshold ?? DEFAULT_COMPACT_THRESHOLD;
  const fallback = options.fallback ?? DEFAULT_FALLBACK;

  if (!isFiniteAmount(value)) {
    return fallback;
  }

  const normalizedValue = normalizeAmount(value);

  try {
    if (variant === "number") {
      return formatNumber(
        normalizedValue,
        locale,
        minimumFractionDigits,
        maximumFractionDigits
      );
    }

    if (variant === "compact") {
      return formatCompactCurrency(normalizedValue, {
        currency,
        locale,
        minimumFractionDigits,
        maximumFractionDigits,
      });
    }

    if (variant === "smart" && Math.abs(normalizedValue) >= compactThreshold) {
      return formatCompactCurrency(normalizedValue, {
        currency,
        locale,
        minimumFractionDigits,
        maximumFractionDigits,
      });
    }

    return formatFullCurrency(normalizedValue, {
      currency,
      locale,
      minimumFractionDigits,
      maximumFractionDigits,
    });
  } catch {
    return fallback;
  }
}

export const formatRupiah = (
  value: number,
  options: Omit<CurrencyFormatOptions, "currency" | "locale"> = {}
): string =>
  formatCurrency(value, {
    ...options,
    currency: "IDR",
    locale: "id-ID",
  });
