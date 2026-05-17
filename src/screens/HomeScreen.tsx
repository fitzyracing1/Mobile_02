import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Run, RootStackParamList } from '../types';
import { loadRuns } from '../storage/runs';
import { formatDistance, formatDuration, formatDate, formatPace } from '../utils/formatters';
import { COLORS, SPACING, FONT_SIZES } from '../theme';

type HomeNavProp = StackNavigationProp<RootStackParamList>;

interface RunCardProps {
  run: Run;
  onPress: () => void;
}

function RunCard({ run, onPress }: RunCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{formatDate(run.date)}</Text>
        <Text style={styles.cardDistance}>{formatDistance(run.distance)} km</Text>
      </View>
      <View style={styles.cardStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatDuration(run.duration)}</Text>
          <Text style={styles.statLabel}>Duration</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatPace(run.avgPace)}</Text>
          <Text style={styles.statLabel}>Avg Pace</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{formatDistance(run.distance)}</Text>
          <Text style={styles.statLabel}>km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavProp>();
  const [recentRuns, setRecentRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRuns = useCallback(async () => {
    try {
      const runs = await loadRuns();
      setRecentRuns(runs.slice(0, 5));
    } catch (error) {
      Alert.alert('Error', 'Failed to load recent runs.');
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

  const handleStartRun = () => {
    navigation.navigate('ActiveRun');
  };

  const handleRunPress = (run: Run) => {
    navigation.navigate('RunDetail', { run });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRuns();
  };

  const renderRun = ({ item }: { item: Run }) => (
    <RunCard run={item} onPress={() => handleRunPress(item)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🏃</Text>
      <Text style={styles.emptyTitle}>No runs yet</Text>
      <Text style={styles.emptySubtitle}>Start your first run to see it here</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Running Tracker</Text>
        <Text style={styles.headerSubtitle}>Ready to crush it today?</Text>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartRun}
        activeOpacity={0.85}
      >
        <View style={styles.startButtonInner}>
          <Text style={styles.startButtonIcon}>▶</Text>
          <Text style={styles.startButtonText}>Start Run</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Runs</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.accent} style={styles.loader} />
        ) : (
          <FlatList
            data={recentRuns}
            keyExtractor={(item) => item.id}
            renderItem={renderRun}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={recentRuns.length === 0 ? styles.emptyList : undefined}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={COLORS.accent}
              />
            }
          />
        )}
      </View>
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
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  startButton: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  startButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  startButtonIcon: {
    fontSize: 22,
    color: COLORS.white,
  },
  startButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  recentSection: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  loader: {
    marginTop: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  cardDistance: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.accent,
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
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
