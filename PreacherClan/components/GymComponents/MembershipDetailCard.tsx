import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { Info } from "lucide-react-native";

interface Props {
  membershipName: string;
  startDate: string | Date;
  endDate: string | Date;
  onRenew: () => void;
  onInfoPress: () => void;
}

/* ================= UTILS ================= */

const toDate = (d: string | Date) =>
  typeof d === "string" ? new Date(d) : d;

const diffInDays = (a: Date, b: Date) =>
  Math.max(
    Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)),
    0
  );

/* ================= COMPONENT ================= */

const MembershipDetailCard: React.FC<Props> = ({
  membershipName,
  startDate,
  endDate,
  onRenew,
  onInfoPress,
}) => {
  const { percentLeft, daysLeft } = useMemo(() => {
    const start = toDate(startDate);
    const end = toDate(endDate);
    const now = new Date();

    const totalDays = diffInDays(start, end);
    const remainingDays = diffInDays(now, end);

    return {
      daysLeft: remainingDays,
      percentLeft:
        totalDays === 0
          ? 0
          : Math.round((remainingDays / totalDays) * 100),
    };
  }, [startDate, endDate]);

  const barColor =
    percentLeft > 50
      ? "bg-emerald-500"
      : percentLeft > 20
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-3">
        <Text className="text-white text-xl font-semibold font-ScienceGothic">
          {membershipName}
        </Text>

        <Pressable onPress={onInfoPress} hitSlop={8}>
          <Info size={20} color="#a1a1aa" />
        </Pressable>
      </View>

      {/* Days Left */}
      <Text className="text-zinc-400 text-sm mb-2 font-ScienceGothic">
        {daysLeft} days remaining
      </Text>

      {/* Progress Bar */}
      <View className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden mb-4">
        <View
          className={`${barColor} h-full`}
          style={{ width: `${percentLeft}%` }}
        />
      </View>

      {/* Footer */}
      <View className="flex flex-row justify-between items-center">
        <Text className="text-zinc-500 text-xs font-ScienceGothic">
          {percentLeft}% time left
        </Text>

        <Pressable
          onPress={onRenew}
          className="bg-zinc-800 px-4 py-2 rounded-md"
        >
          <Text className="text-white text-sm font-ScienceGothic">
            Renew
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default MembershipDetailCard;
