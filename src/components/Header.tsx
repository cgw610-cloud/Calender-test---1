import React from 'react';
import { Calendar as CalendarIcon, Users, Tag, Shuffle, Building2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calendar' | 'teams' | 'categories';
  setActiveTab: (tab: 'calendar' | 'teams' | 'categories') => void;
  onOpenRandomModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRandomModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title / Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-xs"
            style={{ backgroundColor: '#ab002b' }}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                사내 통합 일정 및 교대근무 관리 시스템
              </h1>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: '#574953' }}
              >
                Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              부서별 근무 일정 조율 및 야간근무 자동 분배 규칙 준수 관리
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all border ${
              activeTab === 'calendar'
                ? 'text-white border-transparent shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            style={activeTab === 'calendar' ? { backgroundColor: '#ab002b' } : {}}
          >
            <CalendarIcon className="w-4 h-4" />
            캘린더 대시보드
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all border ${
              activeTab === 'teams'
                ? 'text-white border-transparent shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            style={activeTab === 'teams' ? { backgroundColor: '#ab002b' } : {}}
          >
            <Users className="w-4 h-4" />
            근무자 관리
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all border ${
              activeTab === 'categories'
                ? 'text-white border-transparent shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            style={activeTab === 'categories' ? { backgroundColor: '#ab002b' } : {}}
          >
            <Tag className="w-4 h-4" />
            근무 유형 설정
          </button>

          <button
            onClick={onOpenRandomModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs text-white transition-opacity hover:opacity-90 shadow-xs ml-2"
            style={{ backgroundColor: '#574953' }}
          >
            <Shuffle className="w-4 h-4" />
            스마트 교대근무 자동배치 (야간 제한)
          </button>
        </div>
      </div>
    </header>
  );
};
