import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { journeySteps } from '../data/journeySteps';
import { JourneyStep } from '../types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACCENT = '#E8532A';
const LINE_MUTED = '#2A2A35';
const BADGE_MUTED = '#1E1E2A';
const TOTAL_STEPS = journeySteps.length;

// Only phase 1 is "current" — humanity is at early missions stage
function getPhaseStatus(stepNumber: number): 'current' | 'future' {
  return stepNumber === 1 ? 'current' : 'future';
}

interface TimelineItemProps {
  step: JourneyStep;
  isLast: boolean;
}

function TimelineItem({ step, isLast }: TimelineItemProps) {
  const [expanded, setExpanded] = useState(false);
  const status = getPhaseStatus(step.stepNumber);
  const isCurrent = status === 'current';
  const lineColor = isCurrent ? ACCENT : LINE_MUTED;
  const badgeBg = isCurrent ? ACCENT : BADGE_MUTED;
  const badgeText = isCurrent ? theme.colors.white : theme.colors.textMuted;

  function toggleExpanded() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }

  // Split keyFacts into pairs for 2-column layout
  const factPairs: Array<[typeof step.keyFacts[0], typeof step.keyFacts[0] | null]> = [];
  for (let i = 0; i < step.keyFacts.length; i += 2) {
    factPairs.push([step.keyFacts[i], step.keyFacts[i + 1] ?? null]);
  }

  return (
    <View style={styles.timelineItem}>
      {/* Left column: line + badge */}
      <View style={styles.timelineLeft}>
        {/* Top segment of the vertical line (above badge) */}
        <View style={[styles.lineSegmentTop, { backgroundColor: lineColor }]} />
        {/* Step badge */}
        <View style={[styles.stepBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.stepBadgeText, { color: badgeText }]}>
            {step.stepNumber}
          </Text>
        </View>
        {/* Bottom segment of the vertical line (below badge, hidden for last item) */}
        {!isLast ? (
          <View style={[styles.lineSegmentBottom, { backgroundColor: LINE_MUTED }]} />
        ) : (
          <View style={styles.lineSegmentBottomEmpty} />
        )}
      </View>

      {/* Right column: card */}
      <TouchableOpacity
        style={[
          styles.card,
          isCurrent && styles.cardCurrent,
        ]}
        onPress={toggleExpanded}
        activeOpacity={0.85}
      >
        {/* Card header row: icon + phase label + duration */}
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardIcon}>{step.icon}</Text>
          <View style={styles.cardHeaderMeta}>
            <Text style={[styles.phaseLabel, isCurrent && styles.phaseLabelCurrent]}>
              PHASE {step.stepNumber}
              {isCurrent ? '  •  CURRENT ERA' : ''}
            </Text>
            {step.durationLabel && (
              <View style={[styles.durationPill, isCurrent && styles.durationPillCurrent]}>
                <Text style={[styles.durationPillText, isCurrent && styles.durationPillTextCurrent]}>
                  {step.durationLabel}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Title + subtitle */}
        <Text style={styles.cardTitle}>{step.title}</Text>
        <Text style={styles.cardSubtitle}>{step.subtitle}</Text>

        {/* Expanded content */}
        {expanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedDivider} />
            <Text style={styles.descriptionText}>{step.description}</Text>

            {/* Key facts table */}
            <View style={styles.keyFactsContainer}>
              <Text style={styles.keyFactsHeading}>KEY FACTS</Text>
              {factPairs.map((pair, pairIndex) => (
                <View key={pairIndex} style={styles.factRow}>
                  <View style={styles.factCell}>
                    <Text style={styles.factLabel}>{pair[0].label}</Text>
                    <Text style={styles.factValue}>{pair[0].value}</Text>
                  </View>
                  {pair[1] ? (
                    <>
                      <View style={styles.factCellDivider} />
                      <View style={styles.factCell}>
                        <Text style={styles.factLabel}>{pair[1].label}</Text>
                        <Text style={styles.factValue}>{pair[1].value}</Text>
                      </View>
                    </>
                  ) : (
                    <View style={styles.factCell} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Expand/collapse affordance */}
        <View style={styles.expandToggle}>
          <Text style={styles.expandToggleText}>
            {expanded ? '▲  Close' : '▼  Details'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function JourneyScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero header ── */}
        <LinearGradient
          colors={['#0D1B3E', theme.colors.background]}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>🚀 The Road to Mars</Text>
          <Text style={styles.heroSubtitle}>
            6 Phases · ~900 Days · ~1.5M km
          </Text>
        </LinearGradient>

        {/* ── Vertical timeline ── */}
        <View style={styles.timelineContainer}>
          {journeySteps.map((step, index) => (
            <TimelineItem
              key={step.id}
              step={step}
              isLast={index === TOTAL_STEPS - 1}
            />
          ))}
        </View>

        {/* ── Mission Stats card ── */}
        <View style={styles.statsCard}>
          <Text style={styles.statsHeading}>MISSION STATS</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>~900</Text>
              <Text style={styles.statLabel}>Total days</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>~1.5M</Text>
              <Text style={styles.statLabel}>km to Mars</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>~500</Text>
              <Text style={styles.statLabel}>Days on surface</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>~7mo</Text>
              <Text style={styles.statLabel}>Return journey</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BADGE_SIZE = 32;
const LINE_WIDTH = 2;
const LEFT_COL_WIDTH = 48; // width of the left timeline column

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },

  // ── Hero ──────────────────────────────────────────────────
  hero: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    textAlign: 'center',
  },

  // ── Timeline container ────────────────────────────────────
  timelineContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: 4,
  },

  // ── Timeline item ─────────────────────────────────────────
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  // Left column
  timelineLeft: {
    width: LEFT_COL_WIDTH,
    alignItems: 'center',
  },
  lineSegmentTop: {
    width: LINE_WIDTH,
    height: 20,
  },
  stepBadge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  lineSegmentBottom: {
    width: LINE_WIDTH,
    flex: 1,
    minHeight: 16,
  },
  lineSegmentBottomEmpty: {
    width: LINE_WIDTH,
    height: 16,
  },

  // Right column: card
  card: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing.md,
    overflow: 'hidden',
  },
  cardCurrent: {
    borderColor: ACCENT,
    borderWidth: 1.5,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  cardIcon: {
    fontSize: 32,
    lineHeight: 38,
  },
  cardHeaderMeta: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  phaseLabelCurrent: {
    color: ACCENT,
  },
  durationPill: {
    backgroundColor: theme.colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  durationPillCurrent: {
    backgroundColor: '#2A1510',
    borderWidth: 1,
    borderColor: ACCENT,
  },
  durationPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  durationPillTextCurrent: {
    color: ACCENT,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },

  // Expanded content
  expandedContent: {
    marginTop: 8,
  },
  expandedDivider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: 14,
  },

  // Key facts table
  keyFactsContainer: {
    backgroundColor: '#0D0D16',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: 4,
  },
  keyFactsHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: ACCENT,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  factRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingVertical: 6,
  },
  factCell: {
    flex: 1,
    paddingHorizontal: 4,
    gap: 2,
  },
  factCellDivider: {
    width: 1,
    backgroundColor: theme.colors.borderLight,
    marginHorizontal: 6,
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textMuted,
    lineHeight: 15,
  },
  factValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },

  // Toggle affordance
  expandToggle: {
    marginTop: 10,
    alignItems: 'center',
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },

  // ── Mission stats card ────────────────────────────────────
  statsCard: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  statsHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: ACCENT,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: ACCENT,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.borderLight,
  },
});