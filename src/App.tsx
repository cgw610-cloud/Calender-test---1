import React, { useState, useEffect } from 'react';
import { TeamMember, ScheduleCategory, ScheduleEntry } from './types';
import { INITIAL_MEMBERS, INITIAL_CATEGORIES, getInitialSchedules } from './data/initialData';
import { Header } from './components/Header';
import { CalendarView } from './components/CalendarView';
import { TeamManager } from './components/TeamManager';
import { CategoryManager } from './components/CategoryManager';
import { ScheduleModal } from './components/ScheduleModal';
import { RandomShiftModal } from './components/RandomShiftModal';

export default function App() {
  // Load data from localStorage or defaults
  const [members, setMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('team_members_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MEMBERS;
  });

  const [categories, setCategories] = useState<ScheduleCategory[]>(() => {
    const saved = localStorage.getItem('team_categories_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CATEGORIES;
  });

  const [schedules, setSchedules] = useState<ScheduleEntry[]>(() => {
    const saved = localStorage.getItem('team_schedules_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return getInitialSchedules();
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('team_members_v1', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('team_categories_v1', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('team_schedules_v1', JSON.stringify(schedules));
  }, [schedules]);

  // Navigation state
  const [activeTab, setActiveTab] = useState<'calendar' | 'teams' | 'categories'>('calendar');
  
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11

  // Modals state
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);

  // Month handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  // Team Member CRUD
  const handleAddMember = (newMem: Omit<TeamMember, 'id'>) => {
    const created: TeamMember = {
      ...newMem,
      id: `m-${Date.now()}`,
    };
    setMembers([...members, created]);
  };

  const handleUpdateMember = (updated: TeamMember) => {
    setMembers(members.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('정말 이 팀원을 삭제하시겠습니까? 관련된 일정 데이터도 함께 정리됩니다.')) {
      setMembers(members.filter((m) => m.id !== id));
      setSchedules(schedules.filter((s) => s.memberId !== id));
    }
  };

  // Category CRUD
  const handleAddCategory = (newCat: Omit<ScheduleCategory, 'id'>) => {
    const created: ScheduleCategory = {
      ...newCat,
      id: `c-${Date.now()}`,
    };
    setCategories([...categories, created]);
  };

  const handleUpdateCategory = (updated: ScheduleCategory) => {
    setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('이 카테고리를 삭제하시겠습니까?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  // Schedule Entry CRUD
  const handleAddSchedule = (entry: Omit<ScheduleEntry, 'id'>) => {
    const created: ScheduleEntry = {
      ...entry,
      id: `s-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setSchedules([...schedules, created]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  // Random Shift Apply
  const handleApplyRandomShifts = (newEntries: ScheduleEntry[], mode: 'replace' | 'merge') => {
    if (mode === 'replace') {
      // Find date range from newEntries
      if (newEntries.length === 0) return;
      const dates = newEntries.map((e) => e.date);
      const minDate = dates.reduce((a, b) => (a < b ? a : b));
      const maxDate = dates.reduce((a, b) => (a > b ? a : b));

      // Remove schedules in that range for selected members
      const memberIdsToReplace = Array.from(new Set(newEntries.map((e) => e.memberId)));
      const filtered = schedules.filter((s) => {
        const inRange = s.date >= minDate && s.date <= maxDate;
        const isTargetMember = memberIdsToReplace.includes(s.memberId);
        return !(inRange && isTargetMember);
      });

      setSchedules([...filtered, ...newEntries]);
    } else {
      setSchedules([...schedules, ...newEntries]);
    }
    alert('🎲 랜덤 교대근무가 성공적으로 슥슥 배치되었습니다!');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-amber-950 flex flex-col selection:bg-pink-200">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRandomModal={() => setIsRandomModalOpen(true)}
      />

      <main className="flex-1 py-6">
        {activeTab === 'calendar' && (
          <CalendarView
            members={members}
            categories={categories}
            schedules={schedules}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            onSelectDate={(dateStr) => setSelectedDateStr(dateStr)}
          />
        )}

        {activeTab === 'teams' && (
          <TeamManager
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </main>

      {/* Schedule Modal for specific day */}
      {selectedDateStr && (
        <ScheduleModal
          isOpen={!!selectedDateStr}
          onClose={() => setSelectedDateStr(null)}
          dateStr={selectedDateStr}
          members={members}
          categories={categories}
          schedules={schedules}
          onAddSchedule={handleAddSchedule}
          onDeleteSchedule={handleDeleteSchedule}
        />
      )}

      {/* Random Shift Generator Modal */}
      <RandomShiftModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        members={members}
        categories={categories}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onApplyRandomShifts={handleApplyRandomShifts}
      />
    </div>
  );
}
