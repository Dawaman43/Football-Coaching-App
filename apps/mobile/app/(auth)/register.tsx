import { Text, TextInput, View, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 24,
                }}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
            >
                <View className="mb-10">
                    <Text className="text-4xl font-bold text-slate-900 mb-2">
                        Create Account
                    </Text>
                    <Text className="text-base text-slate-500">
                        Sign up to get started on your journey.
                    </Text>
                </View>

                <View className="space-y-4 gap-4 mb-6">
                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14">
                        <Feather name="user" size={20} color="#64748b" />
                        <TextInput
                            className="flex-1 ml-3 text-slate-900 text-base"
                            placeholder="Full Name"
                            placeholderTextColor="#94a3b8"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </View>

                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14">
                        <Feather name="mail" size={20} color="#64748b" />
                        <TextInput
                            className="flex-1 ml-3 text-slate-900 text-base"
                            placeholder="Email Address"
                            placeholderTextColor="#94a3b8"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14">
                        <Feather name="lock" size={20} color="#64748b" />
                        <TextInput
                            className="flex-1 ml-3 text-slate-900 text-base"
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
                                color="#64748b"
                            />
                        </Pressable>
                    </View>

                    <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-4 h-14">
                        <Feather name="lock" size={20} color="#64748b" />
                        <TextInput
                            className="flex-1 ml-3 text-slate-900 text-base"
                            placeholder="Confirm Password"
                            placeholderTextColor="#94a3b8"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Feather
                                name={showConfirmPassword ? "eye" : "eye-off"}
                                size={20}
                                color="#64748b"
                            />
                        </Pressable>
                    </View>
                </View>

                <Pressable
                    className="flex-row items-center mb-8"
                    onPress={() => setIsChecked(!isChecked)}
                >
                    <View className={`w-6 h-6 rounded-md border items-center justify-center ${isChecked ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                        {isChecked && <Feather name="check" size={16} color="white" />}
                    </View>
                    <Text className="ml-3 text-slate-600 text-base">
                        I agree to the <Text className="text-indigo-600 font-bold">Terms & Conditions</Text>
                    </Text>
                </Pressable>

                <Pressable className="bg-indigo-600 h-14 rounded-xl items-center justify-center shadow-sm active:bg-indigo-700 mb-8">
                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                </Pressable>

                <View className="flex-row justify-center items-center">
                    <Text className="text-slate-500 text-base">
                        Already have an account?{" "}
                    </Text>
                    <Pressable onPress={() => router.back()}>
                        <Text className="text-indigo-600 font-bold text-base">
                            Log In
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
