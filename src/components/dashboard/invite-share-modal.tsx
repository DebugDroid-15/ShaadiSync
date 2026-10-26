"use client";

import * as React from "react";
import { MessageSquare, Copy, Check, ExternalLink, CalendarHeart } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generateWhatsAppInvitation, generateWhatsAppRsvpReminder } from "@/lib/whatsapp";
import { Guest, WeddingFunction } from "@/types/models";

interface InviteShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  functions: WeddingFunction[];
  weddingTitle: string;
  startDate: string;
  city: string;
}

export function InviteShareModal({
  isOpen,
  onClose,
  guest,
  functions,
  weddingTitle,
  startDate,
  city,
}: InviteShareModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [isReminderMode, setIsReminderMode] = React.useState(false);

  if (!guest) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://shaadisync.com";
  const rsvpUrl = `${baseUrl}/invite/${guest.invitationToken}`;

  const ceremonyNames = functions
    .filter((f) => guest.invitedFunctionIds.includes(f.id))
    .map((f) => f.name);

  const invitation = isReminderMode
    ? generateWhatsAppRsvpReminder({
        guestName: guest.firstName,
        coupleTitle: weddingTitle,
        rsvpUrl,
        daysLeft: 12,
      })
    : generateWhatsAppInvitation({
        guestName: guest.firstName,
        coupleTitle: weddingTitle,
        ceremonyNames,
        rsvpUrl,
        startDate,
        city,
      });

  const handleCopy = () => {
    navigator.clipboard.writeText(invitation.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Share Invitation • ${guest.firstName} ${guest.lastName}`}
      description="Zero-cost WhatsApp message generator with personalized invitation link."
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReminderMode(false)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                !isReminderMode
                  ? "bg-navy-700 text-gold-400"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              First Invitation
            </button>
            <button
              onClick={() => setIsReminderMode(true)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                isReminderMode
                  ? "bg-navy-700 text-gold-400"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Gentle Reminder
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            {ceremonyNames.length} Functions
          </span>
        </div>

        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800 font-sans whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
          {invitation.text}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="w-full sm:w-1/2 text-xs font-semibold gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy WhatsApp Text
              </>
            )}
          </Button>

          <a
            href={invitation.waUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-1/2"
          >
            <Button
              className="w-full text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-subtle"
            >
              <MessageSquare className="h-4 w-4" />
              Open WhatsApp Web
            </Button>
          </a>
        </div>
      </div>
    </Dialog>
  );
}
