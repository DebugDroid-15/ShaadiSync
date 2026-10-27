"use client";

import * as React from "react";
import { CalendarHeart, Plus, MapPin, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_WEDDINGS } from "@/lib/mock-data";
import { Wedding } from "@/types/models";
import { formatDate } from "@/lib/utils";
import { ShaadiStorage } from "@/lib/shaadi-storage";

export default function WeddingsManagementPage() {
  const [weddings, setWeddings] = React.useState<Wedding[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    setWeddings(ShaadiStorage.getWeddings());
  }, []);

  const handleCreateWedding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newWedding: Wedding = {
      id: "wed-" + Date.now(),
      organisationId: "org-royal-01",
      title: formData.get("title") as string,
      slug: (formData.get("title") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      coupleBrideName: formData.get("coupleBrideName") as string,
      coupleGroomName: formData.get("coupleGroomName") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      primaryCity: formData.get("primaryCity") as string,
      status: "planning",
      totalBudget: Number(formData.get("totalBudget")) || 3000000,
      totalExpenses: 0,
      totalGuests: 0,
      totalFunctions: 0,
    };
    const updated = [...weddings, newWedding];
    setWeddings(updated);
    ShaadiStorage.saveWeddings(updated);
    setIsModalOpen(false);
  };

  const handleDeleteWedding = (id: string) => {
    if (!confirm("Are you sure you want to remove this wedding project?")) return;
    const updated = weddings.filter((w) => w.id !== id);
    setWeddings(updated);
    ShaadiStorage.saveWeddings(updated);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Multi-Wedding Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage multiple client weddings within your organisation with complete data isolation.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 shadow-subtle"
        >
          <Plus className="h-4 w-4" />
          Create New Wedding
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weddings.map((wedding) => (
          <Card key={wedding.id} className="border-slate-200/90 shadow-card hover:border-gold-400 transition-all">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="gold" className="uppercase text-[10px]">
                  {wedding.status}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {wedding.totalFunctions} Ceremonies
                  </span>
                  <button
                    onClick={() => handleDeleteWedding(wedding.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete wedding project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <CardTitle className="text-xl text-navy-900">{wedding.title}</CardTitle>
              <div className="space-y-1 pt-2 text-xs text-slate-600">
                <p className="flex items-center gap-1.5 font-medium text-navy-800">
                  <MapPin className="h-3.5 w-3.5 text-gold-600" />
                  {wedding.primaryCity}
                </p>
                <p className="text-slate-500">
                  {formatDate(wedding.startDate)} – {formatDate(wedding.endDate)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Couple: <strong className="text-navy-900">{wedding.coupleBrideName}</strong> & <strong className="text-navy-900">{wedding.coupleGroomName}</strong>
              </div>
              <Button variant="secondary" size="sm">
                Open Workspace
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Wedding Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Wedding Project"
        description="Initialize a separate multi-day wedding workspace with independent guest lists, budget, and vendors."
      >
        <form onSubmit={handleCreateWedding} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="title">Wedding Project Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Rohan & Ananya's Royal Wedding" className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="coupleBrideName">Bride Name</Label>
              <Input id="coupleBrideName" name="coupleBrideName" required placeholder="Ananya Verma" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="coupleGroomName">Groom Name</Label>
              <Input id="coupleGroomName" name="coupleGroomName" required placeholder="Rohan Singhania" className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" required className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="primaryCity">City / Destination</Label>
              <Input id="primaryCity" name="primaryCity" required placeholder="Jaipur, Rajasthan" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="totalBudget">Planned Budget (₹ INR)</Label>
              <Input id="totalBudget" name="totalBudget" type="number" defaultValue="3500000" className="mt-1" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="font-semibold">
              Save Wedding Project
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
