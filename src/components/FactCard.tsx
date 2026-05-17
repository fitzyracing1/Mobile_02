import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { MarsFact } from '../types';
import { theme } from '../theme';

interface FactCardProps {
  fact: MarsFact;
}

const CARD_HEIGHT_FRONT = 200;
const CARD_HEIGHT_BACK = 240;

export function FactCard({ fact }: FactCardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlipped = useRef(false);
  const [flipped, setFlipped] = useState(false);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  const handleFlip = () => {
    const next = !isFlipped.current;
    isFlipped.current = next;
    setFlipped(next);
    Animated.spring(flipAnim, {
      toValue: next ? 1 : 0,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  const cardHeight = flipped ? CARD_HEIGHT_BACK : CARD_HEIGHT_FRONT;

  return (
    <TouchableOpacity
      onPress={handleFlip}
      activeOpacity={1}
      style={[styles.container, { height: cardHeight }]}
    >
      {/* Front */}
      <Animated.View
        style={[
          styles.card,
          styles.front,
          {
            height: cardHeight,
            opacity: frontOpacity,
            transform: [{ rotateY: frontInterpolate }],
          },
        ]}
      >
        <Text style={styles.icon}>{fact.icon}</Text>
        <Text style={styles.title}>{fact.title}</Text>
        <Text style={styles.shortFact}>{fact.shortFact}</Text>
        <Text style={styles.tapHint}>Tap to learn more</Text>
      </Animated.View>

      {/* Back */}
      <Animated.View
        style={[
          styles.card,
          styles.back,
          {
            height: cardHeight,
            opacity: backOpacity,
            transform: [{ rotateY: backInterpolate }],
          },
        ]}
      >
        <Text style={styles.backTitle}>{fact.title}</Text>
        <ScrollView
          style={styles.detailScroll}
          showsVerticalScrollIndicator={false}
          scrollEnabled={flipped}
        >
          <Text style={styles.fullDetail}>{fact.fullDetail}</Text>
        </ScrollView>
        <Text style={styles.tapHint}>Tap to flip back</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backfaceVisibility: 'hidden',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
  },
  front: {
    backgroundColor: theme.colors.backgroundCard,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    backgroundColor: theme.colors.accentDim,
    borderColor: theme.colors.accent,
  },
  icon: {
    fontSize: 36,
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  shortFact: {
    ...theme.typography.bodySmall,
    color: theme.colors.accent,
    textAlign: 'center',
    fontWeight: '600',
  },
  tapHint: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  backTitle: {
    ...theme.typography.h3,
    color: theme.colors.accent,
    marginBottom: 8,
  },
  detailScroll: {
    flex: 1,
    marginBottom: 4,
  },
  fullDetail: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
});
