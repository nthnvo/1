import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  X,
  Coffee,
} from 'lucide-react';
import { StudyPlan, Subject, StudySession, StudyDay } from '../types/planner';
import { usePlanner } from '../context/PlannerContext';
import { SessionItem } from './SessionItem';

interface CalendarViewProps {
  plan?: StudyPlan;
  subjects?: Subject[];
  subjectColorMap?: Record<string, string>;
  onToggleComplete?: (sessionId: string) => void;
  onStartFocus?: (session: StudySession) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = (props) => {
  const context = usePlanner();

  const plan = props.plan || context.plan;
  const subjects = props.subjects || context.subjects;
  const toggleComplete = props.onToggleComplete || context.toggleSessionComplete;
  const startFocus = props.onStartFocus || context.setFocusSession;

  const subjectColorMap = useMemo(() => {
    if (props.subjectColorMap) return props.subjectColorMap;
    const map: Record<string, string> = {};
    subjects.forEach((s) => {
      map[s.name] = s.color || '#2563eb';
    });
    return map;
  }, [props.subjectColorMap, subjects]);

  if (!plan) return null;

  // Find initial month from the first day in plan
  const initialDate = useMemo(() => {
    if (plan.days.length > 0) {
      const [y, m, d] = plan.days[0].date.split('-');
      return new Date(parseInt(y), parseInt(m) - 1, 1);
    }
    return new Date();
  }, [plan.days]);

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(initialDate);
  const [selectedDay, setSelectedDay] = useState<StudyDay | null>(null);

  // Map dates to StudyDay
  const dayPlanMap = useMemo(() => {
    const map = new Map<string, StudyDay>();
    plan.days.forEach((d) => map.set(d.date, d));
    return map;
  }, [plan.days]);

  // Map dates to Exams
  const examMap = useMemo(() => {
    const map = new Map<string, Subject[]>();
    subjects.forEach((s) => {
      const list = map.get(s.examDate) || [];
      list.push(s);
      map.set(s.examDate, list);
    });
    return map;
  }, [subjects]);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  // Calendar matrix calculation
  const calendarCells = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    const pad = (n: number) => n.toString().padStart(2, '0');
    const todayStr = new Date().toISOString().split('T')[0];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 0 ? 12 : month;
      const prevY = month === 0 ? year - 1 : year;
      const dStr = `${prevY}-${pad(prevM)}-${pad(d)}`;
      cells.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${year}-${pad(month + 1)}-${pad(d)}`;
      cells.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
      });
    }

    // Next month filler days to complete 35 or 42 grid cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 1 : month + 2;
      const nextY = month === 11 ? year + 1 : year;
      const dStr = `${nextY}-${pad(nextM)}-${pad(d)}`;
      cells.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
      });
    }

    return cells;
  }, [currentMonthDate]);

  const monthTitle = currentMonthDate.toLocaleDateString('th-TH', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs overflow-hidden">
        {/* Calendar Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 bg-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-lg capitalize">{monthTitle}</h3>
              <p className="text-xs text-neutral-500">แตะที่ช่องวันที่เพื่อดูเซสชัน 50 นาทีและการทบทวน</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-neutral-200 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 text-neutral-700 transition-all shadow-2xs cursor-pointer"
            >
              วันนี้
            </button>
            <div className="flex items-center border border-neutral-200 bg-white rounded-xl overflow-hidden shadow-2xs">
              <button
                onClick={prevMonth}
                title="เดือนก่อนหน้า"
                className="p-2 text-neutral-600 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-neutral-200" />
              <button
                onClick={nextMonth}
                title="เดือนถัดไป"
                className="p-2 text-neutral-600 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Weekday Labels (อาทิตย์ - เสาร์) */}
        <div className="grid grid-cols-7 border-b border-neutral-200 bg-blue-50/40 text-center text-[11px] font-semibold text-neutral-600 py-2.5">
          <span className="text-rose-600">อาทิตย์</span>
          <span>จันทร์</span>
          <span>อังคาร</span>
          <span>พุธ</span>
          <span>พฤหัสบดี</span>
          <span>ศุกร์</span>
          <span className="text-sky-700 font-bold">เสาร์</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-neutral-200/80 bg-neutral-100/30">
          {calendarCells.map((cell) => {
            const studyDay = dayPlanMap.get(cell.dateStr);
            const exams = examMap.get(cell.dateStr) || [];
            const hasSessions = studyDay && studyDay.sessions.length > 0;
            const completedCount = studyDay ? studyDay.sessions.filter((s) => s.completed).length : 0;
            const totalCount = studyDay ? studyDay.sessions.length : 0;

            return (
              <div
                key={cell.dateStr}
                onClick={() => studyDay && setSelectedDay(studyDay)}
                className={`min-h-[110px] sm:min-h-[125px] p-2 transition-all flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'bg-neutral-50/40 text-neutral-300'
                    : 'bg-white hover:bg-blue-50/40'
                } ${studyDay ? 'cursor-pointer hover:shadow-inner' : ''} ${
                  cell.isToday ? 'ring-2 ring-blue-500 ring-inset' : ''
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      cell.isToday
                        ? 'bg-blue-600 text-white shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-neutral-800'
                        : 'text-neutral-300'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {/* Completed badge */}
                  {totalCount > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                        completedCount === totalCount
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {completedCount}/{totalCount}
                    </span>
                  )}
                </div>

