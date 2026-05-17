import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { hasSeenOnboarding } from './src/storage/onboarding';
import { SettingsProvider } from './src/context/SettingsContext';

type AppState = 'loading' | 'onboarding' | 'app';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    hasSeenOnboarding().then((seen) => {
      setAppState(seen ? 'app' : 'onboarding');
    });
  }, []);

  if (appState === 'loading') {
    return <View style={styles.root} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SettingsProvider>
        <StatusBar style="light" />
        {appState === 'onboarding' ? (
          <OnboardingScreen onDone={() => setAppState('app')} />
        ) : (
          <AppNavigator />
        )}
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
});
