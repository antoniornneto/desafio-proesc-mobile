import { Container } from '@/components/Container';
import { useHome } from '@/hooks/useHome';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDocuments } from '@/hooks/useDocuments';
import { formatarData } from '@/utils/config';

export default function Home({ navigation }: any) {
  const { user, logOut } = useHome();
  const { documents } = useDocuments();

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
      <View>
        <Text className="font-poppins_bold text-4xl">Documentos</Text>
      </View>
      <ScrollView>
        <View className="gap-8">
          <View className="gap-2">
            <TouchableOpacity onPress={() => navigation.navigate('AvailableDocuments')}>
              <Text className="font-poppins_bold text-2xl text-[#1976d2] underline">
                Documentos Disponíveis
              </Text>
            </TouchableOpacity>
            {documents?.map((document) => (
              <View key={document.id}>
                <Text className="font-poppins_bold text-xl">- {document.title}</Text>
                <View className="flex-row">
                  <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]">
                    Enviado: {formatarData(document.date)} |{' '}
                  </Text>
                  <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]">
                    {document.size} | .{document.type.toUpperCase()}
                  </Text>
                  <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]"></Text>
                </View>
              </View>
            ))}
          </View>
          <View className="gap-2">
            <TouchableOpacity onPress={() => navigation.navigate('SentDocuments')}>
              <Text className="font-poppins_bold text-2xl text-[#1976d2] underline">
                Documentos Enviados
              </Text>
            </TouchableOpacity>
            {documents?.map((document) => (
              <View key={document.id}>
                <Text className="font-poppins_bold text-xl">- {document.title}</Text>
                <View className="flex-row">
                  <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]">
                    Enviado: {formatarData(document.date)} |{' '}
                  </Text>
                  <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]">
                    {document.size} | .{document.type.toUpperCase()}
                  </Text>
                  <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]"></Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
