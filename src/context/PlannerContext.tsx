import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Subject,
  DayAvailability,
  StudyPlan,
  StudySession,
  StudyDay,
  ViewTab,
  Difficulty,
  StudyPhase,
} from '../types/planner';
import { PRESET_TEMPLATES, PresetTemplate, SUBJECT_COLOR_PALETTE, getRelativeDate } from '../data/presets';

const STORAGE_KEYS = {
  SUBJECTS: 'ai_study_planner_ctx_subjects_v3',
  AVAILABILITY: 'ai_study_planner_ctx_availability_v3',
  START_DATE: 'ai_study_planner_ctx_start_date_v3',
  PLAN: 'ai_study_planner_ctx_plan_v3',
  STUDY_STYLE: 'ai_study_planner_ctx_style_v3',
  STEP: 'ai_study_planner_ctx_step_v3',
  SELECTED_DAY: 'ai_study_planner_ctx_selected_day_v3',
};

interface PlannerContextType {
  // State
  subjects: Subject[];
  availability: DayAvailability;
  startDate: string;
  studyStyle: string;
  notes: string;
  plan: StudyPlan | null;
  currentStep: ViewTab;
  selectedDayDate: string;
  loading: boolean;
  error: string | null;
  focusSession: StudySession | null;
  tweakModalOpen: boolean;
  exportModalOpen: boolean;

  // Actions
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  updateSubject: (id: string, field: keyof Subject, value: any) => void;
  addSubject: () => void;
  removeSubject: (id: string) => void;
  setAvailability: React.Dispatch<React.SetStateAction<DayAvailability>>;
  setStartDate: (date: string) => void;
  setStudyStyle: (style: string) => void;
  setNotes: (notes: string) => void;
  setCurrentStep: (step: ViewTab) => void;
  setSelectedDayDate: (date: string) => void;
  setError: (error: string | null) => void;
  setFocusSession: (session: StudySession | null) => void;
  setTweakModalOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;

  // Operations
  selectPreset: (preset: PresetTemplate) => void;
  toggleSessionComplete: (sessionId: string) => void;
  completeFocusSession: (sessionId: string) => void;
  generatePlan: () => Promise<void>;
  tweakPlan: (prompt: string) => Promise<void>;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const PlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const defaultPreset = PRESET_TEMPLATES[0];

