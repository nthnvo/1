import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  Brain,
  Coffee,
  ChevronRight,
  Layers,
  Award,
  Zap,
} from 'lucide-react';
import { PRESET_TEMPLATES } from '../data/presets';
import { usePlanner } from '../context/PlannerContext';

export const LandingPage: React.FC = () => {
  const { setCurrentStep, selectPreset } = usePlanner();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Soft Blue Background Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-100/70 via-sky-100/50 to-cyan-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Study Planner สำหรับนิสิตและนักศึกษาทุกมหาวิทยาลัย</span>
          </div>

          {/* Headline with Blue Gradient */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-[1.15] mb-6">
            จัดตารางอ่านหนังสือสอบด้วย AI <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-800 bg-clip-text text-transparent">
              สูตร 50 นาที พัก 10 นาที
            </span>{' '}
            จำแม่น ไม่หมดไฟ
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 leading-relaxed mb-10">
            ระบบจัดความสำคัญอัจฉริยะ (AI Priority Logic): วิชาที่สอบใกล้กว่า ยากกว่า และเข้าใจน้อยกว่าจะถูกจัดให้อ่านก่อน พร้อมแบ่งช่วงการเรียนรู้ Learning, Review และ Practice ชัดเจน
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setCurrentStep('subjects')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base group cursor-pointer"
            >
              <span>เริ่มต้นจัดตารางอ่านสอบ (Wizard Form)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#presets"
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-neutral-50 text-neutral-700 font-semibold rounded-2xl border border-neutral-200 shadow-2xs hover:border-blue-300 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>ดูตัวอย่างสายการเรียน</span>
            </a>
          </div>

          {/* 3 Steps Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left max-w-4xl mx-auto mb-16">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs relative">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-bold text-neutral-900 text-sm mb-1">
                กรอกข้อมูลวิชา & ระดับความเข้าใจ
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                ใส่ชื่อวิชา วันสอบ ความยาก และประเมินความเข้าใจ 1-5 ดาว เพื่อให้ AI คำนวณ Priority
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs relative">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-bold text-neutral-900 text-sm mb-1">
                กำหนดเวลาว่าง จ-ศ และ ส-อ
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                ระบุเวลาว่างวันธรรมดากับวันหยุด ระบบจะจัดให้เป็นเซสชันละ 50 นาที และพัก 10 นาที
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs relative">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-bold text-neutral-900 text-sm mb-1">
                Dashboard & Daily View
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                ดูสถิติใน Dashboard, เช็คลิสต์กดติ๊กถูกใน Daily View, และดูภาพรวมทั้งเดือนใน Calendar View
              </p>
            </div>
          </div>

          {/* Interactive Feature Highlights */}
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white shadow-xl text-left max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-300 inline-flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  <span>AI Prioritization & 3 Study Phases</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Learning • Review • Practice ครบวงจร
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                  มั่นใจได้ว่าวิชาที่ยากและสอบเร็วกว่า จะได้รับการปูพื้นฐานทำความเข้าใจ (Learning) ทบทวนซ้ำเว้นระยะ (Review) และฝึกทำข้อสอบจริง (Practice) อย่างเป็นระบบ ไม่ตกหล่นแม้แต่วิชาเดียว
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                <div className="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>50 นาที: โฟกัสลึก (Deep Focus)</span>
                </div>
                <div className="flex items-center gap-2 text-xs bg-white/10 px-3.5 py-2 rounded-xl">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  <span>10 นาที: พักสายตา & ฟื้นฟูสมอง</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presets Section */}
      <section id="presets" className="py-16 bg-neutral-100/60 border-t border-neutral-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              เลือกดูตัวอย่างตามสายการเรียน
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              คลิกเพื่อโหลดข้อมูลตัวอย่างแล้วเริ่มสร้างตารางได้ทันที
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESET_TEMPLATES.map((preset) => (
              <div
                key={preset.id}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full inline-block mb-3 border border-blue-100">
                    {preset.faculty}
                  </span>
                  <h3 className="font-bold text-neutral-900 text-base mb-1.5">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="space-y-1.5 border-t border-neutral-100 pt-3 mb-4">
                    <span className="text-[11px] font-medium text-neutral-400 block">
                      วิชาตัวอย่าง:
                    </span>
                    {preset.subjects.map((s) => (
                      <div key={s.id} className="text-xs text-neutral-700 flex items-center justify-between">
                        <span className="truncate max-w-[180px] font-medium">• {s.name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">เข้าใจ {s.understandingLevel}/5</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => selectPreset(preset)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold border border-blue-200 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>ใช้เทมเพลตนี้</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
