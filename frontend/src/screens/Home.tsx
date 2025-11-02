import { Container } from '@/components/Container';
import { useHome } from '@/hooks/useHome';
import React from 'react';
import { Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home({ navigation }: any) {
  const { user, logOut } = useHome();

  if (!user) {
    return null;
  }

  return (
    <Container className="gap-8">
      <View className="flex-row justify-between">
        <Ionicons name="notifications" size={32} color="black" />
        <MaterialIcons name="logout" size={32} color="black" onPress={logOut} />
      </View>
      <View className="rounded-3xl bg-[#8B9E9B] p-4">
        <Text className="font-poppins_bold text-xl">{user.nome}</Text>
        <Text className="font-poppins_medium text-sm text-black/60">{user.matricula}</Text>
        <Text className="font-poppins_medium text-sm text-black/60">
          {`${user.cursoAno.split(' do ')[0]} ${user.turma} - Turno ${user.turno}`}
        </Text>
      </View>
    </Container>
  );
}
