import React, { useState } from 'react';
import { useEbd } from '../context/EbdContext';
import { GROUPS } from '../types';
import type { GroupId } from '../types';
import { UserPlus, Trash2, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';

export const Members: React.FC = () => {
  const { members, addMember, removeMember, toggleMemberActive } = useEbd();
  
  // Form states
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberGroup, setNewMemberGroup] = useState<GroupId>('adultos');

  // Filter state
  const [filterGroup, setFilterGroup] = useState<GroupId | 'all'>('all');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addMember(newMemberName.trim(), newMemberGroup);
    setNewMemberName('');
  };

  const getGroupName = (id: GroupId) => {
    return GROUPS.find(g => g.id === id)?.name || id;
  };

  // Filtered members list
  const filteredMembers = filterGroup === 'all' 
    ? members 
    : members.filter(m => m.groupId === filterGroup);

  // Group colors mapping for badges
  const groupColors: Record<GroupId, string> = {
    adultos: 'bg-gold-500/10 text-gold-400 border border-gold-500/25',
    jovens: 'bg-navy-500/20 text-navy-300 border border-navy-500/25',
    juniores: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    infantil: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-navy-800/60 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Gerenciamento de Membros (Alunos)</h2>
        <p className="text-navy-300 text-sm mt-1">
          Cadastre novos alunos ou gerencie o status daqueles que estão matriculados em cada classe da EBD.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Registration Form */}
        <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl p-5 backdrop-blur-md h-fit">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-gold-400" />
            Cadastrar Novo Aluno
          </h3>

          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-navy-450 uppercase tracking-wider block mb-1.5">
                Nome do Aluno *
              </label>
              <input
                required
                type="text"
                placeholder="Ex: João da Silva..."
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full bg-navy-950 border border-navy-850 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-navy-450 uppercase tracking-wider block mb-1.5">
                Classe EBD *
              </label>
              <select
                value={newMemberGroup}
                onChange={(e) => setNewMemberGroup(e.target.value as GroupId)}
                className="w-full bg-navy-950 border border-navy-850 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all duration-200"
              >
                {GROUPS.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name} — {g.description}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gold-600 hover:bg-gold-700 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wider transition-colors duration-300 shadow-md shadow-gold-700/10"
            >
              Cadastrar Aluno
            </button>
          </form>
        </div>

        {/* Right Side: Members list and filter */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl p-4 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-navy-300">Filtrar por Classe:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterGroup('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                  filterGroup === 'all'
                    ? 'bg-gold-600 border-gold-500 text-white shadow-md'
                    : 'bg-navy-950 border-navy-850 text-navy-300 hover:text-navy-100'
                }`}
              >
                Todas as Classes
              </button>
              {GROUPS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setFilterGroup(g.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                    filterGroup === g.id
                      ? 'bg-gold-600 border-gold-500 text-white shadow-md'
                      : 'bg-navy-950 border-navy-850 text-navy-300 hover:text-navy-100'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-navy-900/30 border border-navy-800/60 rounded-xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy-950/60 text-navy-300 text-xs uppercase tracking-wider font-semibold border-b border-navy-850/60">
                  <tr>
                    <th className="px-6 py-4">Nome do Aluno</th>
                    <th className="px-6 py-4">Classe</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/40">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-navy-400 text-sm">
                        <ShieldAlert className="w-8 h-8 text-navy-450 mx-auto mb-2" />
                        Nenhum aluno matriculado nesta classe.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map(member => (
                      <tr key={member.id} className="hover:bg-navy-800/20 transition-colors">
                        <td className="px-6 py-4 font-semibold text-white">
                          {member.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${groupColors[member.groupId]}`}>
                            {getGroupName(member.groupId)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => toggleMemberActive(member.id)}
                            className="inline-flex items-center gap-1.5 cursor-pointer mx-auto transition-all"
                            title={member.active ? 'Desativar aluno' : 'Ativar aluno'}
                          >
                            {member.active ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <XCircle className="w-3.5 h-3.5" />
                                Inativo
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => removeMember(member.id)}
                            className="p-2 rounded-lg text-navy-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
                            title="Excluir Aluno"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Total Count Footer */}
            <div className="bg-navy-950/40 p-4 border-t border-navy-850/60 flex justify-between text-xs text-navy-300 font-semibold">
              <span>Total na lista filtrada: {filteredMembers.length}</span>
              <span>Total geral cadastrado: {members.length}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
