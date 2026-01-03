import React, { useState } from 'react';
import { LayoutDashboard, Plus, Settings, Search } from 'lucide-react';
import { INITIAL_PROJECTS } from './services/mockData';
import { BIMProject } from './types';
import { ProjectCard } from './components/ProjectCard';
import { AnalysisView } from './components/AnalysisView';

function App() {
  const [projects, setProjects] = useState<BIMProject[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<BIMProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.includes(searchTerm) || p.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = projects.reduce((acc, curr) => acc + curr.currentSizeMB, 0);
  const criticalCount = projects.filter(p => p.status === 'Critical').length;
  const warningCount = projects.filter(p => p.status === 'Warning').length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full right-0 top-0 z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-blue-400" />
            BIM Radar <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white ml-1">Lite</span>
          </h1>
          <p className="text-slate-400 text-xs mt-2">مراقب صحة الموديلات</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setSelectedProject(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${!selectedProject ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            لوحة التحكم
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors opacity-50 cursor-not-allowed">
            <Settings className="w-5 h-5" />
            الإعدادات (قريباً)
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">إجمالي التخزين</p>
            <p className="text-lg font-bold text-blue-400">{(totalSize / 1024).toFixed(2)} GB</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:mr-64 p-4 md:p-8 transition-all">
        
        {/* Header (Mobile only basically) */}
        <header className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
             <h1 className="font-bold text-gray-800">BIM Radar Lite</h1>
        </header>

        {selectedProject ? (
          <AnalysisView 
            project={selectedProject} 
            onBack={() => setSelectedProject(null)} 
          />
        ) : (
          <div className="animate-fade-in">
            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">المشاريع النشطة</p>
                  <p className="text-3xl font-bold text-gray-800">{projects.length}</p>
               </div>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">حالة حرجة</p>
                  <p className="text-3xl font-bold text-red-500">{criticalCount}</p>
               </div>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-sm mb-1">تحذيرات</p>
                  <p className="text-3xl font-bold text-yellow-500">{warningCount}</p>
               </div>
               <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-md transition-colors flex flex-col items-center justify-center gap-2 group">
                  <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sm">إضافة مشروع للمراقبة</span>
               </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">ملفات المشاريع (Central Files)</h2>
                <div className="relative w-full md:w-96">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="بحث باسم المشروع أو المسار..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={setSelectedProject} 
                />
              ))}
              
              {filteredProjects.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-400">
                    لا توجد مشاريع مطابقة للبحث
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
