import React from 'react';
import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Input } from '@/components/Input';
import { useLogin } from '@/hooks/useLogin';
import { Controller } from 'react-hook-form';
import { Loading } from '@/components/Loading';

export default function Login() {
  const { loading, senhaRef, control, handleSubmit, errors, onSubmit } = useLogin();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={'padding'} className="flex-1">
        <Container className="justify-center gap-8">
          <View>
            <Text className="font-poppins_bold text-4xl">Portal do Aluno</Text>
            <Text className="font-poppins_regular text-xl text-gray-400">
              Entre com as suas credenciais para acessar o portal
            </Text>
          </View>
          <Controller
            control={control}
            name="matricula"
            rules={{
              required: 'Informe sua Matrícula',
              pattern: {
                value: /^[0-9]+$/,
                message: 'A matrícula deve conter apenas números',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <Input
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  label="Matrícula"
                  returnKeyType="next"
                  placeholder="Insira sua matrícula"
                  onSubmitEditing={() => senhaRef.current?.focus()}
                  value={value}
                  onChangeText={onChange}
                />
                {errors.matricula && (
                  <Text className="text-red-500">{errors.matricula.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="senha"
            rules={{
              required: 'Informe sua Senha',
              minLength: {
                value: 4,
                message: 'A senha deve ter pelo menos 4 caracteres',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <View className="gap-2">
                <Input
                  ref={senhaRef}
                  autoCapitalize="none"
                  keyboardType="default"
                  returnKeyType="done"
                  secureTextEntry
                  label="Senha"
                  placeholder="Insira sua senha"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.senha && <Text className="text-red-500">{errors.senha.message}</Text>}
              </View>
            )}
          />
          {loading ? (
            <Button title="" variant="primary" onPress={handleSubmit(onSubmit)}>
              <Loading spingColor="white" textColor="text-white" />
            </Button>
          ) : (
            <Button title="Entrar" variant="primary" onPress={handleSubmit(onSubmit)} />
          )}
        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
