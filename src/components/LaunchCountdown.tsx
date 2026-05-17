import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

const TARGET_DATE = new Date('2026-12-01T00:00:00Z');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = Math.max(0, TARGET_DATE.getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.rocketIcon}>🚀</Text>
        <Text style={styles.title}>Next Launch Window</Text>
      </View>
      <View style={styles.grid}>
        <View style={styles.timeBox}>
          <Text style={styles.number}>{pad(timeLeft.days)}</Text>
          <Text style={styles.label}>DAYS</Text>
        </View>
        <View style={styles.separator}><Text style={styles.colon}>:</Text></View>
        <View style={styles.timeBox}>
          <Text style={styles.number}>{pad(timeLeft.hours)}</Text>
          <Text style={styles.label}>HRS</Text>
        </View>
        <View style={styles.separator}><Text style={styles.colon}>:</Text></View>
        <View style={styles.timeBox}>
          <Text style={styles.number}>{pad(timeLeft.minutes)}</Text>
          <Text style={styles.label}>MIN</Text>
        </View>
        <View style={styles.separator}><Text style={styles.colon}>:</Text></View>
        <View style={styles.timeBox}>
          <Text style={styles.number}>{pad(timeLeft.seconds)}</Text>
          <Text style={styles.label}>SEC</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Dec 2026 · Earth–Mars alignment</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  rocketIcon: { fontSize: 20 },
  title: { ...theme.typography.h3, color: theme.colors.textPrimary },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: theme.spacing.md,
  },
  timeBox: {
    alignItems: 'center',
    minWidth: 60,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  number: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.accent,
    letterSpacing: 1,
    lineHeight: 38,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  separator: { alignItems: 'center', paddingBottom: 18 },
  colon: { fontSize: 24, fontWeight: '800', color: theme.colors.accent, opacity: 0.6 },
  subtitle: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, letterSpacing: 0.3 },
});
