import React, { useRef } from "react";
import { View, TextInput } from "react-native";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
}: OtpInputProps) {
  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const otpArray = value.split("");
    otpArray[index] = text;
    const newValue = otpArray.join("").slice(0, length);

    onChange(newValue);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: any,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center gap-4 -ml-1 m-4 w-full ">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputs.current[index] = ref;
          }}
          value={value[index] || ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          className="w-14 h-14 border border-zinc-700 bg-zinc-900 text-white text-xl font-bartle rounded-lg"
        />
      ))}
    </View>
  );
}
