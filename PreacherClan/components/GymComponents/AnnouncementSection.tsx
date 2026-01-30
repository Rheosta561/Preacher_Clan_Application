import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import AnnouncementCard from "./AnnouncementCard";

type AnnouncementType = "warning" | "info" | "alert";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  date: string; // ISO string
  footer?: string;
}

type DateFilter = "today" | "week" | "all";

/* ================= MOCK DATA ================= */

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "High Crowd Alert",
    message: "Gym capacity is almost full. Expect waiting time.",
    type: "warning",
    date: "2026-01-24T10:30:00",
  },
  {
    id: "2",
    title: "Emergency Maintenance",
    message: "Gym will be closed today from 6–8 PM.",
    type: "alert",
    date: "2026-01-23T17:45:00",
    footer: "Issued by Admin",
  },
  {
    id: "3",
    title: "Trainer Booking Live",
    message: "Book trainers directly from the app.",
    type: "info",
    date: "2026-01-18T09:00:00",
  },
];

/* ================= COMPONENT ================= */

const AnnouncementsSection = () => {
  const [filter, setFilter] = useState<DateFilter>("today");

  const filteredAnnouncements = useMemo(() => {
    const now = new Date();

    return ANNOUNCEMENTS.filter((a) => {
      const date = new Date(a.date);

      if (filter === "today") {
        return date.toDateString() === now.toDateString();
      }

      if (filter === "week") {
        const diff =
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7;
      }

      return true;
    });
  }, [filter]);

  return (
    <View className="flex-1">
      {/* ================= FILTER ================= */}
      <View className="flex flex-row gap-2 mb-4">
        {(["today", "week", "all"] as DateFilter[]).map((f) => (
          <Pressable
            key={f}
            onPress={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-lg border
              ${
                filter === f
                  ? "bg-zinc-800 border-zinc-700"
                  : "bg-zinc-950 border-zinc-800"
              }
            `}
          >
            <Text
              className={`text-sm font-ScienceGothic ${
                filter === f ? "text-white" : "text-zinc-400"
              }`}
            >
              {f === "today"
                ? "Today"
                : f === "week"
                ? "This Week"
                : "All"}
            </Text>
          </Pressable>
        ))}
      </View>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}

      >
        {filteredAnnouncements.length === 0 ? (
          <Text className="text-zinc-500 text-center mt-10 font-ScienceGothic">
            No announcements found
          </Text>
        ) : (
          filteredAnnouncements.map((item) => (
            <AnnouncementCard
              key={item.id}
              title={item.title}
              message={item.message}
              type={item.type}
              date={item.date}   
              footer={item.footer}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default AnnouncementsSection;
