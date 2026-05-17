import AsyncStorage from '@react-native-async-storage/async-storage';
import { Run } from '../types';

const RUNS_STORAGE_KEY = '@running_tracker_runs';

/**
 * Save a completed run to AsyncStorage
 */
export async function saveRun(run: Run): Promise<void> {
  try {
    const existingRuns = await loadRuns();
    const updatedRuns = [run, ...existingRuns];
    await AsyncStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(updatedRuns));
  } catch (error) {
    console.error('Failed to save run:', error);
    throw error;
  }
}

/**
 * Load all runs from AsyncStorage, most recent first
 */
export async function loadRuns(): Promise<Run[]> {
  try {
    const data = await AsyncStorage.getItem(RUNS_STORAGE_KEY);
    if (!data) return [];
    const runs: Run[] = JSON.parse(data);
    // Sort by date descending
    return runs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Failed to load runs:', error);
    return [];
  }
}

/**
 * Delete a run by ID
 */
export async function deleteRun(id: string): Promise<void> {
  try {
    const runs = await loadRuns();
    const filtered = runs.filter((r) => r.id !== id);
    await AsyncStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete run:', error);
    throw error;
  }
}

/**
 * Clear all runs (for testing/reset)
 */
export async function clearAllRuns(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RUNS_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear runs:', error);
    throw error;
  }
}