  // Subjects with full persistence
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return defaultPreset.subjects;
  });

  // Availability with full persistence
  const [availability, setAvailability] = useState<DayAvailability>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AVAILABILITY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return defaultPreset.availability;
  });

  // Start Date
  const [startDate, setStartDate] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.START_DATE);
    return saved || new Date().toISOString().split('T')[0];
  });

  // Study Style
  const [studyStyle, setStudyStyle] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDY_STYLE);
    return saved || 'spaced_repetition';
  });

  // Notes
  const [notes, setNotes] = useState<string>(defaultPreset.notes || '');

  // Plan
  const [plan, setPlan] = useState<StudyPlan | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null;
  });

  // Navigation Step
  const [currentStep, setCurrentStepState] = useState<ViewTab>(() => {
    const savedPlan = localStorage.getItem(STORAGE_KEYS.PLAN);
    if (savedPlan) {
      return 'dashboard';
    }
    return 'landing';
  });

  // Selected day for Daily View
  const [selectedDayDate, setSelectedDayDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [focusSession, setFocusSession] = useState<StudySession | null>(null);
  const [tweakModalOpen, setTweakModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AVAILABILITY, JSON.stringify(availability));
  }, [availability]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.START_DATE, startDate);
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDY_STYLE, studyStyle);
  }, [studyStyle]);

  useEffect(() => {
    if (plan) {
      localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
    }
  }, [plan]);

  const setCurrentStep = (step: ViewTab) => {
    setCurrentStepState(step);
    setError(null);
  };

  // Add subject
  const addSubject = () => {
    const nextColor = SUBJECT_COLOR_PALETTE[subjects.length % SUBJECT_COLOR_PALETTE.length];
    const newSub: Subject = {
      id: `sub-${Date.now()}`,
      name: '',
      examDate: getRelativeDate(14),
      difficulty: 'medium',
      understandingLevel: 3, // 3/5 default
      targetGrade: 'A',
      priority: 'normal',
      topics: '',
      color: nextColor,
    };
    setSubjects((prev) => [...prev, newSub]);
  };

  // Update subject field
  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
    );
  };

  // Remove subject
  const removeSubject = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects((prev) => prev.filter((sub) => sub.id !== id));
  };

  // Select Preset
  const selectPreset = (preset: PresetTemplate) => {
    setSubjects(preset.subjects);
    setAvailability(preset.availability);
    setStudyStyle(preset.studyStyle);
    setNotes(preset.notes);
    setError(null);
    setCurrentStep('subjects');
  };

  // Toggle session complete
  const toggleSessionComplete = (sessionId: string) => {
    if (!plan) return;
    const updatedDays = plan.days.map((day) => ({
      ...day,
      sessions: day.sessions.map((s) =>
        s.id === sessionId ? { ...s, completed: !s.completed } : s
      ),
    }));
    setPlan({
      ...plan,
      days: updatedDays,
    });
  };

  // Complete focus session
  const completeFocusSession = (sessionId: string) => {
    if (!plan) return;
    const updatedDays = plan.days.map((day) => ({
      ...day,
      sessions: day.sessions.map((s) =>
        s.id === sessionId ? { ...s, completed: true } : s
      ),
    }));
    setPlan({
      ...plan,
      days: updatedDays,
    });
  };

  // Fallback plan generator with Priority and Learning/Review/Practice phases
  const generateFallbackPlan = (): StudyPlan => {
    const start = new Date(startDate);
    const dayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

    // Calculate priority scores for each subject
    // Rule: Earlier exam date, harder difficulty, lower understanding = higher priority score!
    const prioritizedSubjects = [...subjects].map((s) => {
      const diffMs = new Date(s.examDate).getTime() - start.getTime();
      const daysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      // Difficulty weight (hard=3, medium=2, easy=1)
      const diffWeight = s.difficulty === 'hard' ? 3 : s.difficulty === 'medium' ? 2 : 1;
      // Understanding weight (understanding 1 gives 5, understanding 5 gives 1)
      const unWeight = 6 - (s.understandingLevel || 3);
      // Urgency based on days (1-7 days: 4, 8-14: 3, 15-21: 2, 22+: 1)
      const urgencyWeight = daysLeft <= 7 ? 4 : daysLeft <= 14 ? 3 : daysLeft <= 21 ? 2 : 1;

      const priorityScore = diffWeight * 30 + unWeight * 25 + urgencyWeight * 20;

      let reason = `สอบในอีก ${daysLeft} วัน`;
      if (s.difficulty === 'hard') reason += ' • เป็นวิชายากมาก';
      if ((s.understandingLevel || 3) <= 2) reason += ' • พื้นฐานยังเข้าใจน้อย (ต้องอ่านเยอะและเริ่มก่อน)';

      return {
        ...s,
        daysLeft,
        priorityScore,
        reason,
        urgency: (daysLeft <= 10 ? 'high' : daysLeft <= 18 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      };
    });

    // Sort by priorityScore descending: highest priority first!
    prioritizedSubjects.sort((a, b) => b.priorityScore - a.priorityScore);

    const sortedByDate = [...subjects].sort(
      (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
    );
    const lastExam = new Date(sortedByDate[sortedByDate.length - 1].examDate);
    const totalDays = Math.max(3, Math.ceil((lastExam.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const days: StudyDay[] = [];
    let grandTotalHours = 0;
    let totalLearningHours = 0;
    let totalReviewHours = 0;
    let totalPracticeHours = 0;

    for (let i = 0; i < totalDays; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      const dateStr = cur.toISOString().split('T')[0];
      const dayOfWeek = dayNames[cur.getDay()];
      const isWeekend = cur.getDay() === 0 || cur.getDay() === 6;

      const targetHours = isWeekend
        ? availability.weekendHours || 6
        : availability.weekdayHours || 3;
      grandTotalHours += targetHours;

      const numSessions = Math.max(1, Math.min(6, Math.round(targetHours)));
      const sessions: StudySession[] = [];

      // Determine phase balance based on timeline progress
      // First 40% of days: Learning heavy
      // Next 35%: Review & Practice
      // Last 25%: Practice & Spaced Review
      const progressRatio = i / totalDays;

      for (let sIdx = 0; sIdx < numSessions; sIdx++) {
        // High priority subjects get scheduled earlier and more frequently
        const subIndex = (i * 2 + sIdx) % prioritizedSubjects.length;
        const sub = prioritizedSubjects[subIndex];

        let phase: StudyPhase = 'learning';
        let activityType = 'learning';
        let technique = 'Deep Reading & Feynman Note-Taking';
        let tips = 'อ่านทำความเข้าใจและสรุปเป็นภาษาของตัวเอง';

        if (progressRatio > 0.65 || (sIdx >= 2 && progressRatio > 0.35)) {
          phase = 'practice';
          activityType = 'practice';
          technique = 'Past Paper & Problem Solving';
          tips = 'จับเวลาทำข้อสอบจริงและวิเคราะห์ข้อที่ทำผิด';
          totalPracticeHours += 50 / 60;
        } else if (progressRatio > 0.35 || sIdx === 1) {
          phase = 'review';
          activityType = 'review';
          technique = 'Spaced Repetition & Flashcards';
          tips = 'ปิดสมุดแล้วนึกย้อนทบทวน (Active Recall)';
          totalReviewHours += 50 / 60;
        } else {
          totalLearningHours += 50 / 60;
        }

        sessions.push({
          id: `sess_${i}_${sIdx}`,
          subjectName: sub.name,
          topic: sub.topics
            ? sub.topics.split(',')[sIdx % sub.topics.split(',').length].trim()
            : `เนื้อหาและแนวข้อสอบสำคัญ ${sub.name}`,
          phase,
          activityType: activityType as any,
          durationMinutes: 50,
          breakMinutes: 10,
          recommendedTechnique: technique,
          tips,
          completed: false,
        });
      }

      days.push({
        date: dateStr,
        dayOfWeek,
        focusSummary: `เน้นวิชา ${prioritizedSubjects[i % prioritizedSubjects.length].name} [${sessions[0]?.phase?.toUpperCase()}] พร้อมสลับทบทวน`,
        targetHours,
        sessions,
      });
    }

    return {
      planTitle: `แผนติวเข้มพิชิตเกรด A (${subjects.map((s) => s.name).join(', ')})`,
      summary: `ตารางอ่านหนังสืออัจฉริยะ จัดลำดับความสำคัญตามวันสอบ ความยาก และระดับความเข้าใจ แบ่ง 3 ช่วง: Learning, Review และ Practice ชัดเจน`,
      totalStudyHours: Math.round(grandTotalHours * 10) / 10,
      priorityRankings: prioritizedSubjects.map((s) => ({
        subjectName: s.name,
        priorityScore: s.priorityScore,
        urgency: s.urgency,
        reason: s.reason,
      })),
      phaseBreakdown: {
        learningHours: Math.round(totalLearningHours * 10) / 10,
        reviewHours: Math.round(totalReviewHours * 10) / 10,
        practiceHours: Math.round(totalPracticeHours * 10) / 10,
      },
      examStrategies: [
        'วิชาที่สอบใกล้และเข้าใจน้อย ได้รับการจัดให้เรียนรู้และทำโจทย์เป็นอันดับแรก',
        'แบ่งเป็น 3 ช่วง: Learning (เข้าใจแก่น), Review (ทบทวนซ้ำ), Practice (จำลองสอบ)',
        'อ่านรอบละ 50 นาที และลุกพัก 10 นาทีเพื่อประสิทธิภาพสูงสุดของคลื่นสมอง',
        'นอนหลับให้ครบ 7-8 ชม. เพื่อให้สมองบันทึกความจำระยะยาว',
      ],
      subjectSummaries: prioritizedSubjects.map((s) => ({
        subjectName: s.name,
        allocatedHours: Math.round((grandTotalHours / prioritizedSubjects.length) * 10) / 10,
        advice: `วิชา ${s.name} (${s.reason}) ได้รับการเกลี่ยเวลาอ่านเข้มข้น`,
        priorityScore: s.priorityScore,
        reason: s.reason,
      })),
      days,
      createdAt: new Date().toISOString(),
    };
  };

  // Generate Plan via API
  const generatePlan = async () => {
    const invalidSub = subjects.find((s) => !s.name.trim());
    if (invalidSub) {
      setError('กรุณากรอกชื่อวิชาให้ครบทุกช่อง');
      setCurrentStep('subjects');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/study-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects,
          dailyAvailability: availability,
          startDate,
          studyStyle,
          additionalNotes: notes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'ไม่สามารถสร้างตารางได้');
      }

      setPlan(data.plan);
      setCurrentStep('dashboard');
    } catch (err: any) {
      console.warn('API generation error, using fallback:', err);
      const fallback = generateFallbackPlan();
      setPlan(fallback);
      setCurrentStep('dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Tweak plan via API
  const tweakPlan = async (tweakPrompt: string) => {
    if (!plan) return;
    setLoading(true);

    try {
      const response = await fetch('/api/study-plan/rebalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPlan: plan,
          tweakRequest: tweakPrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'ไม่สามารถปรับตารางได้');
      }

      setPlan(data.plan);
      setTweakModalOpen(false);
    } catch (err: any) {
      console.error('Tweak plan error:', err);
      alert('ขออภัย ไม่สามารถเชื่อมต่อ AI เพื่อปรับตารางได้ในขณะนี้: ' + (err?.message || 'โปรดลองใหม่'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlannerContext.Provider
      value={{
        subjects,
        availability,
        startDate,
        studyStyle,
        notes,
        plan,
        currentStep,
        selectedDayDate,
        loading,
        error,
        focusSession,
        tweakModalOpen,
        exportModalOpen,
        setSubjects,
        updateSubject,
        addSubject,
        removeSubject,
        setAvailability,
        setStartDate,
        setStudyStyle,
        setNotes,
        setCurrentStep,
        setSelectedDayDate,
        setError,
        setFocusSession,
        setTweakModalOpen,
        setExportModalOpen,
        selectPreset,
        toggleSessionComplete,
        completeFocusSession,
        generatePlan,
        tweakPlan,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = (): PlannerContextType => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
