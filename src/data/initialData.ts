import { TeamMember, ScheduleCategory, ScheduleEntry } from '../types';

export const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'm1', name: '김철수', role: '팀장', color: '#f8fafc', avatarEmoji: '👨‍💼' },
  { id: 'm2', name: '이영희', role: '선임', color: '#f8fafc', avatarEmoji: '👩‍💻' },
  { id: 'm3', name: '박민수', role: '주임', color: '#f8fafc', avatarEmoji: '🧑‍💻' },
  { id: 'm4', name: '정지원', role: '사원', color: '#f8fafc', avatarEmoji: '👩‍💼' },
  { id: 'm5', name: '한소희', role: '사원', color: '#f8fafc', avatarEmoji: '🧑‍🔧' },
];

export const INITIAL_CATEGORIES: ScheduleCategory[] = [
  { id: 'c1', name: '주간근무', color: '#e0f2fe', textColor: '#0369a1', borderColor: '#7dd3fc', icon: '☀️' },
  { id: 'c2', name: '오후근무', color: '#fef3c7', textColor: '#b45309', borderColor: '#fcd34d', icon: '🌤️' },
  { id: 'c3', name: '야간근무', color: '#f3e8ff', textColor: '#6b21a8', borderColor: '#d8b4fe', icon: '🌙', isNight: true },
  { id: 'c4', name: '휴무/오프', color: '#fce7f3', textColor: '#be185d', borderColor: '#f472b6', icon: '☕', isOff: true },
  { id: 'c5', name: '재택근무', color: '#dcfce7', textColor: '#15803d', borderColor: '#86efac', icon: '💻' },
  { id: 'c6', name: '외부미팅', color: '#ffedd5', textColor: '#c2410c', borderColor: '#fdba74', icon: '🤝' },
];

export const getInitialSchedules = (): ScheduleEntry[] => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const entries: ScheduleEntry[] = [];
  
  INITIAL_MEMBERS.forEach((member, mIdx) => {
    for (let d = 1; d <= 28; d += (mIdx + 2) % 3 + 1) {
      const dayStr = String(d).padStart(2, '0');
      const monthStr = String(month + 1).padStart(2, '0');
      const catIdx = (d + mIdx) % INITIAL_CATEGORIES.length;
      entries.push({
        id: `s-${member.id}-${d}`,
        date: `${year}-${monthStr}-${dayStr}`,
        memberId: member.id,
        categoryId: INITIAL_CATEGORIES[catIdx].id,
      });
    }
  });

  return entries;
};
