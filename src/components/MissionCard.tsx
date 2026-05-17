import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Mission, MissionStatus, MissionType, MissionsStackParamList } from '../types';
import { theme } from '../theme';

type MissionsNavProp = NativeStackNavigationProp<MissionsStackParamList>;

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

const TYPE_ICONS: Record<MissionType, string> = {
  rover: '🤖',
  lander: '🛬',
  orbiter: '🛸',
  flyby: '💫',
  crewed: '👨‍🚀',
  'sample-return': '🧪',
};

const TYPE_LABELS: Record<MissionType, string> = {
  rover: 'Rover',
  orbiter: 'Orbiter',
  lander: 'Lander',
  crewed: 'Crewed',
  'sample-return': 'Sample Return',
  flyby: 'Flyby',
};

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const navigation = useNavigation<MissionsNavProp>();
  const statusConf = STATUS_CONFIG[mission.status];

  const handlePress = () => {
    navigation.navigate('MissionDetail', { mission });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Text style={styles.typeIcon}>{TYPE_ICONS[mission.type]}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{mission.name}</Text>
          <Text style={styles.meta}>
            {mission.agency} · {mission.year} · {TYPE_LABELS[mission.type]}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusConf.bg }]}>
          <Text style={[styles.badgeText, { color: statusConf.text }]}>
            {statusConf.label}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.previewText} numberOfLines={2}>
          {mission.description}
        </Text>
        <Text style={styles.tapLabel}>Tap to explore ›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.accentDim,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  meta: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    ...theme.typography.label,
    fontSize: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  previewText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    lineHeight: 18,
    marginBottom: 6,
  },
  tapLabel: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
});
