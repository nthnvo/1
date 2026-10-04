import { Subject, DayAvailability } from '../types/planner';

// Helper to get formatted dates relative to today
export function getRelativeDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  faculty: string;
  subjects: Subject[];
  availability: DayAvailability;
  studyStyle: string;
  notes: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'engineering',
    name: 'วิศวกรรมคอมพิวเตอร์ / IT',
    description: 'เน้นวิชาคำนวณ ตรรกะ อัลกอริทึม และการทำโจทย์จำลอง',
    faculty: 'วิศวกรรมศาสตร์ / เทคโนโลยีสารสนเทศ',
    subjects: [
      {
        id: 'sub-eng-1',
        name: 'Data Structures & Algorithms',
        examDate: getRelativeDate(10),
        difficulty: 'hard',
        understandingLevel: 2, // เข้าใจ 2/5 (ยังไม่คล่อง)
        targetGrade: 'A',
        priority: 'high',
        topics: 'Trees, Graphs, Dijkstra, Dynamic Programming, Big-O Analysis',
        color: '#2563eb',
      },
      {
        id: 'sub-eng-2',
        name: 'Calculus II (แคลคูลัส 2)',
        examDate: getRelativeDate(14),
        difficulty: 'hard',
        understandingLevel: 1, // เข้าใจ 1/5 (น้อยมาก ต้องทุ่มเท)
        targetGrade: 'B+',
        priority: 'high',
        topics: 'Multiple Integrals, Sequences & Series, Vector Calculus',
        color: '#0284c7',
      },
      {
        id: 'sub-eng-3',
        name: 'Computer Networks (เครือข่ายคอมพิวเตอร์)',
        examDate: getRelativeDate(18),
        difficulty: 'medium',
        understandingLevel: 3, // เข้าใจ 3/5 (ปานกลาง)
        targetGrade: 'A',
        priority: 'normal',
        topics: 'OSI 7 Layers, TCP/IP, Subnetting, Routing Protocols',
        color: '#0891b2',
      },
    ],
    availability: {
      weekdayHours: 3,
      weekendHours: 6,
      defaultHours: 3.5,
      customDailyHours: {
        monday: 3,
        tuesday: 2.5,
        wednesday: 3,
        thursday: 2,
        friday: 3,
        saturday: 6,
        sunday: 5,
      },
      preferredTimes: ['ช่วงค่ำ (19:00 - 22:00)', 'ช่วงดึก (22:00 - 00:00)'],
    },
    studyStyle: 'spaced_repetition',
    notes: 'วันพฤหัสบดีมีโปรเจกต์ส่งบ่าย เลิกดึก ขออ่านน้อยลง วันเสาร์-อาทิตย์เน้นทำโจทย์แบบจัดเต็ม',
  },
  {
    id: 'business',
    name: 'บริหารธุรกิจ & การตลาด (BBA)',
    description: 'เน้นความเข้าใจเคส การคำนวณการเงิน และท่องจำทฤษฎีการตลาด',
    faculty: 'บริหารธุรกิจ / การตลาด / บัญชี',
    subjects: [
      {
        id: 'sub-bus-1',
        name: 'Financial Management (การเงินธุรกิจ)',
        examDate: getRelativeDate(8),
        difficulty: 'hard',
        understandingLevel: 2, // เข้าใจ 2/5
        targetGrade: 'A',
        priority: 'high',
        topics: 'Time Value of Money, Capital Budgeting, WACC, Cash Flow Estimation',
        color: '#1d4ed8',
      },
      {
        id: 'sub-bus-2',
        name: 'Marketing Strategy (กลยุทธ์การตลาด)',
        examDate: getRelativeDate(12),
        difficulty: 'medium',
        understandingLevel: 4, // เข้าใจ 4/5
        targetGrade: 'A',
        priority: 'normal',
        topics: '4Ps/4Cs, STP Model, SWOT Analysis, Digital Consumer Behavior',
        color: '#0ea5e9',
      },
      {
        id: 'sub-bus-3',
        name: 'Business Statistics (สถิติธุรกิจ)',
        examDate: getRelativeDate(16),
        difficulty: 'medium',
        understandingLevel: 3, // เข้าใจ 3/5
        targetGrade: 'B+',
        priority: 'normal',
        topics: 'Hypothesis Testing, Regression Analysis, Probability Distributions',
        color: '#0369a1',
      },
    ],
    availability: {
      weekdayHours: 2.5,
      weekendHours: 5,
      defaultHours: 3,
      customDailyHours: {
        monday: 2.5,
        tuesday: 3,
        wednesday: 3,
        thursday: 2,
        friday: 2.5,
        saturday: 5,
        sunday: 5,
      },
      preferredTimes: ['ช่วงบ่าย (13:00 - 17:00)', 'ช่วงค่ำ (19:00 - 22:00)'],
    },
    studyStyle: 'balanced',
    notes: 'ต้องการสรุปคีย์เวิร์ดสำคัญ ทำแฟลชการ์ด และฝึกกดเครื่องคิดเลขการเงิน',
  },
  {
    id: 'medical',
    name: 'แพทยศาสตร์ / พยาบาล / วิทย์สุขภาพ',
    description: 'เนื้อหาแน่น ต้องท่องจำสรีรวิทยาและกลไกของโรคอย่างเป็นระบบ',
    faculty: 'แพทยศาสตร์ / พยาบาลศาสตร์ / เภสัชศาสตร์',
    subjects: [
      {
        id: 'sub-med-1',
        name: 'Gross Anatomy (กายวิภาคศาสตร์)',
        examDate: getRelativeDate(9),
        difficulty: 'hard',
        understandingLevel: 1, // เข้าใจ 1/5
        targetGrade: 'A',
        priority: 'high',
        topics: 'Musculoskeletal System, Cranial Nerves, Cardiovascular Anatomy',
        color: '#2563eb',
      },
      {
        id: 'sub-med-2',
        name: 'Physiology (สรีรวิทยา)',
        examDate: getRelativeDate(13),
        difficulty: 'hard',
        understandingLevel: 2, // เข้าใจ 2/5
        targetGrade: 'A',
        priority: 'high',
        topics: 'Renal & Acid-Base, Cardiac Cycle, Endocrine Regulation',
        color: '#0284c7',
      },
      {
        id: 'sub-med-3',
        name: 'Medical Biochemistry (ชีวเคมีทางการแพทย์)',
        examDate: getRelativeDate(17),
        difficulty: 'medium',
        understandingLevel: 3, // เข้าใจ 3/5
        targetGrade: 'B+',
        priority: 'normal',
        topics: 'Krebs Cycle, Lipid Metabolism, DNA Replication & Repair',
        color: '#0891b2',
      },
    ],
    availability: {
      weekdayHours: 3.5,
      weekendHours: 6,
      defaultHours: 4,
      customDailyHours: {
        monday: 3.5,
        tuesday: 4,
        wednesday: 3,
        thursday: 3.5,
        friday: 4,
        saturday: 6,
        sunday: 6,
      },
      preferredTimes: ['ช่วงเช้า (08:00 - 12:00)', 'ช่วงค่ำ (19:00 - 23:00)'],
    },
    studyStyle: 'spaced_repetition',
    notes: 'เน้น Active Recall, Flashcards (Anki style), และเชื่อมโยงกระบวนการทำงานของระบบต่างๆ',
  },
];

export const SUBJECT_COLOR_PALETTE = [
  '#2563eb', // Royal Blue
  '#0284c7', // Sky Blue
  '#0891b2', // Ocean Cyan
  '#1d4ed8', // Dark Blue
  '#0ea5e9', // Light Sky
  '#3b82f6', // Electric Blue
  '#0369a1', // Deep Azure
  '#06b6d4', // Aqua Cyan
  '#60a5fa', // Soft Blue
];
