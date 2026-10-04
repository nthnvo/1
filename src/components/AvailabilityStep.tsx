import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Coffee,
  Sun,
  Moon,
  Sunset,
  BookOpen,
  Sliders,
  ChevronDown,
  ChevronUp,
  Brain,
  CheckCircle,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';

const PREFERRED_TIME_OPTIONS = [
  { id: 'morning', label: 'ช่วงเช้า (08:00 - 12:00)', icon: Sun },
  { id: 'afternoon', label: 'ช่วงบ่าย (13:00 - 17:00)', icon: Sunset },
  { id: 'evening', label: 'ช่วงค่ำ (18:00 - 22:00)', icon: Moon },
  { id: 'night', label: 'ช่วงดึก (22:00 - 02:00)', icon: Moon },
];

export const AvailabilityStep: React.FC = () => {
  const {
    availability,
    setAvailability,
    startDate,
    setStartDate,
    studyStyle,
    setStudyStyle,
    notes,
    setNotes,
    setCurrentStep,
    generatePlan,
    loading,
  } = usePlanner();

  // Toggle preferred time
  const handleTogglePreferredTime = (timeLabel: string) => {
    const current = availability.preferredTimes || [];
    if (current.includes(timeLabel)) {
      setAvailability((prev) => ({
        ...prev,
        preferredTimes: current.filter((t) => t !== timeLabel),
      }));
    } else {
      setAvailability((prev) => ({
        ...prev,
        preferredTimes: [...current, timeLabel],
      }));
    }
  };

  // Change weekday hours
  const handleWeekdayHoursChange = (hours: number) => {
    const val = Math.max(1, Math.min(10, hours));
    setAvailability((prev) => ({
      ...prev,
      weekdayHours: val,
      defaultHours: val,
    }));
  };

  // Change weekend hours
  const handleWeekendHoursChange = (hours: number) => {
    const val = Math.max(1, Math.min(12, hours));
    setAvailability((prev) => ({
      ...prev,
      weekendHours: val,
    }));
  };

  // 50m session estimates
  const weekdaySessions = Math.round((availability.weekdayHours || 3) * (60 / 60));
  const weekendSessions = Math.round((availability.weekendHours || 6) * (60 / 60));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Wizard Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span className="text-neutral-900 font-bold">ขั้นตอนที่ 2: กำหนดเวลาว่าง (จ-ศ & ส-อ) และ 3 รูปแบบการอ่าน</span>
          </div>
          <span>ขั้นตอน 2 จาก 2</span>
        </div>
        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-full transition-all duration-300" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xs p-6 sm:p-8 space-y-8">
        {/* 3 Study Phases & 50/10 Rule Notice */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-sky-50/70 to-cyan-50/60 border border-blue-100 flex flex-col sm:flex-row items-start gap-4">
          <div className="p-2.5 bg-blue-600 text-white rounded-2xl shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-neutral-900 text-sm">
              ระบบจัดแบ่ง 3 ช่วงเวลา: Learning • Review • Practice (รอบละ 50 นาที พัก 10 นาที)
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              AI จะวางแผนและติดป้ายกำกับแต่ละเซสชันอย่างชัดเจน:
              <span className="font-semibold text-blue-700"> [Learning]</span> ทำความเข้าใจเนื้อหาใหม่,
              <span className="font-semibold text-sky-700"> [Review]</span> ทบทวน Active Recall & Spaced Repetition, และ
              <span className="font-semibold text-teal-700"> [Practice]</span> ตะลุยโจทย์และทำข้อสอบเก่า
            </p>
          </div>
        </div>

        {/* Section: Weekdays vs Weekends */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight mb-1">
            เวลาว่างในแต่ละวัน (Daily Availability)
          </h2>
          <p className="text-xs text-neutral-500 mb-6">
            กำหนดจำนวนชั่วโมงที่สามารถอ่านหนังสือได้ระหว่างวันธรรมดากับวันหยุดสุดสัปดาห์
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Weekdays (จันทร์ - ศุกร์) */}
            <div className="p-5 rounded-2xl border border-neutral-200/90 bg-neutral-50/30 hover:border-blue-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    วันธรรมดา (จันทร์ - ศุกร์)
                  </span>
                  <span className="text-base font-bold font-mono text-neutral-900">
                    {availability.weekdayHours || 3} ชม. / วัน
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mb-4">
                  วันเรียนปกติหรือหลังเลิกคาบ
                </p>

                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={availability.weekdayHours || 3}
                  onChange={(e) => handleWeekdayHoursChange(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
                />

                <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5 font-mono">
                  <span>1 ชม.</span>
                  <span>4 ชม.</span>
                  <span>8 ชม.</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/60 text-xs text-neutral-600 flex items-center justify-between">
                <span>ประมาณการจำนวนรอบ:</span>
                <span className="font-semibold text-blue-600">
                  {weekdaySessions} Sessions (50 นาที/รอบ)
                </span>
              </div>
            </div>

            {/* Card 2: Weekends (เสาร์ - อาทิตย์) */}
            <div className="p-5 rounded-2xl border border-neutral-200/90 bg-neutral-50/30 hover:border-blue-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                    วันหยุด (เสาร์ - อาทิตย์)
                  </span>
                  <span className="text-base font-bold font-mono text-neutral-900">
                    {availability.weekendHours || 6} ชม. / วัน
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mb-4">
                  วันหยุดสุดสัปดาห์สำหรับเน้นทำโจทย์
                </p>

                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={availability.weekendHours || 6}
                  onChange={(e) => handleWeekendHoursChange(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-neutral-200 rounded-lg"
                />

                <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5 font-mono">
                  <span>1 ชม.</span>
                  <span>6 ชม.</span>
                  <span>12 ชม.</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-200/60 text-xs text-neutral-600 flex items-center justify-between">
                <span>ประมาณการจำนวนรอบ:</span>
                <span className="font-semibold text-sky-600">
                  {weekendSessions} Sessions (50 นาที/รอบ)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Start Date & Preferred Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              วันที่เริ่มอ่านหนังสือ (Start Date)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900"
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              ตารางรายวันจะเริ่มนับตั้งแต่วันนี้เป็นต้นไป
            </span>
          </div>

          {/* Preferred Times */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              ช่วงเวลาที่สะดวกอ่านมากที่สุด
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PREFERRED_TIME_OPTIONS.map((slot) => {
                const isSelected = (availability.preferredTimes || []).includes(slot.label);
                const Icon = slot.icon;
                return (
                  <button
                    type="button"
                    key={slot.id}
                    onClick={() => handleTogglePreferredTime(slot.label)}
                    className={`text-xs px-2.5 py-2 rounded-xl border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{slot.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Notes */}
        <div className="pt-4 border-t border-neutral-100">
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
            หมายเหตุหรือข้อจำกัดเพิ่มเติม (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="เช่น ขอพัก 1 วันเต็มก่อนสอบ, วิชาแคลคูลัสขอเน้นทำโจทย์เยอะๆ, วันพุธมีงานเลิกดึก"
            className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-800 placeholder-neutral-400"
          />
        </div>

        {/* Footer Navigation */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentStep('subjects')}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับไปแก้ไขรายวิชา (ข้อมูลไม่หาย)</span>
          </button>

          <button
            type="button"
            onClick={generatePlan}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI กำลังจัดตารางตาม Priority...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>สร้างตารางอ่านหนังสือด้วย AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
