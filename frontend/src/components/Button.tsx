import { ReactNode } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = TouchableOpacityProps & {
  className?: string;
  title?: string;
  children?: ReactNode;
  variant?: 'primary' | 'transparent' | 'invisible';
};

export function Button({ title, className, children, variant = 'primary', ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`flex h-14 items-center justify-center rounded-lg ${variant === 'primary' ? 'bg-black' : variant === 'transparent' ? 'border border-gray-300 bg-transparent' : 'border border-transparent bg-transparent'}`}
      {...rest}>
      {children ? (
        children
      ) : (
        <Text
          className={`text-center font-poppins_medium text-xl ${variant === 'primary' ? 'text-white' : 'text-black'}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
