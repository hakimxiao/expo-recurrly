import { AuthTextField } from "@/components/auth/AuthTextField";
import { icons } from "@/constants/icons";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import { clsx } from "clsx";
import { styled } from "nativewind";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const FREQUENCY_OPTIONS = ["Monthly", "Yearly"] as const;

const CATEGORY_COLORS: Record<(typeof CATEGORY_OPTIONS)[number], string> = {
  Entertainment: "#ffd8a8",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#c7e9b4",
  Cloud: "#cfe8ff",
  Music: "#b8e8d0",
  Other: "#f0dfb5",
};

type CreateSubscriptionModalProps = {
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
  visible: boolean;
};

const getRenewalDate = (frequency: Subscription["billing"], startDate: string) =>
  dayjs(startDate)
    .add(1, frequency === "Yearly" ? "year" : "month")
    .toISOString();

export default function CreateSubscriptionModal({
  onClose,
  onCreate,
  visible,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Subscription["billing"]>("Monthly");
  const [category, setCategory] =
    useState<(typeof CATEGORY_OPTIONS)[number]>("Entertainment");
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");

  const isSubmitDisabled = name.trim().length === 0 || !(Number(price) > 0);

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setNameError("");
    setPriceError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    const parsedPrice = Number(price);

    const resolvedNameError =
      trimmedName.length === 0 ? "Subscription name is required." : "";
    const resolvedPriceError =
      Number.isFinite(parsedPrice) && parsedPrice > 0
        ? ""
        : "Enter a valid positive price.";

    setNameError(resolvedNameError);
    setPriceError(resolvedPriceError);

    if (resolvedNameError || resolvedPriceError) {
      return;
    }

    const startDate = dayjs().toISOString();

    onCreate({
      id: `subscription-${Date.now()}`,
      icon: icons.wallet,
      name: trimmedName,
      price: parsedPrice,
      currency: "IDR",
      frequency,
      category,
      status: "active",
      startDate,
      renewalDate: getRenewalDate(frequency, startDate),
      billing: frequency,
      color: CATEGORY_COLORS[category],
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View className="modal-overlay">
        <SafeAreaView className="flex-1 bg-background">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <View className="modal-header border-b-0 px-5 pb-3 pt-2">
              <View>
                <Text className="modal-title">New Subscription</Text>
                <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
                  Add a new recurring payment to your tracker.
                </Text>
              </View>

              <Pressable className="modal-close" onPress={handleClose}>
                <Feather name="x" size={18} color="#081126" />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="px-5 pb-8"
            >
              <View className="auth-card mt-2">
                <View className="auth-form">
                  <AuthTextField
                    label="Name"
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      if (nameError) setNameError("");
                    }}
                    placeholder="Spotify, GitHub Pro, Figma..."
                    placeholderTextColor="rgba(0, 0, 0, 0.45)"
                    error={nameError}
                  />

                  <AuthTextField
                    label="Price"
                    value={price}
                    onChangeText={(value) => {
                      setPrice(value.replace(",", "."));
                      if (priceError) setPriceError("");
                    }}
                    placeholder="149000"
                    placeholderTextColor="rgba(0, 0, 0, 0.45)"
                    keyboardType="decimal-pad"
                    error={priceError}
                  />

                  <View className="auth-field">
                    <Text className="auth-label">Frequency</Text>
                    <View className="picker-row">
                      {FREQUENCY_OPTIONS.map((option) => {
                        const isActive = frequency === option;

                        return (
                          <Pressable
                            key={option}
                            className={clsx(
                              "picker-option",
                              isActive && "picker-option-active",
                            )}
                            onPress={() => setFrequency(option)}
                          >
                            <Text
                              className={clsx(
                                "picker-option-text",
                                isActive && "picker-option-text-active",
                              )}
                            >
                              {option}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  <View className="auth-field">
                    <Text className="auth-label">Category</Text>
                    <View className="category-scroll">
                      {CATEGORY_OPTIONS.map((option) => {
                        const isActive = category === option;

                        return (
                          <Pressable
                            key={option}
                            className={clsx(
                              "category-chip",
                              isActive && "category-chip-active",
                            )}
                            onPress={() => setCategory(option)}
                          >
                            <Text
                              className={clsx(
                                "category-chip-text",
                                isActive && "category-chip-text-active",
                              )}
                            >
                              {option}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </View>
              </View>

              <Pressable
                className={clsx(
                  "auth-button mt-5",
                  isSubmitDisabled && "auth-button-disabled",
                )}
                onPress={handleSubmit}
                disabled={isSubmitDisabled}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
