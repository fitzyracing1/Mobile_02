import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { getMartianSeason } from '../utils/marsCalendar';
import { useSettings } from '../context/SettingsContext';

const TODAY = new Date('2026-05-17');

type DustLevel = 'Low' | 'Moderate' | 'High' | 'Extreme';

interface WeatherSnapshot {
  icon: string;
  skyDesc: string;
  lowC: number;
  highC: number;
  windKph: string;
  dustLevel: DustLevel;
  dustColor: string;
  hazardNote: string;
}

const DUST_COLORS: Record<DustLevel, string> = {
  Low: '#4CAF50',
  Moderate: '#FFC107',
  High: '#FF9800',
  Extreme: '#E8532A',
};

function weatherForLs(ls: number): WeatherSnapshot {
  if (ls < 90) {
    return {
      icon: '🌥️',
      skyDesc: 'Partly dusty',
      lowC: -75,
      highC: -10,
      windKph: '20–50',
      dustLevel: 'Low',
      dustColor: DUST_COLORS.Low,
      hazardNote: 'Relatively calm. Regional dust storms may develop near the equator.',
    };
  }
  if (ls < 180) {
    return {
      icon: '🌤️',
      skyDesc: 'Clear pinkish sky',
      lowC: -65,
      highC: 5,
      windKph: '15–35',
      dustLevel: 'Low',
      dustColor: DUST_COLORS.Low,
      hazardNote: 'Best season for surface operations — near aphelion, dust minimal.',
    };
  }
  if (ls < 270) {
    return {
      icon: '🌪️',
      skyDesc: 'Dusty & hazy',
      lowC: -85,
      highC: -15,
      windKph: '40–100',
      dustLevel: 'High',
      dustColor: DUST_COLORS.High,
      hazardNote: 'Global dust storm season. Solar panels may lose up to 80% output.',
    };
  }
  return {
    icon: '🌑',
    skyDesc: 'Heavy dust haze',
    lowC: -90,
    highC: 20,
    windKph: '50–120',
    dustLevel: 'Extreme',
    dustColor: DUST_COLORS.Extreme,
    hazardNote: 'Near perihelion — planet-wide dust storms possible. High radiation risk.',
  };
}

function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

const TEMP_MIN = -110;
const TEMP_MAX = 30;
function tempFraction(c: number): number {
  return Math.max(0, Math.min(1, (c - TEMP_MIN) / (TEMP_MAX - TEMP_MIN)));
}

export function MarsWeather() {
  const { settings } = useSettings();
  const isFahrenheit = settings.tempUnit === 'fahrenheit';
  const { season, ls } = getMartianSeason(TODAY);
  const wx = weatherForLs(ls);

  const displayTemp = (c: number) =>
    isFahrenheit ? `${celsiusToFahrenheit(c)}°F` : `${c}°C`;

  const lowFrac = tempFraction(wx.lowC);
  const highFrac = tempFraction(wx.highC);

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>MARS WEATHER</Text>
          <Text style={styles.season}>{season}</Text>
        </View>
        <View style={styles.lsBadge}>
          <Text style={styles.lsText}>Ls {ls}°</Text>
        </View>
      </View>

      {/* Main weather row */}
      <View style={styles.mainRow}>
        <Text style={styles.weatherIcon}>{wx.icon}</Text>
        <View style={styles.tempBlock}>
          <View style={styles.tempRow}>
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>HIGH</Text>
              <Text style={[styles.tempValue, { color: wx.highC > 0 ? '#FF9800' : '#4FC3F7' }]}>
                {displayTemp(wx.highC)}
              </Text>
            </View>
            <View style={styles.tempDivider} />
            <View style={styles.tempItem}>
              <Text style={styles.tempLabel}>LOW</Text>
              <Text style={[styles.tempValue, { color: '#4FC3F7' }]}>
                {displayTemp(wx.lowC)}
              </Text>
            </View>
          </View>

          {/* Temperature range bar */}
          <View style={styles.tempBarTrack}>
            <View
              style={[
                styles.tempBarFill,
                {
                  left: `${Math.round(lowFrac * 100)}%` as any,
                  right: `${Math.round((1 - highFrac) * 100)}%` as any,
                },
              ]}
            />
          </View>
          <View style={styles.tempBarLabels}>
            <Text style={styles.tempBarEdge}>{isFahrenheit ? '−166°F' : '−110°C'}</Text>
            <Text style={styles.tempBarEdge}>{isFahrenheit ? '+86°F' : '+30°C'}</Text>
          </View>
        </View>
      </View>

      {/* Conditions grid */}
      <View style={styles.conditionsRow}>
        <View style={styles.condCell}>
          <Text style={styles.condIcon}>💨</Text>
          <Text style={styles.condLabel}>WIND</Text>
          <Text style={styles.condValue}>{wx.windKph} km/h</Text>
        </View>
        <View style={styles.condDivider} />
        <View style={styles.condCell}>
          <Text style={styles.condIcon}>🌫️</Text>
          <Text style={styles.condLabel}>DUST</Text>
          <Text style={[styles.condValue, { color: wx.dustColor }]}>{wx.dustLevel}</Text>
        </View>
        <View style={styles.condDivider} />
        <View style={styles.condCell}>
          <Text style={styles.condIcon}>🔭</Text>
          <Text style={styles.condLabel}>SKY</Text>
          <Text style={styles.condValue} numberOfLines={2}>{wx.skyDesc}</Text>
        </View>
      </View>

      {/* Hazard note */}
      <View style={[styles.hazardRow, { borderLeftColor: wx.dustColor }]}>
        <Text style={styles.hazardText}>{wx.hazardNote}</Text>
      </View>

      <Text style={styles.disclaimer}>
        Typical conditions for current Martian season · Ls {ls}°
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    ...theme.typography.label,
    color: theme.colors.accent,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  season: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    maxWidth: 220,
  },
  lsBadge: {
    backgroundColor: theme.colors.accentDim,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.accent + '55',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lsText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.accent,
    letterSpacing: 0.5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherIcon: {
    fontSize: 44,
    lineHeight: 52,
  },
  tempBlock: {
    flex: 1,
    gap: 6,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tempItem: {
    flex: 1,
  },
  tempLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 1,
  },
  tempValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tempDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.borderLight,
    marginHorizontal: 12,
  },
  tempBarTrack: {
    height: 6,
    backgroundColor: '#0D0D18',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  tempBarFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: theme.colors.accent,
    borderRadius: 3,
  },
  tempBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tempBarEdge: {
    fontSize: 9,
    color: theme.colors.textMuted,
  },
  conditionsRow: {
    flexDirection: 'row',
    backgroundColor: '#0D0D18',
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
  },
  condCell: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  condDivider: {
    width: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: 4,
  },
  condIcon: {
    fontSize: 18,
  },
  condLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 1,
  },
  condValue: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 15,
  },
  hazardRow: {
    borderLeftWidth: 3,
    paddingLeft: 10,
  },
  hazardText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  disclaimer: {
    fontSize: 10,
    color: theme.colors.textMuted,
    textAlign: 'right',
  },
});
