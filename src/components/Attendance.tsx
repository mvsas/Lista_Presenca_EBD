import React, { useState } from 'react';
import { useEbd } from '../context/EbdContext';
import { GROUPS } from '../types';
import type { GroupId } from '../types';
import { 
  Users, CheckCircle2, XCircle, Coins, 
  Search, Plus, Trash2, HeartHandshake, FileText, Info 
} from 'lucide-react';

export const Attendance: React.FC = () => {
  const { 
    members, records, currentDate, togglePresence, 
    addVisitor, removeVisitor, setOffering, getGroupStats 
  } = useEbd();

  // Selected class
  const [activeGroupId, setActiveGroupId] = useState<GroupId>('adultos');
  
  // Search state for members list
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for new visitor
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorObs, setVisitorObs] = useState('');
  const [showAddVisitor, setShowAddVisitor] = useState(false);

  // Active group configuration
  const activeGroup = GROUPS.find(g => g.id === activeGroupId)!;
  const stats = getGroupStats(activeGroupId);
  const currentRecord = records[currentDate] || {
    date: currentDate,
    presentIds: { adultos: [], jovens: [], juniores: [], infantil: [] },
    visitors: { adultos: [], jovens: [], juniores: [], infantil: [] },
    offerings: { adultos: 0, jovens: 0, juniores: 0, infantil: 0 }
  };

  // Lists of members for the active group
  const activeGroupMembers = members.filter(m => m.groupId === activeGroupId && m.active);
  
  // Filtered members by search term
  const filteredMembers = activeGroupMembers.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Present members list
  const presentMembers = activeGroupMembers.filter(m => 
    currentRecord.presentIds[activeGroupId]?.includes(m.id)
  );

  // Absent members list
  const absentMembers = activeGroupMembers.filter(m => 
    !currentRecord.presentIds[activeGroupId]?.includes(m.id)
  );

  // Visitors list
  const visitorsList = currentRecord.visitors[activeGroupId] || [];

  // Offering value
  const offeringValue = currentRecord.offerings[activeGroupId] || 0;

  // Handle adding visitor
  const handleAddVisitorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;
    addVisitor(activeGroupId, visitorName.trim(), visitorPhone.trim(), visitorObs.trim());
    setVisitorName('');
    setVisitorPhone('');
    setVisitorObs('');
    setShowAddVisitor(false);
  };

  // Colors mapping for styles
  const groupColors: Record<GroupId, { text: string; bg: string; border: string; accent: string; ring: string }> = {
    adultos: {
      text: 'text-gold-400',
      bg: 'bg-gold-500/10',
      border: 'border-gold-500/20',
      accent: 'bg-gold-600',
      ring: 'focus:ring-gold-500'
    },
    jovens: {
      text: 'text-navy-300',
      bg: 'bg-navy-500/10',
      border: 'border-navy-500/20',
      accent: 'bg-navy-600',
      ring: 'focus:ring-navy-500'
    },
    juniores: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      accent: 'bg-amber-600',
      ring: 'focus:ring-amber-500'
    },
    infantil: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      accent: 'bg-rose-500',
      ring: 'focus:ring-rose-500'
    }
  };

  const currentTheme = groupColors[activeGroupId];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Group selector tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-navy-900/60 border border-navy-800/60 rounded-xl">
        {GROUPS.map(group => {
          const isActive = group.id === activeGroupId;
          const theme = groupColors[group.id];
          return (
            <button
              key={group.id}
              onClick={() => {
                setActiveGroupId(group.id);
                setSearchTerm('');
                setShowAddVisitor(false);
              }}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isActive 
                  ? `${theme.accent} text-white shadow-lg shadow-black/20` 
                  : 'text-navy-300 hover:text-navy-100 hover:bg-navy-800/40'
              }`}
            >
              <Users className="w-4 h-4" />
              {group.name}
            </button>
          );
        })}
      </div>

      {/* Class header & summary */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 bg-navy-900/20 border border-navy-800/40 rounded-xl backdrop-blur-md">
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.text}`}>
            {activeGroup.description}
          </span>
          <h2 className="text-2xl font-bold text-white mt-0.5">Chamada EBD — {activeGroup.name}</h2>
        </div>
        
        {/* Participation summaries */}
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-navy-950/40 border border-navy-850/60 rounded-lg text-center min-w-[90px]">
            <span className="text-[10px] text-navy-300 uppercase font-bold tracking-wider block">Presentes</span>
            <span className="text-lg font-bold text-emerald-400">{stats.presentes}</span>
          </div>
          <div className="px-4 py-2 bg-navy-950/40 border border-navy-850/60 rounded-lg text-center min-w-[90px]">
            <span className="text-[10px] text-navy-300 uppercase font-bold tracking-wider block">Visitantes</span>
            <span className="text-lg font-bold text-gold-400">{stats.visitantes}</span>
          </div>
          <div className="px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-lg text-center min-w-[110px]">
            <span className="text-[10px] text-gold-300 uppercase font-bold tracking-wider block">Participação</span>
            <span className="text-lg font-bold text-gold-200">{stats.totalParticipacao}</span>
          </div>
          <div className="px-4 py-2 bg-gold-500/15 border border-gold-500/25 rounded-lg text-center min-w-[110px]">
            <span className="text-[10px] text-gold-300 uppercase font-bold tracking-wider block">Oferta</span>
            <span className="text-lg font-bold text-gold-200">{formatCurrency(offeringValue)}</span>
          </div>
        </div>
      </div>

      {/* Main layout: Tables and panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left side: Tabela 1: Membros Cadastrados (Chamada) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl overflow-hidden backdrop-blur-md">
            <div className="p-5 border-b border-navy-850/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold-400" />
                  Tabela 1: Chamada de Membros Cadastrados
                </h3>
                <p className="text-navy-300 text-xs mt-0.5">Marque a presença de cada estudante abaixo.</p>
              </div>
              
              {/* Search bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-navy-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar membro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-navy-950 border border-navy-850 text-navy-200 pl-9 pr-4 py-1.5 rounded-lg text-sm focus:outline-none focus:border-gold-500/50 w-full sm:w-60 transition-all duration-300"
                />
              </div>
            </div>

            {/* Members table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-950/40 text-navy-300 text-xs uppercase tracking-wider font-semibold border-b border-navy-850/60">
                  <tr>
                    <th className="px-6 py-3.5">Nome do Aluno</th>
                    <th className="px-6 py-3.5 text-center">Status de Presença</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/40">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-8 text-center text-navy-400 text-sm">
                        {searchTerm ? 'Nenhum membro encontrado com este termo.' : 'Nenhum membro ativo cadastrado nesta classe. Vá na aba "Membros" para cadastrar.'}
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map(member => {
                      const isPresent = currentRecord.presentIds[activeGroupId]?.includes(member.id);
                      return (
                        <tr 
                          key={member.id} 
                          onClick={() => togglePresence(activeGroupId, member.id)}
                          className={`hover:bg-navy-800/10 transition-colors cursor-pointer ${
                            isPresent ? 'bg-emerald-500/5' : ''
                          }`}
                        >
                          <td className="px-6 py-3.5 font-medium text-slate-200">
                            {member.name}
                          </td>
                          <td className="px-6 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => togglePresence(activeGroupId, member.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 ${
                                isPresent 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-navy-950 text-navy-300 border border-navy-850 hover:border-navy-750'
                              }`}
                            >
                              {isPresent ? 'Presente' : 'Marcar Presença'}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-tables: Tabela 2 (Presentes) and Tabela 3 (Ausentes) side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tabela 2: Presentes */}
            <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl overflow-hidden backdrop-blur-md">
              <div className="p-4 bg-navy-950/20 border-b border-navy-850/60 flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Tabela 2: Alunos Presentes ({presentMembers.length})
                </h4>
              </div>
              <div className="p-2 max-h-60 overflow-y-auto">
                {presentMembers.length === 0 ? (
                  <p className="text-navy-400 text-xs text-center py-6">Nenhum membro marcado como presente.</p>
                ) : (
                  <ul className="divide-y divide-navy-800/30">
                    {presentMembers.map(m => (
                      <li key={m.id} className="py-2.5 px-3 text-xs font-medium text-slate-200 flex justify-between items-center">
                        <span>{m.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                          Confirmado
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Tabela 3: Ausentes */}
            <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl overflow-hidden backdrop-blur-md">
              <div className="p-4 bg-navy-950/20 border-b border-navy-850/60 flex items-center justify-between">
                <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Tabela 3: Alunos Ausentes ({absentMembers.length})
                </h4>
              </div>
              <div className="p-2 max-h-60 overflow-y-auto">
                {absentMembers.length === 0 ? (
                  <p className="text-navy-400 text-xs text-center py-6">Todos os membros estão presentes!</p>
                ) : (
                  <ul className="divide-y divide-navy-800/30">
                    {absentMembers.map(m => (
                      <li key={m.id} className="py-2.5 px-3 text-xs font-medium text-slate-200 flex justify-between items-center">
                        <span>{m.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">
                          Falta
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Right side columns: Visitors, Offerings and Total Participation */}
        <div className="space-y-6">

          {/* Tabela 4: Visitantes */}
          <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-navy-850/60 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-4.5 h-4.5 text-gold-400" />
                Tabela 4: Visitantes
              </h3>
              <button
                onClick={() => setShowAddVisitor(!showAddVisitor)}
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all duration-300 ${
                  showAddVisitor 
                    ? 'bg-navy-950 border-navy-850 text-navy-300' 
                    : 'bg-gold-500/10 border-gold-500/20 text-gold-400 hover:bg-gold-500/20'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                {showAddVisitor ? 'Cancelar' : 'Adicionar'}
              </button>
            </div>

            {/* Add visitor form */}
            {showAddVisitor && (
              <form onSubmit={handleAddVisitorSubmit} className="space-y-3 p-3 rounded-lg bg-navy-950/40 border border-navy-850 mb-4 animate-fadeIn">
                <div>
                  <label className="text-[10px] font-semibold text-navy-450 uppercase tracking-wider block mb-1">
                    Nome Completo *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nome do visitante..."
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-navy-450 uppercase tracking-wider block mb-1">
                    Telefone (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="(99) 99999-9999"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-navy-450 uppercase tracking-wider block mb-1">
                    Observação/De onde é (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Convidado do João, etc..."
                    value={visitorObs}
                    onChange={(e) => setVisitorObs(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500/50"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold-600 hover:bg-gold-700 text-white font-bold py-1.5 rounded-lg text-xs tracking-wider transition-colors duration-300"
                >
                  Salvar Visitante
                </button>
              </form>
            )}

            {/* Visitors list table */}
            <div className="max-h-48 overflow-y-auto space-y-2">
              {visitorsList.length === 0 ? (
                <p className="text-navy-400 text-xs text-center py-6">Nenhum visitante registrado hoje.</p>
              ) : (
                visitorsList.map(v => (
                  <div key={v.id} className="flex justify-between items-start p-2.5 rounded-lg bg-navy-950/30 border border-navy-850/60">
                    <div>
                      <p className="text-xs font-bold text-slate-200">{v.name}</p>
                      {v.phone && <p className="text-[10px] text-navy-300 mt-0.5">Tel: {v.phone}</p>}
                      {v.observation && <p className="text-[10px] text-navy-400 italic mt-0.5">Nota: {v.observation}</p>}
                    </div>
                    <button
                      onClick={() => removeVisitor(activeGroupId, v.id)}
                      className="p-1 rounded-md text-navy-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
                      title="Excluir Visitante"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tabela 5: Oferta da Classe */}
          <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl p-5 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 border-b border-navy-850/60 pb-3">
              <Coins className="w-4.5 h-4.5 text-gold-400" />
              Tabela 5: Oferta da Classe
            </h3>

            {/* Special info notification for Juniores & Infantil */}
            {(activeGroupId === 'juniores' || activeGroupId === 'infantil') && (
              <div className="mb-4 p-3 bg-gold-500/5 border border-gold-500/15 rounded-lg text-gold-400 text-xs flex gap-2.5 items-start">
                <Info className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <p className="leading-normal">
                  <span className="font-bold">Aviso:</span> O valor das ofertas das classes <span className="font-bold">Juniores</span> e <span className="font-bold">Infantil</span> é compartilhado. Qualquer alteração aqui atualizará automaticamente ambas as classes.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-navy-450 uppercase tracking-wider block mb-1">
                  Valor da Oferta (R$)
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <span className="text-navy-400 absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold">
                    R$
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    value={offeringValue || ''}
                    onChange={(e) => setOffering(activeGroupId, parseFloat(e.target.value) || 0)}
                    className="w-full bg-navy-950 border border-navy-850 rounded-lg pl-9 pr-4 py-2 text-sm text-navy-200 font-semibold focus:outline-none focus:border-gold-500/50"
                  />
                </div>
              </div>

              {/* Quick offering increments */}
              <div className="flex gap-2">
                {[5, 10, 20, 50].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setOffering(activeGroupId, offeringValue + val)}
                    className="flex-1 bg-navy-950 border border-navy-850 hover:border-navy-750 text-navy-200 font-semibold py-1.5 rounded-lg text-xs transition-all duration-300"
                  >
                    +{val}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setOffering(activeGroupId, 0)}
                  className="px-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold rounded-lg text-xs transition-all duration-300"
                  title="Zerar Oferta"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>

          {/* Tabela 6: Total de Participação */}
          <div className="bg-gold-500/5 border border-gold-500/10 rounded-xl p-5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10 text-gold-400">
              <FileText className="w-16 h-16" />
            </div>
            
            <h3 className="text-sm font-bold text-gold-300 flex items-center gap-2 mb-2">
              Tabela 6: Total de Participação
            </h3>
            <p className="text-navy-300 text-xs mb-4">
              Junta a quantidade de alunos cadastrados presentes e a quantidade de visitantes do dia.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center items-center">
              <div className="p-2 bg-navy-950/40 rounded-lg">
                <span className="text-[10px] text-navy-450 block uppercase font-bold tracking-wider">Presentes</span>
                <span className="text-base font-bold text-white">{stats.presentes}</span>
              </div>
              <div className="p-2 bg-navy-950/40 rounded-lg">
                <span className="text-[10px] text-navy-450 block uppercase font-bold tracking-wider">Visitantes</span>
                <span className="text-base font-bold text-white">{stats.visitantes}</span>
              </div>
              <div className="p-2 bg-gold-500/20 border border-gold-500/30 rounded-lg">
                <span className="text-[10px] text-gold-300 block uppercase font-bold tracking-wider">Total</span>
                <span className="text-lg font-bold text-gold-200">{stats.totalParticipacao}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
