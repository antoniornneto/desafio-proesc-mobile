import { useUser } from '@/context';
import { BASEURL } from '@/utils/config';
import { Categories, UploadedDocument } from '@/utils/interfaces';
import { useCallback, useEffect, useState } from 'react';

export const useSentDocuments = () => {
  const { user, setUser } = useUser();
  const [sentDocuments, setSentDocuments] = useState<UploadedDocument[]>();
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [categoriesU, setCategoriesU] = useState<Categories>();
  const [refreshing, setRefreshing] = useState(false);

  const removerAcentos = (texto: string): string => {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const filteredDocuments = sentDocuments?.filter((doc) =>
    categoryFilter
      ? removerAcentos(doc.category.toLowerCase()).includes(
          removerAcentos(categoryFilter.toLowerCase())
        )
      : true
  );

  const refreshDocuments = useCallback(async () => {
    if (!user?.matricula) return;

    try {
      const uploadedDocs = await fetch(`${BASEURL}/api/student/documents/uploaded`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const categories = await fetch(`${BASEURL}/api/available-categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!categories.ok) throw new Error('Erro ao buscar categorias.');
      if (!uploadedDocs.ok) throw new Error('Erro ao buscar documentos enviados.');

      const dataUploadedDocs = await uploadedDocs.json();
      const dataCategories = await categories.json();

      setSentDocuments(dataUploadedDocs);
      setCategoriesU(dataCategories.upload);
    } catch (error) {
      console.error(error);
    }
  }, [user?.matricula]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshDocuments();
    setRefreshing(false);
  };

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);
  return {
    setUser,
    categoriesU,
    sentDocuments,
    categoryFilter,
    setCategoryFilter,
    filteredDocuments,
    onRefresh,
    refreshing,
    refreshSentDocuments: refreshDocuments,
  };
};
