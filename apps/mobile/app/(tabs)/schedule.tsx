import { useRole } from "@/context/RoleContext";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScheduleScreen() {
  const { role } = useRole();

  return (
    <SafeAreaView className="flex-1 bg-app">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-4xl font-clash text-app mb-4">
          {role === "Guardian" ? "Family Schedule" : "My Training"}
        </Text>
        <Text className="text-lg font-outfit text-secondary text-center">
          {role === "Guardian"
            ? "View and manage events for all your athletes."
            : "See your upcoming practice sessions and games."}
        </Text>
      </View>
    </SafeAreaView>
  );
}
