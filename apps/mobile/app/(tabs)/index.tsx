import { RoleSwitcher } from "@/components/RoleSwitcher";
import { useRole } from "@/context/RoleContext";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { role } = useRole();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-6 pb-4 bg-white rounded-b-[32px] shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="font-outfit text-gray-400 text-sm mb-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </Text>
              <Text className="font-clash text-2xl text-gray-900">
                Hi,{" "}
                <Text className="text-blue-600">
                  {role === "Guardian" ? "Parent" : "Athlete"}
                </Text>
              </Text>
            </View>
            <View className="h-12 w-12 bg-gray-100 rounded-full items-center justify-center border border-gray-200">
              <Feather name="user" size={20} color="#374151" />
            </View>
          </View>

          <RoleSwitcher />
        </View>

        <View className="px-6 gap-6">
          {role === "Guardian" ? <GuardianDashboard /> : <AthleteDashboard />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function GuardianDashboard() {
  return (
    <>
      <View className="flex-row gap-4">
        <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <View className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center mb-3">
            <Feather name="users" size={20} color="#2563eb" />
          </View>
          <Text className="text-2xl font-clash text-gray-900">2</Text>
          <Text className="text-sm font-outfit text-gray-500">
            Active Athletes
          </Text>
        </View>
        <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <View className="bg-orange-50 w-10 h-10 rounded-full items-center justify-center mb-3">
            <Feather name="calendar" size={20} color="#ea580c" />
          </View>
          <Text className="text-2xl font-clash text-gray-900">3</Text>
          <Text className="text-sm font-outfit text-gray-500">
            Events This Week
          </Text>
        </View>
      </View>

      <View>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold font-clash text-gray-900">
            Today's Agenda
          </Text>
          <TouchableOpacity>
            <Text className="text-blue-600 font-outfit text-sm">See All</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-blue-500 mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="font-bold font-outfit text-gray-900">
              Soccer Practice
            </Text>
            <Text className="font-outfit text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs">
              4:00 PM
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Feather name="map-pin" size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm font-outfit">
              City Sports Field
            </Text>
          </View>
          <View className="mt-3 flex-row items-center gap-2">
            <View className="h-6 w-6 bg-gray-200 rounded-full border border-white items-center justify-center">
              <Text className="text-[10px] font-bold text-gray-600">JD</Text>
            </View>
            <Text className="text-xs text-gray-400 font-outfit">
              John Doe attending
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text className="text-lg font-bold font-clash text-gray-900 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row gap-4">
          <ActionButton
            icon="message-circle"
            label="Message Coach"
            color="bg-purple-50"
            iconColor="#7e22ce"
          />
          <ActionButton
            icon="dollar-sign"
            label="Pay Fees"
            color="bg-green-50"
            iconColor="#15803d"
          />
          <ActionButton
            icon="file-text"
            label="Forms"
            color="bg-gray-50"
            iconColor="#4b5563"
          />
        </View>
      </View>
    </>
  );
}

function AthleteDashboard() {
  return (
    <>
      <View className="bg-gray-900 p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <View className="absolute -right-10 -top-10 w-40 h-40 bg-gray-800 rounded-full opacity-50" />

        <Text className="text-gray-400 font-outfit text-sm mb-1">
          Next Session
        </Text>
        <Text className="text-white font-clash text-2xl mb-4">
          Goalkeeper Training
        </Text>

        <View className="flex-row gap-4 mb-6">
          <View className="bg-gray-800 px-3 py-1.5 rounded-lg flex-row items-center gap-2">
            <Feather name="clock" size={14} color="#e5e7eb" />
            <Text className="text-gray-200 text-xs font-outfit">
              Tomorrow, 9:00 AM
            </Text>
          </View>
          <View className="bg-gray-800 px-3 py-1.5 rounded-lg flex-row items-center gap-2">
            <Feather name="map-pin" size={14} color="#e5e7eb" />
            <Text className="text-gray-200 text-xs font-outfit">
              Main Pitch
            </Text>
          </View>
        </View>

        <TouchableOpacity className="bg-blue-600 py-3 rounded-xl items-center">
          <Text className="text-white font-bold font-outfit">Check In</Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text className="text-lg font-bold font-clash text-gray-900 mb-4">
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
        <Text className="text-lg font-bold font-clash text-gray-900 mb-4">
          Recent Feedback
        </Text>
        <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <View className="flex-row gap-3 mb-2">
            <View className="h-10 w-10 bg-gray-100 rounded-full items-center justify-center">
              <Text className="font-bold text-gray-600">CO</Text>
            </View>
            <View>
              <Text className="font-bold font-outfit text-gray-900">
                Coach Oliver
              </Text>
              <Text className="text-xs text-gray-500 font-outfit">
                2 days ago
              </Text>
            </View>
          </View>
          <Text className="text-gray-600 font-outfit text-sm">
            "Great work on your positioning today, keep practicing those high
            catches!"
          </Text>
        </View>
      </View>
    </>
  );
}

function ActionButton({
  icon,
  label,
  color,
  iconColor,
}: {
  icon: any;
  label: string;
  color: string;
  iconColor: string;
}) {
  return (
    <TouchableOpacity className="flex-1 items-center gap-2">
      <View
        className={`w-14 h-14 ${color} rounded-2xl items-center justify-center`}
      >
        <Feather name={icon} size={24} color={iconColor} />
      </View>
      <Text className="text-xs font-medium font-outfit text-gray-700 text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function StatCard({
  label,
  value,
  trend,
  good,
}: {
  label: string;
  value: string;
  trend: string;
  good: boolean;
}) {
  return (
    <View className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-1 min-w-[100px]">
      <Text className="text-gray-400 text-xs font-outfit mb-1">{label}</Text>
      <Text className="text-2xl font-bold font-clash text-gray-900 mb-2">
        {value}
      </Text>
      <View
        className={`self-start px-2 py-0.5 rounded ${good ? "bg-green-50" : "bg-gray-50"}`}
      >
        <Text
          className={`text-xs font-medium ${good ? "text-green-700" : "text-gray-500"}`}
        >
          {trend}
        </Text>
      </View>
    </View>
  );
}
