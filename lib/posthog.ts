import { usePostHog } from "posthog-react-native";

const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (!posthogApiKey) {
  throw new Error("Add EXPO_PUBLIC_POSTHOG_API_KEY to your .env file");
}

if (!posthogHost) {
  throw new Error("Add EXPO_PUBLIC_POSTHOG_HOST to your .env file");
}

export const posthogConfig = {
  apiKey: posthogApiKey,
  options: {
    host: posthogHost,
  },
} as const;

export const usePostHogInstance = () => usePostHog();
