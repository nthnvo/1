import { StudyPlan } from '../types/planner';

/**
 * Generates an RFC 5545 iCalendar (.ics) string for study sessions in a plan
 */
export function generateIcsCalendar(plan: StudyPlan): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AI Study Planner//Student Schedule//TH',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${plan.planTitle || 'AI Study Schedule'}`,
    'X-WR-TIMEZONE:Asia/Bangkok',
  ];

  let eventCounter = 1;

  plan.days.forEach((day) => {
    // Basic date parsing YYYY-MM-DD
    const dateClean = day.date.replace(/-/g, '');
    let currentHour = 9; // Default starting at 09:00 if not specified
    let currentMinute = 0;

    day.sessions.forEach((session) => {
      if (session.activityType === 'rest') return; // Skip pure rest blocks

      const pad = (n: number) => n.toString().padStart(2, '0');
      const startDT = `${dateClean}T${pad(currentHour)}${pad(currentMinute)}00`;

      // Calculate end time
      const totalMinutes = currentMinute + (session.durationMinutes || 45);
      const endHour = currentHour + Math.floor(totalMinutes / 60);
      const endMinute = totalMinutes % 60;
      const endDT = `${dateClean}T${pad(endHour)}${pad(endMinute)}00`;

      // Next session starts after this session + 15 min break
      const nextTotalMinutes = endMinute + 15;
      currentHour = endHour + Math.floor(nextTotalMinutes / 60);
      currentMinute = nextTotalMinutes % 60;

      const summary = `[อ่านสอบ] ${session.subjectName}: ${session.topic}`;
      const description = `วิชา: ${session.subjectName}\\nหัวข้อ: ${session.topic}\\nกิจกรรม: ${session.activityType}\\nเทคนิคแนะนำ: ${session.recommendedTechnique || 'Active Recall'}\\nคำแนะนำ: ${session.tips || 'ตั้งใจโฟกัส'}`;

      lines.push(
        'BEGIN:VEVENT',
        `UID:study-planner-${day.date}-${session.id || eventCounter++}@aistudyplanner.local`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${startDT}`,
        `DTEND:${endDT}`,
        `SUMMARY:${summary.replace(/,/g, '\\,')}`,
        `DESCRIPTION:${description.replace(/,/g, '\\,')}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Downloads a string as a file
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/calendar;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
