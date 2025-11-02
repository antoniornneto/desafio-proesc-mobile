import React from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useUser } from '@/context';

export default function Routes() {
  const { user } = useUser();
  return user ? <AppStack /> : <AuthStack />;
}
