import React, { useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  RotateCcw,
  PenTool,
  Download,
  RefreshCw,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

export const DashboardView: React.FC = () => {
  const {
    plan,
    subjects,
    setCurrentStep,
    setTweakModalOpen,
    setExportModalOpen,
  } = usePlanner();

  if (!plan) return null;

  // Compute total sessions, completed count, and overall progress percentage
  const { totalSessions, completedSessions, progressPercent, subjectStats } = useMemo(() => {
    let total = 0;
    let completed = 0;
    const subMap: Record<string, { total: number; completed: number }> = {};

    subjects.forEach((s) => {
      subMap[s.name] = { total: 0, completed: 0 };
    });

    plan.days.forEach((day) => {
      day.sessions.forEach((s) => {
        total++;
        if (subMap[s.subjectName]) {
          subMap[s.subjectName].total++;
        }
        if (s.completed) {
          completed++;
          if (subMap[s.subjectName]) {
            subMap[s.subjectName].completed++;
          }
        }
      });
    });

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      totalSessions: total,
      completedSessions: completed,
      progressPercent: percent,
      subjectStats: subMap,
    };
  }, [plan, subjects]);

  // Exam countdown calculations
  const examCountdowns = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return subjects
      .map((s) => {
        const examD = new Date(s.examDate);
        examD.setHours(0, 0, 0, 0);
        const diffMs = examD.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return {
          ...s,
          daysLeft,
        };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [subjects]);

  const nearestExam = examCountdowns[0];

  // Phase breakdown calculations
  const phaseStats = useMemo(() => {
    let learning = 0;
    let review = 0;
    let practice = 0;

    plan.days.forEach((day) => {
      day.sessions.forEach((s) => {
        if (s.phase === 'learning') learning += 50 / 60;
        else if (s.phase === 'review') review += 50 / 60;
        else if (s.phase === 'practice') practice += 50 / 60;
      });
    });

    const totalPhases = learning + review + practice || 1;
    return {
      learning: Math.round(learning * 10) / 10,
      review: Math.round(review * 10) / 10,
      practice: Math.round(practice * 10) / 10,
      learningPct: Math.round((learning / totalPhases) * 100),
      reviewPct: Math.round((review / totalPhases) * 100),
      practicePct: Math.round((practice / totalPhases) * 100),
    };
  }, [plan]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Header / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-2xs relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              📊 DASHBOARD • ภาพรวมการเตรียมสอบ
            </span>
            {nearestExam && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>สอบ {nearestExam.name} อีก {nearestExam.daysLeft} วัน</span>
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {plan.planTitle}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl leading-relaxed">
            {plan.summary}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
          <button
            onClick={() => setCurrentStep('daily')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>ไปที่ตารางอ่านวันนี้ (Daily View)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExportModalOpen(true)}
            className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออกปฏิทิน</span>
          </button>
          <button
            onClick={() => setTweakModalOpen(true)}
            className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ปรับตาราง AI</span>
          </button>
        </div>
      </div>

      {/* 4 Core Stat Cards: Subjects, Days Left, Progress %, Total Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Subjects */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">จำนวนวิชาที่ต้องสอบ</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold font-mono text-neutral-900">
              {subjects.length} วิชา
            </span>
            <span className="text-xs text-neutral-400 block mt-1">
              ครอบคลุมทุกรายวิชาที่ลงทะเบียน
            </span>
          </div>
        </div>

        {/* Card 2: Days Left (Countdown) */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">สอบวิชาแรกในอีก</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold font-mono text-rose-600">
                {nearestExam ? nearestExam.daysLeft : 0}
              </span>
              <span className="text-sm font-bold text-neutral-700">วัน</span>
            </div>
            <span className="text-xs text-neutral-500 truncate block mt-1" title={nearestExam?.name}>
              วิชา: {nearestExam?.name || '-'}
            </span>
          </div>
        </div>

        {/* Card 3: Overall Progress % */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ความคืบหน้า (Progress)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-extrabold font-mono text-blue-600">
                {progressPercent}%
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                ({completedSessions}/{totalSessions} เซสชัน)
              </span>
            </div>
            <div className="w-full bg-blue-50 h-2.5 rounded-full overflow-hidden p-0.5 border border-blue-100">
              <div
                className="bg-gradient-to-r from-blue-600 to-sky-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Total Study Hours */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">ชั่วโมงอ่านรวมทั้งหมด</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold font-mono text-sky-700">
              {plan.totalStudyHours} ชม.
            </span>
            <span className="text-xs text-neutral-400 block mt-1 font-mono">
              เกลี่ย {plan.days.length} วัน • รอบละ 50 นาที
            </span>
          </div>
        </div>
      </div>

      {/* 3 Study Phases: Learning, Review, Practice */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              สัดส่วน 3 รูปแบบการอ่าน (Learning • Review • Practice)
            </h3>
            <p className="text-xs text-neutral-500">
              AI วางสัดส่วนการเรียนรู้ให้สมดุลเพื่อการจดจำอย่างยั่งยืน
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            รวม {plan.totalStudyHours} ชั่วโมง
          </span>
        </div>

        {/* Phase Bar */}
        <div className="w-full h-4 rounded-xl overflow-hidden flex mb-4 bg-neutral-100 p-0.5">
          <div
            className="bg-blue-600 h-full rounded-l-lg transition-all duration-500"
            style={{ width: `${phaseStats.learningPct}%` }}
            title={`Learning: ${phaseStats.learningPct}%`}
          />
          <div
            className="bg-sky-500 h-full transition-all duration-500"
            style={{ width: `${phaseStats.reviewPct}%` }}
            title={`Review: ${phaseStats.reviewPct}%`}
          />
          <div
            className="bg-teal-500 h-full rounded-r-lg transition-all duration-500"
            style={{ width: `${phaseStats.practicePct}%` }}
            title={`Practice: ${phaseStats.practicePct}%`}
          />
        </div>

        {/* 3 Phase Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-600 mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-blue-900">Learning (เรียนรู้ใหม่)</span>
                <span className="text-[11px] font-mono text-blue-700">
                  {phaseStats.learning} ชม. ({phaseStats.learningPct}%)
                </span>
              </div>
              <p className="text-[11px] text-blue-800/80 mt-0.5 leading-relaxed">
                ทำความเข้าใจทฤษฎีและจับใจความบทเรียนใหม่
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-sky-500 mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-sky-900">Review (ทบทวนซ้ำ)</span>
                <span className="text-[11px] font-mono text-sky-700">
                  {phaseStats.review} ชม. ({phaseStats.reviewPct}%)
                </span>
              </div>
              <p className="text-[11px] text-sky-800/80 mt-0.5 leading-relaxed">
                Active Recall, แฟลชการ์ด และสรุปช็อตโน้ต
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-teal-500 mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-teal-900">Practice (ทำโจทย์)</span>
                <span className="text-[11px] font-mono text-teal-700">
                  {phaseStats.practice} ชม. ({phaseStats.practicePct}%)
                </span>
              </div>
              <p className="text-[11px] text-teal-800/80 mt-0.5 leading-relaxed">
                ตะลุย Past Papers ข้อสอบเก่า และ Mock Exam
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Priority Ranking & Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Priority Ranking */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">
                AI Priority Rankings (ลำดับความสำคัญ)
              </h3>
              <p className="text-xs text-neutral-500">
                วิชาที่สอบใกล้กว่า ยากกว่า และเข้าใจน้อยกว่า ถูกจัดคิวให้อ่านก่อน
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(plan.priorityRankings || []).map((pr, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/40 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-xl bg-neutral-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">{pr.subjectName}</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">{pr.reason}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 shrink-0 border border-blue-150">
                  Priority: {pr.priorityScore}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Individual Subject Countdowns & Progress */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">
                กำหนดการสอบ & ความคืบหน้ารายวิชา
              </h3>
              <p className="text-xs text-neutral-500">
                นับถอยหลังสู่วันสอบจริงและจำนวนเซสชันที่อ่านสำเร็จ
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {examCountdowns.map((sub) => {
              const stats = subjectStats[sub.name] || { total: 0, completed: 0 };
              const subPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

              return (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl border border-neutral-200 bg-white flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color || '#0284c7' }} />
                      <h4 className="text-sm font-bold text-neutral-900">{sub.name}</h4>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        sub.daysLeft <= 7
                          ? 'bg-rose-100 text-rose-700'
                          : sub.daysLeft <= 14
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      อีก {sub.daysLeft} วัน
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                    <span>ความคืบหน้า: {subPct}%</span>
                    <span>{stats.completed}/{stats.total} เซสชัน</span>
                  </div>

                  <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${subPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
