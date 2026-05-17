import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useSettings } from '../context/SettingsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavProp>();
  const { settings, updateSettings } = useSettings();

  async function handleResetOnboarding() {
    try {
      await AsyncStorage.removeItem('@road_to_mars/onboarding_seen');
    } catch {
      // ignore
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚙️ Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DISTANCE UNITS</Text>
          <View style={styles.card}>
            <Text style={styles.settingTitle}>Distance</Text>
            <Text style={styles.settingSubtitle}>Used for Mars distance displays</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, settings.distanceUnit === 'km' && styles.toggleButtonActive]}
                onPress={() => updateSettings({ distanceUnit: 'km' })}
              >
                <Text style={[styles.toggleButtonText, settings.distanceUnit === 'km' && styles.toggleButtonTextActive]}>km</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, settings.distanceUnit === 'miles' && styles.toggleButtonActive]}
                onPress={() => updateSettings({ distanceUnit: 'miles' })}
              >
                <Text style={[styles.toggleButtonText, settings.distanceUnit === 'miles' && styles.toggleButtonTextActive]}>mi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TEMPERATURE UNITS</Text>
          <View style={styles.card}>
            <Text style={styles.settingTitle}>Temperature</Text>
            <Text style={styles.settingSubtitle}>Used for Mars temperature display</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, settings.tempUnit === 'celsius' && styles.toggleButtonActive]}
                onPress={() => updateSettings({ tempUnit: 'celsius' })}
              >
                <Text style={[styles.toggleButtonText, settings.tempUnit === 'celsius' && styles.toggleButtonTextActive]}>°C</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, settings.tempUnit === 'fahrenheit' && styles.toggleButtonActive]}
                onPress={() => updateSettings({ tempUnit: 'fahrenheit' })}
              >
                <Text style={[styles.toggleButtonText, settings.tempUnit === 'fahrenheit' && styles.toggleButtonTextActive]}>°F</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ABOUT</Text>
          <View style={styles.card}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.aboutDivider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Data Sources</Text>
              <Text style={styles.aboutValue}>NASA &amp; ESA</Text>
            </View>
            <View style={styles.aboutDivider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Built for</Text>
              <Text style={styles.aboutValue}>Mars enthusiasts</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ADVANCED</Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetOnboarding}>
            <Text style={styles.resetButtonText}>Reset Onboarding</Text>
          </TouchableOpacity>
          <Text style={styles.resetHint}>You will see the welcome screens again on next app launch.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight, backgroundColor: theme.colors.backgroundSecondary },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 24, color: theme.colors.accent },
  headerTitle: { ...theme.typography.h3, color: theme.colors.textPrimary },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },
  section: { marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.md },
  sectionLabel: { ...theme.typography.label, color: theme.colors.textMuted, letterSpacing: 1.5, marginBottom: theme.spacing.sm },
  card: { backgroundColor: theme.colors.backgroundCard, borderWidth: 1, borderColor: theme.colors.borderLight, borderRadius: theme.borderRadius.md, padding: theme.spacing.md },
  settingTitle: { ...theme.typography.h3, color: theme.colors.textPrimary },
  settingSubtitle: { ...theme.typography.bodySmall, color: theme.colors.textMuted, marginTop: 2, marginBottom: theme.spacing.md },
  toggleRow: { flexDirection: 'row', gap: theme.spacing.sm },
  toggleButton: { flex: 1, paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.sm, borderWidth: 1, borderColor: theme.colors.borderLight, alignItems: 'center', backgroundColor: theme.colors.backgroundSecondary },
  toggleButtonActive: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  toggleButtonText: { ...theme.typography.h3, color: theme.colors.textMuted },
  toggleButtonTextActive: { color: theme.colors.white, fontWeight: '700' },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  aboutLabel: { ...theme.typography.body, color: theme.colors.textSecondary },
  aboutValue: { ...theme.typography.body, color: theme.colors.textPrimary, fontWeight: '600' },
  aboutDivider: { height: 1, backgroundColor: theme.colors.borderLight, marginVertical: 2 },
  resetButton: { borderWidth: 1, borderColor: theme.colors.accent, borderRadius: theme.borderRadius.md, paddingVertical: theme.spacing.sm + 4, alignItems: 'center' },
  resetButtonText: { ...theme.typography.h3, color: theme.colors.accent },
  resetHint: { ...theme.typography.caption, color: theme.colors.textMuted, textAlign: 'center', marginTop: theme.spacing.sm },
});
