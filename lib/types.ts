export type Category =
  | 'water-quality'
  | 'sediment'
  | 'intertidal'
  | 'pollution'
  | 'wildlife';

export type Severity = 'info' | 'watch' | 'alert';

export type Measurements = {
  turbidityNTU?: number;
  pH?: number;
  waterTempC?: number;
  salinityPPT?: number;
  dissolvedO2?: number;
};

export type Observation = {
  id: string;
  createdAt: string;
  observer: string;
  lat: number;
  lng: number;
  locationName: string;
  category: Category;
  description: string;
  photoUrl?: string;
  measurements?: Measurements;
  severity: Severity;
  anomalyScore: number;
  indicators: string[];
};

export type ObservationInput = Omit<
  Observation,
  'id' | 'createdAt' | 'severity' | 'anomalyScore' | 'indicators'
>;

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'water-quality', label: 'Water Quality', emoji: '💧' },
  { value: 'sediment', label: 'Sediment', emoji: '🏖️' },
  { value: 'intertidal', label: 'Intertidal', emoji: '🦀' },
  { value: 'pollution', label: 'Pollution', emoji: '⚠️' },
  { value: 'wildlife', label: 'Wildlife', emoji: '🐚' },
];

export const SEVERITY_COLORS: Record<Severity, string> = {
  info: '#2d90ff',
  watch: '#f59e0b',
  alert: '#dc2626',
};
