import React, { createContext, useContext, useState, useEffect } from 'react';
import { GROUPS } from '../types';
import type { Member, DailyRecord, GroupId, Visitor } from '../types';

interface EbdContextType {
  members: Member[];
  records: Record<string, DailyRecord>; // Key: YYYY-MM-DD
  currentDate: string;
  setCurrentDate: (date: string) => void;
  addMember: (name: string, groupId: GroupId) => void;
  removeMember: (id: string) => void;
  toggleMemberActive: (id: string) => void;
  togglePresence: (groupId: GroupId, memberId: string) => void;
  addVisitor: (groupId: GroupId, name: string, phone?: string, observation?: string) => void;
  removeVisitor: (groupId: GroupId, visitorId: string) => void;
  setOffering: (groupId: GroupId, amount: number) => void;
  getGroupStats: (groupId: GroupId) => {
    membros: number;
    presentes: number;
    ausentes: number;
    visitantes: number;
    oferta: number;
    totalParticipacao: number;
  };
  getGlobalStats: () => {
    membrosTotal: number;
    presentesTotal: number;
    ausentesTotal: number;
    visitantesTotal: number;
    ofertaTotal: number;
    totalParticipacao: number;
  };
}

const EbdContext = createContext<EbdContextType | undefined>(undefined);

