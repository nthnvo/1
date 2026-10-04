import React from 'react';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { SubjectStep } from './components/SubjectStep';
import { AvailabilityStep } from './components/AvailabilityStep';
import { DashboardView } from './components/DashboardView';
import { DailyView } from './components/DailyView';
import { CalendarView } from './components/CalendarView';
import { FocusTimer } from './components/FocusTimer';
import { AiTweakModal } from './components/AiTweakModal';
import { ExportModal } from './components/ExportModal';
import { AlertCircle } from 'lucide-react';

function PlannerApp() {
  const {
    currentStep,
    error,
    setError,
    plan,
    focusSession,
    setFocusSession,
    completeFocusSession,
    tweakModalOpen,
    setTweakModalOpen,
    tweakPlan,
    exportModalOpen,
    setExportModalOpen,
    loading,
  } = usePlanner();

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col font-['Prompt',sans-serif]">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Error notification banner */}
        {error && (
          <div className="max-w-4xl mx-auto mt-4 px-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-rose-500 hover:text-rose-800 font-bold ml-4 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* STEP 0: Landing Page */}
        {currentStep === 'landing' && <LandingPage />}

        {/* STEP 1: Subjects Step */}
        {currentStep === 'subjects' && <SubjectStep />}

        {/* STEP 2: Availability Step */}
        {currentStep === 'availability' && <AvailabilityStep />}

        {/* DASHBOARD: Overview with Subjects, Days Left, Progress %, Phase Breakdown, and Priority Rankings */}
        {currentStep === 'dashboard' && plan && <DashboardView />}

        {/* DAILY VIEW: Interactive Checklist with Checkboxes for 50m Sessions */}
        {currentStep === 'daily' && plan && <DailyView />}

        {/* CALENDAR VIEW: Monthly grid with exam indicators and day detail drawer */}
        {currentStep === 'calendar' && plan && <CalendarView />}
      </main>

      {/* Focus Timer Modal (50 min study / 10 min break) */}
      <FocusTimer
        session={focusSession}
        onClose={() => setFocusSession(null)}
        onComplete={completeFocusSession}
      />

      {/* AI Tweak Modal */}
      <AiTweakModal
        isOpen={tweakModalOpen}
        onClose={() => setTweakModalOpen(false)}
        onTweak={tweakPlan}
        loading={loading}
      />

      {/* Calendar Export Modal */}
      {plan && (
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          plan={plan}
        />
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-blue-100 bg-white/90 text-center text-xs text-blue-900/60">
        <p>AI Study Planner • สูตร 50 นาที พัก 10 นาที (Learning • Review • Practice) สำหรับนักศึกษา</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PlannerProvider>
      <PlannerApp />
    </PlannerProvider>
  );
}
