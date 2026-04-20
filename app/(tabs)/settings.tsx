import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="rounded-[28px] border border-border bg-card p-5">
        <Text className="text-sm font-sans-semibold uppercase tracking-[1px] text-accent">
          Account
        </Text>
        <Text className="mt-3 text-3xl font-sans-bold text-primary">
          {user?.fullName ?? user?.firstName ?? "Your workspace"}
        </Text>
        <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
          {primaryEmail ?? "No primary email available yet."}
        </Text>

        <View className="mt-6 gap-3 rounded-2xl bg-background p-4">
          <Text className="text-sm font-sans-semibold text-primary">
            Signed in securely on this device
          </Text>
          <Text className="text-sm font-sans-medium leading-6 text-muted-foreground">
            Your Recurrly session is persisted with secure storage so returning
            to the app feels seamless.
          </Text>
        </View>

        <Pressable
          className="mt-6 items-center rounded-2xl bg-primary py-4"
          onPress={async () => {
            await signOut();
            router.replace("/(auth)/sign-in");
          }}
        >
          <Text className="font-sans-bold text-base text-background">
            Log out
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
