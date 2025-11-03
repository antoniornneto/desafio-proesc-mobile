import { useUser } from '@/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDocuments } from './useDocuments';
import { useSentDocuments } from './useSentDocuments';
import { useCallback, useState } from 'react';

export const useHome = () => {
  const { user, setUser } = useUser();
  const { documents, refreshAvailableDocuments } = useDocuments();
  const { sentDocuments, refreshSentDocuments } = useSentDocuments();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (refreshAvailableDocuments) await refreshAvailableDocuments();
      if (refreshSentDocuments) await refreshSentDocuments();
    } catch (error) {
      console.error('Erro ao atualizar documentos:', error);
    }
    setRefreshing(false);
  }, [refreshAvailableDocuments, refreshSentDocuments]);

  async function logOut() {
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  return {
    logOut,
    user,
    refreshing,
    onRefresh,
    documents,
    sentDocuments,
  };
};
