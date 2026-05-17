import AsyncStorage from '@react-native-async-storage/async-storage';

export type DistanceUnit = 'km' | 'miles';
export type TempUnit = 'celsius' | 'fahrenheit';

export interface AppSettings {
  distanceUnit: DistanceUnit;
  tempUnit: TempUnit;
}

const KEY = '@road_to_mars/settings';
const DEFAULTS: AppSettings = { distanceUnit: 'km', tempUnit: 'celsius' };

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      distanceUnit: parsed.distanceUnit ?? DEFAULTS.distanceUnit,
      tempUnit: parsed.tempUnit ?? DEFAULTS.tempUnit,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function saveSettings(s: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Silently ignore storage errors
  }
}
