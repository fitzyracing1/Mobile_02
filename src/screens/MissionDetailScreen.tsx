import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Mission, MissionStatus, MissionType, MissionsStackParamList } from '../types';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MissionDetailRouteProp = RouteProp<MissionsStackParamList, 'MissionDetail'>;

const HERO_GRADIENTS: Record<MissionType, readonly [string, string, string]> = {
  rover: ['#1A0800', '#3D1500', '#E8532A'],
  orbiter: ['#001A30', '#003D6E', '#0088CC'],
  lander: ['#0A1A00', '#1A3D00', '#4CAF50'],
  crewed: ['#1A0030', '#3D006E', '#9C27B0'],
  'sample-return': ['#1A1500', '#3D3000', '#FF9800'],
  flyby: ['#001A1A', '#003D3D', '#00BCD4'],
};

const TYPE_ICONS: Record<MissionType, string> = {
  rover: '🤖',
  orbiter: '🛰️',
  lander: '🚀',
  crewed: '👨‍🚀',
  'sample-return': '🧪',
  flyby: '💫',
};

const TYPE_LABELS: Record<MissionType, string> = {
  rover: 'Rover',
  orbiter: 'Orbiter',
  lander: 'Lander',
  crewed: 'Crewed',
  'sample-return': 'Sample Return',
  flyby: 'Flyby',
};

const STATUS_CONFIG: Record<MissionStatus, { label: string; bg: string; text: string }> = {
  completed: {
    label: 'COMPLETED',
    bg: theme.colors.badgeCompleted,
    text: theme.colors.badgeCompletedText,
  },
  active: {
    label: 'ACTIVE',
    bg: theme.colors.badgeActive,
    text: theme.colors.badgeActiveText,
  },
  planned: {
    label: 'PLANNED',
    bg: theme.colors.badgePlanned,
    text: theme.colors.badgePlannedText,
  },
};

function getMissionTypeInfo(mission: Mission): { label: string; value: string } {
  switch (mission.type) {
    case 'rover':
      return { label: 'Surface Range', value: mission.status === 'planned' ? 'TBD' : 'Multiple km traversed' };
    case 'orbiter':
      return { label: 'Orbital Period', value: '~2 hours per orbit' };
    case 'lander':
      return { label: 'Landing Site', value: 'Martian surface' };
    case 'crewed':
      return { label: 'Est. Launch Window', value: `~${mission.year}` };
    case 'sample-return':
      return { label: 'Return Timeline', value: `~${mission.year} (est.)` };
    case 'flyby':
      return { label: 'Closest Approach', value: 'Varies by trajectory' };
    default:
      return { label: 'Mission Type', value: TYPE_LABELS[mission.type] };
  }
}

function getMissionTypeNote(mission: Mission): string {
  switch (mission.type) {
    case 'rover':
      if (mission.status === 'planned') {
        return `This rover mission is planned for the ${mission.year} Mars launch window. Launch opportunities occur roughly every 26 months when Earth and Mars align favorably.`;
      }
      return `Rovers traverse the Martian surface to analyze geology, atmosphere, and potential biosignatures. Mars's thin CO₂ atmosphere and low gravity (38% of Earth's) make rover design uniquely challenging.`;
    case 'orbiter':
      return `Orbiters circle Mars continuously, providing global mapping, atmospheric monitoring, and crucial relay communications for surface missions. Mars orbiters typically operate at altitudes between 250–400 km.`;
    case 'lander':
      if (mission.status === 'planned') {
        return `Planned for the ${mission.year} launch window, this lander mission will test critical technologies for future human missions to Mars. Entry, Descent and Landing (EDL) is the riskiest phase — historically called "Seven Minutes of Terror."`;
      }
      return `Landers provide fixed surface science stations, analyzing soil chemistry, seismic activity, and atmospheric conditions at a single location. Entry, Descent and Landing through Mars's thin atmosphere demands precision engineering.`;
    case 'crewed':
      return `A crewed Mars mission would require a transit of approximately 6–9 months each way. Crew would face radiation exposure, microgravity effects, and psychological isolation. Return fuel will be produced on Mars via the Sabatier process from atmospheric CO₂ and water ice.`;
    case 'sample-return':
      return `Returning Mars samples to Earth would allow analysis with the world's most sophisticated laboratory equipment. The campaign involves multiple vehicles including a Mars Ascent Vehicle — the first rocket ever launched from another planet's surface.`;
    case 'flyby':
      return `Flyby missions pass through the Mars system to study the planet, its moons, and surrounding space environment. While they cannot land or orbit, flybys offer valuable data at relatively low mission cost and complexity.`;
    default:
      return `This mission contributes to humanity's ongoing exploration of the Red Planet.`;
  }
}

