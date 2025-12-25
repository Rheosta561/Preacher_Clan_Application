import React from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

interface InsightCardSkeletonProps {
  withImage?: boolean;
}

const InsightCardSkeleton: React.FC<InsightCardSkeletonProps> = ({ withImage = true }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 500 }}
      className="bg-zinc-950 border border-zinc-900 rounded-xl max-w-md overflow-hidden p-0"
    >
      {/* Image Skeleton */}
      {withImage && (
        <Skeleton
          colorMode="dark"
          radius={0}
          height={180}
          width="100%"
        />
      )}

      <View className="p-6">
        {/* Icon placeholder */}
        <View className="absolute right-6 top-6">
          <Skeleton
            colorMode="dark"
            height={24}
            width={24}
            radius={6}
          />
        </View>

        {/* Title */}
        <View className="mb-4">
          <Skeleton colorMode="dark" height={28} width="70%" radius={8} />
        </View>

        {/* Insight lines */}
        <View className="mb-2">
          <Skeleton colorMode="dark" height={18} width="100%" radius={6} />
        </View>
        <View className="mb-3">
          <Skeleton colorMode="dark" height={18} width="90%" radius={6} />
        </View>

        {/* Footer */}
        <Skeleton colorMode="dark" height={14} width="50%" radius={6} />
      </View>
    </MotiView>
  );
};

export default InsightCardSkeleton;
