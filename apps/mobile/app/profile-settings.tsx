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
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-6 py-4 bg-white border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full"
        >
          <Feather name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-bold font-clash text-gray-900">
          Profile Settings
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center">
              <Feather name="shield" size={28} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold font-clash text-gray-900 leading-tight mb-1">
                Guardian Security
              </Text>
              <Text className="text-gray-500 font-outfit text-sm">
                Protect potential sensitive settings with a PIN.
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between py-4 border-t border-gray-50">
            <View className="flex-1 mr-4">
              <Text className="text-base font-semibold font-outfit text-gray-900 mb-1">
                Enable PIN Protection
              </Text>
              <Text className="text-gray-400 font-outfit text-xs leading-relaxed">
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
              className="flex-row items-center justify-between py-4 border-t border-gray-50 mt-2"
            >
              <Text className="text-base font-medium font-outfit text-gray-900">
                Change PIN
              </Text>
              <Feather name="chevron-right" size={20} color="#9ca3af" />
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
