import React from 'react';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  Layers,
  Home,
  LayoutDashboard,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { usePlanner } from '../context/PlannerContext';
import { PRESET_TEMPLATES } from '../data/presets';
import { ViewTab } from '../types/planner';

export const Header: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    plan,
    selectPreset,
    setExportModalOpen,
  } = usePlanner();

  const hasPlan = !!plan;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => setCurrentStep('landing')}
          className="flex items-center gap-3 text-left focus:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 text-lg tracking-tight">AI Study Planner</span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                50/10 นาที
              </span>
            </div>
            <p className="text-xs text-neutral-500 hidden md:block">
              จัดตารางอ่านหนังสือสอบอัจฉริยะ พร้อม Dashboard & Daily View
            </p>
          </div>
        </button>

        {/* Center / Navigation Tabs */}
        <div className="flex items-center bg-blue-50/60 p-1 rounded-xl text-xs font-semibold overflow-x-auto border border-blue-100/60">
          <button
            onClick={() => setCurrentStep('landing')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentStep === 'landing'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-blue-600'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">หน้าแรก</span>
          </button>

          <button
            onClick={() => setCurrentStep('subjects')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentStep === 'subjects' || currentStep === 'availability'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-blue-600'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>ตั้งค่าวิชา</span>
          </button>

          <button
            onClick={() => setCurrentStep('dashboard')}
            disabled={!hasPlan}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentStep === 'dashboard'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : hasPlan
                ? 'text-neutral-600 hover:text-blue-600 cursor-pointer'
                : 'text-neutral-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentStep('daily')}
            disabled={!hasPlan}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentStep === 'daily'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : hasPlan
                ? 'text-neutral-600 hover:text-blue-600 cursor-pointer'
                : 'text-neutral-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Daily View</span>
          </button>

          <button
            onClick={() => setCurrentStep('calendar')}
            disabled={!hasPlan}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
              currentStep === 'calendar'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : hasPlan
                ? 'text-neutral-600 hover:text-blue-600 cursor-pointer'
                : 'text-neutral-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>ปฏิทิน</span>
          </button>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Quick Presets Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700 hover:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">โหลดตัวอย่าง</span>
              <span className="sm:hidden">ตัวอย่าง</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 hidden group-hover:block hover:block z-40 animate-in fade-in duration-150">
              <div className="px-2 py-1 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                เลือกสายการเรียนเพื่อทดสอบทันที:
              </div>
              {PRESET_TEMPLATES.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-neutral-50 transition-colors flex flex-col cursor-pointer"
                >
                  <span className="text-xs font-bold text-neutral-800">{preset.name}</span>
                  <span className="text-[11px] text-neutral-500 line-clamp-1">{preset.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Button */}
          {hasPlan && (
            <button
              onClick={() => setExportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ส่งออก (.ics)</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
