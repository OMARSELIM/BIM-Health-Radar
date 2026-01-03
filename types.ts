export interface HistoryPoint {
  date: string;
  sizeMB: number;
}

export interface BIMProject {
  id: string;
  name: string;
  path: string;
  thresholdMB: number; // The dangerous limit (e.g., 1000MB)
  currentSizeMB: number;
  lastModified: string;
  history: HistoryPoint[];
  status: 'Healthy' | 'Warning' | 'Critical';
}

export interface AIAnalysisResult {
  predictionDate: string | null;
  growthRate: number;
  isCritical: boolean;
  message: string;
  recommendations: string[];
}
