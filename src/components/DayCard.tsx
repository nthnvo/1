import React from 'react';
import { Calendar, Target, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { StudyDay, StudySession, Subject } from '../types/planner';
import { SessionItem } from './SessionItem';

interface DayCardProps {
  day: StudyDay;
  subjects: Subject[];
  subjectColorMap: Record<string, string>;
  onToggleComplete: (sessionId: string) => void;
  onStartFocus: (session: StudySession) => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  subjects,
  subjectColorMap,
  onToggleComplete,
  onStartFocus,
}) => {
  // Check if any subject has an exam on this day
  const examsOnThisDay = subjects.filter((s) => s.examDate === day.date);

  // Compute completed sessions count
  const completedCount = day.sessions.filter((s) => s.completed).length;
  const totalCount = day.sessions.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // Format date display
  const formatDateTh = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-');
      const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isAllCompleted
          ? 'bg-neutral-50/50 border-emerald-200'
          : examsOnThisDay.length > 0
          ? 'bg-amber-50/20 border-amber-300 shadow-xs'
          : 'bg-white border-neutral-200/90 shadow-xs hover:border-neutral-300'
      }`}
    >
      {/* Day Header */}
      <div className="px-5 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/40">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 text-base">
                {day.dayOfWeek}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {formatDateTh(day.date)}
              </span>
            </div>
            {day.focusSummary && (
              <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-1.5 font-normal">
                <Target className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{day.focusSummary}</span>
              </p>
            )}
          </div>
        </div>

        {/* Badges / Stats */}
        <div className="flex items-center gap-2">
          {/* Exam Alert Badge if exam is today */}
          {examsOnThisDay.map((ex) => (
            <span
              key={ex.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>สอบ: {ex.name}</span>
            </span>
          ))}

          {/* Daily Hours */}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 px-2.5 py-1 rounded-full shadow-2xs">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span>เป้าหมาย {day.targetHours} ชม.</span>
          </span>

          {/* Progress ratio */}
          {totalCount > 0 && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                isAllCompleted
                  ? 'bg-emerald-100 text-emerald-800 font-semibold'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>
                {completedCount}/{totalCount} เซสชัน
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Sessions List */}
      <div className="p-4 flex flex-col gap-2.5">
        {day.sessions.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400 italic">
            วันนี้ไม่มีเซสชันอ่านหนังสือ (วันพักผ่อนสมอง)
          </div>
        ) : (
          day.sessions.map((session, idx) => (
            <React.Fragment key={session.id}>
              <SessionItem
                session={session}
                subjectColor={subjectColorMap[session.subjectName] || '#2563eb'}
                onToggleComplete={onToggleComplete}
                onStartFocus={onStartFocus}
              />
              {idx < day.sessions.length - 1 && session.activityType !== 'rest' && (
                <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] text-amber-700 bg-amber-50/60 border border-dashed border-amber-200/90 rounded-xl my-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>พักเบรกฟื้นฟูสมอง 10 นาที • ยืดเส้นสาย & ดื่มน้ำ</span>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};
