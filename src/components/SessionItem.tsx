import React from 'react';
import {
  Check,
  Clock,
  Play,
  Lightbulb,
  BookOpen,
  PenTool,
  FileText,
  RotateCcw,
  Award,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { StudySession, ActivityType, StudyPhase } from '../types/planner';
import { ACTIVITY_META } from '../utils/studyHelpers';

interface SessionItemProps {
  session: StudySession;
  subjectColor?: string;
  onToggleComplete: (sessionId: string) => void;
  onStartFocus: (session: StudySession) => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  subjectColor = '#2563eb',
  onToggleComplete,
  onStartFocus,
}) => {
  const isCompleted = !!session.completed;
  const meta = ACTIVITY_META[session.activityType] || ACTIVITY_META.read;

  // Render Phase Badge (Learning / Review / Practice)
  const renderPhaseBadge = (phase?: StudyPhase) => {
    if (!phase) return null;
    switch (phase) {
      case 'learning':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            📘 Learning
          </span>
        );
      case 'review':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
            🔄 Review
          </span>
        );
      case 'practice':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
            🎯 Practice
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`group relative p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
        isCompleted
          ? 'bg-neutral-50/70 border-neutral-200/80 opacity-75'
          : 'bg-white border-neutral-200/90 hover:border-blue-300 hover:shadow-xs'
      }`}
    >
      {/* Subject color bar accent */}
      <div
        className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full transition-opacity"
        style={{ backgroundColor: subjectColor }}
      />

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggleComplete(session.id)}
        className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
          isCompleted
            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
            : 'border-neutral-300 hover:border-blue-600 bg-white text-transparent hover:text-neutral-300'
        }`}
        title={isCompleted ? 'คลิกเพื่อยกเลิกการอ่าน' : 'คลิกทำเครื่องหมายว่าอ่านจบเซสชันนี้แล้ว'}
      >
        <Check className="w-4 h-4 stroke-[3]" />
      </button>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          {/* Phase Badge: Learning / Review / Practice */}
          {renderPhaseBadge(session.phase)}

          {/* Subject Badge */}
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-md inline-block max-w-[150px] truncate"
            style={{
              backgroundColor: `${subjectColor}15`,
              color: subjectColor,
            }}
          >
            {session.subjectName}
          </span>

          {/* Duration Badge */}
          <span className="text-[11px] font-semibold text-neutral-500 flex items-center gap-1 ml-auto font-mono bg-neutral-100 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-neutral-400" />
            <span>50 นาที</span>
          </span>
        </div>

        {/* Topic Title */}
        <h4
          className={`text-sm font-bold transition-all leading-snug ${
            isCompleted ? 'line-through text-neutral-400' : 'text-neutral-900'
          }`}
        >
          {session.topic}
        </h4>

        {/* Technique & Tips */}
        {(session.recommendedTechnique || session.tips) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
            {session.recommendedTechnique && (
              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                🎯 {session.recommendedTechnique}
              </span>
            )}
            {session.tips && (
              <span className="text-neutral-500 text-[11px] italic truncate max-w-sm" title={session.tips}>
                💡 {session.tips}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Focus Timer Button */}
      {session.activityType !== 'rest' && !isCompleted && (
        <button
          onClick={() => onStartFocus(session)}
          title="เริ่มจับเวลาโฟกัส 50 นาทีสำหรับเซสชันนี้"
          className="opacity-90 group-hover:opacity-100 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 transition-all shrink-0 self-center flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-blue-150"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>โฟกัส 50m</span>
        </button>
      )}
    </div>
  );
};
