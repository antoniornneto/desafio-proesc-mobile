import { Container } from '@/components/Container';
import { useDocuments } from '@/hooks/useDocuments';
import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  ScrollView,
  TextInput,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { BASEURL, obterNomeArquivo } from '@/utils/config';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SentDocuments({ navigation }: any) {
  const { categoriesA, categoryFilter, setCategoryFilter, filteredDocuments } = useDocuments();
  const [showAndroidWarningSent, setShowAndroidWarningSent] = useState<boolean>(false);

  useEffect(() => {
    const checkWarning = async () => {
      if (Platform.OS === 'android') {
        const value = await AsyncStorage.getItem('androidWarningShownSent');
        if (!value) {
          setShowAndroidWarningSent(true);
          await AsyncStorage.setItem('androidWarningShownSent', 'true');
        } else {
          setShowAndroidWarningSent(false);
        }
      } else {
        setShowAndroidWarningSent(false);
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
        <Text className="font-poppins_bold text-3xl">Documentos Enviados</Text>
      </View>

      {showAndroidWarningSent && (
        <Modal
          visible={true}
          animationType="fade"
          transparent
          onRequestClose={() => setShowAndroidWarningSent(false)}>
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="m-6 w-[90%] rounded-2xl bg-white p-6 shadow-lg">
              <Text className="mb-2 font-poppins_bold text-xl">Aviso importante</Text>
              <Text className="mb-4 font-poppins_regular text-gray-700">
                Arquivos <Text className="font-poppins_bold">.pdf</Text> e{' '}
                <Text className="font-poppins_bold">.docx</Text> podem não ser exibidos
                corretamente. Você poderá abri-los ou baixá-los no navegador.
              </Text>
              <TouchableOpacity
                onPress={() => setShowAndroidWarningSent(false)}
                className="self-end rounded-lg bg-blue-600 px-4 py-2">
                <Text className="font-poppins_bold text-white">Entendi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
      <ScrollView>
        <View className="gap-10 py-8">
          {filteredDocuments?.map((document) => {
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
          })}
        </View>
      </ScrollView>
    </Container>
  );
}
