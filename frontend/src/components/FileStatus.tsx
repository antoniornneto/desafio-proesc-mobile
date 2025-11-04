import { BASEURL } from '@/utils/config';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

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
    <View style={[styles.badge, { backgroundColor: config.colors[status] || '#ccc' }]}>
      <Text style={styles.badgeText}>
        {tipo && config.icons[tipo] ? config.icons[tipo] + ' ' : ''}
        {config.labels[status] || status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
