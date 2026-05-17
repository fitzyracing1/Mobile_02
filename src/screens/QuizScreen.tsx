import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ACCENT = '#E8532A';
const CORRECT_COLOR = '#4CAF50';
const WRONG_COLOR = '#E53935';

interface QuizQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
}

const QUESTIONS: QuizQuestion[] = [
  {
    question: 'What is the tallest volcano on Mars?',
    choices: ['Arsia Mons', 'Olympus Mons', 'Pavonis Mons', 'Ascraeus Mons'],
    correctIndex: 1,
  },
  {
    question: 'How long does a Hohmann transfer to Mars take?',
    choices: ['3 months', '5 months', '7 months', '12 months'],
    correctIndex: 2,
  },
  {
    question: 'What percentage of Mars\'s atmosphere is CO₂?',
    choices: ['78%', '21%', '50%', '95%'],
    correctIndex: 3,
  },
  {
    question: 'How often does a Mars launch window occur?',
    choices: ['Every 12 months', 'Every 26 months', 'Every 36 months', 'Every 18 months'],
    correctIndex: 1,
  },
  {
    question: 'What is the name of Mars\'s larger moon?',
    choices: ['Deimos', 'Europa', 'Phobos', 'Titan'],
    correctIndex: 2,
  },
  {
    question: 'What rover first used the sky crane landing system?',
    choices: ['Spirit', 'Opportunity', 'Curiosity', 'Perseverance'],
    correctIndex: 2,
  },
  {
    question: 'What is Mars\'s gravity as a percentage of Earth\'s?',
    choices: ['25%', '38%', '50%', '62%'],
    correctIndex: 1,
  },
  {
    question: 'What instrument on Perseverance produced oxygen on Mars?',
    choices: ['SHERLOC', 'PIXL', 'RIMFAX', 'MOXIE'],
    correctIndex: 3,
  },
  {
    question: 'How long is a Martian sol compared to an Earth day?',
    choices: ['23h 56m', '24h 0m', '24h 37m', '25h 12m'],
    correctIndex: 2,
  },
  {
    question: 'What is the maximum depth of Valles Marineris?',
    choices: ['3 km', '5 km', '7 km', '10 km'],
    correctIndex: 2,
  },
];

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

function getRating(score: number): string {
  if (score <= 3) return 'Keep exploring! 🔴';
  if (score <= 6) return 'Mars apprentice! 🚀';
  if (score <= 9) return 'Mars expert! 🛸';
  return 'Mission Commander! 🌌';
}

