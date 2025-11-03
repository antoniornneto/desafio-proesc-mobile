import { useUser } from '@/context';
import { BASEURL } from '@/utils/config';
import { Document } from '@/utils/interfaces';
import { useEffect, useState } from 'react';

interface Categories {
  [key: string]: string;
}

export const useDocuments = () => {
  const { user, setUser } = useUser();
  const [documents, setDocuments] = useState<Document[]>();
  const [categoriesA, setCategoriesA] = useState<Categories>();
  const [categoriesU, setCategoriesU] = useState<Categories>();

  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const removerAcentos = (texto: string): string => {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const filteredDocuments = documents?.filter((doc) =>
    categoryFilter
      ? removerAcentos(doc.category.toLowerCase()).includes(
          removerAcentos(categoryFilter.toLowerCase())
        )
      : true
  );

  useEffect(() => {
    const reqDoc = async () => {
      try {
        const documents = await fetch(`${BASEURL}/api/student/documents`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const categories = await fetch(`${BASEURL}/api/available-categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!documents.ok) throw new Error('Erro ao buscar documentos');
        if (!categories.ok) throw new Error('Erro ao buscar categorias');

        const dataDocuments = await documents.json();
        const dataCategories = await categories.json();

        setDocuments(dataDocuments);
        setCategoriesA(dataCategories.available);
        setCategoriesU(dataCategories.upload);
      } catch (error) {
        console.log(error);
      }
    };
    reqDoc();
  }, [user?.matricula]);
  return {
    documents,
    categoriesA,
    categoriesU,
    categoryFilter,
    setCategoryFilter,
    filteredDocuments,
    setUser,
  };
};
