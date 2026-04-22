import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { generateSubscriptionId } from "@/lib/subscriptions";
import { create } from "zustand";

interface SubscriptionStore {
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  setSubscriptions: (subscriptions: Subscription[]) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscriptions: HOME_SUBSCRIPTIONS,
  addSubscription: (subscription) =>
    set((state) => {
      const hasDuplicateId = state.subscriptions.some(
        (item) => item.id === subscription.id,
      );

      const nextSubscription = hasDuplicateId
        ? { ...subscription, id: generateSubscriptionId() }
        : subscription;

      return { subscriptions: [nextSubscription, ...state.subscriptions] };
    }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
}));