                {/* Badges / Events */}
                <div className="my-1.5 space-y-1 overflow-hidden">
                  {/* Exam Alert badge */}
                  {exams.map((ex) => (
                    <div
                      key={ex.id}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white truncate flex items-center gap-1 shadow-2xs"
                      title={`วันสอบ: ${ex.name}`}
                    >
                      <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                      <span>สอบ: {ex.name}</span>
                    </div>
                  ))}

                  {/* Session Chips */}
                  {hasSessions &&
                    studyDay.sessions.slice(0, 2).map((s) => {
                      const col = subjectColorMap[s.subjectName] || '#6366f1';
                      return (
                        <div
                          key={s.id}
                          className={`text-[10px] px-1.5 py-0.5 rounded truncate flex items-center gap-1 border ${
                            s.completed
                              ? 'bg-neutral-100 border-neutral-200 text-neutral-400 line-through'
                              : 'bg-white border-neutral-200 text-neutral-700 shadow-2xs'
                          }`}
                          title={`${s.subjectName}: ${s.topic} (50 นาที)`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: col }}
                          />
                          <span className="truncate">{s.subjectName}</span>
                        </div>
                      );
                    })}

                  {/* Overflow count */}
                  {studyDay && studyDay.sessions.length > 2 && (
                    <span className="text-[10px] text-neutral-400 font-medium block pl-1">
                      +{studyDay.sessions.length - 2} เซสชันเพิ่มเติม...
                    </span>
                  )}
                </div>

                {/* Bottom footer in cell */}
                <div className="text-[10px] text-neutral-400 font-mono">
                  {studyDay && `${studyDay.targetHours} ชม.`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Day Details Modal */}
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-blue-50/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-2xs">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900 text-base">
                      {selectedDay.dayOfWeek} ({selectedDay.date})
                    </h3>
                    <p className="text-xs text-neutral-500">
                      เป้าหมาย: {selectedDay.focusSummary || 'อ่านตามแผน'} • รวม {selectedDay.targetHours} ชม.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-neutral-400 hover:text-neutral-700 p-1 rounded-xl hover:bg-neutral-200/50 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sessions List with 10-minute break indicator */}
              <div className="p-6 overflow-y-auto space-y-3 flex-1">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  เซสชันอ่านหนังสือ (50 นาที + พัก 10 นาที):
                </div>
                {selectedDay.sessions.map((session, idx) => (
                  <React.Fragment key={session.id}>
                    <SessionItem
                      session={session}
                      subjectColor={subjectColorMap[session.subjectName] || '#2563eb'}
                      onToggleComplete={toggleComplete}
                      onStartFocus={startFocus}
                    />
                    {/* Break Indicator between sessions */}
                    {idx < selectedDay.sessions.length - 1 && (
                      <div className="flex items-center justify-center gap-2 py-1 text-[11px] text-amber-700 bg-amber-50/70 border border-dashed border-amber-200 rounded-xl my-1">
                        <Coffee className="w-3.5 h-3.5 text-amber-500" />
                        <span>พักเบรกฟื้นฟูสมอง 10 นาที (ยืดเส้นสาย / ดื่มน้ำ)</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-end">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-xl shadow-2xs hover:bg-neutral-50 transition-all"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
