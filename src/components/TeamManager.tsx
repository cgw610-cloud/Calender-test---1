import React, { useState } from 'react';
import { TeamMember } from '../types';
import { Plus, Edit3, Trash2, UserPlus, Shield, CheckCircle } from 'lucide-react';

interface TeamManagerProps {
  members: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onUpdateMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
}

const EMOJI_OPTIONS = ['👨‍💼', '👩‍💼', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔧', '👨‍🔧', '👩‍🔧', '🧑‍🔬', '👨‍🔬', '⭐', '🛡️'];

export const TeamManager: React.FC<TeamManagerProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [isEditing, setIsEditing] = useState<TeamMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('👨‍💼');

  const handleOpenAdd = () => {
    setIsEditing(null);
    setName('');
    setRole('사원');
    setAvatarEmoji('👨‍💼');
    setShowForm(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setIsEditing(m);
    setName(m.name);
    setRole(m.role);
    setAvatarEmoji(m.avatarEmoji);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing) {
      onUpdateMember({
        ...isEditing,
        name: name.trim(),
        role: role.trim(),
        avatarEmoji,
      });
    } else {
      onAddMember({
        name: name.trim(),
        role: role.trim() || '팀원',
        color: '#ffffff',
        avatarEmoji,
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
            <Shield className="w-5 h-5 text-slate-700" /> 부서 근무자 명부 관리
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            교대근무 및 부서 일정 편성에 참여할 팀원 및 담당자를 등록합니다.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-white font-bold text-xs rounded-lg transition-opacity hover:opacity-90 shadow-xs"
          style={{ backgroundColor: '#ab002b' }}
        >
          <UserPlus className="w-4 h-4" />
          신규 근무자 등록
        </button>
      </div>

      {/* Members Table / Grid */}
      <div className="bg-white rounded-xl border border-slate-200 corporate-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">등록된 근무자 목록 ({members.length}명)</span>
        </div>
        <div className="divide-y divide-slate-100">
          {members.map((member) => (
            <div key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl">
                  {member.avatarEmoji || '👨‍💼'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                  <span className="text-xs font-medium text-slate-500">{member.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                  title="수정"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteMember(member.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              등록된 근무자가 없습니다. 신규 근무자를 등록해주세요.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-md w-full corporate-shadow animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? '근무자 정보 수정' : '신규 근무자 등록'}
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
                <label className="block font-bold text-slate-700 mb-1">성명</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900 focus:outline-hidden focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">직책 / 부서역할</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="예: 팀장, 수석엔지니어, 선임"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium bg-slate-50 text-slate-900 focus:outline-hidden focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">프로필 아이콘</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setAvatarEmoji(emoji)}
                      className={`w-9 h-9 rounded-lg border text-lg flex items-center justify-center transition-all ${
                        avatarEmoji === emoji
                          ? 'border-slate-900 bg-slate-100 ring-1 ring-slate-900'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
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