export default function QuizScreen() {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const choiceColors = useRef(
    QUESTIONS[0].choices.map(() => new Animated.Value(0))
  ).current;

  const resetChoiceAnims = () => {
    choiceColors.forEach((anim) => anim.setValue(0));
  };

  const handleAnswer = (index: number) => {
    if (selectedIndex !== null) return;

    const question = QUESTIONS[currentQuestion];
    const isCorrect = index === question.correctIndex;

    setSelectedIndex(index);
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    const flashTargets: { anim: Animated.Value; value: number }[] = [];
    flashTargets.push({ anim: choiceColors[index], value: isCorrect ? 1 : 2 });
    if (!isCorrect) {
      flashTargets.push({ anim: choiceColors[question.correctIndex], value: 1 });
    }

    flashTargets.forEach(({ anim, value }) => {
      Animated.timing(anim, {
        toValue: value,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    setTimeout(() => {
      const next = currentQuestion + 1;
      if (next >= QUESTIONS.length) {
        setIsFinished(true);
        return;
      }

      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        slideAnim.setValue(SCREEN_WIDTH);
        resetChoiceAnims();
        setSelectedIndex(null);
        setCurrentQuestion(next);

        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 900);
  };

  const handleRetry = () => {
    resetChoiceAnims();
    slideAnim.setValue(0);
    setCurrentQuestion(0);
    setSelectedIndex(null);
    setScore(0);
    setIsFinished(false);
  };

  const handleBackToFacts = () => {
    navigation.goBack();
  };

  const progressPercent = ((currentQuestion + (selectedIndex !== null ? 1 : 0)) / QUESTIONS.length) * 100;

  if (isFinished) {
    const rating = getRating(score);
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <LinearGradient
          colors={['#0A1A30', theme.colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView
          contentContainerStyle={styles.resultsScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.resultsEmoji}>
            {score === 10 ? '🌌' : score >= 7 ? '🛸' : score >= 4 ? '🚀' : '🔴'}
          </Text>
          <Text style={styles.resultsTitle}>Quiz Complete!</Text>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreNumber}>
              {score}<Text style={styles.scoreOutOf}>/10</Text>
            </Text>
            <Text style={styles.scoreLabel}>correct</Text>
          </View>
          <Text style={styles.ratingText}>{rating}</Text>

          <View style={styles.resultsDivider} />

          <Text style={styles.resultsBreakdownTitle}>Question Breakdown</Text>
          {QUESTIONS.map((q, i) => (
            <View key={i} style={styles.breakdownRow}>
              <Text style={styles.breakdownNum}>{i + 1}</Text>
              <Text style={styles.breakdownQ} numberOfLines={2}>{q.question}</Text>
              <Text style={styles.breakdownAnswer}>
                {CHOICE_LABELS[q.correctIndex]}
              </Text>
            </View>
          ))}

          <View style={styles.resultsActions}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[ACCENT, theme.colors.accentSecondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.retryGradient}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToFacts}
              activeOpacity={0.75}
            >
              <Text style={styles.backText}>← Back to Facts</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const question = QUESTIONS[currentQuestion];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient
        colors={['#0A1A30', theme.colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackToFacts}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </Text>
          <Text style={styles.scoreInProgress}>Score: {score}</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>

      <Animated.View
        style={[
          styles.questionContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>Q{currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>

        <View style={styles.choicesContainer}>
          {question.choices.map((choice, index) => {
            const colorAnim = choiceColors[index];

            const bgColor = colorAnim.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                theme.colors.backgroundCard,
                CORRECT_COLOR + '33',
                WRONG_COLOR + '33',
              ],
            });

            const borderColor = colorAnim.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                theme.colors.borderLight,
                CORRECT_COLOR,
                WRONG_COLOR,
              ],
            });

            const labelBg = colorAnim.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                theme.colors.backgroundSecondary,
                CORRECT_COLOR,
                WRONG_COLOR,
              ],
            });

            const labelColor = colorAnim.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                theme.colors.textSecondary,
                '#FFFFFF',
                '#FFFFFF',
              ],
            });

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswer(index)}
                activeOpacity={selectedIndex !== null ? 1 : 0.75}
                disabled={selectedIndex !== null}
              >
                <Animated.View
                  style={[
                    styles.choiceRow,
                    { backgroundColor: bgColor, borderColor },
                  ]}
                >
                  <Animated.View
                    style={[styles.choiceLabel, { backgroundColor: labelBg }]}
                  >
                    <Animated.Text
                      style={[styles.choiceLabelText, { color: labelColor }]}
                    >
                      {CHOICE_LABELS[index]}
                    </Animated.Text>
                  </Animated.View>
                  <Text style={styles.choiceText}>{choice}</Text>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  scoreInProgress: {
    ...theme.typography.label,
    color: ACCENT,
    letterSpacing: 0.5,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ACCENT,
    borderRadius: theme.borderRadius.full,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  questionCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  questionNumber: {
    ...theme.typography.label,
    color: ACCENT,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    lineHeight: 28,
  },
  choicesContainer: {
    gap: theme.spacing.sm,
  },
  choiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  choiceLabel: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLabelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  choiceText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  resultsScroll: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  resultsEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  resultsTitle: {
    ...theme.typography.hero,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  scoreBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: ACCENT + '55',
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: ACCENT,
    lineHeight: 64,
  },
  scoreOutOf: {
    fontSize: 32,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  scoreLabel: {
    ...theme.typography.label,
    color: theme.colors.textSecondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  ratingText: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  resultsDivider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    width: '100%',
    marginVertical: theme.spacing.md,
  },
  resultsBreakdownTitle: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    gap: theme.spacing.sm,
  },
  breakdownNum: {
    ...theme.typography.label,
    color: ACCENT,
    width: 20,
    textAlign: 'center',
  },
  breakdownQ: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  breakdownAnswer: {
    ...theme.typography.label,
    color: CORRECT_COLOR,
    width: 20,
    textAlign: 'center',
  },
  resultsActions: {
    width: '100%',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  retryButton: {
    width: '100%',
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  backButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    backgroundColor: theme.colors.backgroundCard,
  },
  backText: {
    ...theme.typography.h3,
    color: theme.colors.textSecondary,
  },
});
