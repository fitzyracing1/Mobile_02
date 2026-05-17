import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { MarsFact } from '../types';
import { theme } from '../theme';

interface FactCardProps {
  fact: MarsFact;
}

export function FactCard({ fact }: FactCardProps) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlipped = useRef(false);

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
    isFlipped.current = !isFlipped.current;
    Animated.spring(flipAnim, {
      toValue: isFlipped.current ? 1 : 0,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={handleFlip}
      activeOpacity={1}
      style={styles.container}
    >
      {/* Front */}
      <Animated.View
        style={[
          styles.card,
          styles.front,
          {
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
            opacity: backOpacity,
            transform: [{ rotateY: backInterpolate }],
          },
        ]}
      >
        <Text style={styles.backTitle}>{fact.title}</Text>
        <Text style={styles.fullDetail}>{fact.fullDetail}</Text>
        <Text style={styles.tapHint}>Tap to flip back</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: theme.spacing.md,
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
  },
  front: {
    backgroundColor: theme.colors.backgroundCard,
    borderColor: theme.colors.border,
    alignItems: 'center',
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
  },
  backTitle: {
    ...theme.typography.h3,
    color: theme.colors.accent,
    marginBottom: 8,
  },
  fullDetail: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    flex: 1,
  },
});
