import { Container } from '@/components/Container';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Linking,
  Platform,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { BASEURL, formatarDataISO, formatarTamanhoArquivo } from '@/utils/config';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSentDocuments } from '@/hooks/useSentDocuments';
import { BottomSheetModal, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useFileUpload } from '@/hooks/useFileUpload';
import { AndroidWarning } from '@/components/AndroidWarning';
import { FileStatus } from '@/components/FileStatus';

export default function SentDocuments({ navigation }: any) {
  const {
    categoriesU,
    categoryFilter,
    setCategoryFilter,
    filteredDocuments,
    onRefresh,
    refreshing,
  } = useSentDocuments();

  const {
    fileUri,
    fileType,
    fileTitle,
    setFileTitle,
    localFileUri,
    uploading,
    uploadStatus,
    handleSelectFile,
    handleUpload,
  } = useFileUpload();

  const [showAndroidWarningSent, setShowAndroidWarningSent] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { height } = Dimensions.get('window');
  const snapPoints = useMemo(() => ['75%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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

      {/* Aviso Android */}
      {showAndroidWarningSent && (
        <AndroidWarning
          visible={showAndroidWarningSent}
          onClose={() => setShowAndroidWarningSent(false)}
        />
      )}

      <View className="gap-2 py-4">
        <View className="flex-row flex-wrap">
          <Text className="font-poppins_regular text-base text-gray-500">Categorias: </Text>
          {categoriesU &&
            Object.entries(categoriesU).map(([key, value], index, array) => (
              <Text
                key={`categorie_${key}`}
                className="font-poppins_regular text-base text-gray-500">
                {value}
                {index < array.length - 1 ? ', ' : '.'}{' '}
              </Text>
            ))}
        </View>
        <TextInput
          placeholder="Ex: atestado, justificativa, requerimento..."
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
                    <View className="flex-col">
                      <Text className="font-poppins_bold text-lg">{document.title}</Text>
                      <View></View>
                      <View>
                        <Text className="font-poppins_regular text-base text-gray-400">
                          <FileStatus status={document.status} tipo={document.category} />
                        </Text>
                        <Text className="font-poppins_regular text-base text-gray-400">
                          Data de envio:{' '}
                          {`${formatarDataISO(document.date)} | ${formatarTamanhoArquivo(document.size)}`}
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
                      <Text className="font-poppins_regular text-base text-gray-400">
                        <FileStatus status={document.status} tipo={document.category} />
                      </Text>
                      <Text className="font-poppins_regular text-base text-gray-400">
                        Data de envio:{' '}
                        {`${formatarDataISO(document.date)} | ${formatarTamanhoArquivo(document.size)}`}
                      </Text>
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
              Você ainda não enviou documentos.
            </Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handlePresentModalPress}
        className="absolute bottom-10 right-6 rounded-full bg-black p-4 shadow-lg">
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <BottomSheetModal
        snapPoints={snapPoints}
        ref={bottomSheetModalRef}
        index={1}
        enableDismissOnClose>
        <BottomSheetView className="flex-1">
          <View className="gap-4 p-8">
            <Text className="mb-3 font-poppins_bold text-xl">Adicionar Documento</Text>

            {/* Título */}
            <View>
              <Text className="mb-2 font-poppins_regular text-gray-500">Título do arquivo:</Text>
              <BottomSheetTextInput
                placeholder="Ex.: Atestado Médico 03/11/2025"
                className="h-12 rounded-lg border border-[#bbbbbb] px-3 py-2 font-poppins_regular"
                value={fileTitle}
                onChangeText={setFileTitle}
                keyboardType="default"
                autoCapitalize="words"
              />
            </View>

            {/* Categoria */}
            <Text className="font-poppins_regular text-gray-500">Escolha a categoria:</Text>
            <View className="flex-row flex-wrap justify-evenly gap-2">
              {categoriesU &&
                Object.entries(categoriesU).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedCategory(key)}
                    className={`mr-2 rounded-full border px-3 py-1 ${
                      selectedCategory === key ? 'border-black bg-black' : 'border-gray-300'
                    }`}>
                    <Text
                      className={`font-poppins_regular ${
                        selectedCategory === key ? 'text-white' : 'text-gray-700'
                      }`}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>

            {/* Selecionar fonte */}
            <View className="mb-4 gap-2">
              <Text className="mb-2 font-poppins_regular text-gray-500">Escolha a fonte:</Text>
              <View className="w-full flex-row justify-around">
                <TouchableOpacity
                  onPress={() => handleSelectFile('camera')}
                  className="items-center">
                  <Ionicons name="camera" size={30} color="#000" />
                  <Text>Câmera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSelectFile('gallery')}
                  className="items-center">
                  <Ionicons name="image" size={30} color="#000" />
                  <Text>Galeria</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSelectFile('files')}
                  className="items-center">
                  <Ionicons name="document" size={30} color="#000" />
                  <Text>Arquivos</Text>
                </TouchableOpacity>
              </View>
            </View>

            {fileUri && (
              <View className="mb-4">
                {fileType?.startsWith('image') ? (
                  <Image
                    source={{ uri: fileUri }}
                    style={{ width: '100%', height: height * 0.35 }}
                    resizeMode="contain"
                  />
                ) : fileType === 'application/pdf' && localFileUri && Platform.OS !== 'android' ? (
                  <WebView
                    originWhitelist={['*']}
                    source={{ uri: localFileUri }}
                    style={{ height: height * 0.35, width: '100%' }}
                    startInLoadingState
                    scrollEnabled
                    nestedScrollEnabled
                  />
                ) : fileType ===
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                  <Text className="mt-4 text-center font-poppins_regular text-gray-500">
                    Pré-visualização não disponível para arquivos DOCX
                  </Text>
                ) : (
                  <Text className="mt-4 text-center font-poppins_regular text-gray-500">
                    Pré-visualização não disponível.
                  </Text>
                )}
              </View>
            )}

            {uploading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#1976d2" />
                <Text className="ml-2 font-poppins_regular">{uploadStatus}</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={async () => {
                  const uploadOk = await handleUpload(selectedCategory);
                  if (uploadOk) {
                    bottomSheetModalRef.current?.close();
                    setTimeout(() => {
                      onRefresh();
                    }, 1000);
                  }
                }}
                className="rounded-lg bg-black px-4 py-2">
                <Text className="text-center font-poppins_bold text-white">Enviar</Text>
              </TouchableOpacity>
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </Container>
  );
}
