import { formatDate, formatTime } from "./utils";

export interface WhatsAppMessageParams {
  guestName: string;
  phone?: string;
  coupleTitle: string;
  ceremonyNames: string[];
  rsvpUrl: string;
  startDate: string;
  city: string;
  customMessage?: string;
}

/**
 * Generates an elegant, culturally authentic WhatsApp invitation message
 * and returns the encoded direct wa.me intent URL.
 */
export function generateWhatsAppInvitation({
  guestName,
  phone,
  coupleTitle,
  ceremonyNames,
  rsvpUrl,
  startDate,
  city,
  customMessage,
}: WhatsAppMessageParams): { text: string; waUrl: string } {
  const ceremonyList = ceremonyNames.map((name) => `✨ ${name}`).join("\n");

  const messageText = `Namaste ${guestName} ji 🙏,

With immense joy, we invite you and your family to celebrate the wedding festivities of *${coupleTitle}* in *${city}*, commencing on *${formatDate(startDate)}*.

You are cordially invited to:
${ceremonyList}

${customMessage ? customMessage + "\n\n" : ""}Please confirm your attendance, food preferences (Veg/Jain), and accompanying family members via your private RSVP link below:
🔗 ${rsvpUrl}

We look forward to celebrating together!
Warm regards & Pranam,
The Family`.trim();

  const encodedText = encodeURIComponent(messageText);
  // Clean phone number (strip non-digits)
  let cleanPhone = (phone || "").replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone; // Prefix Indian country code
  }

  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  return { text: messageText, waUrl };
}

/**
 * Generates a reminder message for guests who have pending RSVP status.
 */
export function generateWhatsAppRsvpReminder({
  guestName,
  phone,
  coupleTitle,
  rsvpUrl,
  daysLeft = 7,
}: {
  guestName: string;
  phone?: string;
  coupleTitle: string;
  rsvpUrl: string;
  daysLeft?: number;
}): { text: string; waUrl: string } {
  const messageText = `Namaste ${guestName} ji 🙏,

A gentle reminder regarding the upcoming wedding celebrations of *${coupleTitle}* (starting in ${daysLeft} days).

To ensure appropriate banquet arrangements and seating, please kindly confirm your RSVP by clicking your personal link:
🔗 ${rsvpUrl}

Thank you!
Warm regards,
The Wedding Team`.trim();

  const encodedText = encodeURIComponent(messageText);
  let cleanPhone = (phone || "").replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }

  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  return { text: messageText, waUrl };
}