interface StatCardProps {
  label: string;
  value: string;
  accentColor?: string;
}

function StatCard({ label, value, accentColor }: StatCardProps) {
  return (
    <View style={statStyles.card}>
      <Text style={[statStyles.value, accentColor ? { color: accentColor } : undefined]}>
        {value}
      </Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    minWidth: (SCREEN_WIDTH - theme.spacing.md * 2 - theme.spacing.sm * 3) / 2,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});

export default function MissionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<MissionDetailRouteProp>();
  const { mission } = route.params;

  const gradientColors = HERO_GRADIENTS[mission.type];
  const statusConf = STATUS_CONFIG[mission.status];
  const typeNote = getMissionTypeNote(mission);
  const typeInfo = getMissionTypeInfo(mission);

  const statusAccentColor =
    mission.status === 'completed'
      ? theme.colors.badgeCompletedText
      : mission.status === 'active'
      ? theme.colors.badgeActiveText
      : theme.colors.badgePlannedText;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient colors={gradientColors} style={styles.hero}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backLabel}>Missions</Text>
          </TouchableOpacity>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.heroIconWrapper}>
              <Text style={styles.heroIcon}>{TYPE_ICONS[mission.type]}</Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: statusConf.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusConf.text }]}>
                {statusConf.label}
              </Text>
            </View>

            <Text style={styles.heroName}>{mission.name}</Text>
            <Text style={styles.heroMeta}>
              {mission.agency} · {mission.year} · {TYPE_LABELS[mission.type]}
            </Text>
          </View>
        </LinearGradient>

        {/* Body */}
        <View style={styles.body}>
          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>MISSION BRIEF</Text>
            <Text style={styles.sectionTitle}>About This Mission</Text>
            <Text style={styles.descriptionText}>{mission.description}</Text>
          </View>

          {/* Highlights Section */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>KEY ACHIEVEMENTS</Text>
            <Text style={styles.sectionTitle}>Mission Highlights</Text>
            <View style={styles.highlightsList}>
              {mission.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <View style={styles.highlightBulletWrapper}>
                    <View style={styles.highlightBullet} />
                  </View>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>AT A GLANCE</Text>
            <Text style={styles.sectionTitle}>Mission Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                <StatCard label="Agency" value={mission.agency} />
                <StatCard label="Year" value={String(mission.year)} />
              </View>
              <View style={styles.statsRow}>
                <StatCard
                  label="Mission Type"
                  value={TYPE_LABELS[mission.type]}
                />
                <StatCard
                  label="Status"
                  value={statusConf.label}
                  accentColor={statusAccentColor}
                />
              </View>
              <View style={styles.statsRow}>
                <StatCard
                  label={typeInfo.label}
                  value={typeInfo.value}
                />
              </View>
            </View>
          </View>

          {/* Mission Type Info Section */}
          <View style={[styles.section, styles.infoSection]}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoIcon}>{TYPE_ICONS[mission.type]}</Text>
              <Text style={styles.infoEyebrow}>
                {TYPE_LABELS[mission.type].toUpperCase()} MISSION
              </Text>
            </View>
            <Text style={styles.infoText}>{typeNote}</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },

  // Hero
  hero: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    minHeight: 280,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: theme.spacing.md,
  },
  backIcon: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  backLabel: {
    ...theme.typography.label,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
  },
  heroContent: {
    alignItems: 'flex-start',
    paddingTop: theme.spacing.sm,
  },
  heroIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroIcon: {
    fontSize: 34,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
  },
  statusBadgeText: {
    ...theme.typography.label,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  heroName: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: -0.5,
    marginBottom: 6,
    lineHeight: 38,
  },
  heroMeta: {
    ...theme.typography.body,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },

  // Body
  body: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionEyebrow: {
    ...theme.typography.label,
    color: theme.colors.accent,
    letterSpacing: 2,
    marginBottom: 6,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

  // Description
  descriptionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },

  // Highlights
  highlightsList: {
    gap: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  highlightBulletWrapper: {
    paddingTop: 6,
  },
  highlightBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },
  highlightText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },

  // Stats
  statsGrid: {
    gap: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  // Info Section
  infoSection: {
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoEyebrow: {
    ...theme.typography.label,
    color: theme.colors.accent,
    letterSpacing: 2,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
});
