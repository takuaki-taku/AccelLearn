import { Stack } from 'expo-router';
import '../global.css';
import { useThemeInit } from '../hooks/useTheme';

function ThemeInitializer() {
  useThemeInit();
  return null;
}

export default function RootLayout() {
  return (
    <>
      <ThemeInitializer />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
