import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useRole } from "@/context/RoleContext";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeToggle } from "@/components/ThemeToggle";

export default function MoreScreen() {
  const { role } = useRole();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-app" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-6 pb-8 bg-input rounded-b-[40px] shadow-sm mb-6">
          <View className="flex-row items-center justify-between mb-8">
            <Animated.Text
              entering={FadeInDown.delay(100).springify()}
              className="text-4xl font-clash text-app tracking-tight"
            >
              Settings
            </Animated.Text>
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <ThemeToggle />
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="flex-row items-center gap-5 mb-8"
          >
            <View className="h-16 w-16 bg-secondary rounded-full items-center justify-center border border-app shadow-sm relative">
              <Feather name="user" size={28} className="text-secondary" />
              <View className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
            </View>
            <View>
              <Text className="text-xl font-bold font-clash text-app leading-tight">
                John Doe
              </Text>
              <Text className="text-secondary font-outfit text-sm mt-0.5">
                john.doe@example.com
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <RoleSwitcher />
          </Animated.View>
        </View>

        <View className="px-6 gap-6">
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Text className="text-xs font-bold font-outfit text-gray-400 uppercase mb-3 ml-2 tracking-wider">
              Account
            </Text>
            <View className="bg-input rounded-3xl overflow-hidden shadow-sm border border-app">
              <MenuItem
                icon="user"
                label="Profile Information"
                isLast={false}
                onPress={() => router.push("/profile-settings")}
              />
              <MenuItem icon="bell" label="Notifications" isLast={false} />
              <MenuItem icon="lock" label="Privacy & Security" isLast={true} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <Text className="text-xs font-bold font-outfit text-gray-400 uppercase mb-3 ml-2 tracking-wider">
              Support & About
            </Text>
            <View className="bg-input rounded-3xl overflow-hidden shadow-sm border border-app">
              <MenuItem icon="help-circle" label="Help Center" isLast={false} />
              <MenuItem
                icon="message-square"
                label="Send Feedback"
                isLast={false}
              />
              <MenuItem icon="info" label="About App" isLast={true} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <Text className="text-xs font-bold font-outfit text-gray-400 uppercase mb-3 ml-2 tracking-wider">
              Legal
            </Text>
            <View className="bg-input rounded-3xl overflow-hidden shadow-sm border border-app">
              <MenuItem
                icon="file-text"
                label="Terms of Service"
                isLast={false}
              />
              <MenuItem icon="shield" label="Privacy Policy" isLast={true} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).springify()}>
            <TouchableOpacity className="flex-row items-center justify-center p-4 rounded-3xl bg-red-50 border border-red-100 active:bg-red-100 mb-2">
              <Feather name="log-out" size={20} color="#ef4444" />
              <Text className="font-bold font-outfit text-red-600 ml-2">
                Log Out
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.Text
            entering={FadeInUp.delay(800).springify()}
            className="text-center text-gray-300 font-outfit text-xs mt-2 mb-6"
          >
            Version 1.0.0 (Build 124)
          </Animated.Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  isLast,
  onPress,
}: {
  icon: any;
  label: string;
  isLast: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-4 bg-input active:bg-secondary ${!isLast ? "border-b border-app" : ""}`}
    >
      <View className="w-10 h-10 items-center justify-center bg-secondary rounded-full mr-3">
        <Feather name={icon} size={18} className="text-secondary" />
      </View>
      <Text className="flex-1 font-outfit text-app text-[15px] font-medium">
        {label}
      </Text>
      <Feather name="chevron-right" size={16} className="text-secondary" />
    </TouchableOpacity>
  );
}
