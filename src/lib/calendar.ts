/**
 * Calendar .ics file generator for Indian Wedding ceremonies
 * Compatible with Google Calendar, Apple Calendar, and Microsoft Outlook.
 */
export function generateIcsCalendar(event: {
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO string or YYYY-MM-DDTHH:mm:ss
  endTime: string;
}): string {
  const formatDateToICS = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const startFormatted = formatDateToICS(event.startTime);
  const endFormatted = formatDateToICS(event.endTime);
  const now = formatDateToICS(new Date().toISOString());

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Team SHATRUJEET//ShaadiSync Indian Wedding OS//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@shaadisync.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return icsLines.join("\r\n");
}

export function downloadIcsFile(event: {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
}) {
  const content = generateIcsCalendar(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

