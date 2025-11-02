import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginFormData, userSession } from '@/utils/types';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextInput } from 'react-native';
import { useUser } from '@/context';
import { IPLOCAL } from '@/utils/config';

export const useLogin = () => {
  const { setUser } = useUser();
  const senhaRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      matricula: '',
      senha: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await fetch(`${IPLOCAL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message);
        return;
      }

      const user: userSession = result.user;
      console.log(result.message);
      console.log(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      console.log('Erro no login: ', error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, setLoading, senhaRef, control, handleSubmit, errors, onSubmit };
};
