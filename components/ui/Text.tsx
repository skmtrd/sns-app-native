
import { Text as RNText, TextProps } from 'react-native';
import { ReactNode } from 'react';

interface CustomTextProps extends TextProps {
  children: ReactNode;
}

export const Text = ({ children, style, ...props }: CustomTextProps) => {
  return (
    <RNText style={[{ color: '#000' }, style]} {...props}>
      {children}
    </RNText>
  );
};