import { clsx } from "clsx";
import type { ReactNode } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

type AuthTextFieldProps = TextInputProps & {
  error?: string;
  helper?: string;
  label: string;
  rightSlot?: ReactNode;
};

export function AuthTextField({
  error,
  helper,
  label,
  rightSlot,
  ...props
}: AuthTextFieldProps) {
  return (
    <View className="auth-field">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="auth-label">{label}</Text>
        {rightSlot}
      </View>

      <TextInput
        className={clsx("auth-input", error && "auth-input-error")}
        placeholderTextColor="rgba(0, 0, 0, 0.45)"
        {...props}
      />

      {error ? <Text className="auth-error">{error}</Text> : null}
      {!error && helper ? <Text className="auth-helper">{helper}</Text> : null}
    </View>
  );
}
