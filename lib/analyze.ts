import type { Category, Measurements, Severity } from './types';

export type AnalyzeInput = {
  category: Category;
  description: string;
  measurements?: Measurements;
};

export type AnalyzeResult = {
  severity: Severity;
  anomalyScore: number; // 0..1
  indicators: string[];
  recommendedAction: string;
};

/**
 * Deterministic heuristic model that stands in for the computer-vision +
 * geospatial pipeline described in the project brief. It inspects the
 * category, free-text description, and any structured measurements and
 * emits a severity, anomaly score (0..1), and a list of indicator tags.
 *
 * The thresholds follow common EPA / NOAA ranges for coastal water quality:
 *   - pH: 7.0 - 8.3 healthy
 *   - Turbidity: < 10 NTU healthy, > 25 NTU degraded
 *   - Dissolved O2: >= 5 mg/L healthy, < 4 mg/L hypoxic
 *   - Water temp: > 28 C stresses many intertidal species
 */
export function analyze(input: AnalyzeInput): AnalyzeResult {
  const indicators: string[] = [];
  let score = 0;

  const m = input.measurements ?? {};
  const desc = (input.description || '').toLowerCase();

  // pH
  if (m.pH !== undefined) {
    if (m.pH < 6.5 || m.pH > 8.6) {
      indicators.push('extreme-pH');
      score += 0.35;
    } else if (m.pH < 7.0 || m.pH > 8.3) {
      indicators.push('borderline-pH');
      score += 0.15;
    }
  }

  // Turbidity
  if (m.turbidityNTU !== undefined) {
    if (m.turbidityNTU > 25) {
      indicators.push('high-turbidity');
      score += 0.3;
    } else if (m.turbidityNTU > 10) {
      indicators.push('elevated-turbidity');
      score += 0.12;
    }
  }

  // Dissolved oxygen
  if (m.dissolvedO2 !== undefined) {
    if (m.dissolvedO2 < 4) {
      indicators.push('hypoxic');
      score += 0.3;
    } else if (m.dissolvedO2 < 5) {
      indicators.push('low-DO');
      score += 0.12;
    }
  }

  // Water temperature
  if (m.waterTempC !== undefined && m.waterTempC > 28) {
    indicators.push('thermal-stress');
    score += 0.12;
  }

  // Category
  if (input.category === 'pollution') {
    indicators.push('pollution-report');
    score += 0.4;
  }

  // Free-text keyword cues (mirrors CV detection cues)
  const keywords: Array<[RegExp, string, number]> = [
    [/oil|sheen|slick/, 'visible-sheen', 0.35],
    [/algae|bloom|red tide/, 'algal-bloom', 0.25],
    [/debris|trash|plastic|litter/, 'marine-debris', 0.18],
    [/dead\s?fish|die[- ]?off|kill/, 'fish-kill', 0.45],
    [/sewage|discharge|outfall/, 'sewage-indicator', 0.4],
    [/erosion|undercut|slump/, 'erosion', 0.15],
  ];
  for (const [re, tag, weight] of keywords) {
    if (re.test(desc)) {
      indicators.push(tag);
      score += weight;
    }
  }

  // Clamp
  const anomalyScore = Math.max(0, Math.min(1, Number(score.toFixed(2))));

  let severity: Severity = 'info';
  if (anomalyScore >= 0.5) severity = 'alert';
  else if (anomalyScore >= 0.2) severity = 'watch';

  const recommendedAction = recommend(severity, indicators);

  return { severity, anomalyScore, indicators, recommendedAction };
}

function recommend(severity: Severity, indicators: string[]): string {
  if (severity === 'alert') {
    if (indicators.includes('visible-sheen') || indicators.includes('sewage-indicator')) {
      return 'Report to local environmental agency immediately and avoid contact with water.';
    }
    if (indicators.includes('fish-kill') || indicators.includes('hypoxic')) {
      return 'Escalate to monitoring team; collect a water sample if safe to do so.';
    }
    return 'Flag for rapid review by a TideTag coordinator within 24 hours.';
  }
  if (severity === 'watch') {
    return 'Schedule a follow-up observation at this site within one week.';
  }
  return 'Log observation and continue routine monitoring.';
}
