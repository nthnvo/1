import React from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { Difficulty } from '../types/planner';

export const SubjectStep: React.FC = () => {
  const {
    subjects,
    updateSubject,
    addSubject,
    removeSubject,
    startDate,
    setCurrentStep,
  } = usePlanner();

  // Calculate days until exam
  const getDaysUntil = (examDateStr: string) => {
    if (!examDateStr) return 0;
    const diff = new Date(examDateStr).getTime() - new Date(startDate).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Validation
  const canProceed = subjects.every((s) => s.name.trim().length > 0);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span className="text-neutral-900 font-bold">ขั้นตอนที่ 1: กรอกข้อมูลรายวิชา & ระดับความเข้าใจ</span>
          </div>
          <span>ขั้นตอน 1 จาก 2</span>
        </div>
        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-1/2 transition-all duration-300" />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs p-6 sm:p-8">
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-neutral-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
              วิชาที่ต้องอ่านสอบ
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              ระบุวิชา วันที่สอบ ความยาก และระดับความเข้าใจ เพื่อให้ AI จัด Priority อ่านก่อน-หลัง
            </p>
          </div>
          <button
            type="button"
            onClick={addSubject}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มวิชาใหม่</span>
          </button>
        </div>

        {/* AI Priority Notice */}
        <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">AI Priority Logic: </span>
            วิชาที่ <span className="font-semibold text-rose-700">สอบใกล้กว่า</span>,{' '}
            <span className="font-semibold text-amber-700">ยากกว่า</span>, และ{' '}
            <span className="font-semibold text-blue-800">เข้าใจน้อยกว่า</span>{' '}
            จะได้รับเวลาอ่านเยอะกว่าและถูกจัดคิวให้อ่านเป็นอันดับแรกเสมอ
          </div>
        </div>

        {/* Subjects List */}
        <div className="space-y-4">
          {subjects.map((sub, idx) => {
            const daysLeft = getDaysUntil(sub.examDate);
            const understanding = sub.understandingLevel ?? 3;

            return (
              <div
                key={sub.id}
                className="relative p-5 rounded-2xl border border-neutral-200/90 bg-neutral-50/40 hover:border-blue-300 hover:bg-white transition-all flex flex-col gap-4 shadow-2xs"
              >
                {/* Color Strip */}
                <div
                  className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full"
                  style={{ backgroundColor: sub.color || '#0284c7' }}
                />

                {/* Top Row: Name, Exam Date, Delete */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Name */}
                  <div className="sm:col-span-6">
                    <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1">
                      ชื่อวิชา #{idx + 1} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                      placeholder="เช่น แคลคูลัส 2, กายวิภาคศาสตร์, สถิติธุรกิจ"
                      className="w-full text-sm font-semibold px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 placeholder-neutral-400"
                    />
                  </div>

                  {/* Exam Date */}
                  <div className="sm:col-span-5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                        วันที่สอบจริง
                      </label>
                      <span className="text-[11px] font-semibold text-blue-600 font-mono">
                        {daysLeft > 0 ? `อีก ${daysLeft} วัน` : 'สอบเร็วๆ นี้!'}
                      </span>
                    </div>
                    <input
                      type="date"
                      value={sub.examDate}
                      onChange={(e) => updateSubject(sub.id, 'examDate', e.target.value)}
                      className="w-full text-sm font-medium px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900"
                    />
                  </div>

                  {/* Delete button */}
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeSubject(sub.id)}
                      disabled={subjects.length <= 1}
                      title="ลบวิชานี้"
                      className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Second Row: Difficulty, Understanding Level, Topics */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-neutral-100">
                  {/* Difficulty */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      ความยากง่าย
                    </label>
                    <select
                      value={sub.difficulty}
                      onChange={(e) =>
                        updateSubject(sub.id, 'difficulty', e.target.value as Difficulty)
                      }
                      className="w-full text-xs px-2.5 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="easy">ง่าย (อ่านสบายๆ)</option>
                      <option value="medium">ปานกลาง (พอไหว)</option>
                      <option value="hard">ยากมาก (ต้องทุ่มเท)</option>
                    </select>
                  </div>

                  {/* Understanding Level (1 to 5) */}
                  <div className="sm:col-span-4">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-neutral-600">
                        ระดับความเข้าใจปัจจุบัน
                      </label>
                      <span className="text-[10px] font-semibold text-blue-600">
                        {understanding === 1
                          ? 'น้อยมาก (ต้องติวหนัก)'
                          : understanding === 2
                          ? 'พอรู้บ้าง'
                          : understanding === 3
                          ? 'ปานกลาง'
                          : understanding === 4
                          ? 'เข้าใจดี'
                          : 'แม่นยำมาก'}
                      </span>
                    </div>
                    {/* Star / Rating Selector */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => updateSubject(sub.id, 'understandingLevel', lvl)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            lvl <= understanding
                              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                              : 'bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topics to read */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      หัวข้อ/บทที่ต้องอ่าน (สำหรับ AI แบ่ง Session)
                    </label>
                    <input
                      type="text"
                      value={sub.topics || ''}
                      onChange={(e) => updateSubject(sub.id, 'topics', e.target.value)}
                      placeholder="เช่น บทที่ 1-4, อินทิกรัลสองชั้น, วงจรไฟฟ้า"
                      className="w-full text-xs px-2.5 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-neutral-400"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentStep('landing')}
            className="px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับไปหน้าแรก</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep('availability')}
            disabled={!canProceed}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>ถัดไป: กำหนดเวลาว่าง (จ-ศ & ส-อ)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
