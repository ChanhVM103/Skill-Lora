import React, { useState, useMemo } from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Sparkles,
  FileScan,
  BookOpen,
  MessageSquareCode,
  Compass,
  CheckCircle2,
  Trash2,
  Settings,
  LogOut,
  History as HistoryIcon,
} from 'lucide-react';
import { ActivityLogItem, ActivityType, MainTabType, UserProfile } from '../../types';
import { Language } from '../../i18n/translations';

interface GeminiHistorySidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  history: ActivityLogItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onSelectHistoryItem: (item: ActivityLogItem) => void;
  onNewScan: () => void;
  activeTab: MainTabType;
  onNavigateToTab: (tab: MainTabType) => void;
  user: UserProfile | null;
  onOpenSettings: () => void;
  onLogout?: () => void;
  language: Language;
}

export const GeminiHistorySidebar: React.FC<GeminiHistorySidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  history,
  onClearHistory,
  onDeleteItem,
  onSelectHistoryItem,
  onNewScan,
  activeTab,
  onNavigateToTab,
  user,
  onOpenSettings,
  onLogout,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  // Filter history by search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const q = searchQuery.toLowerCase();
    return history.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  // Group history items by date relative to today
  const groupedHistory = useMemo(() => {
    const today: ActivityLogItem[] = [];
    const yesterday: ActivityLogItem[] = [];
    const earlier: ActivityLogItem[] = [];

    filteredHistory.forEach((item) => {
      const ts = item.timestamp.toLowerCase();
      if (ts.includes('hôm nay') || ts.includes('vừa xong') || ts.includes('today')) {
        today.push(item);
      } else if (ts.includes('hôm qua') || ts.includes('yesterday')) {
        yesterday.push(item);
      } else {
        earlier.push(item);
      }
    });

    return { today, yesterday, earlier };
  }, [filteredHistory]);

  const getItemIcon = (type: ActivityType) => {
    switch (type) {
      case 'cv_scan':
        return <FileScan className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
      case 'lesson_complete':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />;
      case 'quiz_attempt':
        return <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case 'assessment_submit':
        return <MessageSquareCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case 'page_visit':
      default:
        return <Compass className="w-3.5 h-3.5 text-neutral-400 shrink-0" />;
    }
  };

  const displayName = user?.name || 'Nguyễn quốc Phong';
  const displayRole = user?.faculty || 'Pro';

  return (
    <aside
      className={`relative h-full flex flex-col transition-all duration-300 ease-in-out select-none border-r z-30 ${
        isCollapsed ? 'w-16' : 'w-[272px]'
      } bg-[#18181b] dark:bg-[#131314] text-neutral-200 border-neutral-800/80 shadow-xl`}
      aria-label="Gemini Activity History Sidebar"
    >
      {/* 1. Header with Brand & Collapse Button */}
      <div className="flex items-center justify-between px-3.5 py-3 h-[52px] border-b border-neutral-800/60 shrink-0">
        {!isCollapsed && (
          <div
            onClick={() => onNavigateToTab('cv-scanner')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-ueh-orange to-amber-500 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                Skillora <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">AI</span>
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Mở rộng bảng lịch sử' : 'Thu gọn bảng lịch sử'}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4 text-neutral-300" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-neutral-400 hover:text-white" />
          )}
        </button>
      </div>

      {/* 2. New Scan / Chat Pill Button */}
      <div className="p-2.5 shrink-0">
        {isCollapsed ? (
          <button
            onClick={onNewScan}
            className="w-10 h-10 mx-auto rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center transition-all hover:scale-105 shadow-sm border border-neutral-700/60"
            title="Quét CV & Đánh giá mới"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        ) : (
          <button
            onClick={onNewScan}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-200 hover:text-white text-xs font-semibold border border-neutral-700/70 shadow-sm transition-all hover:border-orange-500/50 group"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:rotate-90 duration-300">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="truncate">{language === 'vi' ? 'Quét CV & Bắt đầu mới' : 'New CV Scan & Assessment'}</span>
          </button>
        )}
      </div>

      {/* 3. Search Bar (When expanded) */}
      {!isCollapsed && (
        <div className="px-3 pb-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'vi' ? 'Tìm trong lịch sử...' : 'Search activity...'}
              className="w-full bg-neutral-900/90 text-neutral-200 placeholder-neutral-500 text-xs rounded-lg pl-8 pr-2.5 py-1.5 border border-neutral-800 focus:outline-none focus:border-orange-500/60 transition-colors"
            />
          </div>
        </div>
      )}

      {/* 4. Quick Category Shortcuts (Gemini style) */}
      {!isCollapsed && (
        <div className="px-3 py-1.5 border-b border-neutral-800/60 flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onNavigateToTab('cv-scanner')}
            className={`px-2.5 py-1 text-[11px] rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'cv-scanner'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 font-medium'
                : 'text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200'
            }`}
          >
            CV Scanner
          </button>
          <button
            onClick={() => onNavigateToTab('courses')}
            className={`px-2.5 py-1 text-[11px] rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'courses'
                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 font-medium'
                : 'text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200'
            }`}
          >
            Học phần
          </button>
          <button
            onClick={() => onNavigateToTab('assessment')}
            className={`px-2.5 py-1 text-[11px] rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'assessment'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-medium'
                : 'text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200'
            }`}
          >
            Test AI
          </button>
          <button
            onClick={() => onNavigateToTab('roadmap')}
            className={`px-2.5 py-1 text-[11px] rounded-full transition-colors whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-medium'
                : 'text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200'
            }`}
          >
            Lộ trình
          </button>
        </div>
      )}

      {/* 5. Recent Activity List (Scrollable - Styled exactly like Gemini History) */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 text-xs scrollbar-thin scrollbar-thumb-neutral-800">
        {isCollapsed ? (
          /* Collapsed Rail View: Just subtle clickable icon dots */
          <div className="flex flex-col items-center space-y-3 pt-2">
            <button
              onClick={() => onNavigateToTab('cv-scanner')}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Quét & Phân tích CV"
            >
              <FileScan className="w-4 h-4 text-orange-400" />
            </button>
            <button
              onClick={() => onNavigateToTab('courses')}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Khóa học của tôi"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
            </button>
            <button
              onClick={() => onNavigateToTab('assessment')}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Đánh giá Năng lực AI"
            >
              <MessageSquareCode className="w-4 h-4 text-blue-400" />
            </button>
            <button
              onClick={() => onNavigateToTab('roadmap')}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Lộ trình Nghề nghiệp"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
            </button>
            <div className="w-6 border-b border-neutral-800 my-1" />
            {history.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-colors"
                title={`${item.title} (${item.timestamp})`}
              >
                {getItemIcon(item.type)}
              </button>
            ))}
          </div>
        ) : (
          /* Expanded View: Gemini Grouped Activities */
          <>
            {/* Section: Gần đây */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <span>{language === 'vi' ? 'Gần đây' : 'Recent'}</span>
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-[10px] text-neutral-500 hover:text-rose-400 transition-colors flex items-center gap-1 font-normal lowercase tracking-normal"
                    title="Xóa toàn bộ lịch sử"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                    <span>xóa tất cả</span>
                  </button>
                )}
              </div>

              {filteredHistory.length === 0 ? (
                <div className="px-3 py-6 text-center text-neutral-500">
                  <HistoryIcon className="w-6 h-6 mx-auto mb-1.5 opacity-40 text-neutral-400" />
                  <p className="text-[11px]">Chưa có lịch sử hoạt động</p>
                </div>
              ) : (
                <>
                  {/* Today */}
                  {groupedHistory.today.length > 0 && (
                    <div className="space-y-0.5">
                      <div className="px-2.5 pt-2 pb-1 text-[10px] font-medium text-neutral-400">
                        {language === 'vi' ? 'Hôm nay' : 'Today'}
                      </div>
                      {groupedHistory.today.map((item) => (
                        <div
                          key={item.id}
                          onMouseEnter={() => setHoveredItemId(item.id)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          onClick={() => onSelectHistoryItem(item)}
                          className="group relative flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors hover:bg-neutral-800/90 text-neutral-300 hover:text-white"
                        >
                          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-1">
                            {getItemIcon(item.type)}
                            <span className="truncate text-xs tracking-tight">
                              {item.title}
                            </span>
                          </div>
                          {hoveredItemId === item.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem(item.id);
                              }}
                              className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/80 shrink-0 transition-colors"
                              title="Xóa mục này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Yesterday */}
                  {groupedHistory.yesterday.length > 0 && (
                    <div className="space-y-0.5 pt-2">
                      <div className="px-2.5 pt-1 pb-1 text-[10px] font-medium text-neutral-400">
                        {language === 'vi' ? 'Hôm qua' : 'Yesterday'}
                      </div>
                      {groupedHistory.yesterday.map((item) => (
                        <div
                          key={item.id}
                          onMouseEnter={() => setHoveredItemId(item.id)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          onClick={() => onSelectHistoryItem(item)}
                          className="group relative flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors hover:bg-neutral-800/90 text-neutral-300 hover:text-white"
                        >
                          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-1">
                            {getItemIcon(item.type)}
                            <span className="truncate text-xs tracking-tight">
                              {item.title}
                            </span>
                          </div>
                          {hoveredItemId === item.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem(item.id);
                              }}
                              className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/80 shrink-0 transition-colors"
                              title="Xóa mục này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Earlier */}
                  {groupedHistory.earlier.length > 0 && (
                    <div className="space-y-0.5 pt-2">
                      <div className="px-2.5 pt-1 pb-1 text-[10px] font-medium text-neutral-400">
                        {language === 'vi' ? 'Trước đó' : 'Earlier'}
                      </div>
                      {groupedHistory.earlier.map((item) => (
                        <div
                          key={item.id}
                          onMouseEnter={() => setHoveredItemId(item.id)}
                          onMouseLeave={() => setHoveredItemId(null)}
                          onClick={() => onSelectHistoryItem(item)}
                          className="group relative flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors hover:bg-neutral-800/90 text-neutral-300 hover:text-white"
                        >
                          <div className="flex items-center gap-2 overflow-hidden flex-1 mr-1">
                            {getItemIcon(item.type)}
                            <span className="truncate text-xs tracking-tight">
                              {item.title}
                            </span>
                          </div>
                          {hoveredItemId === item.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteItem(item.id);
                              }}
                              className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/80 shrink-0 transition-colors"
                              title="Xóa mục này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* 6. Footer: User Profile Bar (Exact Gemini style from screenshot) */}
      <div className="p-2 border-t border-neutral-800/80 bg-[#141416] shrink-0">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 transition-transform"
              title={`${displayName} (${displayRole}) - Bấm để mở Cài đặt`}
            >
              {displayName.charAt(0)}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-neutral-800/70 transition-colors">
            {/* User Avatar + Name */}
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ring-1 ring-white/10">
                {displayName.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-white truncate">
                  {displayName}
                </span>
                <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {displayRole}
                </span>
              </div>
            </div>

            {/* Actions: Settings & Logout */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onOpenSettings}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700/60 rounded-lg transition-colors"
                title="Tùy chỉnh giao diện & ngôn ngữ"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-700/60 rounded-lg transition-colors"
                  title="Đăng xuất"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
