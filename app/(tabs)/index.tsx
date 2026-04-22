import ListHeading from "@/components/homeScreen/ListHeading";
import SubscriptionCard from "@/components/homeScreen/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/homeScreen/UpcomingSubscriptionCard";
import CreateSubscriptionModal from "@/components/subscriptionsScreen/CreateSubscriptionModal";
import {
  HOME_BALANCE,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";

import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import { formatRupiah } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function HomeScreen() {
  const isAndroid = Platform.OS === "android";

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { addSubscription, subscriptions } = useSubscriptionStore();

  return (
    <>
      <SafeAreaView className="flex-1 bg-background p-5">
        <FlatList
          ListHeaderComponent={() => (
            <>
              <View className="home-header">
                <View className="home-user">
                  <Image source={images.avatar} className="home-avatar" />
                  <Text className="home-user-name">{HOME_USER.name}</Text>
                </View>

                <Pressable onPress={() => setIsCreateModalVisible(true)}>
                  <Image source={icons.add} className="home-add-icon" />
                </Pressable>
              </View>

              <View className="home-balance-card">
                <Text className="home-balance-label">Balance</Text>

                <View className="home-balance-row">
                  <Text
                    className={`home-balance-amount ${isAndroid ? "text-3xl!" : ""}`}
                  >
                    {formatRupiah(HOME_BALANCE.amount, { variant: "full" })}
                  </Text>
                  <Text className="home-balance-date">
                    {dayjs(HOME_BALANCE.nextRenewalDate).format("DD/MM")}
                  </Text>
                </View>
              </View>

              <View className="mb-5">
                <ListHeading title="Upcoming" />
                <FlatList
                  data={UPCOMING_SUBSCRIPTIONS}
                  renderItem={({ item }) => (
                    <UpcomingSubscriptionCard {...item} />
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={
                    <Text className="home-empty-state">
                      No upcoming subscriptions
                    </Text>
                  }
                />
              </View>

              <ListHeading title="All Subscriptions" />
            </>
          )}
          data={subscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() =>
                setExpandedSubscriptionId((currentId) =>
                  currentId === item.id ? null : item.id,
                )
              }
            />
          )}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="home-empty-state">No subscriptions yet.</Text>
          }
          contentContainerClassName="pb-30"
        />
      </SafeAreaView>

      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={addSubscription}
      />
    </>
  );
}
