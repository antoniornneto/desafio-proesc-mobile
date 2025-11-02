import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabs from '@/routes/AppTabs';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
    </Stack.Navigator>
  );
}
