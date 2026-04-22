import { Feather } from "@expo/vector-icons";
import SubscriptionCard from "@/components/homeScreen/SubscriptionCard";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptionStore();

  const filteredSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscription.category
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      subscription.plan?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pt-5">
            <Text className="mb-2 text-3xl font-sans-bold text-primary">
              Subscriptions
            </Text>
            <Text className="mb-5 text-sm font-sans-medium text-muted-foreground">
              Find active plans quickly by name, category, or plan type.
            </Text>

            <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
              <View className="size-10 items-center justify-center rounded-full bg-accent/12">
                <Feather name="search" size={18} color="#ea7a53" />
              </View>

              <TextInput
                className="flex-1 text-base font-sans-medium text-primary"
                placeholder="Search subscriptions..."
                placeholderTextColor="rgba(0, 0, 0, 0.45)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              {searchQuery.length > 0 ? (
                <Pressable
                  onPress={() => setSearchQuery("")}
                  className="size-8 items-center justify-center rounded-full bg-muted"
                >
                  <Feather name="x" size={16} color="#081126" />
                </Pressable>
              ) : null}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
