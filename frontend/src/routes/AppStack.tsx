import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import DocumentViewer from '@/screens/DocumentViewer';
import { AppStackParamList } from '@/utils/types';
import AvailableDocuments from '@/screens/AvailableDocuments';
import Home from '@/screens/Home';
import SentDocuments from '@/screens/SentDocuments';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="DocumentViewer" component={DocumentViewer} /> */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AvailableDocuments" component={AvailableDocuments} />
      <Stack.Screen name="SentDocuments" component={SentDocuments} />
    </Stack.Navigator>
  );
}
