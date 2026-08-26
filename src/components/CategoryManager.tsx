import React, { useState } from 'react';
import { ScheduleCategory } from '../types';
import { Plus, Edit3, Trash2, Tag as TagIcon, Moon } from 'lucide-react';

interface CategoryManagerProps {
  categories: ScheduleCategory[];
  onAddCategory: (category: Omit<ScheduleCategory, 'id'>) => void;
  onUpdateCategory: (category: ScheduleCategory) => void;
  onDeleteCategory: (id: string) => void;
}

const ICON_OPTIONS = ['☀️', '🌤️', '🌙', '☕', '💻', '🤝', '⭐', '📋', '🚨', '📞', '🏢'];
const PRESET_THEMES = [
  { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' }, // Sky / Day
  { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' }, // Amber / Evening
  { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' }, // Purple / Night
  { bg: '#fce7f3', text: '#be185d', border: '#f472b6' }, // Pink / Off
  { bg: '#dcfce7', text: '#15803d', border: '#86efac' }, // Green / Remote
  { bg: '#ffedd5', text: '#c2410c', border: '#fdba74' }, // Orange / Meeting
  { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' }, // Slate
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [isEditing, setIsEditing] = useState<ScheduleCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('☀️');
  const [selectedTheme, setSelectedTheme] = useState(PRESET_THEMES[0]);
  const [isOff, setIsOff] = useState(false);
  const [isNight, setIsNight] = useState(false);

  const handleOpenAdd = () => {
    setIsEditing(null);
    setName('');
    setIcon('☀️');
    setSelectedTheme(PRESET_THEMES[0]);
    setIsOff(false);
    setIsNight(false);
    setShowForm(true);
  };

  const handleOpenEdit = (c: ScheduleCategory) => {
    setIsEditing(c);
    setName(c.name);
    setIcon(c.icon || '☀️');
    setSelectedTheme({ bg: c.color, text: c.textColor, border: c.borderColor });
    setIsOff(!!c.isOff);
    setIsNight(!!c.isNight);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing) {
      onUpdateCategory({
        ...isEditing,
        name: name.trim(),
        icon,
        color: selectedTheme.bg,
        textColor: selectedTheme.text,
        borderColor: selectedTheme.border,
        isOff,
        isNight,
      });
    } else {
      onAddCategory({
        name: name.trim(),
        icon,
        color: selectedTheme.bg,
        textColor: selectedTheme.text,
        borderColor: selectedTheme.border,
        isOff,
        isNight,
      });
    }
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Top action header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 corporate-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-slate-700" /> 근무 유형 및 일정 카테고리 관리
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            주간, 오후, 야간, 휴무 등 사내 운영되는 교대근무 및 일정 코드를 설정합니다.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-white font-bold text-xs rounded-lg transition-opacity hover:opacity-90 shadow-xs"
          style={{ backgroundColor: '#ab002b' }}
        >
          <Plus className="w-4 h-4" />
          신규 근무 유형 추가
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-xl border flex items-center justify-between transition-all bg-white"
            style={{ borderColor: cat.borderColor }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border flex items-center justify-center text-xl"
                style={{ backgroundColor: cat.color, borderColor: cat.borderColor }}
              >
                {cat.icon || '📌'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold" style={{ color: cat.textColor }}>
                    {cat.name}
                  </h3>
                  {cat.isNight && (
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-semibold border border-purple-200">
                      야간(제한)
                    </span>
                  )}
                  {cat.isOff && (
                    <span className="text-[10px] bg-pink-100 text-pink-800 px-1.5 py-0.2 rounded font-semibold border border-pink-200">
                      휴무
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">근무 코드 ID: {cat.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                title="수정"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteCategory(cat.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full corporate-shadow animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? '근무 유형 수정' : '신규 근무 유형 추가'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">근무명 / 일정명</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 주간조, 야간조, 비상근무"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900 focus:outline-hidden focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">아이콘 기호</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {ICON_OPTIONS.map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setIcon(em)}
                      className={`w-9 h-9 rounded-lg border text-lg flex items-center justify-center transition-all ${
                        icon === em
                          ? 'border-slate-900 bg-slate-100 ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">색상 테마</label>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {PRESET_THEMES.map((theme, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedTheme(theme)}
                      className={`h-9 rounded-lg border flex items-center justify-center font-bold text-[11px] transition-all ${
                        selectedTheme.bg === theme.bg ? 'ring-2 ring-slate-900 border-slate-900' : 'border-slate-200'
                      }`}
                      style={{ backgroundColor: theme.bg, color: theme.text }}
                    >
                      적용
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isNight"
                    checked={isNight}
                    onChange={(e) => setIsNight(e.target.checked)}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300"
                  />
                  <label htmlFor="isNight" className="font-bold text-slate-800 cursor-pointer flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5 text-purple-700" /> 야간근무 유형으로 설정 (주 3회 이상 자동 배치 제한 대상)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isOff"
                    checked={isOff}
                    onChange={(e) => setIsOff(e.target.checked)}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300"
                  />
                  <label htmlFor="isOff" className="font-bold text-slate-800 cursor-pointer">
                    휴무 / 오프(OFF) 성격의 일정으로 설정
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-bold text-white shadow-xs"
                  style={{ backgroundColor: '#ab002b' }}
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
