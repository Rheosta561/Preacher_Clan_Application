import React, { useRef, useState, useEffect } from "react";
import { View, FlatList, Dimensions } from "react-native";
import SuggestedSplitCard from "./SuggestedSplitCard";
import { WorkoutSplit } from "@/constants/split";

const { width } = Dimensions.get("window");

interface Props {
  splits: WorkoutSplit[];
  onUseSplit?: (split : WorkoutSplit) => void;
  onOpenSplit?: (split: WorkoutSplit) => void;
  splitInUseId : string ;
}

const AUTO_SCROLL_INTERVAL = 4500;
const CARD_WIDTH = width * 0.90; 
const SPACER_WIDTH = (width - CARD_WIDTH) / 2;

const SuggestedSplits = ({ splits, onUseSplit, onOpenSplit , splitInUseId }: Props) => {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const isAuto = useRef(true);

//   console.log(' Suggested splits slider , split in use ' , splitInUseId)

  /* ---------- AUTO SCROLL ---------- */
  useEffect(() => {
    if (!splits.length) return;

    const timer = setInterval(() => {
      if (!isAuto.current) return;

      const next = (index + 1) % splits.length;
      setIndex(next);

      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timer);
  }, [index, splits.length]);

  /* ---------- HANDLE USER SWIPE ---------- */
  const handleScrollEnd = (e: any) => {
    const newIndex = Math.round(
      e.nativeEvent.contentOffset.x / CARD_WIDTH
    );

    if (newIndex !== index) setIndex(newIndex);

    // resume auto scroll
    setTimeout(() => (isAuto.current = true), 1000);
  };

  return (
    <View className="mt-4">
      <FlatList
        ref={flatListRef}
        data={splits}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        keyExtractor={(item) => item.split_id}
        contentContainerStyle={{
          paddingHorizontal: SPACER_WIDTH,
        }}
        renderItem={({ item }) => (
          <SuggestedSplitCard
            split={item}
            onUseSplit={onUseSplit}
            onOpenSplit={onOpenSplit}
            splitInUseId ={splitInUseId}


          />
        )}
        onScrollBeginDrag={() => {
          // stop auto scroll when user touches
          isAuto.current = false;
        }}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, i) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * i,
          index: i,
        })}
        initialScrollIndex={0}
      />
    </View>
  );
};

export default SuggestedSplits;
