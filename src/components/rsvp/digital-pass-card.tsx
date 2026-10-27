"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Download, QrCode, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalPassCardProps {
  passCode: string;
  guestName: string;
  eventName: string;
  weddingTitle: string;
  permittedCount?: number;
}

export function DigitalPassCard({
  passCode,
  guestName,
  eventName,
  weddingTitle,
  permittedCount = 1,
}: DigitalPassCardProps) {
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("");

  React.useEffect(() => {
    QRCode.toDataURL(passCode, {
      width: 260,
      margin: 1.5,
      color: {
        dark: "#1e1b4b", // navy-900
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR render error:", err));
  }, [passCode]);

  function downloadPass() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `ShaadiSync_Pass_${passCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div className="rounded-2xl border-2 border-gold-300 bg-linear-to-b from-amber-50/40 via-white to-amber-50/20 p-5 shadow-lg text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-gold-400 via-burgundy-600 to-gold-400" />

      <div className="flex items-center justify-center gap-1.5 text-burgundy-700 font-bold text-xs uppercase tracking-wider mb-1 pt-1">
        <Sparkles className="h-3.5 w-3.5 text-gold-500" />
        Official Wedding Entry Pass
      </div>

      <h3 className="font-bold text-base text-navy-900">{eventName}</h3>
      <p className="text-xs text-slate-500 font-medium mb-3">{weddingTitle}</p>

      {/* QR Code Frame */}
      <div className="inline-block p-2 rounded-xl bg-white border border-gold-200/80 shadow-xs mb-3">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt={`QR Pass: ${passCode}`} className="w-48 h-48 mx-auto" />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-slate-400">
            <QrCode className="h-10 w-10 animate-pulse text-gold-500" />
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-lg p-2.5 max-w-xs mx-auto border border-slate-200 mb-3">
        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Attendee</div>
        <div className="font-bold text-sm text-navy-900">{guestName}</div>
        <div className="text-xs text-emerald-700 font-semibold mt-0.5">
          Admitting {permittedCount} Person{permittedCount > 1 ? "s" : ""}
        </div>
        <div className="mt-1 font-mono text-xs text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block font-bold">
          {passCode}
        </div>
      </div>

      <p className="text-[11px] text-slate-500 max-w-xs mx-auto mb-3">
        Show this QR code at the entrance gate scanner or present the bearer code to the hospitality team.
      </p>

      <Button
        variant="outline"
        size="sm"
        onClick={downloadPass}
        className="text-xs gap-1.5 border-gold-300 hover:bg-gold-50 font-semibold"
      >
        <Download className="h-3.5 w-3.5 text-gold-600" />
        Save Pass to Phone
      </Button>
    </div>
  );
}

