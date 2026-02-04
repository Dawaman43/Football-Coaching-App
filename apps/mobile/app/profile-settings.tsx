import { PinModal } from "@/components/PinModal";
import { useRole } from "@/context/RoleContext";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { guardianPin, setGuardianPin } = useRole();
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);

  const handleSetPin = (pin: string) => {
    setGuardianPin(pin);
    setIsPinModalVisible(false);
  };

  const handleTogglePin = (value: boolean) => {
    if (value) {
      setIsPinModalVisible(true);
    } else {
      setGuardianPin(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-app" edges={["top"]}>
      <View className="px-6 py-4 bg-input border-b border-app flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center bg-secondary rounded-full"
        >
          <Feather name="arrow-left" size={20} className="text-app" />
        </TouchableOpacity>
        <Text className="text-lg font-bold font-clash text-app">
          Profile Settings
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-input rounded-3xl p-6 shadow-sm mb-6">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-16 h-16 bg-accent-light rounded-full items-center justify-center">
              <Feather name="shield" size={28} className="text-accent" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold font-clash text-app leading-tight mb-1">
                Guardian Security
              </Text>
              <Text className="text-secondary font-outfit text-sm">
                Protect potential sensitive settings with a PIN.
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between py-4 border-t border-app">
            <View className="flex-1 mr-4">
              <Text className="text-base font-semibold font-outfit text-app mb-1">
                Enable PIN Protection
              </Text>
              <Text className="text-muted font-outfit text-xs leading-relaxed">
                Require a PIN when switching back to Guardian mode.
              </Text>
            </View>
            <Switch
              value={!!guardianPin}
              onValueChange={handleTogglePin}
              trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
              thumbColor={"#ffffff"}
            />
          </View>

          {guardianPin && (
            <TouchableOpacity
              onPress={() => setIsPinModalVisible(true)}
              className="flex-row items-center justify-between py-4 border-t border-app mt-2"
            >
              <Text className="text-base font-medium font-outfit text-app">
                Change PIN
              </Text>
              <Feather name="chevron-right" size={20} className="text-muted" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <PinModal
        visible={isPinModalVisible}
        onClose={() => setIsPinModalVisible(false)}
        onSuccess={handleSetPin}
        title="Set Guardian PIN"
        subtitle="Create a 4-digit PIN to protect your settings."
      />
    </SafeAreaView>
  );
}
