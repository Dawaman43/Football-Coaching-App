import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../theme/AppThemeProvider";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();
  const { isDark, toggleColorScheme } = useAppTheme();

  return (
    <SafeAreaView className="flex-1 bg-app">
      <View className="px-4 pt-4 flex-row justify-end">
        <Pressable onPress={toggleColorScheme} className="p-2">
          <Feather
            name={isDark ? "sun" : "moon"}
            size={24}
            color={isDark ? "#FCD34D" : "#4F46E5"}
          />
        </Pressable>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
      >
        <View className="mb-10">
          <Text className="text-4xl font-telma-bold text-app mb-2">
            Create Account
          </Text>
          <Text className="text-base font-outfit text-secondary">
            Sign up to get started on your journey.
          </Text>
        </View>

        <View className="space-y-4 gap-4 mb-6">
          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather
              name="user"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Full Name"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather
              name="mail"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Email Address"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather
              name="lock"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color={isDark ? "#94a3b8" : "#64748b"}
              />
            </Pressable>
          </View>

          <View className="flex-row items-center bg-input border border-app rounded-xl px-4 h-14">
            <Feather
              name="lock"
              size={20}
              color={isDark ? "#94a3b8" : "#64748b"}
            />
            <TextInput
              className="flex-1 ml-3 text-app text-base font-outfit"
              placeholder="Confirm Password"
              placeholderTextColor="#94a3b8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Feather
                name={showConfirmPassword ? "eye" : "eye-off"}
                size={20}
                color={isDark ? "#94a3b8" : "#64748b"}
              />
            </Pressable>
          </View>
        </View>

        <Pressable
          className="flex-row items-center mb-8"
          onPress={() => setIsChecked(!isChecked)}
        >
          <View
            className={`w-6 h-6 rounded-md border items-center justify-center ${isChecked ? "bg-accent border-accent" : "bg-input border-app"}`}
          >
            {isChecked && <Feather name="check" size={16} color="white" />}
          </View>
          <Text className="ml-3 text-secondary text-base font-outfit">
            I agree to the{" "}
            <Pressable onPress={() => router.push("/terms")}>
              <Text className="text-accent font-bold">Terms & Conditions</Text>
            </Pressable>
          </Text>
        </Pressable>

        <Pressable className="bg-accent h-14 rounded-xl items-center justify-center shadow-sm active:opacity-90 mb-8">
          <Text className="text-white font-bold text-lg font-outfit">
            Sign Up
          </Text>
        </Pressable>

        <View className="flex-row justify-center items-center">
          <Text className="text-secondary text-base font-outfit">
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-accent font-bold text-base font-outfit">
              Log In
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
