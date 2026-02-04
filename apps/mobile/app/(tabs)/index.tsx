import { AthleteDashboard } from "@/components/dashboard/AthleteDashboard";
import { GuardianDashboard } from "@/components/dashboard/GuardianDashboard";
import { ThemedScrollView } from "@/components/ThemedScrollView";
import { useRole } from "@/context/RoleContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { role } = useRole();

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Refreshed Home Screen");
  };

  return (
    <SafeAreaView className="flex-1 bg-app" edges={["top"]}>
      <ThemedScrollView
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="px-6 pt-6 pb-6 bg-input rounded-b-[32px] shadow-sm mb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="font-outfit text-muted text-sm mb-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Text>
              <Text className="font-clash text-2xl text-app">
                Hi,{" "}
                <Text className="text-accent">
                  {role === "Guardian" ? "Parent" : "Athlete"}
                </Text>
              </Text>
            </View>
            <View className="h-12 w-12 bg-secondary rounded-full items-center justify-center border border-app">
              <Feather name="user" size={20} className="text-app" />
            </View>
          </View>
        </View>

        <View className="px-6 gap-6">
          {role === "Guardian" ? <GuardianDashboard /> : <AthleteDashboard />}
        </View>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
