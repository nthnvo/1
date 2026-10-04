import { ActivityType } from '../types/planner';

export interface ActivityMeta {
  label: string;
  labelEn: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  iconName: string;
}

export const ACTIVITY_META: Record<ActivityType, ActivityMeta> = {
  learning: {
    label: 'เรียนรู้ใหม่ (Learning)',
    labelEn: 'Deep Learning',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    iconName: 'BookOpen',
  },
  read: {
    label: 'อ่านทำความเข้าใจ',
    labelEn: 'Deep Reading',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    iconName: 'BookOpen',
  },
  summary: {
    label: 'สรุปช็อตโน้ต',
    labelEn: 'Summary & Notes',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    iconName: 'FileText',
  },
  practice: {
    label: 'ตะลุยทำโจทย์',
    labelEn: 'Problem Solving',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    iconName: 'PenTool',
  },
  review: {
    label: 'ทบทวน Spaced Recall',
    labelEn: 'Spaced Review',
    colorClass: 'text-sky-700',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    iconName: 'RotateCcw',
  },
  mock_exam: {
    label: 'จำลองทำข้อสอบจริง',
    labelEn: 'Mock Exam',
    colorClass: 'text-blue-800',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    iconName: 'Award',
  },
  rest: {
    label: 'พักเบรกฟื้นฟูสมอง',
    labelEn: 'Rest & Buffer',
    colorClass: 'text-sky-800',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-200',
    iconName: 'Coffee',
  },
};

export const STUDY_QUOTES = [
  '“ความสำเร็จในการสอบ ไม่ได้มาจากการอัดในคืนสุดท้าย แต่มาจากการสะสมทีละนิดทุกวัน”',
  '“การทำโจทย์ผิดวันนี้ คือคะแนนที่จะไม่หายไปในห้องสอบจริง”',
  '“Active Recall และ Spaced Repetition ช่วยประหยัดเวลาอ่านได้มากกว่า 50%”',
  '“พักผ่อนและนอนหลับให้พอ คือกระบวนการที่สมองบันทึกความจำระยะยาว”',
  '“จงโฟกัสที่ความก้าวหน้าทีละก้าว ไม่ต้องสมบูรณ์แบบ แค่เริ่มทำตามแผนทีละเซสชัน”',
];
