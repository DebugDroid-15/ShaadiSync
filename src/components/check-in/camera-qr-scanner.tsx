"use client";

import * as React from "react";
import { Camera, CameraOff, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraQrScannerProps {
  onScan: (decodedText: string) => void;
  isActive: boolean;
}

export function CameraQrScanner({ onScan, isActive }: CameraQrScannerProps) {
  const [cameraStarted, setCameraStarted] = React.useState(false);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const scannerRef = React.useRef<any>(null);
  const containerId = "html5qr-code-full-region";

  const stopScanner = React.useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Scanner stop error:", err);
      }
      scannerRef.current = null;
    }
    setCameraStarted(false);
  }, []);

  const startScanner = React.useCallback(async () => {
    setCameraError(null);
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (scannerRef.current) {
        await stopScanner();
      }

      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode;

      const qrCodeSuccessCallback = (decodedText: string) => {
        // Trigger beep / haptic if available
        if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
          navigator.vibrate(100);
        }
        onScan(decodedText);
      };

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback,
        undefined
      );
      setCameraStarted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("NotAllowedError") || msg.includes("Permission denied")) {
        setCameraError("Camera permission denied. Please allow camera access in browser settings.");
      } else if (msg.includes("NotFoundError")) {
        setCameraError("No optical camera found on this device.");
      } else {
        setCameraError("Unable to access camera: " + msg);
      }
      setCameraStarted(false);
    }
  }, [onScan, stopScanner]);

  React.useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  React.useEffect(() => {
    if (!isActive && cameraStarted) {
      stopScanner();
    }
  }, [isActive, cameraStarted, stopScanner]);

  return (
    <div className="space-y-3">
      <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
        {/* HTML5 QR Code Container */}
        <div id={containerId} className="w-full h-full max-w-[340px]" />

        {!cameraStarted && (
          <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-burgundy-50 border border-burgundy-200 flex items-center justify-center mb-3">
              <Camera className="h-8 w-8 text-burgundy-600" />
            </div>
            <h4 className="text-sm font-bold text-navy-900">Live Device Optical Scanner</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">
              Use your device camera to scan digital QR passes or printed invitation badges in real-time.
            </p>

            <Button
              size="sm"
              onClick={startScanner}
              className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold"
            >
              <Camera className="h-4 w-4" />
              Turn On Live Camera
            </Button>
          </div>
        )}

        {cameraStarted && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
            <Button
              size="sm"
              variant="secondary"
              onClick={stopScanner}
              className="gap-1.5 bg-white/90 backdrop-blur-md shadow-md text-xs font-bold"
            >
              <CameraOff className="h-3.5 w-3.5 text-red-600" />
              Turn Off Camera
            </Button>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span>{cameraError}</span>
            <p className="mt-1 text-[11px] text-amber-700">
              Tip: You can use the manual token entry field below to admit guests instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
