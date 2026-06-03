export type GroupId = 'adultos' | 'jovens' | 'juniores' | 'infantil';

export interface GroupConfig {
  id: GroupId;
  name: string;
  color: string; // Theme color (indigo, violet, emerald, etc.)
  description: string;
}

export const GROUPS: GroupConfig[] = [
  { id: 'adultos', name: 'Adultos', color: 'indigo', description: 'Classe de Adultos' },
  { id: 'jovens', name: 'Jovens', color: 'violet', description: 'Classe de Jovens' },
  { id: 'juniores', name: 'Juniores', color: 'amber', description: 'Classe de Juniores (Oferta Compartilhada com Infantil)' },
  { id: 'infantil', name: 'Infantil', color: 'rose', description: 'Classe Infantil (Oferta Compartilhada com Juniores)' },
];

export interface Member {
  id: string;
  name: string;
  groupId: GroupId;
  active: boolean;
  createdAt: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone?: string;
  observation?: string;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  presentIds: Record<GroupId, string[]>; // list of member IDs present
  visitors: Record<GroupId, Visitor[]>;
  offerings: Record<GroupId, number>; // offerings per group
}
