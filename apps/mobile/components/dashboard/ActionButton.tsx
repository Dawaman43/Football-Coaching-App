import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ActionButtonProps {
  icon: any;
  label: string;
  color: string;
  iconColor: string;
  onPress?: () => void;
}

export function ActionButton({
  icon,
  label,
  color,
  iconColor,
  onPress,
}: ActionButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-1 items-center gap-2">
      <View
        className={`w-14 h-14 ${color} rounded-2xl items-center justify-center`}
      >
        <Feather
          name={icon}
          size={24}
          color={iconColor.startsWith("#") ? iconColor : undefined}
          className={!iconColor.startsWith("#") ? iconColor : undefined}
        />
      </View>
      <Text className="text-xs font-medium font-outfit text-secondary text-center">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
