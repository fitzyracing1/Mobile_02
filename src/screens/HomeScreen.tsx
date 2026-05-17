import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { StatBadge } from '../components/StatBadge';
import { LaunchCountdown } from '../components/LaunchCountdown';
import { LiveOnMars } from '../components/LiveOnMars';
import { calculateMarsDistance, formatDistance, formatLightTime } from '../utils/marsDistance';
import { missions } from '../data/missions';
import { useSettings } from '../context/SettingsContext';
import { RootStackParamList } from '../types';

const TODAY = new Date('2026-05-17');

const FEATURED_MISSION = missions.find((m) => m.id === 'spacex-starship-uncrewed')!;

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const distanceData = useMemo(() => calculateMarsDistance(TODAY), []);
  const { settings } = useSettings();
  const navigation = useNavigation<NavProp>();

  const isMiles = settings.distanceUnit === 'miles';
  const isFahrenheit = settings.tempUnit === 'fahrenheit';

  // Live distance label with unit conversion
  const distanceLabel = isMiles
    ? `${(distanceData.distanceKm * 0.621371).toFixed(1)}M mi`
    : `${distanceData.distanceKm.toFixed(1)}M km`;

  const lightDelayLabel = formatLightTime(distanceData.lightMinutes);

  // Mars at a Glance unit-aware values
  const avgDistanceValue = isMiles ? '140M mi' : '225M km';
  const avgTempValue = isFahrenheit ? '−76°F' : '−60°C';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={['#2A0800', '#5C1A00', '#E8532A', '#C1440E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroEyebrow}>EDUCATIONAL APP</Text>
            <Text style={styles.heroTitle}>Road to Mars</Text>
            <Text style={styles.heroSubtitle}>
              How humanity will reach the Red Planet
            </Text>
            <View style={styles.heroOrb}>
              <Text style={styles.heroOrbText}>🔴</Text>
            </View>
            {/* Settings gear button */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Today's Mars Distance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Mars Distance</Text>
            <Text style={styles.sectionDate}>May 17, 2026</Text>
          </View>
          <View style={styles.distanceCard}>
            <LinearGradient
              colors={[theme.colors.accentDim, '#1A0A05']}
              style={styles.distanceGradient}
            >
              <Text style={styles.distanceValue}>{distanceLabel}</Text>
              <Text style={styles.distanceSubtext}>
                from Earth right now
              </Text>
              <View style={styles.distanceMeta}>
                <View style={styles.distanceMetaItem}>
                  <Text style={styles.distanceMetaLabel}>SIGNAL DELAY</Text>
                  <Text style={styles.distanceMetaValue}>{lightDelayLabel} one-way</Text>
                </View>
                <View style={styles.distanceMetaDivider} />
                <View style={styles.distanceMetaItem}>
                  <Text style={styles.distanceMetaLabel}>DISTANCE (AU)</Text>
                  <Text style={styles.distanceMetaValue}>
                    {distanceData.distanceAU.toFixed(3)} AU
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Mars at a Glance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mars at a Glance</Text>
          <View style={styles.statsGrid}>
            <StatBadge icon="📏" label="Avg Distance" value={avgDistanceValue} />
            <StatBadge icon="⏱️" label="Travel Time" value="~7 mo" />
          </View>
          <View style={[styles.statsGrid, { marginTop: theme.spacing.sm }]}>
            <StatBadge icon="⚖️" label="Gravity" value="38%" />
            <StatBadge icon="🌡️" label="Avg Temp" value={avgTempValue} />
          </View>
          <View style={[styles.statsGrid, { marginTop: theme.spacing.sm }]}>
            <StatBadge icon="📅" label="Mars Day" value="24h 37m" />
            <StatBadge icon="🪐" label="Mars Year" value="687 days" />
          </View>
        </View>

        {/* Next Launch Window */}
        <View style={styles.section}>
          <LaunchCountdown />
        </View>

        {/* Live on Mars */}
        <View style={styles.section}>
          <LiveOnMars />
        </View>

        {/* Featured Mission */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mission of the Week</Text>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>SPOTLIGHT</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.featuredCard} activeOpacity={0.85}>
            <LinearGradient
              colors={['#1A0800', theme.colors.accentDim]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredHeader}>
                <Text style={styles.featuredIcon}>🚀</Text>
                <View>
                  <Text style={styles.featuredName}>{FEATURED_MISSION.name}</Text>
                  <Text style={styles.featuredAgency}>
                    {FEATURED_MISSION.agency} · {FEATURED_MISSION.year}
                  </Text>
                </View>
                <View style={styles.plannedBadge}>
                  <Text style={styles.plannedBadgeText}>PLANNED</Text>
                </View>
              </View>
              <Text style={styles.featuredDesc} numberOfLines={3}>
                {FEATURED_MISSION.description}
              </Text>
              <View style={styles.featuredHighlights}>
                {FEATURED_MISSION.highlights.slice(0, 2).map((h, i) => (
                  <Text key={i} style={styles.featuredHighlight}>
                    ▸ {h}
                  </Text>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Facts Strip */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Did You Know?</Text>
          <View style={styles.quickFacts}>
            <View style={styles.quickFact}>
              <Text style={styles.quickFactIcon}>🌋</Text>
              <Text style={styles.quickFactText}>
                Olympus Mons on Mars is the tallest volcano in the solar system at{' '}
                <Text style={styles.highlight}>21.9 km</Text> — nearly 3× Mount Everest.
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.quickFact}>
              <Text style={styles.quickFactIcon}>🏔️</Text>
              <Text style={styles.quickFactText}>
                Valles Marineris is a canyon{' '}
                <Text style={styles.highlight}>4,000 km long</Text> — wide enough to
                cross the entire United States.
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.quickFact}>
              <Text style={styles.quickFactIcon}>💧</Text>
              <Text style={styles.quickFactText}>
                Mars has enough polar water ice that if melted, it would cover the
                planet in{' '}
                <Text style={styles.highlight}>35 meters</Text> of water.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  heroEyebrow: {
    ...theme.typography.label,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: -1,
  },
  heroSubtitle: {
    ...theme.typography.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
  },
  heroOrb: {
    position: 'absolute',
    right: 24,
    bottom: 20,
  },
  heroOrbText: {
    fontSize: 80,
    opacity: 0.9,
  },
  settingsButton: {
    position: 'absolute',
    top: 12,
    right: 16,
  },
  settingsButtonText: {
    fontSize: 24,
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  sectionDate: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  distanceCard: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  distanceGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: 40,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: -1,
  },
  distanceSubtext: {
    ...theme.typography.body,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  distanceMeta: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    width: '100%',
  },
  distanceMetaItem: {
    flex: 1,
    alignItems: 'center',
  },
  distanceMetaDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  distanceMetaLabel: {
    ...theme.typography.label,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  distanceMetaValue: {
    ...theme.typography.h3,
    color: theme.colors.white,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  launchCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
    alignItems: 'flex-start',
  },
  launchLeft: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.accentDim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  launchIcon: {
    fontSize: 26,
  },
  launchRight: {
    flex: 1,
  },
  launchDate: {
    ...theme.typography.h3,
    color: theme.colors.accent,
  },
  launchDesc: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 19,
  },
  launchBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accentDim,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  launchBadgeText: {
    ...theme.typography.label,
    color: theme.colors.accent,
    fontSize: 11,
  },
  featuredBadge: {
    backgroundColor: theme.colors.accentDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  featuredBadgeText: {
    ...theme.typography.label,
    color: theme.colors.accent,
    fontSize: 9,
  },
  featuredCard: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  featuredGradient: {
    padding: theme.spacing.md,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  featuredIcon: {
    fontSize: 28,
  },
  featuredName: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  featuredAgency: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  plannedBadge: {
    marginLeft: 'auto',
    backgroundColor: theme.colors.badgePlanned,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  plannedBadgeText: {
    ...theme.typography.label,
    color: theme.colors.badgePlannedText,
    fontSize: 10,
  },
  featuredDesc: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginBottom: theme.spacing.sm,
  },
  featuredHighlights: {
    gap: 4,
  },
  featuredHighlight: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    lineHeight: 19,
  },
  quickFacts: {
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  quickFact: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  quickFactIcon: {
    fontSize: 24,
    lineHeight: 30,
  },
  quickFactText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  highlight: {
    color: theme.colors.accent,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginHorizontal: theme.spacing.md,
  },
});
