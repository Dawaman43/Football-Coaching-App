import { PinModal } from "@/components/PinModal";
import { useRole } from "@/context/RoleContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export function RoleSwitcher() {
  const { role, setRole, guardianPin, checkPin } = useRole();
  const initialWidth = Dimensions.get("window").width - 56;
  const [containerWidth, setContainerWidth] = React.useState(initialWidth);

  const activeIndex = useSharedValue(role === "Guardian" ? 0 : 1);

  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pinError, setPinError] = useState<string | undefined>();

  useEffect(() => {
    activeIndex.value = withSpring(role === "Guardian" ? 0 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [role]);

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handleRoleChange = (newRole: "Guardian" | "Athlete") => {
    if (role === newRole) return;

    if (newRole === "Guardian" && guardianPin) {
      setPinError(undefined);
      setIsPinModalVisible(true);
      return;
    }

    performRoleSwitch(newRole);
  };

  const performRoleSwitch = (newRole: "Guardian" | "Athlete") => {
    if (process.env.EXPO_OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRole(newRole);
  };

  const handlePinSuccess = (pin: string) => {
    if (checkPin(pin)) {
      setIsPinModalVisible(false);
      performRoleSwitch("Guardian");
    } else {
      setPinError("Incorrect PIN");
    }
  };

  const indicatorWidth = containerWidth ? (containerWidth - 8) / 2 : 0;

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(activeIndex.value * indicatorWidth, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
      width: indicatorWidth,
      backgroundColor: "#3b82f6",
    };
  });

  return (
    <View className="mb-0 overflow-hidden">
      <View className="flex-row items-center justify-between mb-4 px-1">
        <View className="flex-row items-center gap-3">
          <View className="bg-gray-900 p-2.5 rounded-full shadow-sm">
            <Feather name="repeat" size={18} color="#ffffff" />
          </View>
          <View>
            <Text className="text-lg font-bold font-clash text-gray-900 leading-tight">
              Switch Profile
            </Text>
            <Text className="text-xs font-outfit text-gray-500 font-medium tracking-wide">
              MANAGE APP AS
            </Text>
          </View>
        </View>
      </View>

      <View
        className="flex-row bg-gray-100 rounded-3x p-4 border border-gray-200 shadow-inner relative h-[64px] items-center"
        onLayout={handleLayout}
      >
        {containerWidth > 0 && (
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 1,
                bottom: 1,
                left: 1,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "rgba(243, 244, 246, 0.5)", // gray-100/50
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.05,
                shadowRadius: 1,
                elevation: 1,
              },
              animatedIndicatorStyle,
            ]}
          />
        )}

        <RoleOption
          label="Guardian"
          icon="shield"
          isActive={role === "Guardian"}
          onPress={() => handleRoleChange("Guardian")}
        />
        <RoleOption
          label="Athlete"
          icon="activity"
          isActive={role === "Athlete"}
          onPress={() => handleRoleChange("Athlete")}
        />
      </View>

      <PinModal
        visible={isPinModalVisible}
        onClose={() => setIsPinModalVisible(false)}
        onSuccess={handlePinSuccess}
        title="Enter Guardian PIN"
        subtitle="Enter your PIN to switch to Guardian mode"
        error={pinError}
      />
    </View>
  );
}

function RoleOption({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: any;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 h-full flex-row items-center justify-center gap-2 z-10"
      hitSlop={8}
    >
      <Feather name={icon} size={18} color={isActive ? "#ffffff" : "#6b7280"} />
      <Text
        className={`font-semibold font-outfit text-base ${
          isActive ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
