import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Image, Platform, Text, View } from "react-native";

const UpcomingSubscriptionCard = ({
  name,
  price,
  daysLeft,
  icon,
  currency,
}: UpcomingSubscription) => {
  const isAndroid = Platform.OS === "android";

  return (
    <View className={`upcoming-card ${isAndroid ? "w-50" : ""}`}>
      <View className="upcoming-row">
        <Image source={icon} className="upcoming-icon" />
        <View>
          <Text className="upcoming-price">
            {formatCurrency(price, {
              currency: currency ?? "IDR",
              locale: currency === "IDR" || !currency ? "id-ID" : "en-US",
              variant: "smart",
            })}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            {daysLeft > 1 ? `${daysLeft} days left` : "Last day"}
          </Text>
        </View>
      </View>

      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;
