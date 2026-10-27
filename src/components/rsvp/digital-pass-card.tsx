"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Download, QrCode, Sparkles, Smartphone, Share2 } from "lucide-react";
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

    // Render a high-resolution royal commemorative pass canvas with all event details
    const canvas = document.createElement("canvas");
    const width = 640;
    const height = 920;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Warm Ivory background
    ctx.fillStyle = "#FAF8F2";
    ctx.fillRect(0, 0, width, height);

    // 2. Outer golden luxury border
    ctx.strokeStyle = "#C6A15B";
    ctx.lineWidth = 8;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    ctx.strokeStyle = "#172B4D";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // 3. Top Royal Gradient Header Bar
    const grad = ctx.createLinearGradient(30, 30, width - 30, 30);
    grad.addColorStop(0, "#C6A15B");
    grad.addColorStop(0.5, "#8B1E3F"); // burgundy
    grad.addColorStop(1, "#C6A15B");
    ctx.fillStyle = grad;
    ctx.fillRect(28, 28, width - 56, 12);

    // 4. Header title text
    ctx.textAlign = "center";
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#8B1E3F";
    ctx.fillText("✨ OFFICIAL WEDDING ENTRY PASS ✨", width / 2, 75);

    // 5. Ceremony Event Name
    ctx.font = "bold 26px serif";
    ctx.fillStyle = "#172B4D";
    ctx.fillText(eventName, width / 2, 115);

    // 6. Wedding Couple Name
    ctx.font = "500 18px serif";
    ctx.fillStyle = "#5A6A85";
    ctx.fillText(weddingTitle, width / 2, 145);

    // 7. QR Code Frame Box
    const qrSize = 340;
    const qrX = (width - qrSize) / 2;
    const qrY = 175;

    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#E0C48A";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 16);
    ctx.fill();
    ctx.stroke();

    // Draw QR image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = qrDataUrl;
    img.onload = () => {
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

      // 8. Attendee details card box
      const cardY = qrY + qrSize + 32;
      const cardWidth = 480;
      const cardHeight = 160;
      const cardX = (width - cardWidth) / 2;

      ctx.fillStyle = "#FFFFFF";
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 16);
      ctx.fill();
      ctx.stroke();

      // Attendee label
      ctx.font = "bold 13px sans-serif";
      ctx.fillStyle = "#64748B";
      ctx.fillText("ATTENDEE", width / 2, cardY + 30);

      // Guest Full Name
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#172B4D";
      ctx.fillText(guestName, width / 2, cardY + 65);

      // Admitting count
      ctx.font = "bold 16px sans-serif";
      ctx.fillStyle = "#047857"; // emerald-700
      ctx.fillText(`Admitting ${permittedCount} Person${permittedCount > 1 ? "s" : ""}`, width / 2, cardY + 98);

      // Pass code pill
      ctx.font = "bold 15px monospace";
      ctx.fillStyle = "#334155";
      ctx.fillText(`TOKEN: ${passCode}`, width / 2, cardY + 135);

      // 9. Footer instructions
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#64748B";
      ctx.fillText("Present this QR pass at the entrance gate scanner.", width / 2, height - 70);

      ctx.font = "italic 11px sans-serif";
      ctx.fillStyle = "#94A3B8";
      ctx.fillText("Powered by ShaadiSync • Team SHATRUJEET", width / 2, height - 46);

      // Trigger high-res PNG download
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `ShaadiSync_${eventName.replace(/[^a-zA-Z0-9]/g, "_")}_${passCode}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  }

  return (
    <div className="rounded-2xl border-2 border-gold-300 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 p-5 shadow-lg text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-400 via-burgundy-600 to-gold-400" />

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

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={downloadPass}
          className="w-full sm:w-auto text-xs gap-1.5 border-gold-300 hover:bg-gold-50 font-semibold"
        >
          <Download className="h-3.5 w-3.5 text-gold-600" />
          Save Pass to Phone
        </Button>

        {typeof navigator !== "undefined" && "share" in navigator && (
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => {
              try {
                await navigator.share({
                  title: `${eventName} Pass • ${weddingTitle}`,
                  text: `My Entry Pass for ${eventName} (${guestName}, ${permittedCount} Guests). Token: ${passCode}`,
                  url: window.location.href,
                });
              } catch {
                // User cancelled share
              }
            }}
            className="w-full sm:w-auto text-xs gap-1.5 font-semibold text-navy-800"
          >
            <Share2 className="h-3.5 w-3.5 text-navy-700" />
            Share / Add to Wallet
          </Button>
        )}
      </div>
    </div>
  );
}

