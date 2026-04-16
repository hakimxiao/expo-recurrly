import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-7xl font-sans">Hello</Text>
      <Text className="text-7xl font-sans-extrabold">Hello</Text>
      <Text className="text-7xl font-sans-light">Hello</Text>
    </SafeAreaView>
  );
}
