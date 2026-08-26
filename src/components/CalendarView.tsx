import React, { useState } from 'react';
import { TeamMember, ScheduleCategory, ScheduleEntry } from '../types';
import { ChevronLeft, ChevronRight, Filter, UserCheck, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  members: TeamMember[];
  categories: ScheduleCategory[];
  schedules: ScheduleEntry[];
  currentYear: number;
  currentMonth: number; // 0-11
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  members,
  categories,
  schedules,
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectDate,
}) => {
  const [filterMemberId, setFilterMemberId] = useState<string>('all');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0: Sun, 1: Mon ...

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const calendarCells: { dateStr: string | null; dayNumber: number | null }[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push({ dateStr: null, dayNumber: null });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    calendarCells.push({
      dateStr: `${currentYear}-${monthStr}-${dayStr}`,
      dayNumber: d,
    });
  }

  const filteredSchedules = schedules.filter((s) => {
    if (filterMemberId !== 'all' && s.memberId !== filterMemberId) return false;
    if (filterCategoryId !== 'all' && s.categoryId !== filterCategoryId) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Month Navigation & Filters Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 corporate-shadow flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Month Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevMonth}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center border border-slate-300 transition-colors"
            title="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center min-w-[150px]">
            <h2 className="text-xl font-bold text-slate-900">
              {currentYear}년 {monthNames[currentMonth]}
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">통합 근무 현황 캘린더</span>
          </div>
          <button
            onClick={onNextMonth}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center border border-slate-300 transition-colors"
            title="다음 달"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 transition-colors"
          >
            이번 달
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <UserCheck className="w-4 h-4 text-slate-600" />
            <select
              value={filterMemberId}
              onChange={(e) => setFilterMemberId(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">모든 근무자 보기</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.avatarEmoji} {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Filter className="w-4 h-4 text-slate-600" />
            <select
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">모든 근무 유형 보기</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <CalendarIcon className="w-4 h-4 text-slate-500" />
          <span>날짜 셀을 클릭하여 근무 일정을 추가하거나 상세 조회를 수행하세요.</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border"
              style={{ backgroundColor: cat.color, color: cat.textColor, borderColor: cat.borderColor }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-slate-200 corporate-shadow overflow-hidden">
        {/* Day Header Row */}
        <div className="grid grid-cols-7 bg-slate-100 border-b border-slate-200 text-center py-2.5 text-xs font-bold text-slate-700">
          <div className="text-red-600">일요일</div>
          <div>월요일</div>
          <div>화요일</div>
          <div>수요일</div>
          <div>목요일</div>
          <div>금요일</div>
          <div className="text-blue-600">토요일</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,_1fr)] divide-x divide-y divide-slate-100 bg-slate-50/30">
          {calendarCells.map((cell, index) => {
            if (!cell.dateStr || !cell.dayNumber) {
              return <div key={`empty-${index}`} className="bg-slate-100/40 p-2" />;
            }

            const daySchedules = filteredSchedules.filter((s) => s.date === cell.dateStr);
            const isToday =
              cell.dateStr ===
              `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(
                new Date().getDate()
              ).padStart(2, '0')}`;

            const dayOfWeekIndex = index % 7;

            return (
              <div
                key={cell.dateStr}
                onClick={() => onSelectDate(cell.dateStr!)}
                className={`p-2 flex flex-col justify-between transition-colors cursor-pointer group hover:bg-slate-50 relative bg-white ${
                  isToday ? 'ring-2 ring-inset ring-slate-900 bg-slate-50/80' : ''
                }`}
              >
                {/* Date Number Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                      isToday
                        ? 'bg-slate-900 text-white'
                        : dayOfWeekIndex === 0
                        ? 'text-red-600'
                        : dayOfWeekIndex === 6
                        ? 'text-blue-600'
                        : 'text-slate-800'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold transition-opacity">
                    + 배정
                  </span>
                </div>

                {/* Schedules list in day cell */}
                <div className="space-y-1 mt-1.5 flex-1 overflow-y-auto max-h-[95px] pr-0.5">
                  {daySchedules.map((entry) => {
                    const member = members.find((m) => m.id === entry.memberId);
                    const category = categories.find((c) => c.id === entry.categoryId);
                    if (!member || !category) return null;

                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between text-[11px] px-2 py-1 rounded font-semibold border shadow-2xs truncate"
                        style={{
                          backgroundColor: category.color,
                          color: category.textColor,
                          borderColor: category.borderColor,
                        }}
                        title={`${member.name} (${category.name})`}
                      >
                        <div className="flex items-center gap-1 truncate">
                          <span className="text-[10px]">{member.avatarEmoji}</span>
                          <span className="truncate">{member.name}</span>
                        </div>
                        <span className="text-[10px] whitespace-nowrap opacity-90">{category.icon}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
