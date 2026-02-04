import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface PinModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => void;
  title?: string;
  subtitle?: string;
  error?: string;
}

export function PinModal({
  visible,
  onClose,
  onSuccess,
  title = "Enter PIN",
  subtitle = "Please enter your 4-digit PIN",
  error,
}: PinModalProps) {
  const [pin, setPin] = useState("");
  const shakeOffset = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setPin("");
    }
  }, [visible]);

  useEffect(() => {
    if (error) {
      shake();
      setPin("");
    }
  }, [error]);

  const shake = () => {
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 5, true),
      withTiming(0, { duration: 50 }),
    );
  };

  const handleNumberPress = (number: string) => {
    if (pin.length < 4) {
      const newPin = pin + number;
      setPin(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          onSuccess(newPin);
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeOffset.value }],
    };
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <Animated.View
          style={animatedStyle}
          className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-xl"
        >
          <View className="flex-row justify-end mb-2">
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 items-center justify-center bg-gray-100 rounded-full"
            >
              <Feather name="x" size={16} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-4">
              <Feather name="lock" size={24} color="#3b82f6" />
            </View>
            <Text className="text-xl font-bold font-clash text-gray-900 mb-2">
              {title}
            </Text>
            <Text className="text-gray-500 font-outfit text-center">
              {error ? (
                <Text className="text-red-500 font-medium">{error}</Text>
              ) : (
                subtitle
              )}
            </Text>
          </View>

          <View className="flex-row justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                className={`w-14 h-16 rounded-2xl border-2 justify-center items-center ${
                  pin.length > index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                {pin.length > index && (
                  <Text className="text-2xl font-bold font-clash text-gray-900">
                    {pin[index]}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View className="gap-4 px-2">
            <View className="flex-row justify-between gap-4">
              <KeypadButton number="1" onPress={() => handleNumberPress("1")} />
              <KeypadButton number="2" onPress={() => handleNumberPress("2")} />
              <KeypadButton number="3" onPress={() => handleNumberPress("3")} />
            </View>
            <View className="flex-row justify-between gap-4">
              <KeypadButton number="4" onPress={() => handleNumberPress("4")} />
              <KeypadButton number="5" onPress={() => handleNumberPress("5")} />
              <KeypadButton number="6" onPress={() => handleNumberPress("6")} />
            </View>
            <View className="flex-row justify-between gap-4">
              <KeypadButton number="7" onPress={() => handleNumberPress("7")} />
              <KeypadButton number="8" onPress={() => handleNumberPress("8")} />
              <KeypadButton number="9" onPress={() => handleNumberPress("9")} />
            </View>
            <View className="flex-row justify-between gap-4">
              <View className="flex-1" />
              <KeypadButton number="0" onPress={() => handleNumberPress("0")} />
              <TouchableOpacity
                onPress={handleDelete}
                className="flex-1 h-14 items-center justify-center active:opacity-50"
              >
                <Feather name="delete" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function KeypadButton({
  number,
  onPress,
}: {
  number: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 h-14 items-center justify-center bg-gray-50 rounded-xl active:bg-gray-200"
    >
      <Text className="text-2xl font-semibold font-outfit text-gray-900">
        {number}
      </Text>
    </TouchableOpacity>
  );
}
