import React from 'react';
import { useEbd } from '../context/EbdContext';
import { GROUPS } from '../types';
import { Users, CheckCircle2, XCircle, UserPlus, Coins, BarChart3, TrendingUp, Printer } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { getGlobalStats, getGroupStats, currentDate } = useEbd();
  const global = getGlobalStats();

  // Helper to format date into Portuguese format
  const formatDateBR = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header and Summary Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-navy-800/80 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white print:text-black">Relatório Geral Consolidadado</h2>
          <p className="text-navy-300 text-sm mt-1 print:text-gray-600">
            Resumo de participação e arrecadação de todas as classes para a data de{' '}
            <span className="text-gold-400 print:text-black font-semibold">{formatDateBR(currentDate)}</span>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-white font-medium transition-colors border border-navy-700 w-full sm:w-auto justify-center"
          >
            <Printer className="w-4 h-4" />
            Imprimir / PDF
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-medium w-full sm:w-auto justify-center">
            <TrendingUp className="w-3.5 h-3.5" />
            Dados Atualizados
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Members */}
        <div className="relative overflow-hidden bg-navy-900/40 border border-navy-800/60 rounded-xl p-5 backdrop-blur-md transition-all duration-300 hover:border-gold-500/40">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Membro Total</span>
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{global.membrosTotal}</span>
            <p className="text-navy-400 text-xs mt-1">Alunos ativos matriculados</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500/30"></div>
        </div>

        {/* Total Present */}
        <div className="relative overflow-hidden bg-navy-900/40 border border-navy-800/60 rounded-xl p-5 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Presente Total</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{global.presentesTotal}</span>
            <span className="text-emerald-400 text-xs font-medium ml-2">
              ({global.membrosTotal > 0 ? Math.round((global.presentesTotal / global.membrosTotal) * 100) : 0}%)
            </span>
            <p className="text-navy-400 text-xs mt-1">Alunos que responderam chamada</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/30"></div>
        </div>

        {/* Total Absent */}
        <div className="relative overflow-hidden bg-navy-900/40 border border-navy-800/60 rounded-xl p-5 backdrop-blur-md transition-all duration-300 hover:border-rose-500/40">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Ausente Total</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{global.ausentesTotal}</span>
            <span className="text-rose-400 text-xs font-medium ml-2">
              ({global.membrosTotal > 0 ? Math.round((global.ausentesTotal / global.membrosTotal) * 100) : 0}%)
            </span>
            <p className="text-navy-400 text-xs mt-1">Faltas registradas</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500/30"></div>
        </div>

        {/* Total Visitors */}
        <div className="relative overflow-hidden bg-navy-900/40 border border-navy-800/60 rounded-xl p-5 backdrop-blur-md transition-all duration-300 hover:border-gold-500/40">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Visitante Total</span>
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{global.visitantesTotal}</span>
            <p className="text-navy-400 text-xs mt-1">Visitantes acolhidos hoje</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500/30"></div>
        </div>

        {/* Total Offerings */}
        <div className="relative overflow-hidden bg-navy-900/40 border border-navy-800/60 rounded-xl p-5 backdrop-blur-md transition-all duration-300 hover:border-gold-500/40">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Oferta Total</span>
            <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xl font-bold text-white tracking-tight block truncate">
              {formatCurrency(global.ofertaTotal)}
            </span>
            <p className="text-navy-400 text-[10px] mt-1.5 leading-tight">
              Soma total de ofertas das classes
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500/30"></div>
        </div>
      </div>

      {/* Attendance & Offering Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participation and Progress bars */}
        <div className="lg:col-span-2 bg-navy-900/30 border border-navy-800/60 rounded-xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            Desempenho de Presença por Classe
          </h3>
          <div className="space-y-6">
            {GROUPS.map(group => {
              const stats = getGroupStats(group.id);
              const percentage = stats.membros > 0 ? Math.round((stats.presentes / stats.membros) * 100) : 0;
              
              // Define theme colors based on group configurations
              let barColor = 'bg-gold-500';
              if (group.id === 'jovens') barColor = 'bg-navy-400';
              if (group.id === 'juniores') barColor = 'bg-amber-600';
              if (group.id === 'infantil') barColor = 'bg-rose-500';

              return (
                <div key={group.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-200">{group.name}</span>
                    <span className="text-navy-300">
                      {stats.presentes} de {stats.membros} presentes ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-navy-800/40 rounded-full h-3 overflow-hidden">
                    <div
                       className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-navy-450">
                    <span>Participação Total (c/ visitantes): {stats.totalParticipacao}</span>
                    <span>Ausentes: {stats.ausentes}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Offerings summary panel */}
        <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-gold-400" />
              Ofertas por Classe
            </h3>
            <p className="text-xs text-navy-300 mb-6">
              Distribuição dos valores recolhidos no dia selecionado.
            </p>
            <div className="space-y-4">
              {GROUPS.map(group => {
                const stats = getGroupStats(group.id);
                const isShared = group.id === 'juniores' || group.id === 'infantil';
                return (
                  <div key={group.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-950/40 border border-navy-850/60">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        group.id === 'adultos' ? 'bg-gold-500' :
                        group.id === 'jovens' ? 'bg-navy-400' :
                        group.id === 'juniores' ? 'bg-amber-600' : 'bg-rose-500'
                      }`}></div>
                      <div>
                        <span className="text-sm font-medium text-slate-200 block">{group.name}</span>
                        {isShared && (
                          <span className="text-[9px] text-gold-500/80 font-medium uppercase tracking-wider block">
                            Compartilhada
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-100">{formatCurrency(stats.oferta)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-navy-850/60">
            <div className="flex justify-between items-center bg-gold-500/5 border border-gold-500/10 rounded-lg p-3">
              <span className="text-xs font-semibold text-gold-400">Total de Ofertas do Dia:</span>
              <span className="text-base font-bold text-gold-400">{formatCurrency(global.ofertaTotal)}</span>
            </div>
            <p className="text-[10px] text-navy-450 mt-2 text-center">
              * Classes Juniores e Infantil compartilham o mesmo caixa de oferta.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Groups Side-by-Side Summary Table */}
      <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-navy-850/60">
          <h3 className="text-lg font-semibold text-white">Quadro Resumo de Classes</h3>
          <p className="text-navy-300 text-xs mt-1">Comparativo direto de estatísticas entre todos os grupos de alunos da EBD.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-950/60 text-navy-300 text-xs uppercase tracking-wider font-semibold border-b border-navy-850/60">
              <tr>
                <th className="px-6 py-4">Classe</th>
                <th className="px-6 py-4 text-center">Membros</th>
                <th className="px-6 py-4 text-center">Presentes</th>
                <th className="px-6 py-4 text-center">Ausentes</th>
                <th className="px-6 py-4 text-center">Visitantes</th>
                <th className="px-6 py-4 text-center bg-gold-500/5 text-gold-400">Total Participação</th>
                <th className="px-6 py-4 text-right">Oferta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/40">
              {GROUPS.map(group => {
                const stats = getGroupStats(group.id);
                return (
                  <tr key={group.id} className="hover:bg-navy-800/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        group.id === 'adultos' ? 'bg-gold-500' :
                        group.id === 'jovens' ? 'bg-navy-400' :
                        group.id === 'juniores' ? 'bg-amber-600' : 'bg-rose-500'
                      }`}></div>
                      {group.name}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-300">{stats.membros}</td>
                    <td className="px-6 py-4 text-center text-emerald-400 font-semibold">{stats.presentes}</td>
                    <td className="px-6 py-4 text-center text-rose-400 font-medium">{stats.ausentes}</td>
                    <td className="px-6 py-4 text-center text-gold-400 font-semibold">{stats.visitantes}</td>
                    <td className="px-6 py-4 text-center bg-gold-500/5 text-gold-200 font-bold">
                      {stats.totalParticipacao}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-200 font-semibold">{formatCurrency(stats.oferta)}</td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr className="bg-navy-950/40 font-bold border-t border-navy-800">
                <td className="px-6 py-4 text-white">Total Consolidado</td>
                <td className="px-6 py-4 text-center text-white">{global.membrosTotal}</td>
                <td className="px-6 py-4 text-center text-emerald-400">{global.presentesTotal}</td>
                <td className="px-6 py-4 text-center text-rose-400">{global.ausentesTotal}</td>
                <td className="px-6 py-4 text-center text-gold-400">{global.visitantesTotal}</td>
                <td className="px-6 py-4 text-center bg-gold-500/10 text-gold-300 text-base">
                  {global.totalParticipacao}
                </td>
                <td className="px-6 py-4 text-right text-gold-400 text-base">{formatCurrency(global.ofertaTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
