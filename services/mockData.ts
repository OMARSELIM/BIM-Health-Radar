import { BIMProject, HistoryPoint } from '../types';

const generateHistory = (startSize: number, growthRate: number, days: number): HistoryPoint[] => {
  const history: HistoryPoint[] = [];
  let currentSize = startSize;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some random noise (-5MB to +15MB variance)
    const noise = (Math.random() * 20) - 5; 
    currentSize += growthRate + noise;
    
    history.push({
      date: date.toISOString().split('T')[0],
      sizeMB: parseFloat(currentSize.toFixed(1)),
    });
  }
  return history;
};

export const INITIAL_PROJECTS: BIMProject[] = [
  {
    id: '1',
    name: 'برج الأفق - الملف المعماري',
    path: '\\\\Server\\Projects\\2401_Horizon\\Arch\\Horizon_Arch_Central.rvt',
    thresholdMB: 1000,
    currentSizeMB: 850,
    lastModified: new Date().toISOString(),
    status: 'Warning',
    history: generateHistory(600, 8, 30), // Started at 600, growing ~8MB/day
  },
  {
    id: '2',
    name: 'مستشفى الشفاء - ميكانيكا',
    path: '\\\\Server\\Projects\\2305_Hospital\\MEP\\Hospital_MEP_Central.rvt',
    thresholdMB: 500,
    currentSizeMB: 320,
    lastModified: new Date().toISOString(),
    status: 'Healthy',
    history: generateHistory(250, 2, 30), // Slow growth
  },
  {
    id: '3',
    name: 'المول التجاري - إنشائي',
    path: '\\\\Server\\Projects\\2410_Mall\\Struct\\Mall_ST_Central.rvt',
    thresholdMB: 800,
    currentSizeMB: 790,
    lastModified: new Date().toISOString(),
    status: 'Critical',
    history: generateHistory(400, 15, 30), // Fast growth!
  },
  {
    id: '4',
    name: 'فيلا خاصة - تصميم داخلي',
    path: '\\\\Server\\Projects\\2422_Villa\\ID\\Villa_ID_Central.rvt',
    thresholdMB: 300,
    currentSizeMB: 120,
    lastModified: new Date().toISOString(),
    status: 'Healthy',
    history: generateHistory(100, 0.5, 30),
  }
];