// Initial mock data to make the app look rich and populated
const INITIAL_MEMBERS: Member[] = [
  // Adultos
  { id: 'a1', name: 'Antônio Santos', groupId: 'adultos', active: true, createdAt: '2026-05-01' },
  { id: 'a2', name: 'Maria Souza', groupId: 'adultos', active: true, createdAt: '2026-05-01' },
  { id: 'a3', name: 'José Pereira', groupId: 'adultos', active: true, createdAt: '2026-05-01' },
  { id: 'a4', name: 'Francisca Lima', groupId: 'adultos', active: true, createdAt: '2026-05-01' },
  { id: 'a5', name: 'João Alves', groupId: 'adultos', active: true, createdAt: '2026-05-01' },
  // Jovens
  { id: 'j1', name: 'Mateus Oliveira', groupId: 'jovens', active: true, createdAt: '2026-05-01' },
  { id: 'j2', name: 'Lucas Rocha', groupId: 'jovens', active: true, createdAt: '2026-05-01' },
  { id: 'j3', name: 'Beatriz Costa', groupId: 'jovens', active: true, createdAt: '2026-05-01' },
  { id: 'j4', name: 'Ana Beatriz', groupId: 'jovens', active: true, createdAt: '2026-05-01' },
  { id: 'j5', name: 'Gabriel Neves', groupId: 'jovens', active: true, createdAt: '2026-05-01' },
  // Juniores
  { id: 'ju1', name: 'Daniel Silva', groupId: 'juniores', active: true, createdAt: '2026-05-01' },
  { id: 'ju2', name: 'Sofia Almeida', groupId: 'juniores', active: true, createdAt: '2026-05-01' },
  { id: 'ju3', name: 'Thiago Martins', groupId: 'juniores', active: true, createdAt: '2026-05-01' },
  // Infantil
  { id: 'i1', name: 'Alice Rodrigues', groupId: 'infantil', active: true, createdAt: '2026-05-01' },
  { id: 'i2', name: 'Heitor Dias', groupId: 'infantil', active: true, createdAt: '2026-05-01' },
  { id: 'i3', name: 'Manuela Gomes', groupId: 'infantil', active: true, createdAt: '2026-05-01' },
];

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const EbdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('ebd_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => {
    const saved = localStorage.getItem('ebd_records');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ebd_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('ebd_records', JSON.stringify(records));
  }, [records]);

  // Helper to ensure record exists for current date
  const getOrCreateRecord = (date: string): DailyRecord => {
    if (records[date]) return records[date];
    return {
      date,
      presentIds: { adultos: [], jovens: [], juniores: [], infantil: [] },
      visitors: { adultos: [], jovens: [], juniores: [], infantil: [] },
      offerings: { adultos: 0, jovens: 0, juniores: 0, infantil: 0 }
    };
  };

  const addMember = (name: string, groupId: GroupId) => {
    const newMember: Member = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      groupId,
      active: true,
      createdAt: getTodayDateString()
    };
    setMembers(prev => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    // Also remove from presence list of all records
    setRecords(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(date => {
        const rec = updated[date];
        Object.keys(rec.presentIds).forEach(gId => {
          const groupId = gId as GroupId;
          rec.presentIds[groupId] = rec.presentIds[groupId].filter(mId => mId !== id);
        });
      });
      return updated;
    });
  };

  const toggleMemberActive = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const togglePresence = (groupId: GroupId, memberId: string) => {
    setRecords(prev => {
      const current = getOrCreateRecord(currentDate);
      const isPresent = current.presentIds[groupId].includes(memberId);
      
      const newPresentIds = isPresent
        ? current.presentIds[groupId].filter(id => id !== memberId)
        : [...current.presentIds[groupId], memberId];

      return {
        ...prev,
        [currentDate]: {
          ...current,
          presentIds: {
            ...current.presentIds,
            [groupId]: newPresentIds
          }
        }
      };
    });
  };

  const addVisitor = (groupId: GroupId, name: string, phone?: string, observation?: string) => {
    const newVisitor: Visitor = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      phone,
      observation
    };

    setRecords(prev => {
      const current = getOrCreateRecord(currentDate);
      return {
        ...prev,
        [currentDate]: {
          ...current,
          visitors: {
            ...current.visitors,
            [groupId]: [...current.visitors[groupId], newVisitor]
          }
        }
      };
    });
  };

  const removeVisitor = (groupId: GroupId, visitorId: string) => {
    setRecords(prev => {
      const current = getOrCreateRecord(currentDate);
      return {
        ...prev,
        [currentDate]: {
          ...current,
          visitors: {
            ...current.visitors,
            [groupId]: current.visitors[groupId].filter(v => v.id !== visitorId)
          }
        }
      };
    });
  };

  const setOffering = (groupId: GroupId, amount: number) => {
    setRecords(prev => {
      const current = getOrCreateRecord(currentDate);
      const updatedOfferings = { ...current.offerings, [groupId]: amount };

      // Regra especial: Juniores e Infantil compartilham a oferta
      if (groupId === 'juniores' || groupId === 'infantil') {
        updatedOfferings.juniores = amount;
        updatedOfferings.infantil = amount;
      }

      return {
        ...prev,
        [currentDate]: {
          ...current,
          offerings: updatedOfferings
        }
      };
    });
  };

  const getGroupStats = (groupId: GroupId) => {
    const activeGroupMembers = members.filter(m => m.groupId === groupId && m.active);
    const record = getOrCreateRecord(currentDate);

    const membros = activeGroupMembers.length;
    const presentes = record.presentIds[groupId].filter(id => 
      activeGroupMembers.some(m => m.id === id)
    ).length;
    const ausentes = Math.max(0, membros - presentes);
    const visitantes = record.visitors[groupId]?.length || 0;
    const oferta = record.offerings[groupId] || 0;
    const totalParticipacao = presentes + visitantes;

    return {
      membros,
      presentes,
      ausentes,
      visitantes,
      oferta,
      totalParticipacao
    };
  };

  const getGlobalStats = () => {
    let membrosTotal = 0;
    let presentesTotal = 0;
    let ausentesTotal = 0;
    let visitantesTotal = 0;
    
    GROUPS.forEach(group => {
      const stats = getGroupStats(group.id);
      membrosTotal += stats.membros;
      presentesTotal += stats.presentes;
      ausentesTotal += stats.ausentes;
      visitantesTotal += stats.visitantes;
    });

    const record = getOrCreateRecord(currentDate);
    // Oferta Total: Adultos + Jovens + Oferta Compartilhada de Juniores/Infantil
    // Como a oferta de Juniores e Infantil é a mesma, se somarmos os dois podemos estar duplicando o caixa físico 
    // ou representando a soma real recolhida na igreja (que seriam duas coletas iguais).
    // Conforme o enunciado: "no grupo juniores e infantil o valor da oferta e compartilhada entao sempre sera o mesmo valor para as duas"
    // Faremos a soma: Adultos + Jovens + Juniores + Infantil, mantendo a fidelidade matemática de que as duas salas registraram aquele valor.
    // Daremos transparência no painel.
    const ofertaTotal = 
      (record.offerings.adultos || 0) + 
      (record.offerings.jovens || 0) + 
      (record.offerings.juniores || 0) + 
      (record.offerings.infantil || 0);

    const totalParticipacao = presentesTotal + visitantesTotal;

    return {
      membrosTotal,
      presentesTotal,
      ausentesTotal,
      visitantesTotal,
      ofertaTotal,
      totalParticipacao
    };
  };

  return (
    <EbdContext.Provider
      value={{
        members,
        records,
        currentDate,
        setCurrentDate,
        addMember,
        removeMember,
        toggleMemberActive,
        togglePresence,
        addVisitor,
        removeVisitor,
        setOffering,
        getGroupStats,
        getGlobalStats
      }}
    >
      {children}
    </EbdContext.Provider>
  );
};

export const useEbd = () => {
  const context = useContext(EbdContext);
  if (!context) {
    throw new Error('useEbd must be used within an EbdProvider');
  }
  return context;
};
