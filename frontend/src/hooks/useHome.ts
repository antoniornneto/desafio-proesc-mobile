import { useUser } from '@/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDocuments } from './useDocuments';
import { useSentDocuments } from './useSentDocuments';
import { useCallback, useRef, useState } from 'react';
import { BASEURL } from '@/utils/config';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useHome = () => {
  const { user, setUser } = useUser();
  const { documents, refreshAvailableDocuments } = useDocuments();
  const { sentDocuments, refreshSentDocuments } = useSentDocuments();

  const [refreshing, setRefreshing] = useState(false);
  const activeUpdates = useRef<Set<string>>(new Set());

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

  async function autoUpdateStatusFile(
    documentId: string,
    delays: { inicio: number; analise: number },
    atualizarStatusLocal?: (
      docId: string,
      status: 'enviado' | 'em_analise' | 'aprovado' | 'rejeitado'
    ) => void,
    onRefresh?: () => void
  ) {
    if (activeUpdates.current.has(documentId)) return;
    activeUpdates.current.add(documentId);

    try {
      await sleep(delays.inicio);

      try {
        const respAnalise = await fetch(`${BASEURL}/api/student/documents/${documentId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'em_analise' }),
        });
        if (!respAnalise.ok) {
          console.error('Falha ao setar em_analise:', await respAnalise.text());
        } else {
          if (atualizarStatusLocal) atualizarStatusLocal(documentId, 'em_analise');
        }
      } catch (err) {
        console.error('Erro na requisição em_analise:', err);
      }

      await sleep(delays.analise);

      try {
        const respAprovado = await fetch(`${BASEURL}/api/student/documents/${documentId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'aprovado' }),
        });
        if (!respAprovado.ok) {
          console.error('Falha ao aprovar documento:', await respAprovado.text());
        } else {
          if (atualizarStatusLocal) atualizarStatusLocal(documentId, 'aprovado');
        }
      } catch (err) {
        console.error('Erro na requisição aprovado:', err);
      }

      if (onRefresh) await onRefresh();
    } finally {
      activeUpdates.current.delete(documentId);
    }
  }

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
    autoUpdateStatusFile,
  };
};
