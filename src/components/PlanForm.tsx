import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Subject, DayAvailability, Difficulty, Priority } from '../types/planner';
import { SUBJECT_COLOR_PALETTE, getRelativeDate } from '../data/presets';

interface PlanFormProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  availability: DayAvailability;
  setAvailability: React.Dispatch<React.SetStateAction<DayAvailability>>;
  startDate: string;
  setStartDate: (date: string) => void;
  studyStyle: string;
  setStudyStyle: (style: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  onGeneratePlan: () => Promise<void>;
  loading: boolean;
}

const STUDY_STYLES = [
  {
    id: 'spaced_repetition',
    title: 'Spaced Repetition & Active Recall',
    subtitle: 'แนะนำสำหรับจำแม่นระยะยาว ทบทวนเป็นรอบๆ และทำข้อสอบซ้ำ',
  },
  {
    id: 'balanced',
    title: 'แบบสมดุล (อ่านเนื้อหา + สรุป + ทำโจทย์)',
    subtitle: 'เกลี่ยเวลาครบทุกมิติ ไม่หนักจนเกินไป ป้องกันสมองล้า',
  },
  {
    id: 'practice_heavy',
    title: 'เน้นตะลุยโจทย์และข้อสอบเก่า (Exam Heavy)',
    subtitle: 'เหมาะสำหรับวิชาคำนวณ หรืออ่านเนื้อหามาแล้วต้องการความชำนาญ',
  },
  {
    id: 'pomodoro_intensive',
    title: 'ติวเข้มแบบโฟกัสสั้น (Pomodoro Cycles)',
    subtitle: 'เหมาะกับคนสมาธิสั้น แบ่งช่วงอ่าน 25-45 นาทีสลับพักเบรก',
  },
];

const PREFERRED_TIME_OPTIONS = [
  'ช่วงเช้า (08:00 - 12:00)',
  'ช่วงบ่าย (13:00 - 17:00)',
  'ช่วงค่ำ (18:00 - 22:00)',
  'ช่วงดึก (22:00 - 02:00)',
];

