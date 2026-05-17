import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { missions } from '../data/missions';
import { MissionCard } from '../components/MissionCard';
import { FilterTab, Mission, MissionStatus } from '../types';

const FILTER_TABS: FilterTab[] = ['All', 'Past', 'Active', 'Future'];

const STATUS_FOR_FILTER: Record<FilterTab, MissionStatus | null> = {
  All: null,
  Past: 'completed',
  Active: 'active',
  Future: 'planned',
};

function MissionStats() {
  const completed = missions.filter((m) => m.status === 'completed').length;
  const active = missions.filter((m) => m.status === 'active').length;
  const planned = missions.filter((m) => m.status === 'planned').length;

  return (
    <View style={statStyles.row}>
      <View style={statStyles.item}>
        <Text style={statStyles.value}>{completed}</Text>
        <Text style={statStyles.label}>Completed</Text>
      </View>
      <View style={statStyles.divider} />
      <View style={statStyles.item}>
        <Text style={[statStyles.value, { color: theme.colors.info }]}>{active}</Text>
        <Text style={statStyles.label}>Active</Text>
      </View>
      <View style={statStyles.divider} />
      <View style={statStyles.item}>
        <Text style={[statStyles.value, { color: theme.colors.warning }]}>{planned}</Text>
        <Text style={statStyles.label}>Planned</Text>
      </View>
    </View>
  );
}

const statStyles = StyleSheet.create({
  row: { flexDirection: 'row', backgroundColor: theme.colors.backgroundCard, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md, padding: theme.spacing.md },
  item: { flex: 1, alignItems: 'center' },
  value: { fontSize: 28, fontWeight: '800', color: theme.colors.badgeCompletedText },
  label: { ...theme.typography.caption, color: theme.colors.textSecondary, textTransform: 'uppercase', marginTop: 2 },
  divider: { width: 1, backgroundColor: theme.colors.borderLight },
});

export default function MissionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');

  const filteredMissions = useMemo<Mission[]>(() => {
    const statusFilter = STATUS_FOR_FILTER[activeFilter];
    if (!statusFilter) return missions;
    return missions.filter((m) => m.status === statusFilter);
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={['#1A0500', theme.colors.background]} style={styles.header}>
        <Text style={styles.eyebrow}>EXPLORATION HISTORY</Text>
        <Text style={styles.title}>Mars Missions</Text>
        <Text style={styles.subtitle}>
          From the first landers in 1976 to humanity’s first crewed
          landing — every mission that gets us closer to Mars.
        </Text>
      </LinearGradient>

      <View style={styles.statsBar}>
        <MissionStats />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTER_TABS.map((tab) => {
            const isActive = tab === activeFilter;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveFilter(tab)}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredMissions.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛸</Text>
            <Text style={styles.emptyText}>No missions in this category</Text>
          </View>
        ) : (
          filteredMissions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))
        )}
        <View style={styles.timelineNote}>
          <Text style={styles.timelineNoteText}>
            🗓 Data accurate as of May 2026. Mission timelines may shift based on
            funding, technical readiness, and launch window constraints.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: theme.spacing.lg, paddingBottom: theme.spacing.md },
  eyebrow: { ...theme.typography.label, color: theme.colors.accent, letterSpacing: 2, marginBottom: 6 },
  title: { fontSize: 32, fontWeight: '800', color: theme.colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { ...theme.typography.body, color: theme.colors.textSecondary, marginTop: 8, lineHeight: 22 },
  statsBar: { paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
  filterContainer: { marginBottom: theme.spacing.sm },
  filterScroll: { paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm },
  filterTab: { paddingHorizontal: theme.spacing.md, paddingVertical: 8, borderRadius: theme.borderRadius.full, borderWidth: 1, borderColor: theme.colors.borderLight, backgroundColor: theme.colors.backgroundCard },
  filterTabActive: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  filterTabText: { ...theme.typography.label, color: theme.colors.textSecondary, fontSize: 13 },
  filterTabTextActive: { color: theme.colors.white },
  list: { flex: 1 },
  listContent: { paddingHorizontal: theme.spacing.md, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { ...theme.typography.body, color: theme.colors.textSecondary },
  timelineNote: { backgroundColor: theme.colors.backgroundCard, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.borderLight },
  timelineNoteText: { ...theme.typography.caption, color: theme.colors.textMuted, lineHeight: 16 },
});
