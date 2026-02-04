import { ActionButton } from "@/components/dashboard/ActionButton";
import { Skeleton } from "@/components/Skeleton";
import { useRefreshContext } from "@/context/RefreshContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function GuardianDashboard() {
  const { isLoading } = useRefreshContext();

  return (
    <>
      <View className="flex-row gap-4">
        {isLoading ? (
          <>
            <View className="flex-1 bg-input p-4 rounded-2xl shadow-sm border border-app">
              <Skeleton
                circle
                width={40}
                height={40}
                style={{ marginBottom: 12 }}
              />
              <Skeleton width="40%" height={24} style={{ marginBottom: 8 }} />
              <Skeleton width="80%" height={16} />
            </View>
            <View className="flex-1 bg-input p-4 rounded-2xl shadow-sm border border-app">
              <Skeleton
                circle
                width={40}
                height={40}
                style={{ marginBottom: 12 }}
              />
              <Skeleton width="40%" height={24} style={{ marginBottom: 8 }} />
              <Skeleton width="80%" height={16} />
            </View>
          </>
        ) : (
          <>
            <View className="flex-1 bg-input p-4 rounded-2xl shadow-sm border border-app">
              <View className="bg-accent-light w-10 h-10 rounded-full items-center justify-center mb-3">
                <Feather name="users" size={20} className="text-accent" />
              </View>
              <Text className="text-2xl font-clash text-app">2</Text>
              <Text className="text-sm font-outfit text-secondary">
                Active Athletes
              </Text>
            </View>
            <View className="flex-1 bg-input p-4 rounded-2xl shadow-sm border border-app">
              <View className="bg-orange-50 dark:bg-orange-950/30 w-10 h-10 rounded-full items-center justify-center mb-3">
                <Feather name="calendar" size={20} color="#ea580c" />
              </View>
              <Text className="text-2xl font-clash text-app">3</Text>
              <Text className="text-sm font-outfit text-secondary">
                Events This Week
              </Text>
            </View>
          </>
        )}
      </View>

      <View>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold font-clash text-app">
            Today's Agenda
          </Text>
          <TouchableOpacity>
            <Text className="text-accent font-outfit text-sm">See All</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="bg-input p-4 rounded-2xl shadow-sm border-l-4 border-accent mb-3">
            <View className="flex-row justify-between mb-4">
              <Skeleton width="50%" height={20} />
              <Skeleton width="20%" height={20} />
            </View>
            <View className="flex-row items-center gap-2 mb-4">
              <Skeleton circle width={14} height={14} />
              <Skeleton width="60%" height={14} />
            </View>
            <View className="flex-row items-center gap-2">
              <Skeleton circle width={24} height={24} />
              <Skeleton width="40%" height={12} />
            </View>
          </View>
        ) : (
          <View className="bg-input p-4 rounded-2xl shadow-sm border-l-4 border-accent mb-3">
            <View className="flex-row justify-between mb-2">
              <Text className="font-bold font-outfit text-app">
                Soccer Practice
              </Text>
              <Text className="font-outfit text-accent bg-accent-light px-2 py-0.5 rounded text-xs">
                4:00 PM
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Feather name="map-pin" size={14} className="text-secondary" />
              <Text className="text-secondary text-sm font-outfit">
                City Sports Field
              </Text>
            </View>
            <View className="mt-3 flex-row items-center gap-2">
              <View className="h-6 w-6 bg-secondary rounded-full border border-app items-center justify-center">
                <Text className="text-[10px] font-bold text-secondary">JD</Text>
              </View>
              <Text className="text-xs text-muted font-outfit">
                John Doe attending
              </Text>
            </View>
          </View>
        )}
      </View>

      <View>
        <Text className="text-lg font-bold font-clash text-app mb-4">
          Quick Actions
        </Text>
        <View className="flex-row gap-4">
          <ActionButton
            icon="message-circle"
            label="Message Coach"
            color="bg-purple-50 dark:bg-purple-950/30"
            iconColor="#7e22ce"
          />
          <ActionButton
            icon="dollar-sign"
            label="Pay Fees"
            color="bg-green-50 dark:bg-green-950/30"
            iconColor="#15803d"
          />
          <ActionButton
            icon="file-text"
            label="Forms"
            color="bg-secondary"
            iconColor="text-secondary"
          />
        </View>
      </View>
    </>
  );
}
