import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface SubjectInput {
  id: string;
  name: string;
  examDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  understandingLevel?: number; // 1 (เข้าใจน้อยมาก) ถึง 5 (เข้าใจดีมาก)
  topics?: string;
  targetGrade?: string;
  priority?: 'high' | 'normal' | 'low';
}

interface GeneratePlanRequest {
  subjects: SubjectInput[];
  dailyAvailability: {
    weekdayHours?: number;
    weekendHours?: number;
    defaultHours: number;
    customDailyHours?: { [key: string]: number };
    preferredTimes?: string[];
  };
  startDate: string;
  studyStyle?: string;
  additionalNotes?: string;
}

// Route: Generate Study Plan
app.post('/api/study-plan/generate', async (req: Request, res: Response) => {
  try {
    const { subjects, dailyAvailability, startDate, studyStyle, additionalNotes }: GeneratePlanRequest = req.body;

    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: 'กรุณาระบุวิชาที่ต้องอ่านอย่างน้อย 1 วิชา' });
    }

    if (!startDate) {
      return res.status(400).json({ error: 'กรุณาระบุวันที่เริ่มต้นอ่าน' });
    }

    const weekdayHours = dailyAvailability.weekdayHours || dailyAvailability.defaultHours || 3;
    const weekendHours = dailyAvailability.weekendHours || dailyAvailability.defaultHours || 5;

    const prompt = `คุณคือผู้เชี่ยวชาญด้านจิตวิทยาการเรียนรู้ การจัดตารางอ่านหนังสือ และเทคนิคการเตรียมสอบระดับมหาวิทยาลัย (AI Study Planner)

ข้อมูลของนักศึกษา:
- วันที่เริ่มต้นวางแผน: ${startDate}
- รูปแบบการอ่าน: ${studyStyle || 'สมดุล (Active Recall + Spaced Repetition)'}
- เวลาว่าง:
  * วันจันทร์ - ศุกร์: ${weekdayHours} ชม./วัน
  * วันเสาร์ - อาทิตย์: ${weekendHours} ชม./วัน
  * ช่วงเวลาที่สะดวก: ${(dailyAvailability.preferredTimes || []).join(', ') || 'ยืดหยุ่น'}
- โน้ตเพิ่มเติม: ${additionalNotes || 'ไม่มี'}

รายวิชาและข้อมูลการประเมินตนเอง:
${subjects
  .map(
    (s, idx) =>
      `${idx + 1}. วิชา: ${s.name} | สอบวันที่: ${s.examDate} | ความยาก: ${s.difficulty} | ระดับความเข้าใจปัจจุบัน: ${s.understandingLevel || 3}/5 (1=น้อยมาก, 5=แม่นยำ) | หัวข้อ: ${s.topics || 'เนื้อหาตลอดทั้งเทอม'}`
  )
  .join('\n')}

กฎและ AI LOGIC สำคัญ (MANDATORY):
1. **AI Priority Logic (การจัดลำดับความสำคัญ)**:
   - วิชาที่ **สอบใกล้กว่า**, **ยากกว่า**, และ **เข้าใจน้อยกว่า** ต้องได้เวลาอ่านเยอะกว่า (Allocated Hours สูงกว่า) และถูกจัดให้อ่านก่อน (Scheduled Earlier ในวันแรกๆ)
   - สร้าง Priority Ranking พร้อมคะแนน 1-100 และเหตุผล
2. **รูปแบบการอ่าน 3 ช่วง (Study Phases)**:
   - ทุกๆ Session ต้องระบุ phase เป็นหนึ่งใน 3 รูปแบบนี้:
     * 'learning' = เรียนรู้ใหม่ / อ่านทำความเข้าใจเนื้อหา
     * 'review' = ทบทวนซ้ำ / Spaced Recall / สรุปช็อตโน้ต
     * 'practice' = ตะลุยโจทย์ / ทำข้อสอบเก่า / จำลองสอบเสมือนจริง
   - ลำดับต้องสมเหตุสมผล: เริ่มต้นด้วย Learning แก่นสำคัญ -> Review ทบทวน -> Practice ทำโจทย์เข้มข้น -> Spaced Review ก่อนสอบ
3. **กฎ 50/10 นาที**:
   - แต่ละเซสชันต้องใช้เวลา 50 นาทีเสมอ (durationMinutes: 50) คั่นด้วยพัก 10 นาที
4. **สรุปภาพรวม**:
   - คำนวณสรุปชั่วโมงของ Learning, Review และ Practice ใน phaseBreakdown`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'คุณคือ AI Study Planner ที่ชาญฉลาด ตอบกลับเป็น JSON ภาษาไทยเสมอ โดยโครงสร้างต้องตรงตาม JSON schema ที่กำหนดไว้อย่างเคร่งครัด',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            totalStudyHours: { type: Type.NUMBER },
            examStrategies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            priorityRankings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subjectName: { type: Type.STRING },
                  priorityScore: { type: Type.NUMBER },
                  urgency: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['subjectName', 'priorityScore', 'urgency', 'reason'],
              },
            },
            phaseBreakdown: {
              type: Type.OBJECT,
              properties: {
                learningHours: { type: Type.NUMBER },
                reviewHours: { type: Type.NUMBER },
                practiceHours: { type: Type.NUMBER },
              },
              required: ['learningHours', 'reviewHours', 'practiceHours'],
            },
            subjectSummaries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subjectName: { type: Type.STRING },
                  allocatedHours: { type: Type.NUMBER },
                  advice: { type: Type.STRING },
                },
                required: ['subjectName', 'allocatedHours', 'advice'],
              },
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  dayOfWeek: { type: Type.STRING },
                  focusSummary: { type: Type.STRING },
                  targetHours: { type: Type.NUMBER },
                  sessions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        subjectName: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        phase: { type: Type.STRING, description: 'learning, review, หรือ practice' },
                        activityType: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        recommendedTechnique: { type: Type.STRING },
                        tips: { type: Type.STRING },
                      },
                      required: ['id', 'subjectName', 'topic', 'phase', 'activityType', 'durationMinutes', 'recommendedTechnique'],
                    },
                  },
                },
                required: ['date', 'dayOfWeek', 'focusSummary', 'targetHours', 'sessions'],
              },
            },
          },
          required: ['planTitle', 'summary', 'totalStudyHours', 'examStrategies', 'subjectSummaries', 'days'],
        },
      },
    });


    const text = response.text;
    if (!text) {
      throw new Error('ไม่ได้รับข้อมูลการสร้างแผนจาก AI');
    }

    const planData = JSON.parse(text);
    return res.json({ success: true, plan: planData });
  } catch (error: any) {
    console.error('Error generating study plan:', error);
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการสร้างตารางอ่านหนังสือ: ' + (error?.message || 'โปรดลองใหม่อีกครั้ง'),
    });
  }
});

