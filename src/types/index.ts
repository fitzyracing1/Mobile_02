export interface Coordinate {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  timestamp?: number;
}

export interface Run {
  id: string;
  date: string; // ISO 8601 string
  duration: number; // seconds
  distance: number; // meters
  coordinates: Coordinate[];
  avgPace: number; // seconds per km
}

export type RunStatus = 'idle' | 'active' | 'paused' | 'stopped';

export interface RunState {
  status: RunStatus;
  elapsed: number; // seconds
  distance: number; // meters
  coordinates: Coordinate[];
  currentPace: number; // seconds per km
  avgPace: number; // seconds per km
}

export type RootStackParamList = {
  MainTabs: undefined;
  ActiveRun: undefined;
  RunDetail: { run: Run };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
};
