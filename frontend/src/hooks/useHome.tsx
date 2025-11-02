import { useUser } from '@/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHome = () => {
  const { user, setUser } = useUser();

  async function logOut() {
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  return { logOut, user };
};
