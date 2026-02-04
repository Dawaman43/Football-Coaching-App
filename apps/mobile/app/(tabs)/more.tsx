import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useRole } from "@/context/RoleContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreScreen() {
  const { role } = useRole();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-6 pb-8 bg-white rounded-b-[40px] shadow-sm mb-6">
          <Animated.Text
            entering={FadeInDown.delay(100).springify()}
            className="text-4xl font-clash text-gray-900 mb-8 tracking-tight"
          >
            Settings
          </Animated.Text>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="flex-row items-center gap-5 mb-8"
          >
            <View className="h-16 w-16 bg-gray-50 rounded-full items-center justify-center border border-gray-100 shadow-sm relative">
              <Feather name="user" size={28} color="#6b7280" />
              <View className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
            </View>
            <View>
              <Text className="text-xl font-bold font-clash text-gray-900 leading-tight">
                John Doe
              </Text>
              <Text className="text-gray-500 font-outfit text-sm mt-0.5">
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
            <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <MenuItem
                icon="user"
                label="Profile Information"
                isLast={false}
              />
              <MenuItem icon="bell" label="Notifications" isLast={false} />
              <MenuItem icon="lock" label="Privacy & Security" isLast={true} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500).springify()}>
            <Text className="text-xs font-bold font-outfit text-gray-400 uppercase mb-3 ml-2 tracking-wider">
              Support & About
            </Text>
            <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
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
            <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
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
}: {
  icon: any;
  label: string;
  isLast: boolean;
}) {
  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 bg-white active:bg-gray-50 ${!isLast ? "border-b border-gray-50" : ""}`}
    >
      <View className="w-10 h-10 items-center justify-center bg-gray-50 rounded-full mr-3">
        <Feather name={icon} size={18} color="#4b5563" />
      </View>
      <Text className="flex-1 font-outfit text-gray-900 text-[15px] font-medium">
        {label}
      </Text>
      <Feather name="chevron-right" size={16} color="#d1d5db" />
    </TouchableOpacity>
  );
}
