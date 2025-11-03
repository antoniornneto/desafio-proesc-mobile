// hooks/useFileUpload.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Alert } from 'react-native';
import { BASEURL } from '@/utils/config';

type FileSource = 'camera' | 'gallery' | 'files';

type StatusDelay = {
  emAnalise: number;
  aprovado: number;
  rejeitado: number;
};

export function useFileUpload() {
  const [fileTitle, setFileTitle] = useState('');
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [localFileUri, setLocalFileUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // guarda timeouts para limpar no unmount
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const copyFileToLocal = useCallback(async (uri: string) => {
    try {
      const filename = uri.split('/').pop() ?? `file_${Date.now()}`;
      const dest = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.copyAsync({ from: uri, to: dest });
      setLocalFileUri(dest);
    } catch (error) {
      console.error('Erro ao copiar arquivo para visualização:', error);
      setLocalFileUri(null);
    }
  }, []);

  async function updateFileStatusDelay(
    documentId: string,
    fileTypeOrName: string,
    delay: StatusDelay
  ) {
    const patchUrl = (status: string) => `${BASEURL}/api/student/documents/${documentId}/status`;

    try {
      const t1 = setTimeout(async () => {
        try {
          await fetch(patchUrl('em_analise'), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'em_analise' }),
          });
        } catch (err) {
          console.error('Falha ao atualizar para em_analise:', err);
        }

        const isDocx =
          (fileTypeOrName && fileTypeOrName.includes('wordprocessingml')) ||
          (fileTypeOrName && fileTypeOrName.toLowerCase().endsWith('.docx'));

        const nextDelay = isDocx ? delay.rejeitado : delay.aprovado;
        const nextStatus = isDocx ? 'rejeitado' : 'aprovado';

        const t2 = setTimeout(async () => {
          try {
            await fetch(patchUrl(nextStatus), {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: nextStatus }),
            });
          } catch (err) {
            console.error(`Falha ao atualizar para ${nextStatus}:`, err);
          }
        }, nextDelay);

        timeoutsRef.current.push(t2 as unknown as number);
      }, delay.emAnalise);

      timeoutsRef.current.push(t1 as unknown as number);
    } catch (err) {
      console.error('Erro em updateFileStatusDelay:', err);
    }
  }

  const handleSelectFile = useCallback(
    async (source: FileSource) => {
      try {
        if (source === 'files') {
          const res = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
          });

          if (res.canceled) return;

          const asset = res.assets?.[0];
          if (!asset) return;

          const uri = asset.uri;
          const name = asset.name ?? uri.split('/').pop() ?? '';
          const size = asset.size ?? null;

          const ext = name.split('.').pop()?.toLowerCase() ?? '';
          const inferredMime =
            ext === 'pdf'
              ? 'application/pdf'
              : ext === 'docx'
                ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                : null;

          setFileSize(size);
          setFileType(inferredMime);
          setFileUri(uri);

          if (inferredMime === 'application/pdf' || ext === 'pdf') {
            await copyFileToLocal(uri);
          } else {
            setLocalFileUri(null);
          }
        } else {
          const permissionResult =
            source === 'camera'
              ? await ImagePicker.requestCameraPermissionsAsync()
              : await ImagePicker.requestMediaLibraryPermissionsAsync();

          if (!permissionResult.granted) {
            Alert.alert('Permissão negada.');
            return;
          }

          const pickerResult =
            source === 'camera'
              ? await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                })
              : await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                });

          if (pickerResult.canceled) return;
          const asset = (pickerResult as any).assets?.[0];
          if (!asset) return;

          const uri = asset.uri;
          const mime = asset.mimeType ?? asset.type ?? null;
          const size = asset.fileSize ?? null;

          setFileSize(size);
          setFileType(mime);
          setFileUri(uri);
          setLocalFileUri(uri);
        }
      } catch (err) {
        console.error('Erro ao selecionar arquivo:', err);
        Alert.alert('Erro ao selecionar arquivo.');
      }
    },
    [copyFileToLocal]
  );

  const handleUpload = useCallback(
    async (category: string) => {
      if (!fileUri || !category || !fileTitle.trim()) {
        Alert.alert('Preencha o nome do arquivo, selecione um arquivo e uma categoria.');
        return false;
      }

      try {
        setUploading(true);
        setUploadStatus('Enviando...');

        let uriToUse = fileUri;
        if (!uriToUse.startsWith('file://') && !uriToUse.startsWith('http')) {
          uriToUse = 'file://' + uriToUse;
        }

        const originalName = fileUri.split('/').pop() ?? `file_${Date.now()}`;
        const extension = originalName.includes('.') ? originalName.split('.').pop() : undefined;

        const filenameWithExt =
          fileTitle && fileTitle.trim().length > 0
            ? `${fileTitle}${extension ? '.' + extension : ''}`
            : originalName;

        const formData = new FormData();
        formData.append('file', {
          uri: uriToUse,
          type: fileType || 'application/octet-stream',
          name: filenameWithExt,
        } as any);

        formData.append('title', fileTitle.trim());
        formData.append('category', category);
        formData.append('size', fileSize ? fileSize.toString() : '');

        const response = await fetch(`${BASEURL}/api/student/documents/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setUploadStatus('Upload concluído!');

          setTimeout(() => {
            setFileUri(null);
            setFileType(null);
            setLocalFileUri(null);
            setFileTitle('');
            setUploadStatus('');
            setUploading(false);
          }, 1500);

          updateFileStatusDelay(result.id, fileType || filenameWithExt, {
            emAnalise: 1000,
            aprovado: 4000,
            rejeitado: 3000,
          });

          return true;
        } else {
          setUploadStatus('Erro ao enviar.');
          setUploading(false);
          const text = await response.text().catch(() => null);
          console.error('Upload failed:', response.status, text);
          return false;
        }
      } catch (error) {
        console.error('Erro no upload:', error);
        setUploadStatus('Falha no upload.');
        setUploading(false);
        Alert.alert('Não foi possível carregar o seu arquivo, tente novamente.');
        return false;
      }
    },
    [fileUri, fileType, fileTitle, fileSize]
  );

  return {
    fileUri,
    fileType,
    localFileUri,
    fileTitle,
    setFileTitle,
    uploading,
    uploadStatus,
    handleSelectFile,
    handleUpload,
  };
}
