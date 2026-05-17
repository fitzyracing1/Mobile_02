export type MissionStatus = 'completed' | 'active' | 'planned';
export type MissionType = 'rover' | 'lander' | 'orbiter' | 'flyby' | 'crewed' | 'sample-return';
export type FilterTab = 'All' | 'Past' | 'Active' | 'Future';

export interface Mission {
  id: string;
  name: string;
  agency: string;
  year: number;
  type: MissionType;
  status: MissionStatus;
  description: string;
  highlights: string[];
}

export interface JourneyStep {
  id: string;
  stepNumber: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  keyFacts: { label: string; value: string }[];
  durationLabel?: string;
}

export interface MarsFact {
  id: string;
  category: 'Atmosphere' | 'Geography' | 'Moons' | 'Comparison';
  icon: string;
  title: string;
  shortFact: string;
  fullDetail: string;
}

export type MainTabParamList = {
  Home: undefined;
  Journey: undefined;
  Missions: undefined;
  Facts: undefined;
};

export type MissionsStackParamList = {
  MissionsList: undefined;
  MissionDetail: { mission: Mission };
};
