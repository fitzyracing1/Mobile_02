import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';
import { markOnboardingSeen } from '../storage/onboarding';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Slide {
  id: string;
  content: React.ReactNode;
}

interface OnboardingScreenProps {
  onDone: () => void;
}

function WelcomeSlide() {
  return (
    <View style={slideStyles.container}>
      <LinearGradient
        colors={['#1A0500', '#3D1200', '#E8532A']}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={slideStyles.inner}>
        <Text style={slideStyles.eyebrow}>WELCOME TO</Text>
        <Text style={slideStyles.heroTitle}>Road to Mars</Text>
        <Text style={slideStyles.marsEmoji}>🔴</Text>
        <Text style={slideStyles.subtitle}>Your guide to humanity's greatest journey</Text>
      </View>
    </View>
  );
}

function WhatsInsideSlide() {
  const tabs = [
    { icon: '🔴', label: 'Overview', desc: "Today's distance to Mars" },
    { icon: '🚀', label: 'Journey', desc: 'How we get there' },
    { icon: '🛸', label: 'Missions', desc: 'Every Mars mission' },
    { icon: '📡', label: 'Facts', desc: 'Flip cards with Mars secrets' },
  ];
  return (
    <View style={slideStyles.container}>
      <View style={slideStyles.inner}>
        <Text style={slideStyles.slideTitle}>What's Inside</Text>
        <Text style={slideStyles.slideSubtitle}>Four sections packed with everything Mars</Text>
        <View style={slideStyles.tabsGrid}>
          {tabs.map((tab) => (
            <View key={tab.label} style={slideStyles.tabCard}>
              <LinearGradient
                colors={[theme.colors.backgroundCard, theme.colors.accentDim]}
                style={slideStyles.tabCardGradient}
              >
                <Text style={slideStyles.tabIcon}>{tab.icon}</Text>
                <Text style={slideStyles.tabLabel}>{tab.label}</Text>
                <Text style={slideStyles.tabDesc}>{tab.desc}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ReadySlide({ onDone }: { onDone: () => void }) {
  return (
    <View style={slideStyles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1A0800', '#2A1510']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={slideStyles.inner}>
        <Text style={slideStyles.rocketEmoji}>🚀</Text>
        <Text style={slideStyles.slideTitle}>Ready to Explore?</Text>
        <Text style={slideStyles.readyBody}>
          The next launch window is late 2026.{'\n'}The adventure starts now.
        </Text>
        <TouchableOpacity style={slideStyles.letsGoButton} onPress={onDone} activeOpacity={0.85}>
          <LinearGradient
            colors={[theme.colors.accent, theme.colors.accentSecondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={slideStyles.letsGoGradient}
          >
            <Text style={slideStyles.letsGoText}>Let's Go →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const SLIDES_COUNT = 3;

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const handleDone = async () => { await markOnboardingSeen(); onDone(); };
  const handleSkip = async () => { await markOnboardingSeen(); onDone(); };
  const handleNext = () => {
    const next = currentIndex + 1;
    if (next < SLIDES_COUNT) {
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentIndex(next);
    }
  };

  const slides: Slide[] = [
    { id: 'welcome', content: <WelcomeSlide /> },
    { id: 'whats-inside', content: <WhatsInsideSlide /> },
    { id: 'ready', content: <ReadySlide onDone={handleDone} /> },
  ];

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>{item.content}</View>
  );

  const onMomentumScrollEnd = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
  };

  const isLastSlide = currentIndex === SLIDES_COUNT - 1;

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
      />
      {!isLastSlide && (
        <SafeAreaView style={styles.skipContainer} edges={['top']}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}
      <SafeAreaView style={styles.bottomContainer} edges={['bottom']}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]} />
          ))}
        </View>
        {!isLastSlide && (
          <TouchableOpacity onPress={handleNext} style={styles.nextButton} activeOpacity={0.85}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },
  skipContainer: { position: 'absolute', top: 0, right: 0, left: 0, alignItems: 'flex-end', paddingHorizontal: theme.spacing.md },
  skipButton: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm },
  skipText: { ...theme.typography.body, color: 'rgba(255,255,255,0.55)' },
  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', paddingBottom: theme.spacing.lg, paddingHorizontal: theme.spacing.md, gap: theme.spacing.md },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { borderRadius: theme.borderRadius.full },
  dotActive: { width: 24, height: 8, backgroundColor: theme.colors.accent },
  dotInactive: { width: 8, height: 8, backgroundColor: 'rgba(255,255,255,0.25)' },
  nextButton: { backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: theme.borderRadius.full, paddingHorizontal: theme.spacing.xl, paddingVertical: 12, width: '100%', alignItems: 'center' },
  nextText: { ...theme.typography.h3, color: theme.colors.white },
});

const slideStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.xl, paddingBottom: 120 },
  eyebrow: { ...theme.typography.label, color: 'rgba(255,255,255,0.7)', letterSpacing: 3, marginBottom: theme.spacing.sm },
  heroTitle: { fontSize: 48, fontWeight: '900' as const, color: theme.colors.white, letterSpacing: -1.5, textAlign: 'center' },
  marsEmoji: { fontSize: 100, marginVertical: theme.spacing.xl, textAlign: 'center' },
  rocketEmoji: { fontSize: 80, marginBottom: theme.spacing.xl, textAlign: 'center' },
  subtitle: { ...theme.typography.h3, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 28 },
  slideTitle: { ...theme.typography.hero, color: theme.colors.white, textAlign: 'center', marginBottom: theme.spacing.sm },
  slideSubtitle: { ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.xl },
  tabsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, justifyContent: 'center', width: '100%' },
  tabCard: { width: (SCREEN_WIDTH - theme.spacing.xl * 2 - theme.spacing.sm) / 2, borderRadius: theme.borderRadius.md, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  tabCardGradient: { padding: theme.spacing.md, alignItems: 'center', gap: 6 },
  tabIcon: { fontSize: 32 },
  tabLabel: { ...theme.typography.h3, color: theme.colors.textPrimary, textAlign: 'center' },
  tabDesc: { ...theme.typography.bodySmall, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 17 },
  readyBody: { ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 26, marginBottom: theme.spacing.xxl },
  letsGoButton: { width: '100%', borderRadius: theme.borderRadius.full, overflow: 'hidden' },
  letsGoGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  letsGoText: { fontSize: 18, fontWeight: '700' as const, color: theme.colors.white, letterSpacing: 0.5 },
});
