import { SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return <SafeAreaView className={`m-6 flex-1 ${className}`}>{children}</SafeAreaView>;
};
