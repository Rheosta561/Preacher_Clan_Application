import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import NotificationCard from "@/components/Notification/NotificationCard";
import Navbar from "@/components/Utility/Navbar";
import { useNotification } from "@/context/NotificationContext";

/* ================= FILTER TABS ================= */

type FilterType = "today" | "week" | "all";

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "all", label: "All" },
];

/* ================= DATE UTILS ================= */

const isToday = (date: Date) => {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const isThisWeek = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff <= 7 * 24 * 60 * 60 * 1000;
};

/* ================= SCREEN ================= */

const NotificationScreen: React.FC = () => {
  const { notifications, markAllRead } = useNotification();
  const [activeFilter, setActiveFilter] =
    useState<FilterType>("today");

// mark all read on opening 
  useEffect(() => {
    markAllRead();
  }, []);

// filtered data 
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const date = new Date(n.createdAt || Date.now());

      if (activeFilter === "today") return isToday(date);
      if (activeFilter === "week") return isThisWeek(date);
      return true;
    });
  }, [notifications, activeFilter]);

  return (
    <View className="flex-1 bg-zinc-950">


      

      {/* FILTER TABS */}
      <View className="flex-row px-4 mb-4">
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setActiveFilter(f.key)}
            className={`flex-1 py-2 mx-1 rounded-md ${
              activeFilter === f.key
                ? "bg-zinc-800"
                : "bg-zinc-900"
            }`}
          >
            <Text
              className={`text-center font-ScienceGothic ${
                activeFilter === f.key
                  ? "text-white"
                  : "text-zinc-400"
              }`}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* NOTIFICATIONS LIST */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}

      >
        {filteredNotifications.length === 0 ? (
          <View className="items-center mt-16">
            <Text className="text-zinc-500 font-ScienceGothic">
              No notifications here.
            </Text>
          </View>
        ) : (
          <View className="px-4 flex flex-col gap-1">
            {filteredNotifications.map((n, idx) => (
              <NotificationCard
                key={n._id || idx}
                message={n.message}
                type={n.type || "info"}
                date={n.createdAt || new Date()}
                isRead={n.isRead}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
