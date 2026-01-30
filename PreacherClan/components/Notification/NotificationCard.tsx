import React from "react";
import { View, Text } from "react-native";
import {
  AlertTriangle,
  Info,
  Bell,
} from "lucide-react-native";

interface Props {
  message: string;
  type: "info" | "warning" | "error";
  date: string | Date;
  isRead?: boolean;
}

/* ================= CONFIG ================= */

const CONFIG = {
  info: {
    icon: Info,
    iconColor: "#3b82f6",
    border: "border-blue-600/40",
    bg: "bg-blue-500/5",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "#f97316",
    border: "border-orange-600/40",
    bg: "bg-orange-500/5",
  },
  error: {
    icon: Bell,
    iconColor: "#ef4444",
    border: "border-red-600/40",
    bg: "bg-red-500/5",
  },
};

/* ================= UTILS ================= */

const formatDate = (date: string | Date) => {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ================= COMPONENT ================= */

const NotificationCard: React.FC<Props> = ({
  message,
  type,
  date,
  isRead = false,
}) => {
  const Icon = CONFIG[type].icon;

  return (
    <View
      className={`
        bg-zinc-950
        ${CONFIG[type].bg}
        border
        ${CONFIG[type].border}
        rounded-lg
        p-5
        ${!isRead ? "border-l-4" : ""}
      `}
    >
      {/* Header */}
      <View className="flex flex-row items-start justify-between mb-2">
        <View className="flex flex-row items-center gap-2">
          <Icon size={20} color={CONFIG[type].iconColor} />
          <Text className="text-white text-base font-semibold font-ScienceGothic">
            Notification
          </Text>

          {!isRead && (
            <View className="h-2 w-2 rounded-full bg-red-500" />
          )}
        </View>

        <Text className="text-zinc-500 text-xs font-ScienceGothic mt-1">
          {formatDate(date)}
        </Text>
      </View>

      {/* Message */}
      <Text className="text-zinc-300 font-ScienceGothic">
        {message}
      </Text>
    </View>
  );
};

export default NotificationCard;
