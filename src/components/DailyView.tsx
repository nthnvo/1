import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Filter,
  Play,
  Sparkles,
  Target,
  ArrowRight,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { SessionItem } from './SessionItem';
import { StudySession } from '../types/planner';

export const DailyView: React.FC = () => {
  const {
    plan,
    subjects,
    selectedDayDate,
    setSelectedDayDate,
    toggleSessionComplete,
    setFocusSession,
  } = usePlanner();

  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  if (!plan || plan.days.length === 0) return null;

  // Map subjects to colors
  const subjectColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    subjects.forEach((s) => {
      map[s.name] = s.color || '#2563eb';
    });
    return map;
  }, [subjects]);

  // Current day index
  const currentIndex = plan.days.findIndex((d) => d.date === selectedDayDate);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentDay = plan.days[safeIndex];

  // Navigation handlers
  const handlePrevDay = () => {
    if (safeIndex > 0) {
      setSelectedDayDate(plan.days[safeIndex - 1].date);
    }
  };

  const handleNextDay = () => {
    if (safeIndex < plan.days.length - 1) {
      setSelectedDayDate(plan.days[safeIndex + 1].date);
    }
  };

  // Exam alert if any subject has exam on this day
  const examsToday = subjects.filter((s) => s.examDate === currentDay.date);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return currentDay.sessions.filter((s) => {
      if (filterMode === 'pending') return !s.completed;
      if (filterMode === 'completed') return !!s.completed;
      return true;
    });
  }, [currentDay, filterMode]);

  const completedCount = currentDay.sessions.filter((s) => s.completed).length;
  const totalCount = currentDay.sessions.length;
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  // Format Thai date
  const formatDateTh = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Date Navigation Bar */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-900">
                {currentDay.dayOfWeek}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-mono">
                {formatDateTh(currentDay.date)}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              เป้าหมายวันนี้: {currentDay.focusSummary || 'อ่านตามแผน'} • รวม {currentDay.targetHours} ชั่วโมง
            </p>
          </div>
        </div>

        {/* Prev / Next day buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            disabled={safeIndex <= 0}
            className="p-2 rounded-xl border border-neutral-200 hover:bg-blue-50/50 hover:border-blue-200 text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="วันก่อนหน้า"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-neutral-500 font-medium px-2">
            วันที่ {safeIndex + 1} จาก {plan.days.length}
          </span>
          <button
            onClick={handleNextDay}
            disabled={safeIndex >= plan.days.length - 1}
            className="p-2 rounded-xl border border-neutral-200 hover:bg-blue-50/50 hover:border-blue-200 text-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="วันถัดไป"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Day Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {plan.days.map((day, idx) => {
          const isSelected = day.date === currentDay.date;
          const done = day.sessions.filter((s) => s.completed).length;
          const total = day.sessions.length;

          return (
            <button
              key={day.date}
              onClick={() => setSelectedDayDate(day.date)}
              className={`px-3 py-2 rounded-2xl border text-xs shrink-0 transition-all text-left flex flex-col gap-1 min-w-[110px] cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white hover:bg-blue-50/40 hover:border-blue-200 border-neutral-200 text-neutral-700'
              }`}
            >
              <span className={`font-bold ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                {day.dayOfWeek.replace('วัน', '')} ({day.date.split('-')[2]})
              </span>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-neutral-400'}`}>
                {done}/{total} สำเร็จ
              </span>
            </button>
          );
        })}
      </div>

      {/* Exam Alert if exam is today */}
      {examsToday.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between shadow-2xs animate-pulse">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">วันนี้มีสอบ!</h4>
              <p className="text-xs">
                วิชา: {examsToday.map((e) => e.name).join(', ')} • ขอให้มั่นใจและทำข้อสอบได้เต็มที่
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-rose-600 text-white rounded-xl">
            EXAM DAY
          </span>
        </div>
      )}

      {/* Today Completion Banner */}
      {isAllDone && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-2xs">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">ยอดเยี่ยมมาก! คุณอ่านครบทุกเซสชันของวันนี้แล้ว</h4>
            <p className="text-xs text-emerald-700">
              พักผ่อนให้เพียงพอเพื่อให้สมองจัดระเบียบความจำ และพร้อมลุยต่อในวันพรุ่งนี้
            </p>
          </div>
        </div>
      )}

      {/* Main Checklist Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-100">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              รายการเซสชันอ่านหนังสือ (50 นาที + พัก 10 นาที)
            </h3>
            <p className="text-xs text-neutral-500">
              คลิก Checkbox เพื่อทำเครื่องหมายว่าอ่านจบแล้ว ความคืบหน้าจะอัปเดตทันที
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'all'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ทั้งหมด ({totalCount})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'pending'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ยังไม่อ่าน ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'completed'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              เสร็จแล้ว ({completedCount})
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 text-xs italic">
              ไม่มีเซสชันในหมวดที่เลือก
            </div>
          ) : (
            filteredSessions.map((session, idx) => (
              <React.Fragment key={session.id}>
                <SessionItem
                  session={session}
                  subjectColor={subjectColorMap[session.subjectName] || '#2563eb'}
                  onToggleComplete={toggleSessionComplete}
                  onStartFocus={(s) => setFocusSession(s)}
                />
                {/* 10-Minute Break Divider between sessions */}
                {idx < filteredSessions.length - 1 && session.activityType !== 'rest' && (
                  <div className="flex items-center justify-center gap-2 py-1.5 text-xs text-amber-800 bg-amber-50/70 border border-dashed border-amber-200/90 rounded-2xl my-1 font-medium">
                    <Coffee className="w-4 h-4 text-amber-500" />
                    <span>พักเบรกฟื้นฟูสมอง 10 นาที • ดื่มน้ำ & ยืดเส้นสาย</span>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
