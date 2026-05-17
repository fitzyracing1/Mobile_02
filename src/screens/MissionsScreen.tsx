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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { missions } from '../data/missions';
import { MissionCard } from '../components/MissionCard';
import { FilterTab, Mission, MissionStatus, MissionsStackParamList } from '../types';

type MissionsNavProp = NativeStackNavigationProp<MissionsStackParamList>;
type ViewMode = 'list' | 'timeline';

const FILTER_TABS: FilterTab[] = ['All', 'Past', 'Active', 'Future'];

const STATUS_FOR_FILTER: Record<FilterTab, MissionStatus | null> = {
  All: null,
  Past: 'completed',
  Active: 'active',
  Future: 'planned',
};

const STATUS_COLOR: Record<MissionStatus, string> = {
  completed: '#4CAF50',
  active: '#4FC3F7',
  planned: '#E8532A',
};

// ── Timeline layout ───────────────────────────────────────────
const TL_START_YEAR = 1975;
const PX_PER_YEAR = 78;
const H_PAD = 44;
const LINE_Y = 155;
const CARD_H = 104;
const CARD_W = 106;
const STICK_H = 22;
const ABOVE_CARD_TOP = LINE_Y - STICK_H - CARD_H; // 155 - 22 - 104 = 29
const BELOW_CARD_TOP = LINE_Y + STICK_H; // 177
const TL_VIEW_H = 290;

function xForYear(year: number): number {
  return H_PAD + (year - TL_START_YEAR) * PX_PER_YEAR;
}

interface MissionPosition {
  mission: Mission;
  x: number;
  isAbove: boolean;
}

function computePositions(): MissionPosition[] {
  const sorted = [...missions].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
  const groups: Record<number, Mission[]> = {};
  for (const m of sorted) {
    if (!groups[m.year]) groups[m.year] = [];
    groups[m.year].push(m);
  }

  return sorted.map((mission, idx) => {
    const group = groups[mission.year];
    const groupIdx = group.indexOf(mission);
    const count = group.length;
    let xOff = 0;
    if (count > 1) {
      const gap = CARD_W + 6;
      xOff = groupIdx * gap - ((count - 1) * gap) / 2;
    }
    return { mission, x: xForYear(mission.year) + xOff, isAbove: idx % 2 === 0 };
  });
}

const YEAR_TICKS = [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025, 2030, 2035];
const NOW_YEAR = 2026;

// ── Mission Timeline component ───────────────────────────────
function MissionTimeline() {
  const navigation = useNavigation<MissionsNavProp>();
  const positions = useMemo(computePositions, []);
  const totalW = Math.max(...positions.map((p) => p.x + CARD_W / 2)) + H_PAD + 20;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: TL_VIEW_H }}
        contentContainerStyle={{ width: totalW, height: TL_VIEW_H }}
      >
        {/* Backbone line */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: LINE_Y,
            width: totalW,
            height: 2,
            backgroundColor: theme.colors.borderLight,
          }}
        />

        {/* Year ticks */}
        {YEAR_TICKS.map((yr) => {
          const x = xForYear(yr);
          return (
            <React.Fragment key={yr}>
              <View
                style={{
                  position: 'absolute',
                  left: x - 0.5,
                  top: LINE_Y - 6,
                  width: 1,
                  height: 12,
                  backgroundColor: '#333346',
                }}
              />
              <Text
                style={{
                  position: 'absolute',
                  left: x - 18,
                  top: LINE_Y + 10,
                  width: 36,
                  fontSize: 10,
                  color: '#3A3A52',
                  textAlign: 'center',
                }}
              >
                {yr}
              </Text>
            </React.Fragment>
          );
        })}

        {/* NOW marker */}
        <View
          style={{
            position: 'absolute',
            left: xForYear(NOW_YEAR) - 1,
            top: LINE_Y - 22,
            width: 2,
            height: 44,
            backgroundColor: theme.colors.accent + '66',
          }}
        />
        <Text
          style={{
            position: 'absolute',
            left: xForYear(NOW_YEAR) - 16,
            top: LINE_Y - 34,
            width: 32,
            fontSize: 9,
            fontWeight: '800',
            color: theme.colors.accent,
            textAlign: 'center',
            letterSpacing: 0.5,
          }}
        >
          NOW
        </Text>

        {/* Mission nodes */}
        {positions.map(({ mission, x, isAbove }) => {
          const color = STATUS_COLOR[mission.status];
          const cardTop = isAbove ? ABOVE_CARD_TOP : BELOW_CARD_TOP;
          const stickTop = isAbove ? ABOVE_CARD_TOP + CARD_H : LINE_Y;

          return (
            <React.Fragment key={mission.id}>
              {/* Dot on timeline */}
              <View
                style={{
                  position: 'absolute',
                  left: x - 5,
                  top: LINE_Y - 5,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: color,
                  borderWidth: 2,
                  borderColor: theme.colors.background,
                }}
              />

              {/* Connecting stick */}
              <View
                style={{
                  position: 'absolute',
                  left: x - 0.5,
                  top: stickTop,
                  width: 1,
                  height: STICK_H,
                  backgroundColor: color + '55',
                }}
              />

              {/* Mission card */}
              <TouchableOpacity
                onPress={() => navigation.navigate('MissionDetail', { mission })}
                activeOpacity={0.8}
                style={{
                  position: 'absolute',
                  left: x - CARD_W / 2,
                  top: cardTop,
                  width: CARD_W,
                  height: CARD_H,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.backgroundCard,
                    borderRadius: 8,
                    padding: 7,
                    borderWidth: 1,
                    borderColor: color + '44',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: '800',
                      color: color,
                      letterSpacing: 0.3,
                      marginBottom: 2,
                    }}
                  >
                    {mission.year}
                  </Text>
                  <Text
                    numberOfLines={3}
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: theme.colors.textPrimary,
                      lineHeight: 15,
                      flex: 1,
                    }}
                  >
                    {mission.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 9,
                      color: theme.colors.textMuted,
                      marginTop: 2,
                    }}
                  >
                    {mission.agency}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                      marginTop: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: color,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 8,
                        color: color,
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: 0.3,
                      }}
                    >
                      {mission.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </ScrollView>

      {/* Legend + scroll hint */}
      <View style={tlStyles.legend}>
        {(Object.entries(STATUS_COLOR) as [MissionStatus, string][]).map(([status, color]) => (
          <View key={status} style={tlStyles.legendItem}>
            <View style={[tlStyles.legendDot, { backgroundColor: color }]} />
            <Text style={tlStyles.legendLabel}>{status}</Text>
          </View>
        ))}
        <Text style={tlStyles.scrollHint}>scroll →</Text>
      </View>
    </View>
  );
}

