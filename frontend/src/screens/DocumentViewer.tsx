import React, { useEffect, useState } from 'react';
import { Platform, Text, View, ActivityIndicator, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Document } from '@/utils/interfaces';
import { BASEURL } from '@/utils/config';

type Props = {
  route: {
    params: {
      doc: Document;
    };
  };
  navigation: any;
};

export default function DocumentViewer({ route, navigation }: Props) {
  const doc = route.params.doc;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android' && (doc.type === 'pdf' || doc.type === 'docx')) {
      const fileUrl = doc.url.startsWith('http') ? doc.url : `${BASEURL}${doc.url}`;
      setLoading(true);
      Linking.openURL(fileUrl)
        .catch((e) => console.error('Erro ao abrir no navegador:', e))
        .finally(() => setLoading(false));
    }
  }, [doc]);

  if (!doc)
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="rounded-xl bg-red-200 p-2 font-poppins_regular text-xl text-red-900">
          Desculpe, não foi possível encontrar seu documento.
        </Text>
      </View>
    );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <ActivityIndicator size="large" />
        <Text>Abrindo documento em outro aplicativo...</Text>
      </View>
    );
  }

  if (Platform.OS === 'android' && (doc.type === 'pdf' || doc.type === 'docx')) {
    return (
      <SafeAreaView className="flex flex-1 flex-col px-8">
        <Ionicons
          name="arrow-back"
          size={40}
          color="black"
          style={{ marginTop: 24, marginBottom: 32 }}
          onPress={() => navigation.goBack()}
        />
        <Text className="m-auto text-center font-poppins_regular">
          Por favor, aguarde. Estamos abrindo o documento em outro aplicativo.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <WebView source={{ uri: `${BASEURL}${doc.url}` }} style={{ flex: 1 }} startInLoadingState />
    </SafeAreaView>
  );
}
