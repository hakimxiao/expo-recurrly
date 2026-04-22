const FALLBACK_ID_PREFIX = "subscription";

export const generateSubscriptionId = () => {
  const randomSuffix = Math.random().toString(36).slice(2, 10);

  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${FALLBACK_ID_PREFIX}-${crypto.randomUUID()}`;
  }

  return `${FALLBACK_ID_PREFIX}-${Date.now()}-${randomSuffix}`;
};
