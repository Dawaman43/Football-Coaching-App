import { useAppTheme } from "@/app/theme/AppThemeProvider";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const athleteRegisterSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.string().min(1, "Age is required"),
  team: z.string().min(1, "Team is required"),
  trainingDaysPerWeek: z.string().min(1, "Training days is required"),
  injuries: z.string().optional(),
  growthNotes: z.string().optional(),
  performanceGoals: z.string().optional(),
  equipmentAccess: z.string().optional(),
  isChecked: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and privacy policy",
  }),
});

type AthleteRegisterFormData = z.infer<typeof athleteRegisterSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AthleteRegisterFormData>({
    resolver: zodResolver(athleteRegisterSchema),
    defaultValues: {
      name: "",
      age: "",
      team: "",
      trainingDaysPerWeek: "",
      injuries: "",
      growthNotes: "",
      performanceGoals: "",
      equipmentAccess: "",
      isChecked: false,
    },
    mode: "onChange",
  });

  const onSubmit = (data: AthleteRegisterFormData) => {
    console.log("Athlete Registration submitted:", data);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-app">
      <View className="px-6 pt-4 mb-4">
        <Pressable
          onPress={() => router.navigate("/(tabs)/(onboarding)")}
          className="p-2 -ml-2 self-start"
        >
          <Feather
            name="arrow-left"
            size={24}
            color={isDark ? "#94a3b8" : "#64748b"}
          />
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
          <View>
            <View
              className={`flex-row items-center bg-input border ${errors.name ? "border-red-500" : "border-app"} rounded-xl px-4 h-14`}
            >
              <Feather
                name="user"
                size={20}
                color={errors.name ? "#ef4444" : isDark ? "#94a3b8" : "#64748b"}
              />
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 ml-3 text-app text-base font-outfit"
                    placeholder="Athlete Name"
                    placeholderTextColor="#94a3b8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
              />
            </View>
            {errors.name && (
              <Text className="text-red-500 text-xs font-outfit ml-2 mt-1">
                {errors.name.message}
              </Text>
            )}
          </View>

          <View>
            <View
              className={`flex-row items-center bg-input border ${errors.age ? "border-red-500" : "border-app"} rounded-xl px-4 h-14`}
            >
              <Feather
                name="calendar"
                size={20}
                color={errors.age ? "#ef4444" : isDark ? "#94a3b8" : "#64748b"}
              />
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 ml-3 text-app text-base font-outfit"
                    placeholder="Age"
                    placeholderTextColor="#94a3b8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            {errors.age && (
              <Text className="text-red-500 text-xs font-outfit ml-2 mt-1">
                {errors.age.message}
              </Text>
            )}
          </View>

          <View>
            <View
              className={`flex-row items-center bg-input border ${errors.team ? "border-red-500" : "border-app"} rounded-xl px-4 h-14`}
            >
              <Feather
                name="users"
                size={20}
                color={errors.team ? "#ef4444" : isDark ? "#94a3b8" : "#64748b"}
              />
              <Controller
                control={control}
                name="team"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 ml-3 text-app text-base font-outfit"
                    placeholder="Team and Level"
                    placeholderTextColor="#94a3b8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.team && (
              <Text className="text-red-500 text-xs font-outfit ml-2 mt-1">
                {errors.team.message}
              </Text>
            )}
          </View>

          <View>
            <View
              className={`flex-row items-center bg-input border ${errors.trainingDaysPerWeek ? "border-red-500" : "border-app"} rounded-xl px-4 h-14`}
            >
              <Feather
                name="activity"
                size={20}
                color={
                  errors.trainingDaysPerWeek
                    ? "#ef4444"
                    : isDark
                      ? "#94a3b8"
                      : "#64748b"
                }
              />
              <Controller
                control={control}
                name="trainingDaysPerWeek"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="flex-1 ml-3 text-app text-base font-outfit"
                    placeholder="Training days per week"
                    placeholderTextColor="#94a3b8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="numeric"
                  />
                )}
              />
            </View>
            {errors.trainingDaysPerWeek && (
              <Text className="text-red-500 text-xs font-outfit ml-2 mt-1">
                {errors.trainingDaysPerWeek.message}
              </Text>
            )}
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather
              name="alert-circle"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <Controller
              control={control}
              name="injuries"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 ml-3 text-app text-base font-outfit"
                  placeholder="Current or previous injuries"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>

          <View className="flex-row items-start pt-4 bg-input border border-app rounded-xl px-4 min-h-[56px] h-auto">
            <Feather
              name="file-text"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
              style={{ marginTop: 2 }}
            />
            <Controller
              control={control}
              name="growthNotes"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 ml-3 text-app text-base font-outfit leading-5"
                  placeholder="Growth notes (optional)"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                  style={{ textAlignVertical: "top" }}
                />
              )}
            />
          </View>

          <View className="flex-row items-start pt-4 bg-input border border-app rounded-xl px-4 min-h-[56px] h-auto">
            <Feather
              name="target"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
              style={{ marginTop: 2 }}
            />
            <Controller
              control={control}
              name="performanceGoals"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 ml-3 text-app text-base font-outfit leading-5"
                  placeholder="Performance goals"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={3}
                  style={{ textAlignVertical: "top" }}
                />
              )}
            />
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather
              name="tool"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <Controller
              control={control}
              name="equipmentAccess"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="flex-1 ml-3 text-app text-base font-outfit"
                  placeholder="Equipment access"
                  placeholderTextColor="#94a3b8"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        </View>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="bg-accent h-14 rounded-xl items-center justify-center mb-8 w-full"
        >
          <Text className="text-white font-bold text-lg font-outfit">
            Complete Registration
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
