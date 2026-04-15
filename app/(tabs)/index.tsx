import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return <SafeAreaView className="flex-1 bg-background p-5"></SafeAreaView>;
}
