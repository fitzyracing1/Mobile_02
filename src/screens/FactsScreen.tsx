import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { marsFacts } from '../data/marsFacts';
import { FactCard } from '../components/FactCard';
import { MarsFact } from '../types';

type Category = 'All' | 'Atmosphere' | 'Geography' | 'Moons' | 'Comparison';
const CATEGORIES: Category[] = ['All', 'Atmosphere', 'Geography', 'Moons', 'Comparison'];
const CATEGORY_ICONS: Record<Category, string> = { All: '🔭', Atmosphere: '💨', Geography: '🗺️', Moons: '🌑', Comparison: '⚖️' };
const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  All: 'Everything you need to know about the Red Planet.',
  Atmosphere: 'Mars\'s thin, cold, CO₂-rich atmosphere — hostile but navigable.',
  Geography: 'From the tallest volcano to the deepest canyon — Mars is extreme.',
  Moons: 'Phobos and Deimos — two tiny captured asteroids orbiting Mars.',
  Comparison: 'How Mars stacks up against our home planet.',
};

export default function FactsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const filteredFacts = useMemo<MarsFact[]>(() => {
    if (selectedCategory === 'All') return marsFacts;
    return marsFacts.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#0A1A30', theme.colors.background]} style={styles.header}>
          <Text style={styles.eyebrow}>THE RED PLANET</Text>
          <Text style={styles.title}>Mars Facts</Text>
          <Text style={styles.subtitle}>Tap any card to flip it and reveal the full story.</Text>
        </LinearGradient>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll} style={styles.categoryScrollContainer}>
          {CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={[styles.categoryTab, isActive && styles.categoryTabActive]} activeOpacity={0.75}>
                <Text style={styles.categoryIcon}>{CATEGORY_ICONS[cat]}</Text>
                <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.categoryDesc}>
          <Text style={styles.categoryDescIcon}>{CATEGORY_ICONS[selectedCategory]}</Text>
          <Text style={styles.categoryDescText}>{CATEGORY_DESCRIPTIONS[selectedCategory]}</Text>
        </View>

        <View style={styles.countRow}>
          <Text style={styles.countText}>{filteredFacts.length} fact{filteredFacts.length !== 1 ? 's' : ''}</Text>
          <Text style={styles.countHint}>Tap cards to flip</Text>
        </View>

        <View style={styles.factsContainer}>
          {filteredFacts.map((fact) => (<FactCard key={fact.id} fact={fact} />))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>About These Facts</Text>
          <Text style={styles.infoBoxText}>Data sourced from NASA, ESA, and peer-reviewed planetary science publications. Mars distance calculations use real orbital mechanics based on Keplerian elements. Mission dates represent best current estimates as of May 2026 and are subject to revision.</Text>
        </View>

        <View style={styles.comparisonSection}>
          <Text style={styles.compTitle}>Mars vs Earth — At a Glance</Text>
          <View style={styles.compTable}>
            {[{label:'Diameter',earth:'12,742 km',mars:'6,779 km'},{label:'Mass',earth:'1.00 Earth',mars:'0.107 Earth'},{label:'Gravity',earth:'9.81 m/s²',mars:'3.72 m/s²'},{label:'Day length',earth:'24h 0m',mars:'24h 37m'},{label:'Year length',earth:'365.25 days',mars:'686.97 days'},{label:'Avg temperature',earth:'+15°C',mars:'−60°C'},{label:'Atmosphere',earth:'N₂/O₂',mars:'95% CO₂'},{label:'Atm. pressure',earth:'101,325 Pa',mars:'~610 Pa'},{label:'Moons',earth:'1 (Luna)',mars:'2 (Phobos, Deimos)'},{label:'Sun distance',earth:'1.00 AU',mars:'1.52 AU'}].map((row, i) => (
              <View key={i} style={[styles.compRow, i % 2 === 0 && styles.compRowAlt]}>
                <Text style={styles.compLabel}>{row.label}</Text>
                <Text style={styles.compEarth}>{row.earth}</Text>
                <Text style={styles.compMars}>{row.mars}</Text>
              </View>
            ))}
          </View>
          <View style={styles.compLegend}>
            <View style={styles.compLegendItem}><View style={[styles.compDot, { backgroundColor: theme.colors.info }]} /><Text style={styles.compLegendText}>Earth</Text></View>
            <View style={styles.compLegendItem}><View style={[styles.compDot, { backgroundColor: theme.colors.accent }]} /><Text style={styles.compLegendText}>Mars</Text></View>
          </View>
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
  categoryScrollContainer: { marginBottom: theme.spacing.sm },
  categoryScroll: { paddingHorizontal: theme.spacing.md, gap: theme.spacing.sm },
  categoryTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.md, paddingVertical: 8, borderRadius: theme.borderRadius.full, borderWidth: 1, borderColor: theme.colors.borderLight, backgroundColor: theme.colors.backgroundCard, gap: 6 },
  categoryTabActive: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  categoryIcon: { fontSize: 16 },
  categoryTabText: { ...theme.typography.label, color: theme.colors.textSecondary, fontSize: 13 },
  categoryTabTextActive: { color: theme.colors.white },
  categoryDesc: { flexDirection: 'row', alignItems: 'center', marginHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm, gap: theme.spacing.sm, backgroundColor: theme.colors.backgroundCard, borderRadius: theme.borderRadius.sm, padding: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.borderLight },
  categoryDescIcon: { fontSize: 24 },
  categoryDescText: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, flex: 1, lineHeight: 19 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.sm },
  countText: { ...theme.typography.label, color: theme.colors.accent, letterSpacing: 1, textTransform: 'uppercase' },
  countHint: { ...theme.typography.caption, color: theme.colors.textMuted },
  factsContainer: { paddingHorizontal: theme.spacing.md },
  infoBox: { marginHorizontal: theme.spacing.md, marginTop: theme.spacing.md, backgroundColor: theme.colors.backgroundCard, borderWidth: 1, borderColor: theme.colors.borderLight, borderRadius: theme.borderRadius.md, padding: theme.spacing.md },
  infoBoxTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, marginBottom: 6 },
  infoBoxText: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, lineHeight: 20 },
  comparisonSection: { marginHorizontal: theme.spacing.md, marginTop: theme.spacing.lg },
  compTitle: { ...theme.typography.h3, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  compTable: { borderRadius: theme.borderRadius.md, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  compRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: theme.spacing.sm, backgroundColor: theme.colors.backgroundCard },
  compRowAlt: { backgroundColor: '#101018' },
  compLabel: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, flex: 1.2, fontWeight: '500' },
  compEarth: { ...theme.typography.bodySmall, color: theme.colors.info, flex: 1, textAlign: 'center' },
  compMars: { ...theme.typography.bodySmall, color: theme.colors.accent, flex: 1, textAlign: 'right', fontWeight: '600' },
  compLegend: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.sm, justifyContent: 'flex-end' },
  compLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  compDot: { width: 10, height: 10, borderRadius: 5 },
  compLegendText: { ...theme.typography.caption, color: theme.colors.textSecondary },
});
