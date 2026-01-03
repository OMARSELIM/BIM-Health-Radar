import React from 'react';
import { BIMProject } from '../types';
import { FileBarChart, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface ProjectCardProps {
  project: BIMProject;
  onClick: (project: BIMProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'Warning': return 'border-l-4 border-yellow-500 bg-yellow-50';
      default: return 'border-l-4 border-green-500 bg-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Critical': return <Activity className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'Warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const usagePercent = Math.min(100, (project.currentSizeMB / project.thresholdMB) * 100);

  return (
    <div 
      onClick={() => onClick(project)}
      className={`relative p-5 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 ${getStatusColor(project.status)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800 text-lg truncate w-48" title={project.name}>{project.name}</h3>
          <p className="text-xs text-gray-500 font-mono mt-1 truncate w-48">{project.path}</p>
        </div>
        <div className="p-2 bg-white rounded-full shadow-sm">
            {getStatusIcon(project.status)}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 font-medium">الحجم الحالي: <span className="text-gray-900 font-bold">{project.currentSizeMB} MB</span></span>
            <span className="text-gray-400 text-xs">الحد الأقصى: {project.thresholdMB} MB</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-200 overflow-hidden">
            <div 
                className={`h-2.5 rounded-full ${project.status === 'Critical' ? 'bg-red-500' : project.status === 'Warning' ? 'bg-yellow-500' : 'bg-green-500'}`} 
                style={{ width: `${usagePercent}%` }}
            ></div>
        </div>
      </div>

      <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
        <FileBarChart className="w-3 h-3 ml-1" />
        انقر لعرض التحليل التفصيلي
      </div>
    </div>
  );
};
