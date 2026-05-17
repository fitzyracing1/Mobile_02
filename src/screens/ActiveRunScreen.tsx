import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { RootStackParamList } from '../types';
import { useRunTracker } from '../hooks/useRunTracker';
import { saveRun } from '../storage/runs';
import { formatDuration, formatDistance, formatPace } from '../utils/formatters';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../theme';

type ActiveRunNavProp = StackNavigationProp<RootStackParamList, 'ActiveRun'>;

type Phase = 'pre' | 'running';

export default function ActiveRunScreen() {
  const navigation = useNavigation<ActiveRunNavProp>();
  const { runState, startRun, pauseRun, resumeRun, stopRun, resetRun, locationPermission } =
    useRunTracker();
  const [phase, setPhase] = useState<Phase>('pre');
  const [saving, setSaving] = useState(false);

  const vibrate = () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
  };

  const handleStart = useCallback(async () => {
    try {
      vibrate();
      await startRun();
      setPhase('running');
    } catch (error) {
      if (
        locationPermission === Location.PermissionStatus.DENIED ||
        locationPermission === Location.PermissionStatus.UNDETERMINED
      ) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location access in your device settings to track your run.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to start run. Please try again.');
      }
    }
  }, [startRun, locationPermission]);

  const handlePause = useCallback(() => {
    vibrate();
    pauseRun();
  }, [pauseRun]);

  const handleResume = useCallback(() => {
    vibrate();
    resumeRun();
  }, [resumeRun]);

  const handleStop = useCallback(() => {
    vibrate();
    Alert.alert(
      'End Run',
      'Are you sure you want to end this run?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Run',
          style: 'destructive',
          onPress: async () => {
            const finalState = stopRun();
            setSaving(true);
            try {
              if (finalState.distance > 0 || finalState.elapsed > 0) {
                const run = {
                  id: Date.now().toString() + Math.random().toString(36).slice(2),
                  date: new Date().toISOString(),
                  duration: finalState.elapsed,
                  distance: finalState.distance,
                  coordinates: finalState.coordinates,
                  avgPace:
                    finalState.distance > 0
                      ? finalState.elapsed / (finalState.distance / 1000)
                      : 0,
                };
                await saveRun(run);
                resetRun();
                navigation.navigate('RunDetail', { run });
              } else {
                resetRun();
                navigation.goBack();
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to save run.');
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  }, [stopRun, resetRun, navigation]);

  const handleDiscard = useCallback(() => {
    Alert.alert(
      'Discard Run',
      'Discard this run without saving?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            resetRun();
            navigation.goBack();
          },
        },
      ]
    );
  }, [resetRun, navigation]);

  const isActive = runState.status === 'active';
  const isPaused = runState.status === 'paused';
  const hasStarted = phase === 'running';

  if (!hasStarted) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.preRunContainer}>
          <View style={styles.preRunContent}>
            <Text style={styles.preRunIcon}>🏃</Text>
            <Text style={styles.preRunTitle}>Ready to Run?</Text>
            <Text style={styles.preRunSubtitle}>
              GPS will track your route and calculate distance automatically
            </Text>
          </View>

          <View style={styles.preRunActions}>
            <TouchableOpacity
              style={styles.bigStartButton}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Text style={styles.bigStartButtonText}>Start Run</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.75}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Status Indicator */}
      <View style={styles.statusBar}>
        <View
          style={[
            styles.statusDot,
            isActive ? styles.statusDotActive : styles.statusDotPaused,
          ]}
        />
        <Text style={styles.statusText}>
          {isActive ? 'TRACKING' : isPaused ? 'PAUSED' : 'STOPPED'}
        </Text>
      </View>

      {/* Primary Metric: Timer */}
      <View style={styles.primaryMetric}>
        <Text style={styles.timerLabel}>TIME</Text>
        <Text style={styles.timerValue}>{formatDuration(runState.elapsed)}</Text>
      </View>

      {/* Secondary Metric: Distance */}
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceValue}>{formatDistance(runState.distance)}</Text>
        <Text style={styles.distanceUnit}>km</Text>
      </View>

      {/* Pace Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{formatPace(runState.currentPace)}</Text>
          <Text style={styles.statCardLabel}>Current Pace</Text>
        </View>
        <View style={styles.statCardDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>{formatPace(runState.avgPace)}</Text>
          <Text style={styles.statCardLabel}>Avg Pace</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Pause / Resume */}
        {isActive ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={handlePause}
            activeOpacity={0.8}
          >
            <Text style={styles.controlButtonIcon}>⏸</Text>
            <Text style={styles.controlButtonText}>Pause</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.resumeButton]}
            onPress={handleResume}
            activeOpacity={0.8}
          >
            <Text style={styles.controlButtonIcon}>▶</Text>
            <Text style={styles.controlButtonText}>Resume</Text>
          </TouchableOpacity>
        )}

        {/* Stop */}
        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={handleStop}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.controlButtonIcon}>⏹</Text>
          <Text style={styles.controlButtonText}>{saving ? 'Saving...' : 'Stop'}</Text>
        </TouchableOpacity>
      </View>

      {/* Discard link */}
      <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
        <Text style={styles.discardButtonText}>Discard Run</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Pre-run
  preRunContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  preRunContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preRunIcon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  preRunTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  preRunSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
  preRunActions: {
    gap: SPACING.sm,
  },
  bigStartButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  bigStartButtonText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },

  // Active run
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.md,
    gap: SPACING.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: COLORS.success,
  },
  statusDotPaused: {
    backgroundColor: COLORS.pauseColor,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 2,
  },
  primaryMetric: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  timerLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  },
  timerValue: {
    fontSize: 72,
    fontWeight: '800',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  distanceValue: {
    fontSize: FONT_SIZES.display,
    fontWeight: '800',
    color: COLORS.accent,
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  distanceUnit: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statCardValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  statCardLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  statCardDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  controls: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xxl,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: 6,
  },
  pauseButton: {
    backgroundColor: COLORS.pauseColor,
  },
  resumeButton: {
    backgroundColor: COLORS.success,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  controlButtonIcon: {
    fontSize: 20,
    color: COLORS.white,
  },
  controlButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  discardButton: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  discardButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textTertiary,
    textDecorationLine: 'underline',
  },
});
