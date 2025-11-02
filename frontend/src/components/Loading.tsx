import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export type LoadingProps = {
  textColor: 'text-white' | 'text-black';
  spingColor: 'black' | 'white';
};

export const Loading = ({ textColor = 'text-black', spingColor = 'black' }: LoadingProps) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <View className="flex-row justify-center gap-2">
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <AntDesign name="loading" size={24} color={spingColor} />
      </Animated.View>
      <Text className={`font-poppins_medium text-xl ${textColor}`}>Carregando</Text>
    </View>
  );
};
