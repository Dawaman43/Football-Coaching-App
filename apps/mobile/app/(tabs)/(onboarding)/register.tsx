import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [team, setTeam] = useState("");
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState("");
  const [injuries, setInjuries] = useState("");
  const [growthNotes, setGrowthNotes] = useState("");
  const [performanceGoals, setPerformanceGoals] = useState("");
  const [equipmentAccess, setEquipmentAccess] = useState("");

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-app">
      <View className="px-6 pt-4 mb-4">
        <Pressable
          onPress={() => router.back()}
          className="p-2 -ml-2 self-start"
        >
          <Feather name="arrow-left" size={24} color="#64748b" />
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        <View className="mb-8">
          <Text className="text-4xl font-clash text-app mb-2">
            Athlete Profile
          </Text>
          <Text className="text-base font-outfit text-secondary">
            Enter your child's details to personalize their training plan.
          </Text>
        </View>

        <View className="gap-4 mb-8">
          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather name="user" size={20} color="#64748b" />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Athlete Name"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather name="calendar" size={20} color="#64748b" />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Age"
              placeholderTextColor="#94a3b8"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather name="users" size={20} color="#64748b" />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Team and Level"
              placeholderTextColor="#94a3b8"
              value={team}
              onChangeText={setTeam}
            />
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather name="activity" size={20} color="#64748b" />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Training days per week"
              placeholderTextColor="#94a3b8"
              value={trainingDaysPerWeek}
              onChangeText={setTrainingDaysPerWeek}
              keyboardType="numeric"
            />
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather name="alert-circle" size={20} color="#64748b" />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Current or previous injuries"
              placeholderTextColor="#94a3b8"
              value={injuries}
              onChangeText={setInjuries}
            />
          </View>

          <View className="flex-row items-start pt-4 bg-input border border-app rounded-xl px-4 min-h-[56px] h-auto">
            <Feather
              name="file-text"
              size={20}
              color="#64748b"
              style={{ marginTop: 2 }}
            />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit leading-5"
              placeholder="Growth notes (optional)"
              placeholderTextColor="#94a3b8"
              value={growthNotes}
              onChangeText={setGrowthNotes}
              multiline
              numberOfLines={3}
              style={{ textAlignVertical: "top" }}
            />
          </View>

          <View className="flex-row items-start pt-4 bg-input border border-app rounded-xl px-4 min-h-[56px] h-auto">
            <Feather
              name="target"
              size={20}
              color="#64748b"
              style={{ marginTop: 2 }}
            />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit leading-5"
              placeholder="Performance goals"
              placeholderTextColor="#94a3b8"
              value={performanceGoals}
              onChangeText={setPerformanceGoals}
              multiline
              numberOfLines={3}
              style={{ textAlignVertical: "top" }}
            />
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather name="tool" size={20} color="#64748b" />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Equipment access"
              placeholderTextColor="#94a3b8"
              value={equipmentAccess}
              onChangeText={setEquipmentAccess}
            />
          </View>
        </View>

        {/* Legal Acceptance */}
        <Pressable
          onPress={() => {}}
          className="flex-row items-start mb-8 gap-3"
        >
          <Feather
            name="square"
            size={20}
            color="#64748b"
            style={{ marginTop: 2 }}
          />
          <Text className="flex-1 text-secondary font-outfit leading-5">
            I accept the{" "}
            <Text className="font-bold text-app">Terms and Conditions</Text> and{" "}
            <Text className="font-bold text-app">Privacy Policy</Text>.
          </Text>
        </Pressable>

        <Pressable className="bg-accent h-14 rounded-xl items-center justify-center mb-8 w-full">
          <Text className="text-white font-bold text-lg font-outfit">
            Complete Registration
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
