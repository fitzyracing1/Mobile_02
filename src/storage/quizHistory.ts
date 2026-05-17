import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@road_to_mars/quiz_history';
const MAX_ENTRIES = 10;

export interface QuizResult {
  score: number;
  total: number;
  date: string; // ISO string
}

export async function loadQuizHistory(): Promise<QuizResult[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuizResult[]) : [];
  } catch {
    return [];
  }
}

export async function saveQuizResult(score: number, total: number): Promise<QuizResult[]> {
  try {
    const history = await loadQuizHistory();
    const entry: QuizResult = { score, total, date: new Date().toISOString() };
    const updated = [entry, ...history].slice(0, MAX_ENTRIES);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getPersonalBest(history: QuizResult[]): number | null {
  if (history.length === 0) return null;
  return Math.max(...history.map((r) => r.score));
}
