import { BASEURL } from '@/utils/config';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

type StatusConfig = {
  colors: Record<string, string>;
  labels: Record<string, string>;
  icons: Record<string, string>;
};

type FileStatusProps = {
  status: string;
  tipo?: string;
};

export const FileStatus: React.FC<FileStatusProps> = ({ status, tipo }) => {
  const [config, setConfig] = useState<StatusConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASEURL}/api/status-config`)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !config) return <ActivityIndicator size="small" color="#aaa" />;

  return (
    <View
      className={`mt-1 flex-row justify-center rounded-xl bg-[${config?.colors[status]}] px-3 py-1`}>
      <Text className="self-start">
        {tipo && config.icons[tipo] ? config.icons[tipo] + ' ' : ''}
      </Text>
      <Text className="text-center font-poppins_bold text-white">
        {config.labels[status] || status}
      </Text>
    </View>
  );
};
