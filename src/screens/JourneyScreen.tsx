import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { journeySteps } from '../data/journeySteps';
import { JourneyStep } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.78;

function TimelineCard({ step, index }: { step: JourneyStep; index: number }) {
  const isLast = index === journeySteps.length - 1;
  return (
    <View style={[styles.timelineCard, { width: CARD_WIDTH }]}>
      <LinearGradient colors={[theme.colors.backgroundCard, '#1A0E0A']} style={styles.timelineCardGradient}>
        <View style={styles.stepIndicator}>
          <View style={styles.stepNumber}><Text style={styles.stepNumberText}>{step.stepNumber}</Text></View>
          {!isLast && <View style={styles.stepLine} />}
        </View>
        <View style={styles.timelineContent}>
          <Text style={styles.timelineIcon}>{step.icon}</Text>
          <Text style={styles.timelineTitle}>{step.title}</Text>
          {step.durationLabel && (<View style={styles.durationBadge}><Text style={styles.durationText}>{step.durationLabel}</Text></View>)}
          <Text style={styles.timelineSubtitle}>{step.subtitle}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

function StepDetail({ step }: { step: JourneyStep }) {
  return (
    <View style={styles.stepDetail}>
      <View style={styles.stepDetailHeader}>
        <View style={styles.stepDetailIconBox}><Text style={styles.stepDetailIcon}>{step.icon}</Text></View>
        <View style={styles.stepDetailMeta}>
          <Text style={styles.stepDetailNum}>Step {step.stepNumber}</Text>
          <Text style={styles.stepDetailTitle}>{step.title}</Text>
          <Text style={styles.stepDetailSubtitle}>{step.subtitle}</Text>
        </View>
      </View>
      <Text style={styles.stepDetailDescription}>{step.description}</Text>
      <View style={styles.keyFacts}>
        <Text style={styles.keyFactsTitle}>Key Facts</Text>
        {step.keyFacts.map((fact, i) => (
          <View key={i} style={styles.keyFactRow}>
            <Text style={styles.keyFactLabel}>{fact.label}</Text>
            <Text style={styles.keyFactValue}>{fact.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function JourneyScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#1A0500', theme.colors.background]} style={styles.header}>
          <Text style={styles.eyebrow}>THE MISSION PLAN</Text>
          <Text style={styles.title}>How We Get to Mars</Text>
          <Text style={styles.subtitle}>Six phases spanning 900 days — from launch to landing and back again.</Text>
        </LinearGradient>

        <View style={styles.timelineSection}>
          <Text style={styles.sectionLabel}>MISSION PHASES</Text>
          <FlatList horizontal data={journeySteps} keyExtractor={(item) => item.id} renderItem={({ item, index }) => (<TimelineCard step={item} index={index} />)} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timelineList} snapToInterval={CARD_WIDTH + theme.spacing.sm} decelerationRate="fast" />
          <Text style={styles.scrollHint}>← Swipe to see all phases →</Text>
        </View>

        <View style={styles.missionStats}>
          <Text style={styles.sectionLabel}>TOTAL MISSION PROFILE</Text>
          <View style={styles.missionStatsGrid}>
            <View style={styles.missionStatItem}><Text style={styles.missionStatValue}>~900</Text><Text style={styles.missionStatLabel}>Total days</Text></View>
            <View style={styles.missionStatDivider} />
            <View style={styles.missionStatItem}><Text style={styles.missionStatValue}>~14</Text><Text style={styles.missionStatLabel}>Months in space</Text></View>
            <View style={styles.missionStatDivider} />
            <View style={styles.missionStatItem}><Text style={styles.missionStatValue}>~500</Text><Text style={styles.missionStatLabel}>Days on Mars</Text></View>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionLabel}>PHASE DETAILS</Text>
          {journeySteps.map((step) => (<StepDetail key={step.id} step={step} />))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Why a Hohmann Transfer?</Text>
          <Text style={styles.infoBoxText}>A Hohmann transfer orbit is an elliptical path around the Sun connecting two circular orbits. It requires only two engine burns and uses the minimum possible fuel for the journey. The trade-off is time — the spacecraft must coast along this arc for ~7 months. Higher-energy "fast transit" trajectories are possible but require significantly more propellant, adding mass and cost. For crewed missions, faster transit times may be worth the extra fuel to reduce radiation exposure and physiological stress.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xl },
  eyebrow: { ...theme.typography.label, color: theme.colors.accent, letterSpacing: 2, marginBottom: 6 },
  title: { fontSize: 32, fontWeight: '800', color: theme.colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { ...theme.typography.body, color: theme.colors.textSecondary, marginTop: 8, lineHeight: 22 },
  timelineSection: { marginBottom: theme.spacing.md },
  sectionLabel: { ...theme.typography.label, color: theme.colors.accent, letterSpacing: 2, paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
  timelineList: { paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm },
  timelineCard: { borderRadius: theme.borderRadius.md, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  timelineCardGradient: { padding: theme.spacing.md, height: 180, justifyContent: 'space-between' },
  stepIndicator: { flexDirection: 'row', alignItems: 'center' },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.accent, justifyContent: 'center', alignItems: 'center' },
  stepNumberText: { color: theme.colors.white, fontWeight: '800', fontSize: 14 },
  stepLine: { flex: 1, height: 1, backgroundColor: theme.colors.accentDim, marginLeft: 8 },
  timelineContent: { gap: 4 },
  timelineIcon: { fontSize: 28 },
  timelineTitle: { ...theme.typography.h3, color: theme.colors.textPrimary },
  durationBadge: { alignSelf: 'flex-start', backgroundColor: theme.colors.accentDim, paddingHorizontal: 8, paddingVertical: 2, borderRadius: theme.borderRadius.full, borderWidth: 1, borderColor: theme.colors.accent },
  durationText: { ...theme.typography.caption, color: theme.colors.accent },
  timelineSubtitle: { ...theme.typography.caption, color: theme.colors.textSecondary, lineHeight: 16 },
  scrollHint: { ...theme.typography.caption, color: theme.colors.textMuted, textAlign: 'center', marginTop: theme.spacing.sm, letterSpacing: 0.5 },
  missionStats: { marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.md },
  missionStatsGrid: { flexDirection: 'row', backgroundColor: theme.colors.backgroundCard, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md, padding: theme.spacing.md },
  missionStatItem: { flex: 1, alignItems: 'center' },
  missionStatValue: { fontSize: 28, fontWeight: '800', color: theme.colors.accent },
  missionStatLabel: { ...theme.typography.caption, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 2, textTransform: 'uppercase' },
  missionStatDivider: { width: 1, backgroundColor: theme.colors.borderLight },
  detailsSection: { paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.md },
  stepDetail: { backgroundColor: theme.colors.backgroundCard, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, marginBottom: theme.spacing.md },
  stepDetailHeader: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.sm, alignItems: 'flex-start' },
  stepDetailIconBox: { width: 52, height: 52, borderRadius: theme.borderRadius.sm, backgroundColor: theme.colors.accentDim, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.accent },
  stepDetailIcon: { fontSize: 26 },
  stepDetailMeta: { flex: 1 },
  stepDetailNum: { ...theme.typography.caption, color: theme.colors.accent, textTransform: 'uppercase', letterSpacing: 1 },
  stepDetailTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, marginTop: 2 },
  stepDetailSubtitle: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, fontStyle: 'italic', marginTop: 2 },
  stepDetailDescription: { ...theme.typography.body, color: theme.colors.textSecondary, lineHeight: 22, marginBottom: theme.spacing.md },
  keyFacts: { backgroundColor: '#0F0F18', borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm, gap: 6 },
  keyFactsTitle: { ...theme.typography.label, color: theme.colors.accent, letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' },
  keyFactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  keyFactLabel: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, flex: 1 },
  keyFactValue: { ...theme.typography.bodySmall, color: theme.colors.textPrimary, fontWeight: '600', textAlign: 'right', flex: 1 },
  infoBox: { marginHorizontal: theme.spacing.md, backgroundColor: theme.colors.backgroundCard, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md, padding: theme.spacing.md, borderLeftWidth: 3, borderLeftColor: theme.colors.accent },
  infoBoxTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  infoBoxText: { ...theme.typography.body, color: theme.colors.textSecondary, lineHeight: 22 },
});
