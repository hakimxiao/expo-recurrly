import dayjs from "dayjs";

export { formatCurrency, formatRupiah } from "./money";

const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";
const EMPTY_DATE_LABEL = "Not provided";
const UNKNOWN_STATUS_LABEL = "Unknown";

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return EMPTY_DATE_LABEL;
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format(DEFAULT_DATE_FORMAT)
    : EMPTY_DATE_LABEL;
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return UNKNOWN_STATUS_LABEL;
  return value.charAt(0).toUpperCase() + value.slice(1);
};
