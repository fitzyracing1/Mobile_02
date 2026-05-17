import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { deleteRun } from '../storage/runs';
import {
  formatDistance,
  formatDuration,
  formatDate,
  formatTime,
  formatPace,
} from '../utils/formatters';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../theme';

type RunDetailNavProp = StackNavigationProp<RootStackParamList, 'RunDetail'>;
type RunDetailRouteProp = RouteProp<RootStackParamList, 'RunDetail'>;

interface StatRowProps {
  label: string;
  value: string;
  accent?: boolean;
}

function StatRow({ label, value, accent }: StatRowProps) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statRowLabel}>{label}</Text>
      <Text style={[styles.statRowValue, accent && styles.statRowValueAccent]}>
        {value}
      </Text>
    </View>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
}

function StatCard({ icon, label, value, unit }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statCardIcon}>{icon}</Text>
      <Text style={styles.statCardValue}>
        {value}
        {unit ? <Text style={styles.statCardUnit}> {unit}</Text> : null}
      </Text>
      <Text style={styles.statCardLabel}>{label}</Text>
    </View>
  );
}

export default function RunDetailScreen() {
  const navigation = useNavigation<RunDetailNavProp>();
  const route = useRoute<RunDetailRouteProp>();
  const { run } = route.params;

  const speedKmh =
    run.duration > 0 ? (run.distance / 1000) / (run.duration / 3600) : 0;

  const handleDelete = () => {
    Alert.alert(
      'Delete Run',
      'Are you sure you want to delete this run? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRun(run.id);
              // Navigate back to history or home
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete run.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButtonText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Run Details</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero section */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Completed Run</Text>
          </View>
          <View style={styles.heroDistance}>
            <Text style={styles.heroDistanceValue}>{formatDistance(run.distance)}</Text>
            <Text style={styles.heroDistanceUnit}>km</Text>
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroDate}>{formatDate(run.date)}</Text>
            <Text style={styles.heroDot}> · </Text>
            <Text style={styles.heroTime}>{formatTime(run.date)}</Text>
          </View>
        </View>

        {/* Primary stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="⏱"
            label="Duration"
            value={formatDuration(run.duration)}
          />
          <StatCard
            icon="⚡"
            label="Avg Pace"
            value={formatPace(run.avgPace)}
          />
          <StatCard
            icon="🚀"
            label="Avg Speed"
            value={speedKmh.toFixed(1)}
            unit="km/h"
          />
          <StatCard
            icon="📍"
            label="GPS Points"
            value={String(run.coordinates.length)}
          />
        </View>

        {/* Detailed breakdown */}
        <View style={styles.detailCard}>
          <Text style={styles.detailCardTitle}>Breakdown</Text>

          <StatRow
            label="Distance"
            value={`${formatDistance(run.distance)} km`}
            accent
          />
          <View style={styles.divider} />
          <StatRow label="Duration" value={formatDuration(run.duration)} />
          <View style={styles.divider} />
          <StatRow label="Average Pace" value={formatPace(run.avgPace)} />
          <View style={styles.divider} />
          <StatRow label="Average Speed" value={`${speedKmh.toFixed(2)} km/h`} />
          <View style={styles.divider} />
          <StatRow label="Date" value={formatDate(run.date)} />
          <View style={styles.divider} />
          <StatRow label="Start Time" value={formatTime(run.date)} />
          <View style={styles.divider} />
          <StatRow
            label="GPS Track Points"
            value={`${run.coordinates.length} points`}
          />
        </View>

        {/* Milestones section */}
        {run.distance >= 1000 && (
          <View style={styles.milestonesCard}>
            <Text style={styles.milestonesTitle}>Milestones</Text>
            <View style={styles.milestonesList}>
              {run.distance >= 1000 && (
                <View style={styles.milestone}>
                  <Text style={styles.milestoneIcon}>🏅</Text>
                  <Text style={styles.milestoneText}>Completed 1km</Text>
                </View>
              )}
              {run.distance >= 5000 && (
                <View style={styles.milestone}>
                  <Text style={styles.milestoneIcon}>🥈</Text>
                  <Text style={styles.milestoneText}>Completed 5km</Text>
                </View>
              )}
              {run.distance >= 10000 && (
                <View style={styles.milestone}>
                  <Text style={styles.milestoneIcon}>🥇</Text>
                  <Text style={styles.milestoneText}>Completed 10km</Text>
                </View>
              )}
              {run.distance >= 21097 && (
                <View style={styles.milestone}>
                  <Text style={styles.milestoneIcon}>🏆</Text>
                  <Text style={styles.milestoneText}>Half Marathon!</Text>
                </View>
              )}
              {run.distance >= 42195 && (
                <View style={styles.milestone}>
                  <Text style={styles.milestoneIcon}>🌟</Text>
                  <Text style={styles.milestoneText}>Full Marathon!</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    minWidth: 60,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.accent,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  deleteButton: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  deleteButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },

  // Hero card
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroBadge: {
    backgroundColor: COLORS.accentDark,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.md,
  },
  heroBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
  },
  heroDistance: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  heroDistanceValue: {
    fontSize: 64,
    fontWeight: '800',
    color: COLORS.accent,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  heroDistanceUnit: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  heroDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  heroDot: {
    color: COLORS.textTertiary,
  },
  heroTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  statCardIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  statCardUnit: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  statCardLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Detail card
  detailCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailCardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  statRowLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  statRowValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statRowValueAccent: {
    color: COLORS.accent,
    fontSize: FONT_SIZES.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // Milestones
  milestonesCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  milestonesTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  milestonesList: {
    gap: SPACING.sm,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  milestoneIcon: {
    fontSize: 20,
  },
  milestoneText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});
