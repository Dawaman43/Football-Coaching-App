import React from "react";
import { Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  good: boolean;
}

export function StatCard({ label, value, trend, good }: StatCardProps) {
  return (
    <View className="bg-input p-4 rounded-2xl border border-app shadow-sm flex-1 min-w-[100px]">
      <Text className="text-muted text-xs font-outfit mb-1">{label}</Text>
      <Text className="text-2xl font-bold font-clash text-app mb-2">
        {value}
      </Text>
      <View
        className={`self-start px-2 py-0.5 rounded ${
          good ? "bg-green-50 dark:bg-green-950/30" : "bg-secondary"
        }`}
      >
        <Text
          className={`text-xs font-medium ${
            good ? "text-green-700 dark:text-green-400" : "text-secondary"
          }`}
        >
          {trend}
        </Text>
      </View>
    </View>
  );
}
