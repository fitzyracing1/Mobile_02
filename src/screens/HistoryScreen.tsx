import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Run, RootStackParamList } from '../types';
import { loadRuns, deleteRun } from '../storage/runs';
import { formatDistance, formatDuration, formatDate, formatTime, formatPace } from '../utils/formatters';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../theme';

type HistoryNavProp = StackNavigationProp<RootStackParamList>;

interface RunHistoryItemProps {
  run: Run;
  onPress: () => void;
  onDelete: () => void;
}

function RunHistoryItem({ run, onPress, onDelete }: RunHistoryItemProps) {
  const handleLongPress = () => {
    Alert.alert(
      'Delete Run',
      `Delete the run from ${formatDate(run.date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={onPress}
      onLongPress={handleLongPress}
      activeOpacity={0.75}
    >
      {/* Left accent bar */}
      <View style={styles.accentBar} />

      <View style={styles.historyItemContent}>
        {/* Header row */}
        <View style={styles.itemHeader}>
          <View>
            <Text style={styles.itemDate}>{formatDate(run.date)}</Text>
            <Text style={styles.itemTime}>{formatTime(run.date)}</Text>
          </View>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceBadgeText}>{formatDistance(run.distance)}</Text>
            <Text style={styles.distanceBadgeUnit}>km</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.itemStats}>
          <View style={styles.itemStat}>
            <Text style={styles.itemStatIcon}>⏱</Text>
            <Text style={styles.itemStatValue}>{formatDuration(run.duration)}</Text>
          </View>
          <View style={styles.itemStat}>
            <Text style={styles.itemStatIcon}>⚡</Text>
            <Text style={styles.itemStatValue}>{formatPace(run.avgPace)}</Text>
          </View>
          <View style={styles.itemStat}>
            <Text style={styles.itemStatIcon}>📍</Text>
            <Text style={styles.itemStatValue}>{run.coordinates.length} pts</Text>
          </View>
        </View>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const navigation = useNavigation<HistoryNavProp>();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRuns = useCallback(async () => {
    try {
      const data = await loadRuns();
      setRuns(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load run history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRuns();
    }, [fetchRuns])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRuns();
  };

  const handleRunPress = (run: Run) => {
    navigation.navigate('RunDetail', { run });
  };

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteRun(id);
        setRuns((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        Alert.alert('Error', 'Failed to delete run.');
      }
    },
    []
  );

  // Aggregate stats
  const totalRuns = runs.length;
  const totalDistance = runs.reduce((sum, r) => sum + r.distance, 0);
  const totalDuration = runs.reduce((sum, r) => sum + r.duration, 0);

  const renderRun = ({ item }: { item: Run }) => (
    <RunHistoryItem
      run={item}
      onPress={() => handleRunPress(item)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  const renderHeader = () => {
    if (runs.length === 0) return null;
    return (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>All Time</Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{totalRuns}</Text>
            <Text style={styles.summaryStatLabel}>Runs</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{formatDistance(totalDistance)}</Text>
            <Text style={styles.summaryStatLabel}>km Total</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStat}>
            <Text style={styles.summaryStatValue}>{formatDuration(totalDuration)}</Text>
            <Text style={styles.summaryStatLabel}>Time</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No runs recorded</Text>
      <Text style={styles.emptySubtitle}>Complete your first run to see it here</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Run History</Text>
        {runs.length > 0 && (
          <Text style={styles.headerSubtitle}>{totalRuns} run{totalRuns !== 1 ? 's' : ''} recorded</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.accent} style={styles.loader} />
      ) : (
        <FlatList
          data={runs}
          keyExtractor={(item) => item.id}
          renderItem={renderRun}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            runs.length === 0 && styles.emptyList,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.accent}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  loader: {
    marginTop: SPACING.xxl,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.accent,
  },
  summaryStatLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: COLORS.accent,
  },
  historyItemContent: {
    flex: 1,
    padding: SPACING.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  itemDate: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  itemTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  distanceBadgeText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '800',
    color: COLORS.accent,
  },
  distanceBadgeUnit: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  itemStats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  itemStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemStatIcon: {
    fontSize: 12,
  },
  itemStatValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textTertiary,
    paddingRight: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