// Route: Tweak / Rebalance Existing Plan
app.post('/api/study-plan/rebalance', async (req: Request, res: Response) => {
  try {
    const { currentPlan, tweakRequest } = req.body;
    if (!currentPlan || !tweakRequest) {
      return res.status(400).json({ error: 'กรุณาส่งแผนปัจจุบันและสิ่งที่ต้องการปรับ' });
    }

    const prompt = `คุณคือ AI Study Planner ผู้ช่วยจัดตารางอ่านหนังสือของนักศึกษา

นี่คือแผนอ่านหนังสือปัจจุบัน:
ชื่อแผน: ${currentPlan.planTitle}
สรุปแผน: ${currentPlan.summary}
จำนวนวันในแผน: ${currentPlan.days?.length || 0} วัน

คำขอปรับตารางจากนักศึกษา:
"${tweakRequest}"

คำสั่ง:
ปรับแต่งแผนการอ่านหนังสือให้ตรงกับคำขอ โดยยังคงโครงสร้าง JSON เดิมที่กระชับ สมเหตุสมผล และตอบโจทย์สถานการณ์ของนักศึกษา`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'คุณคือ AI Study Planner ตอบกลับเป็น JSON ภาษาไทยที่มีโครงสร้างเดิมตรงตามกำหนด',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            totalStudyHours: { type: Type.NUMBER },
            examStrategies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            subjectSummaries: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subjectName: { type: Type.STRING },
                  allocatedHours: { type: Type.NUMBER },
                  advice: { type: Type.STRING },
                },
                required: ['subjectName', 'allocatedHours', 'advice'],
              },
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  dayOfWeek: { type: Type.STRING },
                  focusSummary: { type: Type.STRING },
                  targetHours: { type: Type.NUMBER },
                  sessions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        subjectName: { type: Type.STRING },
                        topic: { type: Type.STRING },
                        activityType: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        recommendedTechnique: { type: Type.STRING },
                        tips: { type: Type.STRING },
                      },
                      required: ['id', 'subjectName', 'topic', 'activityType', 'durationMinutes', 'recommendedTechnique'],
                    },
                  },
                },
                required: ['date', 'dayOfWeek', 'focusSummary', 'targetHours', 'sessions'],
              },
            },
          },
          required: ['planTitle', 'summary', 'totalStudyHours', 'examStrategies', 'subjectSummaries', 'days'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('ไม่ได้รับข้อมูลการปรับแผนจาก AI');
    }

    const updatedPlan = JSON.parse(text);
    return res.json({ success: true, plan: updatedPlan });
  } catch (error: any) {
    console.error('Error rebalancing plan:', error);
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการปรับแผน: ' + (error?.message || 'โปรดลองใหม่อีกครั้ง'),
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer();
