import { styled } from "nativewind";
import type { PropsWithChildren, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type AuthScaffoldProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  footer?: ReactNode;
}>;

const TRUST_POINTS = [
  "Encrypted sessions",
  "Email verification",
  "Fast setup",
];

export function AuthScaffold({
  children,
  footer,
  subtitle,
  title,
}: AuthScaffoldProps) {
  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>

              <View>
                <Text className="auth-wordmark">Recurrly</Text>
                <Text className="auth-wordmark-sub">
                  subscription clarity
                </Text>
              </View>
            </View>

            <Text className="auth-title">{title}</Text>
            <Text className="auth-subtitle">{subtitle}</Text>

            <View className="mt-5 flex-row flex-wrap items-center justify-center gap-2">
              {TRUST_POINTS.map((point) => (
                <View
                  key={point}
                  className="rounded-full border border-border bg-background px-3 py-2"
                >
                  <Text className="text-xs font-sans-semibold text-primary">
                    {point}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="auth-card">
            {children}
            {footer}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
