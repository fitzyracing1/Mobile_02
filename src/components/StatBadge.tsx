import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface StatBadgeProps {
  label: string;
  value: string;
  icon?: string;
  highlight?: boolean;
}

export function StatBadge({ label, value, icon, highlight = false }: StatBadgeProps) {
  return (
    <View style={[styles.container, highlight && styles.highlighted]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    minWidth: 80,
    flex: 1,
  },
  highlighted: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentDim,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  value: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
