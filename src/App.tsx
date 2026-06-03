import { useState } from 'react';
import { EbdProvider, useEbd } from './context/EbdContext';
import { Dashboard } from './components/Dashboard';
import { Attendance } from './components/Attendance';
import { Members } from './components/Members';
import { BookOpen, Calendar, LayoutDashboard, ClipboardList, Users } from 'lucide-react';

type TabId = 'dashboard' | 'attendance' | 'members';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { currentDate, setCurrentDate } = useEbd();

  // Helper to format Date for Portuguese display
  const formatDateBR = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 print:bg-white text-slate-100 print:text-black flex flex-col font-sans antialiased selection:bg-gold-500/30 selection:text-gold-200">
      {/* Upper premium colored bar indicator */}
      <div className="h-1.5 w-full bg-gradient-to-r from-gold-700 via-gold-500 to-gold-800 print:hidden"></div>

      {/* Main Header */}
      <header className="bg-navy-900/80 border-b border-navy-800/80 sticky top-0 z-50 backdrop-blur-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo and Church Name */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-gold-700 to-gold-900 border border-gold-600/20 shadow-md shadow-gold-900/40 text-white flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                EBD <span className="text-gold-400 font-normal">Escola Bíblica Dominical</span>
              </h1>
              <p className="text-navy-300 text-xs font-medium">Controle de Presença e Ofertas</p>
            </div>
          </div>

          {/* Date Picker Section */}
          <div className="flex items-center gap-3 bg-navy-950 border border-navy-800/80 rounded-xl px-3 py-1.5 self-start md:self-auto shadow-inner">
            <Calendar className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] text-navy-400 font-semibold uppercase tracking-wider">Domingo / Data</span>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                className="bg-transparent border-none text-navy-200 text-sm font-bold focus:outline-none focus:ring-0 p-0 cursor-pointer"
              />
            </div>
            <div className="hidden sm:block pl-2.5 border-l border-navy-800/80">
              <span className="text-[10px] bg-navy-800/80 text-navy-200 font-semibold px-2 py-0.5 rounded">
                {formatDateBR(currentDate)}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-navy-800 gap-2 overflow-x-auto pb-px print:hidden">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 border-b-2 font-semibold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-gold-500 text-gold-400 bg-gold-500/5'
                : 'border-transparent text-navy-300 hover:text-navy-100 hover:border-navy-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Relatório Geral
          </button>
          
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-3 border-b-2 font-semibold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-gold-500 text-gold-400 bg-gold-500/5'
                : 'border-transparent text-navy-300 hover:text-navy-100 hover:border-navy-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Chamada por Classe
          </button>
          
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 border-b-2 font-semibold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'members'
                ? 'border-gold-500 text-gold-400 bg-gold-500/5'
                : 'border-transparent text-navy-300 hover:text-navy-100 hover:border-navy-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Cadastro de Alunos
          </button>
        </div>

        {/* Tab View Contents */}
        <div className="flex-grow">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'attendance' && <Attendance />}
          {activeTab === 'members' && <Members />}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-navy-950 border-t border-navy-900 py-6 text-center text-xs text-navy-450 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} EBD Presença. Desenvolvido para a Escola Bíblica Dominical.</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <EbdProvider>
      <AppContent />
    </EbdProvider>
  );
}

export default App;
