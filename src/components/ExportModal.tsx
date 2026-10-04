import React, { useState } from 'react';
import { Calendar, Download, Copy, Printer, Check, X, FileText } from 'lucide-react';
import { StudyPlan } from '../types/planner';
import { generateIcsCalendar, downloadFile } from '../utils/calendarExport';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: StudyPlan;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, plan }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadIcs = () => {
    const icsContent = generateIcsCalendar(plan);
    const filename = `${plan.planTitle.replace(/[^a-zA-Z0-9ก-๙]/g, '_') || 'StudyPlan'}.ics`;
    downloadFile(filename, icsContent, 'text/calendar;charset=utf-8');
  };

  const handlePrint = () => {
    window.print();
  };

  const generateTextSummary = (): string => {
    let text = `📅 ${plan.planTitle}\n`;
    text += `สรุป: ${plan.summary}\n`;
    text += `รวมชั่วโมงอ่าน: ${plan.totalStudyHours} ชม.\n`;
    text += `--------------------------------------\n`;

    plan.days.forEach((day) => {
      text += `\n📌 ${day.dayOfWeek} (${day.date}) - เป้าหมาย: ${day.focusSummary} [รวม ${day.targetHours} ชม.]\n`;
      day.sessions.forEach((s, idx) => {
        text += `  ${idx + 1}. [${s.durationMinutes} นาที] ${s.subjectName}: ${s.topic} (${s.activityType})\n`;
      });
    });

    return text;
  };

  const handleCopyText = async () => {
    const summary = generateTextSummary();
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-neutral-800 text-white">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">ส่งออกตารางอ่านหนังสือ</h3>
              <p className="text-xs text-neutral-500">เลือกรูปแบบที่ต้องการนำไปใช้งาน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 flex flex-col gap-3">
          {/* Option 1: Calendar .ICS */}
          <button
            onClick={handleDownloadIcs}
            className="w-full p-4 rounded-xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left flex items-start gap-4 group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900 text-sm group-hover:text-blue-900">
                ดาวน์โหลดไฟล์ปฏิทิน (.ics)
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                นำเข้า Google Calendar, Apple Calendar, หรือ Outlook ได้ทันที พร้อมการแจ้งเตือนตามเซสชัน
              </p>
            </div>
          </button>

          {/* Option 2: Copy Text */}
          <button
            onClick={handleCopyText}
            className="w-full p-4 rounded-xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left flex items-start gap-4 group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              {copied ? <Check className="w-6 h-6 text-emerald-600" /> : <Copy className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900 text-sm group-hover:text-neutral-900">
                {copied ? 'คัดลอกลงคลิปบอร์ดแล้ว!' : 'คัดลอกสรุปข้อความ (Text Summary)'}
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                สำหรับส่งในกลุ่ม LINE, Discord, หรือแปะใน Notion / สมุดจด
              </p>
            </div>
          </button>

          {/* Option 3: Print / PDF */}
          <button
            onClick={handlePrint}
            className="w-full p-4 rounded-xl border border-neutral-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-left flex items-start gap-4 group cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Printer className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-neutral-900 text-sm group-hover:text-blue-900">
                พิมพ์ หรือ บันทึกเป็น PDF (Print Sheet)
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                จัดรูปแบบกระดาษสวยงาม มินิมอล สำหรับปริ้นท์แปะผนังห้องอ่านหนังสือ
              </p>
            </div>
          </button>
        </div>

        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 font-medium"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
