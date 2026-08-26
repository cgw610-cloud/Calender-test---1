import React, { useState } from 'react';
import { TeamMember, ScheduleCategory, ScheduleEntry } from '../types';
import { Shuffle, Calendar, Users, X, AlertCircle } from 'lucide-react';

interface RandomShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  categories: ScheduleCategory[];
  currentYear: number;
  currentMonth: number; // 0-11
  onApplyRandomShifts: (newEntries: ScheduleEntry[], mode: 'replace' | 'merge') => void;
}

export const RandomShiftModal: React.FC<RandomShiftModalProps> = ({
  isOpen,
  onClose,
  members,
  categories,
  currentYear,
  currentMonth,
  onApplyRandomShifts,
}) => {
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDateDefault = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
  const endDateDefault = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const [startDate, setStartDate] = useState(startDateDefault);
  const [endDate, setEndDate] = useState(endDateDefault);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(members.map((m) => m.id));
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(categories.map((c) => c.id));
  const [excludeWeekends, setExcludeWeekends] = useState(false);
  const [maxNightPerWeek, setMaxNightPerWeek] = useState<number>(2); // 최대 2회 (3번 이상 불가)
  const [mode, setMode] = useState<'replace' | 'merge'>('merge');

  if (!isOpen) return null;

  const handleToggleAllMembers = () => {
    if (selectedMemberIds.length === members.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(members.map((m) => m.id));
    }
  };

  const handleToggleAllCategories = () => {
    if (selectedCategoryIds.length === categories.length) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(categories.map((c) => c.id));
    }
  };

  // Helper to get week number
  const getWeekNumber = (d: Date) => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return Math.round((((date.getTime() - week1.getTime()) / 86400000) - 3 + ((week1.getDay() + 6) % 7)) / 7) + 1;
  };

  const handleGenerate = () => {
    if (selectedMemberIds.length === 0) {
      alert('최소한 한 명 이상의 근무자를 선택해주세요.');
      return;
    }
    if (selectedCategoryIds.length === 0) {
      alert('최소한 하나 이상의 근무 유형을 선택해주세요.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert('시작일이 종료일보다 빠를 수 없습니다.');
      return;
    }

    // Identify night category IDs
    const nightCategoryIds = categories.filter((c) => c.isNight || c.name.includes('야간')).map((c) => c.id);

    const generated: ScheduleEntry[] = [];
    const memberNightCounts: Record<string, Record<string, number>> = {};

    const curr = new Date(start);
    while (curr <= end) {
      const dayOfWeek = curr.getDay(); // 0: Sun, 6: Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (!(excludeWeekends && isWeekend)) {
        const year = curr.getFullYear();
        const month = String(curr.getMonth() + 1).padStart(2, '0');
        const day = String(curr.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const weekKey = `${year}-W${getWeekNumber(curr)}`;

        selectedMemberIds.forEach((memberId) => {
          if (!memberNightCounts[memberId]) memberNightCounts[memberId] = {};
          if (!memberNightCounts[memberId][weekKey]) memberNightCounts[memberId][weekKey] = 0;

          let availableCats = selectedCategoryIds;
          const currentNightCount = memberNightCounts[memberId][weekKey];
          if (currentNightCount >= maxNightPerWeek) {
            availableCats = selectedCategoryIds.filter((catId) => !nightCategoryIds.includes(catId));
          }

          if (availableCats.length === 0) {
            availableCats = selectedCategoryIds;
          }

          const randomCatIdx = Math.floor(Math.random() * availableCats.length);
          const chosenCategoryId = availableCats[randomCatIdx];

          if (nightCategoryIds.includes(chosenCategoryId)) {
            memberNightCounts[memberId][weekKey] += 1;
          }

          generated.push({
            id: `rnd-${memberId}-${dateStr}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            date: dateStr,
            memberId,
            categoryId: chosenCategoryId,
          });
        });
      }

      curr.setDate(curr.getDate() + 1);
    }

    onApplyRandomShifts(generated, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg w-full corporate-shadow animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: '#574953' }}
            >
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">교대근무 자동 배치 (야간 제한 규칙)</h3>
              <p className="text-xs text-slate-500">주간/오후/야간 근무를 자동 분배하며 야간 근무 횟수를 엄격히 제한합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Rule Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">사내 근무 규정 적용:</span> 근무자별로 1주일 동안 야간근무는 최대 2회까지만 배치됩니다 (3회 이상 불가).
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> 배치 기간 설정
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-medium">시작일</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium">종료일</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Night Shift Limit setting */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              주당 최대 야간근무 횟수 제한 (규정: 3회 이상 불가)
            </label>
            <div className="flex items-center gap-3">
              <select
                value={maxNightPerWeek}
                onChange={(e) => setMaxNightPerWeek(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900 w-full"
              >
                <option value={1}>주 최대 1회</option>
                <option value={2}>주 최대 2회 (기본 권장)</option>
              </select>
            </div>
          </div>

          {/* Members Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" /> 대상 근무자 ({selectedMemberIds.length}/{members.length})
              </label>
              <button
                type="button"
                onClick={handleToggleAllMembers}
                className="font-bold text-slate-600 hover:underline"
              >
                {selectedMemberIds.length === members.length ? '전체 해제' : '전체 선택'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 max-h-32 overflow-y-auto">
              {members.map((m) => {
                const isSelected = selectedMemberIds.includes(m.id);
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedMemberIds(selectedMemberIds.filter((id) => id !== m.id));
                      } else {
                        setSelectedMemberIds([...selectedMemberIds, m.id]);
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-all ${
                      isSelected
                        ? 'border-transparent text-white'
                        : 'bg-white border-slate-200 text-slate-500 opacity-70'
                    }`}
                    style={isSelected ? { backgroundColor: '#ab002b' } : {}}
                  >
                    <span>{m.avatarEmoji}</span>
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Selection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">
                배치할 근무 유형 ({selectedCategoryIds.length}/{categories.length})
              </label>
              <button
                type="button"
                onClick={handleToggleAllCategories}
                className="font-bold text-slate-600 hover:underline"
              >
                {selectedCategoryIds.length === categories.length ? '전체 해제' : '전체 선택'}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 max-h-32 overflow-y-auto">
              {categories.map((c) => {
                const isSelected = selectedCategoryIds.includes(c.id);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCategoryIds(selectedCategoryIds.filter((id) => id !== c.id));
                      } else {
                        setSelectedCategoryIds([...selectedCategoryIds, c.id]);
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md border font-medium transition-all ${
                      isSelected
                        ? 'border-slate-300 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-400 opacity-60'
                    }`}
                    style={{ backgroundColor: isSelected ? c.color : '#ffffff' }}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                    {c.isNight && <span className="text-[10px] text-purple-700 font-bold">(야간제한적용)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="weekend"
                checked={excludeWeekends}
                onChange={(e) => setExcludeWeekends(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded border-slate-300"
              />
              <label htmlFor="weekend" className="font-medium text-slate-700 cursor-pointer">
                주말(토, 일)은 자동 배치에서 제외하기
              </label>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <span className="font-bold text-slate-700">배치 방식:</span>
              <label className="flex items-center gap-1 font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'merge'}
                  onChange={() => setMode('merge')}
                  className="text-slate-900"
                />
                기존 일정 유지하며 추가
              </label>
              <label className="flex items-center gap-1 font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'replace'}
                  onChange={() => setMode('replace')}
                  className="text-slate-900"
                />
                해당 기간 기존 일정 초기화 후 덮어쓰기
              </label>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="px-5 py-2 rounded-lg font-bold text-white shadow-xs flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: '#ab002b' }}
            >
              <Shuffle className="w-4 h-4" />
              규칙 준수 교대근무 자동 생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
