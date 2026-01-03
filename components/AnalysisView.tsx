import React, { useState, useEffect } from 'react';
import { BIMProject, AIAnalysisResult } from '../types';
import { analyzeBIMProject } from '../services/geminiService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { BrainCircuit, ArrowRight, Loader2, Calendar, TrendingUp, AlertOctagon } from 'lucide-react';

interface AnalysisViewProps {
  project: BIMProject;
  onBack: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ project, onBack }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRunAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);
    const result = await analyzeBIMProject(project);
    setAnalysis(result);
    setLoading(false);
    setHasRun(true);
  };

  return (
    <div className="animate-fade-in-up">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium"
      >
        <ArrowRight className="w-5 h-5 ml-2" />
        العودة إلى لوحة التحكم
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
                <p className="text-gray-500 font-mono text-sm dir-ltr text-right mt-1">{project.path}</p>
            </div>
            <div className={`px-4 py-1 rounded-full text-sm font-bold ${
                project.status === 'Critical' ? 'bg-red-100 text-red-700' :
                project.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
            }`}>
                {project.status === 'Critical' ? 'حرج' : project.status === 'Warning' ? 'تحذير' : 'سليم'}
            </div>
          </div>

          <div className="h-[400px] w-full bg-gray-50 rounded-xl p-4 border border-gray-100 relative">
             <div className="absolute top-2 left-4 z-10 bg-white/80 px-2 py-1 rounded text-xs text-gray-500">
                الحد الأقصى المسموح: {project.thresholdMB} MB
             </div>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={project.history}>
                    <defs>
                        <linearGradient id="colorSize" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                    <XAxis 
                        dataKey="date" 
                        tick={{fontSize: 10}} 
                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                        stroke="#9ca3af"
                    />
                    <YAxis 
                        stroke="#9ca3af" 
                        label={{ value: 'MB', angle: -90, position: 'insideLeft', offset: 10, style: {fill: '#6b7280'} }}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value: number) => [`${value} MB`, 'حجم الملف']}
                    />
                    <ReferenceLine y={project.thresholdMB} label="" stroke="red" strokeDasharray="3 3" />
                    <Area 
                        type="monotone" 
                        dataKey="sizeMB" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSize)" 
                    />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Action Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                        <BrainCircuit className="w-6 h-6 text-cyan-400" />
                        الرادار الذكي
                    </h3>
                    <p className="text-blue-200 text-sm mb-6 leading-relaxed">
                        استخدم الذكاء الاصطناعي لتحليل نمط نمو الملف والتنبؤ بموعد الوصول للحد الخطر.
                    </p>
                    
                    {!hasRun ? (
                        <button 
                            onClick={handleRunAnalysis}
                            disabled={loading}
                            className="w-full bg-white text-blue-900 font-bold py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5"/> : "بدء الفحص الذكي"}
                        </button>
                    ) : (
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-200 text-sm">معدل النمو اليومي</span>
                                <span className="font-bold text-lg text-cyan-300">
                                    {analysis?.growthRate ? `+${analysis.growthRate.toFixed(1)} MB` : '--'}
                                </span>
                            </div>
                            <button 
                                onClick={handleRunAnalysis}
                                className="text-xs text-blue-300 hover:text-white underline mt-2 w-full text-right"
                            >
                                تحديث التحليل
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Results Card */}
            {hasRun && analysis && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 animate-fade-in">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-500" />
                        نتائج التنبؤ
                    </h4>

                    {analysis.predictionDate ? (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <AlertOctagon className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-red-800 font-bold text-sm">خطر متوقع!</p>
                                    <p className="text-red-600 text-xs mt-1">سيصل الملف للحد الأقصى في:</p>
                                    <p className="text-red-900 font-bold text-lg mt-1 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {analysis.predictionDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
                             <p className="text-green-800 font-bold text-sm flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                الوضع مستقر
                             </p>
                             <p className="text-green-600 text-xs mt-1">لا يتوقع تجاوز الحد خلال الستة أشهر القادمة بناءً على المعدل الحالي.</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <p className="text-sm text-gray-700 font-medium leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                            "{analysis.message}"
                        </p>
                        
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">توصيات الصيانة:</p>
                            <ul className="space-y-2">
                                {analysis.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

// Icon needed locally
const CheckCircle = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
)
