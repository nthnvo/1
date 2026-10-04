import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
  Filter,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Search,
  CheckSquare,
  LayoutGrid,
  ListOrdered,
  Coffee,
} from 'lucide-react';
import { StudyPlan, Subject, StudySession } from '../types/planner';
import { DayCard } from './DayCard';
import { CalendarView } from './CalendarView';

interface PlanViewProps {
  plan: StudyPlan;
  subjects: Subject[];
  onToggleComplete: (sessionId: string) => void;
  onStartFocus: (session: StudySession) => void;
  onOpenTweakModal: () => void;
  onOpenExportModal: () => void;
  onBackToEdit: () => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  plan,
  subjects,
  onToggleComplete,
  onStartFocus,
  onOpenTweakModal,
  onOpenExportModal,
  onBackToEdit,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'calendar'>('cards');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Map subject name to color
  const subjectColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    subjects.forEach((s) => {
      map[s.name] = s.color || '#2563eb';
    });
    return map;
  }, [subjects]);

  // Compute total sessions and completed count
  const { totalSessions, completedSessions, progressPercent } = useMemo(() => {
    let total = 0;
    let completed = 0;
    plan.days.forEach((day) => {
      day.sessions.forEach((s) => {
        total++;
        if (s.completed) completed++;
      });
    });
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { totalSessions: total, completedSessions: completed, progressPercent: percent };
  }, [plan]);

  // Filtered days based on subject or search query
  const filteredDays = useMemo(() => {
    return plan.days.map((day) => {
      const filteredSessions = day.sessions.filter((session) => {
        const matchesSubject =
          selectedSubjectFilter === 'all' ||
          session.subjectName.toLowerCase() === selectedSubjectFilter.toLowerCase();

        const matchesSearch =
          !searchQuery.trim() ||
          session.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          session.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (session.tips && session.tips.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesSubject && matchesSearch;
      });

      return {
        ...day,
        sessions: filteredSessions,
      };
    });
  }, [plan.days, selectedSubjectFilter, searchQuery]);

  // Nearest exam calculation
  const nearestExam = useMemo(() => {
    if (!subjects.length) return null;
    const sorted = [...subjects].sort(
      (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
    );
    const first = sorted[0];
    const diff = new Date(first.examDate).getTime() - new Date().getTime();
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return { name: first.name, days, date: first.examDate };
  }, [subjects]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner & Plan Title */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs p-6 sm:p-8 mb-8 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-sky-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Study Schedule Ready</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" />
                <span>สูตร 50 นาที พัก 10 นาที</span>
              </span>
              {nearestExam && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>สอบ {nearestExam.name} อีก {nearestExam.days} วัน</span>
                </span>
              )}
            </div>

            {/* Top action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenTweakModal}
                className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ปรับตารางด้วย AI</span>
              </button>
              <button
                onClick={onOpenExportModal}
                className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออก / ปฏิทิน</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {plan.planTitle}
          </h1>
          <p className="text-neutral-600 text-sm mt-2 max-w-3xl leading-relaxed">
            {plan.summary}
          </p>

          {/* Stats Bar */}
          <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                จำนวนวันวางแผน
              </span>
              <span className="text-xl font-bold font-mono text-neutral-900 mt-0.5 block">
                {plan.days.length} วัน
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                ชั่วโมงอ่านรวม
              </span>
              <span className="text-xl font-bold font-mono text-blue-600 mt-0.5 block">
                {plan.totalStudyHours} ชม.
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                รอบอ่าน (50 นาที)
              </span>
              <span className="text-xl font-bold font-mono text-neutral-900 mt-0.5 block">
                {completedSessions}/{totalSessions} สำเร็จ
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                ความคืบหน้ารวม
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold font-mono text-blue-600 block">
                  {progressPercent}%
                </span>
                <div className="flex-1 bg-blue-50 h-2 rounded-full overflow-hidden border border-blue-100">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategies Card */}
      {plan.examStrategies && plan.examStrategies.length > 0 && (
        <div className="mb-8 p-5 sm:p-6 bg-gradient-to-br from-blue-50/70 to-sky-50/50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-neutral-900 text-sm">
              กลยุทธ์สำคัญเพื่อคะแนนสูงสุด (AI Exam Strategies)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {plan.examStrategies.map((strat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 bg-white/80 p-2.5 rounded-xl border border-blue-50">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{strat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Switcher Bar (Card View vs Calendar View) */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Toggle Buttons */}
        <div className="flex items-center bg-blue-50/60 p-1 rounded-xl text-xs font-semibold border border-blue-100/60">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-blue-600'
            }`}
          >
            <ListOrdered className="w-4 h-4 text-blue-600" />
            <span>มุมมองการ์ดรายวัน (Card-based Timeline)</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'calendar'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-blue-600'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span>มุมมองปฏิทิน (Calendar View)</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาหัวข้อ, วิชา..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-800 placeholder-neutral-400 bg-neutral-50/50"
          />
        </div>
      </div>

      {/* Subject Filter Pills (Visible when in Card view) */}
      {viewMode === 'cards' && (
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-neutral-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>กรองวิชา:</span>
          </span>
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              selectedSubjectFilter === 'all'
                ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-blue-50/50'
            }`}
          >
            ทุกวิชา
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectFilter(sub.name)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                selectedSubjectFilter.toLowerCase() === sub.name.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-blue-50/50'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* VIEW CONTENT */}
      {viewMode === 'cards' ? (
        /* Card-based Timeline View */
        <div className="space-y-5">
          {filteredDays.map((day) => (
            <DayCard
              key={day.date}
              day={day}
              subjects={subjects}
              subjectColorMap={subjectColorMap}
              onToggleComplete={onToggleComplete}
              onStartFocus={onStartFocus}
            />
          ))}
        </div>
      ) : (
        /* Calendar View */
        <CalendarView
          plan={plan}
          subjects={subjects}
          subjectColorMap={subjectColorMap}
          onToggleComplete={onToggleComplete}
          onStartFocus={onStartFocus}
        />
      )}

      {/* Footer Actions */}
      <div className="mt-10 pt-6 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToEdit}
          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-4 py-2 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          ← ย้อนกลับไปแก้ไขรายวิชา & เวลาว่าง
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenTweakModal}
            className="px-4 py-2 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ขอปรับตารางกับ AI</span>
          </button>
          <button
            type="button"
            onClick={onOpenExportModal}
            className="px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออกปฏิทิน (.ics)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
