import { ActionButton } from "@/components/dashboard/ActionButton";
import { PinModal } from "@/components/PinModal";
import { Skeleton } from "@/components/Skeleton";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { useRefreshContext } from "@/context/RefreshContext";
import { useRole } from "@/context/RoleContext";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { guardianPin, setGuardianPin } = useRole();
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const { isLoading } = useRefreshContext();

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

  const handleRefresh = async () => {
    // Mock refresh logic
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Refreshed Profile Settings");
  };

  return (
    <SafeAreaView className="flex-1 bg-app" edges={["top"]}>
      <View className="px-6 py-4 bg-input border-b border-app flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/more")}
          className="w-10 h-10 items-center justify-center bg-secondary rounded-full"
        >
          <Feather name="arrow-left" size={20} className="text-app" />
        </TouchableOpacity>
        <Text className="text-lg font-bold font-clash text-app">
          Profile Settings
        </Text>
        <View className="w-10" />
      </View>

      <ThemedScrollView
        onRefresh={handleRefresh}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 24,
          paddingTop: 24,
        }}
      >
        {isLoading ? (
          <View className="bg-input rounded-3xl p-6 shadow-sm mb-6">
            <View className="flex-row items-center gap-4 mb-8">
              <Skeleton circle width={64} height={64} />
              <View className="flex-1 gap-2">
                <Skeleton width="60%" height={24} />
                <Skeleton width="40%" height={16} />
              </View>
            </View>
            <View className="py-4 border-t border-app gap-4">
              <View className="flex-row justify-between">
                <Skeleton width="50%" height={20} />
                <Skeleton width={40} height={24} borderRadius={12} />
              </View>
              <Skeleton width="100%" height={12} />
              <Skeleton width="70%" height={12} />
            </View>
          </View>
        ) : (
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
                <Feather
                  name="chevron-right"
                  size={20}
                  className="text-muted"
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        <ActionButton
          label="Save Changes"
          icon="check"
          color="bg-accent"
          iconColor="text-white"
          onPress={() => router.navigate("/(tabs)/more")}
          fullWidth={true}
        />
      </ThemedScrollView>
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
