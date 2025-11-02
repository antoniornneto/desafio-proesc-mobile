import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/screens/Home';
import Documentos from '@/screens/Documents';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 120,
          borderRadius: 16,
          position: 'absolute',
          left: 16,
          right: 16,
          backgroundColor: '#6D7578',
          elevation: 3,
          paddingTop: 24,
        },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Home') {
            return (
              <View className="flex w-28 flex-col items-center">
                <Ionicons name="home" size={size} color={focused ? '#FFF' : '#a1a1aa'} />
                <Text
                  className={`font-poppins_regular text-sm ${focused ? 'text-white' : 'text-zinc-400'}`}>
                  Home
                </Text>
              </View>
            );
          }
          if (route.name === 'Documentos') {
            return (
              <View className="flex w-28 flex-col items-center">
                <MaterialIcons name="folder" size={size} color={focused ? '#fff' : '#a1a1aa'} />
                <Text
                  className={`font-poppins_regular text-sm ${focused ? 'text-white' : 'text-zinc-400'}`}>
                  Documentos
                </Text>
              </View>
            );
          }
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Documentos" component={Documentos} />
    </Tab.Navigator>
  );
}
