import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { theme } from '../theme';
import {
  getRoverSol,
  getMartianSeason,
  getDaysUntilOpposition,
} from '../utils/marsCalendar';

const TODAY = new Date('2026-05-17T00:00:00Z');

const CURIOSITY_LANDING    = new Date('2012-08-06T00:00:00Z').getTime();
const PERSEVERANCE_LANDING = new Date('2021-02-18T00:00:00Z').getTime();
const INGENUITY_DEPLOY     = new Date('2021-04-03T00:00:00Z').getTime();

interface RoverInfo {
  name: string;
  emoji: string;
  sol: number;
  status: 'Active' | 'Silent';
  location: string;
  note: string;
}

const ROVERS: RoverInfo[] = [
  {
    name: 'Curiosity',
    emoji: '🤖',
    sol: getRoverSol(CURIOSITY_LANDING, TODAY.getTime()),
    status: 'Active',
    location: 'Gale Crater',
    note: 'Studying ancient habitability',
  },
  {
    name: 'Perseverance',
    emoji: '🦾',
    sol: getRoverSol(PERSEVERANCE_LANDING, TODAY.getTime()),
    status: 'Active',
    location: 'Jezero Crater',
    note: 'Collecting samples for return mission',
  },
  {
    name: 'Ingenuity',
    emoji: '🚁',
    sol: getRoverSol(INGENUITY_DEPLOY, TODAY.getTime()),
    status: 'Silent',
    location: 'Jezero Crater',
    note: '72 flights · went silent Jan 2024',
  },
];

function PulsingDot() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.2, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.Text style={[styles.pulsingDot, { opacity }]}>🔴</Animated.Text>
  );
}

export function LiveOnMars() {
  const season = getMartianSeason(TODAY);
  const daysToOpposition = getDaysUntilOpposition(TODAY);

  return (
    <View>
      <View style={styles.header}>
        <PulsingDot />
        <Text style={styles.title}>Live on Mars</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.roverRow}
      >
        {ROVERS.map((rover) => (
          <View key={rover.name} style={styles.roverCard}>
            <View style={styles.roverCardTop}>
              <Text style={styles.roverEmoji}>{rover.emoji}</Text>
              <View
                style={[
                  styles.statusBadge,
                  rover.status === 'Active' ? styles.statusActive : styles.statusSilent,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    rover.status === 'Active' ? styles.statusActiveText : styles.statusSilentText,
                  ]}
                >
                  {rover.status}
                </Text>
              </View>
            </View>
            <Text style={styles.roverName}>{rover.name}</Text>
            <View style={styles.solRow}>
              <Text style={styles.solLabel}>SOL</Text>
              <Text style={styles.solNumber}>{rover.sol.toLocaleString()}</Text>
            </View>
            <Text style={styles.roverLocation}>{rover.location}</Text>
            <Text style={styles.roverNote}>{rover.note}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.seasonCard}>
        <View style={styles.seasonHeader}>
          <Text style={styles.seasonIcon}>🌍</Text>
          <View style={styles.seasonTitleBlock}>
            <Text style={styles.seasonLabel}>MARTIAN SEASON</Text>
            <Text style={styles.seasonName}>{season.season}</Text>
          </View>
          <View style={styles.lsBadge}>
            <Text style={styles.lsLabel}>Ls</Text>
            <Text style={styles.lsValue}>{season.ls}°</Text>
          </View>
        </View>
        <Text style={styles.seasonDesc}>{season.description}</Text>
      </View>

      <View style={styles.oppositionCard}>
        <Text style={styles.oppositionIcon}>🔭</Text>
        <View style={styles.oppositionBody}>
          <Text style={styles.oppositionTitle}>
            Mars Opposition in{' '}
            <Text style={styles.oppositionDays}>{daysToOpposition}</Text>{' '}
            days
          </Text>
          <Text style={styles.oppositionDate}>
            Feb 19, 2027 — closest approach to Earth
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  pulsingDot: { fontSize: 14 },
  title: { ...theme.typography.h3, color: theme.colors.textPrimary },
  roverRow: { paddingBottom: theme.spacing.sm, gap: theme.spacing.sm },
  roverCard: {
    width: 160,
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  roverCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm },
  roverEmoji: { fontSize: 26 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: theme.borderRadius.full, borderWidth: 1 },
  statusActive: { backgroundColor: theme.colors.badgeActive, borderColor: theme.colors.info },
  statusSilent: { backgroundColor: '#1E1E1E', borderColor: theme.colors.textMuted },
  statusText: { ...theme.typography.label, fontSize: 10 },
  statusActiveText: { color: theme.colors.info },
  statusSilentText: { color: theme.colors.textMuted },
  roverName: { ...theme.typography.h3, color: theme.colors.textPrimary, marginBottom: 4 },
  solRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginBottom: 4 },
  solLabel: { ...theme.typography.label, color: theme.colors.accent, fontSize: 10, letterSpacing: 1.5 },
  solNumber: { fontSize: 22, fontWeight: '800', color: theme.colors.white, letterSpacing: -0.5 },
  roverLocation: { ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 2 },
  roverNote: { ...theme.typography.caption, color: theme.colors.textMuted, fontSize: 10, lineHeight: 14, marginTop: 2 },
  seasonCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  seasonHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  seasonIcon: { fontSize: 26 },
  seasonTitleBlock: { flex: 1 },
  seasonLabel: { ...theme.typography.label, color: theme.colors.textMuted, fontSize: 10, letterSpacing: 1.5 },
  seasonName: { ...theme.typography.h3, color: theme.colors.textPrimary, fontSize: 15 },
  lsBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.accentDim,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lsLabel: { ...theme.typography.label, color: theme.colors.accent, fontSize: 9, letterSpacing: 1 },
  lsValue: { fontSize: 18, fontWeight: '800', color: theme.colors.accent, letterSpacing: -0.5 },
  seasonDesc: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, lineHeight: 18 },
  oppositionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  oppositionIcon: { fontSize: 28 },
  oppositionBody: { flex: 1 },
  oppositionTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, fontSize: 15 },
  oppositionDays: { color: theme.colors.accent, fontWeight: '800' },
  oppositionDate: { ...theme.typography.caption, color: theme.colors.textSecondary, marginTop: 3 },
});
