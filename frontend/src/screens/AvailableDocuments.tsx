import { Container } from '@/components/Container';
import { useDocuments } from '@/hooks/useDocuments';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Linking, Platform, RefreshControl } from 'react-native';
import { WebView } from 'react-native-webview';
import { BASEURL, obterNomeArquivo } from '@/utils/config';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AndroidWarning } from '@/components/AndroidWarning';

export default function AvailableDocuments({ navigation }: any) {
  const {
    categoriesA,
    categoryFilter,
    setCategoryFilter,
    filteredDocuments,
    onRefresh,
    refreshing,
  } = useDocuments();
  const [showAndroidWarning, setShowAndroidWarning] = useState<boolean>(false);

  useEffect(() => {
    const checkWarning = async () => {
      if (Platform.OS === 'android') {
        const value = await AsyncStorage.getItem('androidWarningShown');
        if (!value) {
          setShowAndroidWarning(true);
          await AsyncStorage.setItem('androidWarningShown', 'true');
        } else {
          setShowAndroidWarning(false);
        }
      } else {
        setShowAndroidWarning(false);
      }
    };
    checkWarning();
  }, []);

  return (
    <Container>
      <Ionicons
        className="mb-4"
        name="arrow-back"
        size={40}
        color="black"
        onPress={() => navigation.goBack()}
      />
      <View>
        <Text className="font-poppins_bold text-3xl">Documentos Disponíveis</Text>
      </View>

      {/* Aviso Android */}
      {showAndroidWarning && (
        <AndroidWarning visible={showAndroidWarning} onClose={() => setShowAndroidWarning(false)} />
      )}
      <View className="gap-2 py-4">
        <View className="flex-row flex-wrap">
          <Text className="font-poppins_regular text-base text-gray-500">Categorias: </Text>
          {categoriesA &&
            Object.entries(categoriesA).map(([key, value], index, array) => (
              <Text
                key={`categorie_${key}`}
                className="font-poppins_regular text-base text-gray-500">
                {value}
                {index < array.length - 1 ? ', ' : '.'}{' '}
              </Text>
            ))}
        </View>
        <TextInput
          placeholder="Ex: histórico, declaraoção, boletim..."
          value={categoryFilter}
          onChangeText={setCategoryFilter}
          className="h-12 rounded-lg border border-[#bbbbbb] bg-white px-3 py-2 font-poppins_regular"
          keyboardType="default"
        />
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="gap-10 py-8">
          {(filteredDocuments || []).length > 0 ? (
            filteredDocuments?.map((document) => {
              const isAndroidAndDocType =
                Platform.OS === 'android' && (document.type === 'pdf' || document.type === 'docx');
              const fileUrl = `${BASEURL}${document.url}`;

              return (
                <View key={document.id} className="gap-4">
                  {isAndroidAndDocType ? (
                    <View className="flex-row flex-wrap">
                      <Text className="font-poppins_bold text-lg">{document.title}</Text>
                      <View>
                        <Text className="font-poppins_regular text-base text-gray-400">
                          Arquivo: {`${obterNomeArquivo(document.url)} | ${document.size}`}
                        </Text>
                      </View>
                      <Text
                        className="font-poppins_regular text-[#1976d2] underline"
                        onPress={() => Linking.openURL(fileUrl)}>
                        Fazer o download ou abrir no navegador.
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text className="font-poppins_bold text-lg">{document.title}</Text>
                      <WebView
                        source={{ uri: `${BASEURL}${document.url}` }}
                        style={{ height: 400 }}
                        startInLoadingState
                        scrollEnabled
                        nestedScrollEnabled
                      />
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <Text className="font-poppins_regular text-zinc-400">
              Você ainda não possui documentos para visualizar.
            </Text>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
