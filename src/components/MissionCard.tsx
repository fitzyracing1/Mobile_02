import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Mission, MissionStatus, MissionType } from '../types';
import { theme } from '../theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

interface MissionCardProps {
  mission: Mission;
}

export function MissionCard({ mission }: MissionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusConf = STATUS_CONFIG[mission.status];

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
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
            {mission.agency} · {mission.year}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusConf.bg }]}>
          <Text style={[styles.badgeText, { color: statusConf.text }]}>
            {statusConf.label}
          </Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.description}>{mission.description}</Text>
          <View style={styles.highlights}>
            {mission.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <Text style={styles.bullet}>▸</Text>
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.expandLabel}>
          {expanded ? '▲ Less info' : '▼ More info'}
        </Text>
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
  body: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  highlights: {
    marginTop: theme.spacing.sm,
    gap: 6,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  bullet: {
    color: theme.colors.accent,
    fontSize: 13,
    lineHeight: 20,
  },
  highlightText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingVertical: 8,
    alignItems: 'center',
  },
  expandLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
