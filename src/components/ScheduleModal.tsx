import React, { useState } from 'react';
import { TeamMember, ScheduleCategory, ScheduleEntry } from '../types';
import { Calendar, Users, X, Trash2 } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string; // YYYY-MM-DD
  members: TeamMember[];
  categories: ScheduleCategory[];
  schedules: ScheduleEntry[];
  onAddSchedule: (entry: Omit<ScheduleEntry, 'id'>) => void;
  onDeleteSchedule: (id: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  members,
  categories,
  schedules,
  onAddSchedule,
  onDeleteSchedule,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || '');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const daySchedules = schedules.filter((s) => s.date === dateStr);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedCategoryId) return;

    onAddSchedule({
      date: dateStr,
      memberId: selectedMemberId,
      categoryId: selectedCategoryId,
      note: note.trim(),
    });

    setNote('');
  };

  const formatDateTitle = (str: string) => {
    const parts = str.split('-');
    if (parts.length !== 3) return str;
    return `${parts[0]}년 ${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg w-full corporate-shadow animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: '#ab002b' }}
            >
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{formatDateTitle(dateStr)} 근무 일정 관리</h3>
              <p className="text-xs text-slate-500">해당 날짜에 근무자를 배정하거나 일정을 기록합니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing schedules on this day */}
        <div className="space-y-3 mb-6 text-xs">
          <h4 className="font-bold text-slate-700 uppercase tracking-wide">
            등록된 배정 내역 ({daySchedules.length}건)
          </h4>
          {daySchedules.length === 0 ? (
            <div className="text-center py-5 bg-slate-50 rounded-lg border border-slate-200 text-slate-500 font-medium">
              이날 등록된 근무 일정이 없습니다.
            </div>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {daySchedules.map((entry) => {
                const member = members.find((m) => m.id === entry.memberId);
                const category = categories.find((c) => c.id === entry.categoryId);

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-sm">
                        {member?.avatarEmoji || '👨‍💼'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{member?.name || '미확인'}</span>
                          <span
                            className="text-[11px] px-2 py-0.5 rounded font-semibold border"
                            style={{
                              backgroundColor: category?.color || '#f1f5f9',
                              color: category?.textColor || '#0f172a',
                              borderColor: category?.borderColor || '#cbd5e1',
                            }}
                          >
                            {category?.icon} {category?.name || '근무'}
                          </span>
                        </div>
                        {entry.note && <p className="text-[11px] text-slate-500 mt-0.5">{entry.note}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteSchedule(entry.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add new schedule form */}
        <form onSubmit={handleAdd} className="space-y-4 pt-3 border-t border-slate-100 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wide">
            신규 근무/일정 배정
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">근무자</label>
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900 focus:outline-hidden focus:border-slate-500"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.avatarEmoji} {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">근무 유형</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900 focus:outline-hidden focus:border-slate-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">메모 (선택사항)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="예: 특근 수당 적용, 대체휴무 등"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900 focus:outline-hidden focus:border-slate-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
            >
              닫기
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold text-white shadow-xs"
              style={{ backgroundColor: '#ab002b' }}
            >
              배정 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
