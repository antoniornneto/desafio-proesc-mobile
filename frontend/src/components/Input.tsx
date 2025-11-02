import { View, Text, TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label: string;
  className?: string;
  ref?: React.Ref<TextInput>;
};

export function Input({ label, className, ref, ...rest }: InputProps) {
  return (
    <View className="gap-2">
      <Text className="font-poppins_medium text-xl">{label}</Text>
      <TextInput
        className={`font-poppins_regular h-12 rounded-lg border border-[#bbbbbb] px-3 py-2 ${className}`}
        ref={ref}
        {...rest}
        placeholderTextColor="#bbbbbb"
      />
    </View>
  );
}
