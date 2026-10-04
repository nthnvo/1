import React, { useState } from 'react';
import { Sparkles, X, Loader2, ArrowRight } from 'lucide-react';

interface AiTweakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTweak: (prompt: string) => Promise<void>;
  loading: boolean;
}

const QUICK_PROMPTS = [
  'วันนี้อ่านไม่ทันตามเป้า ช่วยเกลี่ยเวลาที่เหลือไปวันอื่นๆ ให้หน่อย',
  'ขอจัดวันหยุดพักผ่อน (Rest Day) เพิ่มเติม 1 วันก่อนวันสอบจริง',
  'อยากเน้นการทำโจทย์เก่า (Past Papers) และ Active Recall ให้มากขึ้น',
  'ขอปรับเวลาแต่ละเซสชันให้สั้นลงเหลือรอบละ 30-40 นาทีเพื่อไม่ให้ล้า',
  'วิชาที่ยากที่สุดต้องการเวลาเพิ่มขึ้น 30% เกลี่ยจากวิชาที่ง่ายกว่า',
];

export const AiTweakModal: React.FC<AiTweakModalProps> = ({
  isOpen,
  onClose,
  onTweak,
  loading,
}) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    await onTweak(prompt.trim());
  };

  const handleSelectQuickPrompt = (qp: string) => {
    setPrompt(qp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base">ปรับแต่งตารางอ่านหนังสือด้วย AI</h3>
              <p className="text-xs text-neutral-500">บอก AI ว่าต้องการปรับเปลี่ยนหรือยืดหยุ่นส่วนไหน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-200/50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
              คำสั่งลัดที่ใช้บ่อย (แตะเพื่อเลือก):
            </label>
            <div className="flex flex-col gap-1.5">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectQuickPrompt(qp)}
                  className="text-left text-xs px-3 py-2 rounded-xl border border-neutral-200 hover:border-blue-300 hover:bg-blue-50/50 text-neutral-700 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-1">{qp}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              รายละเอียดความต้องการ:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="เช่น วันนี้ติดธุระด่วนอ่านไม่ได้ ขอเลื่อนไปทบวันเสาร์-อาทิตย์, หรืออยากเพิ่มเวลาวิชาฟิสิกส์เป็นพิเศษ..."
              rows={3}
              className="w-full text-sm p-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-neutral-800 placeholder-neutral-400 resize-none"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors font-medium disabled:opacity-50 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-xs hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI กำลังประมวลผล...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ปรับตารางทันที</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
