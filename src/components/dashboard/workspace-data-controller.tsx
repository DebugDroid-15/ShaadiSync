"use client";

import * as React from "react";
import {
  Trash2,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Database,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShaadiStorage } from "@/lib/shaadi-storage";

export function WorkspaceDataController() {
  const [dataMode, setDataMode] = React.useState<"clean" | "demo" | "custom">("demo");
  const [guestCount, setGuestCount] = React.useState<number>(0);
  const [weddingCount, setWeddingCount] = React.useState<number>(0);
  const [isConfirmingClear, setIsConfirmingClear] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const refreshCounts = React.useCallback(() => {
    setDataMode(ShaadiStorage.getDataMode());
    setGuestCount(ShaadiStorage.getGuests().length);
    setWeddingCount(ShaadiStorage.getWeddings().length);
  }, []);

  React.useEffect(() => {
    refreshCounts();

    const handleStorageUpdate = () => {
      refreshCounts();
    };

    window.addEventListener("shaadisync_storage_update", handleStorageUpdate);
    return () => window.removeEventListener("shaadisync_storage_update", handleStorageUpdate);
  }, [refreshCounts]);

  // Handler: Clear All Data (Clean Slate)
  const handleClearAll = () => {
    ShaadiStorage.clearAllToCleanSlate();
    setIsConfirmingClear(false);
    refreshCounts();
    window.location.reload();
  };

  // Handler: Load Demo Seed Scenario
  const handleLoadDemo = () => {
    ShaadiStorage.loadDemoScenario();
    refreshCounts();
    window.location.reload();
  };

  // Handler: Export Workspace JSON
  const handleExport = () => {
    const json = ShaadiStorage.exportWorkspaceJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shaadisync_workspace_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handler: Import Workspace JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = ShaadiStorage.importWorkspaceJson(content);
      if (success) {
        refreshCounts();
        window.location.reload();
      } else {
        alert("Invalid ShaadiSync workspace JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-950 to-burgundy-950 border-b border-gold-400/30 px-4 py-2.5 text-white text-xs select-none shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Mode Badge & Live Summary */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-gold-400 animate-pulse" />
            <span className="font-serif font-bold text-gold-300 tracking-wide text-xs">
              Storage Engine:
            </span>
          </div>

          <Badge
            variant={dataMode === "clean" ? "outline" : "gold"}
            className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 ${
              dataMode === "clean"
                ? "border-emerald-400 text-emerald-300 bg-emerald-950/40"
                : "bg-gold-500/20 text-gold-300 border border-gold-400/40"
            }`}
          >
            {dataMode === "clean" ? "Clean Testing Slate (0 Mock Data)" : "Royal Demo Scenario Loaded"}
          </Badge>

          <span className="text-[11px] text-slate-300 hidden sm:inline">
            Active: <strong>{weddingCount}</strong> Wedding | <strong>{guestCount}</strong> Guests | Offline Local Sync Active
          </span>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Clear Slate Button */}
          {isConfirmingClear ? (
            <div className="flex items-center gap-1.5 bg-rose-950/80 px-2 py-1 rounded-md border border-rose-500/50">
              <span className="text-[10px] text-rose-300 font-semibold">Erase all records?</span>
              <button
                onClick={handleClearAll}
                className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setIsConfirmingClear(false)}
                className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[10px]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmingClear(true)}
              className="h-7 text-[11px] px-2.5 font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/50 border-rose-500/40"
              title="Remove all dummy/mock data and start with an empty wedding"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-400 mr-1" />
              Clear All Dummy Data
            </Button>
          )}

          {/* Seed Demo Data Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadDemo}
            className="h-7 text-[11px] px-2.5 font-semibold text-gold-300 hover:text-gold-100 hover:bg-gold-950/40 border-gold-400/40"
            title="Reload realistic 380-guest Indian wedding scenario"
          >
            <RotateCcw className="h-3.5 w-3.5 text-gold-400 mr-1" />
            Reload Demo Data
          </Button>

          {/* Export JSON */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-7 text-[11px] px-2 text-slate-300 hover:text-white border-navy-700"
            title="Download complete workspace state as JSON"
          >
            <Download className="h-3.5 w-3.5 text-slate-300" />
          </Button>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 text-[11px] px-2 text-slate-300 hover:text-white border-navy-700"
            title="Restore workspace from JSON backup"
          >
            <Upload className="h-3.5 w-3.5 text-slate-300" />
          </Button>
        </div>
      </div>
    </div>
  );
}

