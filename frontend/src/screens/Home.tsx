import { Container } from '@/components/Container';
import { useHome } from '@/hooks/useHome';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { formatarData } from '@/utils/config';
import { FileStatus } from '@/components/FileStatus';

export default function Home({ navigation }: any) {
  const { user, logOut, refreshing, onRefresh, documents, sentDocuments, autoUpdateStatusFile } =
    useHome();

  const [sentDocsLocal, setSentDocsLocal] = useState(sentDocuments || []);

  useEffect(() => {
    setSentDocsLocal(sentDocuments || []);
  }, [sentDocuments]);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, [onRefresh])
  );

  useEffect(() => {
    if (sentDocuments && sentDocuments.length > 0) {
      sentDocuments.forEach((doc) => {
        if (doc.status === 'enviado') {
          autoUpdateStatusFile(doc.id, { inicio: 5000, analise: 4000 }, onRefresh);
        }
      });
    }
  }, [sentDocuments, autoUpdateStatusFile]);

  if (!user) return null;

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
        <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]">
          As listas abaixo mostram os 3 últimos documentos postados e enviados.
        </Text>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="gap-8">
          {/* Documentos Disponíveis */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => navigation.navigate('AvailableDocuments')}>
              <Text className="font-poppins_bold text-2xl text-[#1976d2] underline">
                Documentos Disponíveis <Text>({documents?.length})</Text>
              </Text>
            </TouchableOpacity>

            {(documents || []).length > 0 ? (
              (documents || [])
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3)
                .map((document) => (
                  <View key={document.id}>
                    <Text className="font-poppins_bold text-xl">{document.title}</Text>
                    <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]">
                      {`${formatarData(document.date)} | ${document.size}`}
                    </Text>
                  </View>
                ))
            ) : (
              <Text className="font-poppins_regular text-zinc-400">Sem documentos.</Text>
            )}
          </View>

          {/* Documentos Enviados */}
          <View className="gap-2">
            <TouchableOpacity onPress={() => navigation.navigate('SentDocuments')}>
              <Text className="font-poppins_bold text-2xl text-[#1976d2] underline">
                Documentos Enviados <Text>({sentDocsLocal?.length})</Text>
              </Text>
            </TouchableOpacity>

            {(sentDocsLocal || []).length > 0 ? (
              sentDocsLocal
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3)
                .map((document) => (
                  <View key={document.id}>
                    <Text className="font-poppins_bold text-xl">{document.title}</Text>
                    <View className="flex-row">
                      <Text className="mt-1 font-poppins_medium text-sm text-[#a1a1a1]">
                        {document.description}
                      </Text>
                      <Text className="ml-2 mt-1 font-poppins_medium text-sm text-[#a1a1a1]">
                        <FileStatus status={document.status} tipo={document.category} />
                      </Text>
                    </View>
                  </View>
                ))
            ) : (
              <Text className="font-poppins_regular text-zinc-400">Nenhum documento enviado.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
