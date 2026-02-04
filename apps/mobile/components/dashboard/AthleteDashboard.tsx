import { StatCard } from "@/components/dashboard/StatCard";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function AthleteDashboard() {
  return (
    <>
      <View className="bg-slate-900 dark:bg-slate-800 p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <View className="absolute -right-10 -top-10 w-40 h-40 bg-slate-800 dark:bg-slate-700 rounded-full opacity-50" />

        <Text className="text-gray-400 font-outfit text-sm mb-1">
          Next Session
        </Text>
        <Text className="text-white font-clash text-2xl mb-4">
          Goalkeeper Training
        </Text>

        <View className="flex-row gap-4 mb-6">
          <View className="bg-slate-800 dark:bg-slate-700 px-3 py-1.5 rounded-lg flex-row items-center gap-2">
            <Feather name="clock" size={14} className="text-gray-200" />
            <Text className="text-gray-200 text-xs font-outfit">
              Tomorrow, 9:00 AM
            </Text>
          </View>
          <View className="bg-slate-800 dark:bg-slate-700 px-3 py-1.5 rounded-lg flex-row items-center gap-2">
            <Feather name="map-pin" size={14} className="text-gray-200" />
            <Text className="text-gray-200 text-xs font-outfit">
              Main Pitch
            </Text>
          </View>
        </View>

        <TouchableOpacity className="bg-accent py-3 rounded-xl items-center">
          <Text className="text-white font-bold font-outfit">Check In</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text className="text-lg font-bold font-clash text-app mb-4">
          My Performance
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <StatCard label="Attendance" value="95%" trend="+2%" good={true} />
          <StatCard label="Goals" value="12" trend="+3" good={true} />
          <StatCard label="Assists" value="8" trend="0" good={false} />
        </View>
      </View>

      {/* Feedback */}
      <View>
        <Text className="text-lg font-bold font-clash text-app mb-4">
          Recent Feedback
        </Text>
        <View className="bg-input p-4 rounded-2xl border border-app shadow-sm">
          <View className="flex-row gap-3 mb-2">
            <View className="h-10 w-10 bg-secondary rounded-full items-center justify-center">
              <Text className="font-bold text-app">CO</Text>
            </View>
            <View>
              <Text className="font-bold font-outfit text-app">
                Coach Oliver
              </Text>
              <Text className="text-xs text-secondary font-outfit">
                2 days ago
              </Text>
            </View>
          </View>
          <Text className="text-secondary font-outfit text-sm">
            "Great work on your positioning today, keep practicing those high
            catches!"
          </Text>
        </View>
      </View>
    </>
  );
}
