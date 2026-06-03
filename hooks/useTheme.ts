import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

const THEME_KEY = 'accellearn_theme';

export function useThemeInit() {
  const { setColorScheme } = useColorScheme();
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') {
        setColorScheme(stored);
      } else {
        setColorScheme('dark');
        AsyncStorage.setItem(THEME_KEY, 'dark');
      }
    });
  }, []);
}

export function useThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  function toggle() {
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(next);
    AsyncStorage.setItem(THEME_KEY, next);
  }
  return { colorScheme: colorScheme ?? 'dark', toggle };
}