export const PlanForm: React.FC<PlanFormProps> = ({
  subjects,
  setSubjects,
  availability,
  setAvailability,
  startDate,
  setStartDate,
  studyStyle,
  setStudyStyle,
  notes,
  setNotes,
  onGeneratePlan,
  loading,
}) => {
  const [showAdvancedAvailability, setShowAdvancedAvailability] = useState(false);

  // Add new subject
  const handleAddSubject = () => {
    const nextColor = SUBJECT_COLOR_PALETTE[subjects.length % SUBJECT_COLOR_PALETTE.length];
    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name: '',
      examDate: getRelativeDate(14),
      difficulty: 'medium',
      understandingLevel: 3,
      targetGrade: 'A',
      priority: 'normal',
      topics: '',
      color: nextColor,
    };
    setSubjects([...subjects, newSub]);
  };

  // Update subject field
  const handleUpdateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(
      subjects.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
  };

  // Remove subject
  const handleRemoveSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((sub) => sub.id !== id));
  };

  // Toggle preferred times
  const handleTogglePreferredTime = (time: string) => {
    const current = availability.preferredTimes || [];
    if (current.includes(time)) {
      setAvailability({
        ...availability,
        preferredTimes: current.filter((t) => t !== time),
      });
    } else {
      setAvailability({
        ...availability,
        preferredTimes: [...current, time],
      });
    }
  };

  // Update specific day hours
  const handleDayHourChange = (dayName: keyof DayAvailability['customDailyHours'], value: number) => {
    setAvailability({
      ...availability,
      customDailyHours: {
        ...availability.customDailyHours,
        [dayName]: Math.max(0.5, Math.min(14, value)),
      },
    });
  };

  // Calculate days until exam
  const getDaysUntil = (examDateStr: string) => {
    if (!examDateStr) return 0;
    const diff = new Date(examDateStr).getTime() - new Date(startDate).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Page Title & Intro */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          วางแผนตารางอ่านหนังสือสอบด้วย AI
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          กรอกรายวิชา วันที่สอบ และเวลาว่างของคุณในแต่ละวัน แล้วให้ AI ช่วยคำนวณและเกลี่ยตารางอ่านแบบรายวัน
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Subjects List */}
        <section className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-neutral-900 text-base">1. รายวิชาและวันที่สอบ (Subjects)</h2>
                <p className="text-xs text-neutral-500">ระบุวิชาที่ต้องอ่านสอบและกำหนดวันสอบจริง</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddSubject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มวิชา</span>
            </button>
          </div>

          {/* Subjects Cards */}
          <div className="space-y-4">
            {subjects.map((sub, idx) => {
              const daysLeft = getDaysUntil(sub.examDate);
              return (
                <div
                  key={sub.id}
                  className="relative p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/30 hover:border-neutral-300 transition-all flex flex-col gap-3"
                >
                  {/* Color Accent Indicator */}
                  <div
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                    style={{ backgroundColor: sub.color || '#6366f1' }}
                  />

                  {/* Top Row: Name, Exam Date, Remove */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Subject Name */}
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                        ชื่อวิชา #{idx + 1}
                      </label>
                      <input
                        type="text"
                        value={sub.name}
                        onChange={(e) => handleUpdateSubject(sub.id, 'name', e.target.value)}
                        placeholder="เช่น Calculus II, เศรษฐศาสตร์จุลภาค, Data Structures"
                        className="w-full text-sm font-medium px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-neutral-900 placeholder-neutral-400"
                      />
                    </div>

                    {/* Exam Date */}
                    <div className="sm:col-span-5">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                          วันที่สอบ
                        </label>
                        <span className="text-[11px] font-medium text-indigo-600">
                          {daysLeft > 0 ? `อีก ${daysLeft} วัน` : 'วันสอบคือวันนี้!'}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          value={sub.examDate}
                          onChange={(e) => handleUpdateSubject(sub.id, 'examDate', e.target.value)}
                          className="w-full text-sm font-medium px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-neutral-900"
                        />
                      </div>
                    </div>

                    {/* Delete button */}
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(sub.id)}
                        disabled={subjects.length <= 1}
                        title="ลบวิชานี้"
                        className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Secondary Row: Difficulty, Target Grade, Topics */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 border-t border-neutral-100">
                    {/* Difficulty */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                        ความยาก
                      </label>
                      <select
                        value={sub.difficulty}
                        onChange={(e) =>
                          handleUpdateSubject(sub.id, 'difficulty', e.target.value as Difficulty)
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="easy">ง่าย (อ่านสบายๆ)</option>
                        <option value="medium">ปานกลาง (พอไหว)</option>
                        <option value="hard">ยากมาก (ต้องทุ่มเท)</option>
                      </select>
                    </div>

                    {/* Target Grade */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                        เกรดเป้าหมาย
                      </label>
                      <input
                        type="text"
                        value={sub.targetGrade || 'A'}
                        onChange={(e) => handleUpdateSubject(sub.id, 'targetGrade', e.target.value)}
                        placeholder="A, B+, ผ่าน"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Topics / Scope */}
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                        เนื้อหา/บทที่สอบ (สำคัญสำหรับ AI)
                      </label>
                      <input
                        type="text"
                        value={sub.topics || ''}
                        onChange={(e) => handleUpdateSubject(sub.id, 'topics', e.target.value)}
                        placeholder="เช่น บทที่ 1-5, อินทิกรัลสองชั้น, เมทริกซ์, วงจรไฟฟ้า"
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-neutral-800 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-neutral-400"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Daily Availability & Timing */}
        <section className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-base">2. เวลาว่างในการอ่านหนังสือ (Daily Availability)</h2>
              <p className="text-xs text-neutral-500">บอกเวลาที่คุณสามารถทุ่มเทอ่านได้ต่อวัน เพื่อไม่ให้ AI จัดตารางตึงเกินไป</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                วันที่เริ่มอ่านหนังสือ (Start Date)
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm font-medium px-3 py-2 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                ตารางจะเริ่มนับและวางแผนตั้งแต่วันนี้เป็นต้นไป
              </span>
            </div>

            {/* Default Daily Study Hours */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                  เวลาอ่านเฉลี่ยต่อวัน
                </label>
                <span className="text-sm font-bold font-mono text-blue-600 px-2 py-0.5 bg-blue-50 rounded-md">
                  {availability.defaultHours} ชั่วโมง / วัน
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={availability.defaultHours}
                onChange={(e) =>
                  setAvailability({
                    ...availability,
                    defaultHours: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-blue-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1 font-mono">
                <span>1 ชม. (เบาๆ)</span>
                <span>4-5 ชม. (กำลังดี)</span>
                <span>10 ชม. (มาราธอน)</span>
              </div>
            </div>
          </div>

          {/* Preferred Time Slots */}
          <div className="mt-6 pt-5 border-t border-neutral-100">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              ช่วงเวลาที่ชอบอ่านหรือสมองแล่นที่สุด
            </label>
            <div className="flex flex-wrap gap-2">
              {PREFERRED_TIME_OPTIONS.map((slot) => {
                const isSelected = (availability.preferredTimes || []).includes(slot);
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => handleTogglePreferredTime(slot)}
                    className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Toggle Custom Hours per Weekday */}
          <div className="mt-6 pt-5 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setShowAdvancedAvailability(!showAdvancedAvailability)}
              className="flex items-center justify-between w-full text-left text-xs font-semibold text-neutral-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                <span>กำหนดเวลาว่างแยกเฉพาะวัน (จันทร์ - อาทิตย์)</span>
                <span className="text-[11px] text-neutral-400 font-normal">
                  (เช่น วันธรรมดาติดเรียน เสาร์-อาทิตย์ว่างยาว)
                </span>
              </div>
              {showAdvancedAvailability ? (
                <ChevronUp className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {showAdvancedAvailability && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                {[
                  { key: 'monday', label: 'จันทร์' },
                  { key: 'tuesday', label: 'อังคาร' },
                  { key: 'wednesday', label: 'พุธ' },
                  { key: 'thursday', label: 'พฤหัสฯ' },
                  { key: 'friday', label: 'ศุกร์' },
                  { key: 'saturday', label: 'เสาร์' },
                  { key: 'sunday', label: 'อาทิตย์' },
                ].map(({ key, label }) => {
                  const val = availability.customDailyHours[key as keyof DayAvailability['customDailyHours']] ?? availability.defaultHours;
                  return (
                    <div key={key} className="flex flex-col items-center bg-white p-2 rounded-lg border border-neutral-200">
                      <span className="text-[11px] font-semibold text-neutral-700 mb-1">{label}</span>
                      <input
                        type="number"
                        min="0.5"
                        max="14"
                        step="0.5"
                        value={val}
                        onChange={(e) =>
                          handleDayHourChange(
                            key as keyof DayAvailability['customDailyHours'],
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 text-center text-xs font-bold font-mono py-1 rounded border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900"
                      />
                      <span className="text-[10px] text-neutral-400 mt-0.5">ชม.</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Study Strategy & Style */}
        <section className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900 text-base">3. สไตล์และเทคนิคการอ่าน (Study Style)</h2>
              <p className="text-xs text-neutral-500">เลือกแนวทางการเตรียมตัวสอบที่เหมาะกับคุณ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STUDY_STYLES.map((style) => {
              const isSelected = studyStyle === style.id;
              return (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setStudyStyle(style.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 shadow-2xs ring-1 ring-blue-600'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                  }`}
                >
                  <h4 className="text-xs font-bold text-neutral-900">{style.title}</h4>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                    {style.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Additional Notes */}
          <div className="mt-5 pt-4 border-t border-neutral-100">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              ข้อจำกัดหรือหมายเหตุเพิ่มเติม (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น วันพุธมีแล็บกลับดึก, ต้องการเน้นวิชาแคลคูลัส 2 เท่า, ขอพักเต็มที่ 1 วันก่อนสอบ"
              className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-800 placeholder-neutral-400"
            />
          </div>
        </section>

        {/* Generate CTA Button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onGeneratePlan}
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 mx-auto disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-base">AI กำลังวิเคราะห์และจัดตารางรายวัน...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="text-base">ให้ AI จัดตารางอ่านหนังสือรายวัน</span>
              </>
            )}
          </button>
          <p className="text-xs text-neutral-400 mt-2">
            AI จะคำนวณวันสอบ ความยาก และเวลาว่างเพื่อเกลี่ยตารางอ่านแบบสมเหตุสมผล
          </p>
        </div>
      </div>
    </div>
  );
};
