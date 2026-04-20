import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type AppAlertProps = {
  description: string;
  onClose: () => void;
  open: boolean;
  title?: string;
};

const AppAlert = ({
  description,
  onClose,
  open,
  title = "Something went wrong",
}: AppAlertProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={open}
      onRequestClose={onClose}
    >
      <Pressable className="modal-overlay justify-center px-5" onPress={onClose}>
        <Pressable
          className="rounded-[28px] border border-border bg-card p-5"
          onPress={(event) => event.stopPropagation()}
        >
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-lg font-sans-bold text-primary">{title}</Text>
              <Text className="mt-3 text-sm font-sans-medium leading-6 text-muted-foreground">
                {description}
              </Text>
            </View>

            <Pressable className="modal-close" onPress={onClose}>
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>

          <Pressable className="auth-button mt-6" onPress={onClose}>
            <Text className="auth-button-text">Okay</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AppAlert;
