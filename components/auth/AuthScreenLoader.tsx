import { ActivityIndicator, View } from "react-native";

export function AuthScreenLoader() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-5">
      <ActivityIndicator color="#081126" size="small" />
    </View>
  );
}
