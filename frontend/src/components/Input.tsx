import { View, Text, TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  className?: string;
  classNameLabel?: string;
  ref?: React.Ref<TextInput>;
};

export function Input({ label, className, classNameLabel, ref, ...rest }: InputProps) {
  return (
    <View className="gap-2">
      <Text className={`font-poppins_medium text-xl ${classNameLabel}`}>{label}</Text>
      <TextInput
        className={`h-12 rounded-lg border border-[#bbbbbb] px-3 py-2 font-poppins_regular ${className}`}
        ref={ref}
        {...rest}
        placeholderTextColor="#bbbbbb"
      />
    </View>
  );
}