const tlStyles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 6,
    paddingBottom: 2,
    gap: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textTransform: 'capitalize',
  },
  scrollHint: {
    marginLeft: 'auto' as any,
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 0.3,
  },
});

// ── Mission Stats bar ─────────────────────────────────────────
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
  row: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.badgeCompletedText,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.borderLight,
  },
});

// ── Main Screen ───────────────────────────────────────────────
export default function MissionsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filteredMissions = useMemo<Mission[]>(() => {
    const statusFilter = STATUS_FOR_FILTER[activeFilter];
    if (!statusFilter) return missions;
    return missions.filter((m) => m.status === statusFilter);
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Fixed Header */}
      <LinearGradient colors={['#1A0500', theme.colors.background]} style={styles.header}>
        <Text style={styles.eyebrow}>EXPLORATION HISTORY</Text>
        <Text style={styles.title}>Mars Missions</Text>
        <Text style={styles.subtitle}>
          From the first landers in 1976 to humanity's first crewed landing — every
          mission that gets us closer to Mars.
        </Text>
      </LinearGradient>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <MissionStats />
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          onPress={() => setViewMode('list')}
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
          activeOpacity={0.75}
        >
          <Text style={[styles.toggleBtnText, viewMode === 'list' && styles.toggleBtnTextActive]}>
            ☰  List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode('timeline')}
          style={[styles.toggleBtn, viewMode === 'timeline' && styles.toggleBtnActive]}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.toggleBtnText,
              viewMode === 'timeline' && styles.toggleBtnTextActive,
            ]}
          >
            ⬌  Timeline
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'timeline' ? (
        /* ── Timeline view ── */
        <View style={styles.timelineWrapper}>
          <MissionTimeline />
          <View style={styles.timelineNote}>
            <Text style={styles.timelineNoteText}>
              Tap any mission to explore details. The orange line marks today (2026).
            </Text>
          </View>
        </View>
      ) : (
        /* ── List view ── */
        <>
          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {FILTER_TABS.map((tab) => {
                const isActive = tab === activeFilter;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveFilter(tab)}
                    style={[styles.filterTab, isActive && styles.filterTabActive]}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[styles.filterTabText, isActive && styles.filterTabTextActive]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Mission List */}
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
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

            <View style={styles.footerNote}>
              <Text style={styles.footerNoteText}>
                🗓 Data accurate as of May 2026. Mission timelines may shift based on funding,
                technical readiness, and launch window constraints.
              </Text>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  eyebrow: {
    ...theme.typography.label,
    color: theme.colors.accent,
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: 8,
    lineHeight: 22,
  },
  statsBar: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },

  // View mode toggle
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: theme.colors.accent,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    letterSpacing: 0.3,
  },
  toggleBtnTextActive: {
    color: theme.colors.white,
  },

  // Timeline
  timelineWrapper: {
    flex: 1,
  },
  timelineNote: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  timelineNoteText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },

  // Filter tabs
  filterContainer: {
    marginBottom: theme.spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.backgroundCard,
  },
  filterTabActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  filterTabText: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  filterTabTextActive: {
    color: theme.colors.white,
  },

  // Mission list
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 32,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  footerNote: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  footerNoteText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    lineHeight: 16,
  },
});
