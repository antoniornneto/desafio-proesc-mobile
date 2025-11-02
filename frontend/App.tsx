import { ThemeProvider } from '@/context/ThemeContext';
import './src/styles/global.css';
import { NavigationContainer } from '@react-navigation/native';
import Routes from '@/routes';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProvider, useUser } from '@/context';

function UserLoader({ children }: { children: React.ReactNode }) {
  const { setUser } = useUser();

  useEffect(() => {
    const loadingUser = async () => {
      const storage = await AsyncStorage.getItem('user');
      if (storage) setUser(JSON.parse(storage));
    };
    loadingUser();
  }, [setUser]);

  return <>{children}</>;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) return null;
  return (
    <UserProvider>
      <UserLoader>
        <ThemeProvider>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </ThemeProvider>
      </UserLoader>
    </UserProvider>
  );
}
