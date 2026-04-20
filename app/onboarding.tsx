import { useAuth, useClerk, useUser } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const Onboarding = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <View className="flex-1 justify-center bg-background px-5">
      <View className="rounded-[28px] border border-border bg-card p-6">
        <Text className="text-sm font-sans-semibold uppercase tracking-[1px] text-accent">
          Account setup
        </Text>
        <Text className="mt-3 text-3xl font-sans-bold text-primary">
          You&apos;re in, {user?.firstName ?? "there"}.
        </Text>
        <Text className="mt-3 text-base font-sans-medium leading-6 text-muted-foreground">
          Your session is active. If your account needs any final setup steps,
          we&apos;ll guide you through them here next.
        </Text>

        <Pressable
          className="auth-button mt-6"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="auth-button-text">Continue to dashboard</Text>
        </Pressable>

        <Pressable
          className="auth-secondary-button mt-3"
          onPress={() => signOut()}
        >
          <Text className="auth-secondary-button-text">Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Onboarding;
