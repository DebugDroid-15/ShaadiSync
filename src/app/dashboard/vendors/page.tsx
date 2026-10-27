"use client";

import * as React from "react";
import {
  Briefcase,
  Plus,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatINR } from "@/lib/utils";
import { MOCK_VENDORS } from "@/lib/mock-data";
import { Vendor, VendorCategory, VendorBookingStatus } from "@/types/models";
import { createVendorAction } from "@/lib/actions/vendors";
import { ShaadiStorage } from "@/lib/shaadi-storage";

const CATEGORY_LABELS: Record<VendorCategory, string> = {
  caterer: "Catering & Banquets",
  decorator: "Decor & Floral",
  photographer: "Photography & Cinema",
  videographer: "Videography & Drone",
  makeup: "Makeup & Mehndi",
  dj: "Sound & DJ Rig",
  priest: "Pandit / Officiant",
  florist: "Florist",
  transport: "Logistics & Fleet",
  venue: "Venue & Lawns",
  other: "Other Services",
};

export default function VendorsPage() {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setVendors(ShaadiStorage.getVendors());
  }, []);

  // Financial aggregates
  const totalContracted = vendors.reduce((acc, v) => acc + (v.agreedPrice || v.quotedPrice), 0);
  const totalAdvancePaid = vendors.reduce((acc, v) => acc + v.advancePaid, 0);
  const totalBalanceDue = vendors.reduce((acc, v) => acc + v.balanceDue, 0);

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "all" || v.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || v.bookingStatus === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateVendor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append("weddingId", "wed-aarav-diya");

    try {
      const res = await createVendorAction(formData);
      if (!res.success) {
        setFormError(res.error || "Failed to create vendor.");
      } else if (res.data) {
        const updated = [...vendors, res.data as Vendor];
        setVendors(updated);
        ShaadiStorage.saveVendors(updated);
        setIsModalOpen(false);
      }
    } catch {
      setFormError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: VendorBookingStatus) => {
    switch (status) {
      case "booked":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Booked</Badge>;
      case "quoted":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Quoted</Badge>;
      case "inquiry":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Inquiry</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Cancelled</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Vendor Directory & Contracts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Contract tracking, booking statuses, advance token payments, and ceremony schedules.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-burgundy-600 hover:bg-burgundy-700">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Total Contracted
              <Briefcase className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">{formatINR(totalContracted)}</div>
            <p className="text-xs text-slate-500 mt-1">Sum of agreed vendor prices</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
              Advance Paid
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{formatINR(totalAdvancePaid)}</div>
            <p className="text-xs text-slate-500 mt-1">
              {totalContracted > 0 ? Math.round((totalAdvancePaid / totalContracted) * 100) : 0}% of contracted sum paid
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center justify-between">
              Outstanding Balance
              <Clock className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{formatINR(totalBalanceDue)}</div>
            <p className="text-xs text-slate-500 mt-1">Remaining balance due across vendors</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search vendor name, contact person, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by Category"
                className="h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="all">All Categories</option>
                <option value="caterer">Caterer</option>
                <option value="decorator">Decorator</option>
                <option value="photographer">Photographer</option>
                <option value="videographer">Videographer</option>
                <option value="dj">DJ & Sound</option>
                <option value="makeup">Makeup</option>
                <option value="priest">Pandit</option>
                <option value="florist">Florist</option>
                <option value="transport">Transport</option>
                <option value="venue">Venue</option>
                <option value="other">Other</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                aria-label="Filter by Booking Status"
                className="h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="all">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="quoted">Quoted</option>
                <option value="inquiry">Inquiry</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base font-semibold text-navy-900">
            Registered Vendors ({filteredVendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[220px]">Vendor & Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Agreed / Quoted</TableHead>
                <TableHead className="text-right">Advance Paid</TableHead>
                <TableHead className="text-right">Balance Due</TableHead>
                <TableHead>Assigned Ceremonies</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    No vendors found matching your filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="font-semibold text-navy-900">{vendor.businessName}</div>
                      <div className="text-xs text-slate-500">{CATEGORY_LABELS[vendor.category] || vendor.category}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-slate-800">{vendor.contactName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        {vendor.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {vendor.phone}
                          </span>
                        )}
                        {vendor.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {vendor.email}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.bookingStatus)}</TableCell>
                    <TableCell className="text-right font-medium text-slate-800">
                      {vendor.agreedPrice > 0 ? (
                        <span>{formatINR(vendor.agreedPrice)}</span>
                      ) : (
                        <span className="text-slate-400 italic">Quoted: {formatINR(vendor.quotedPrice)}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-700">
                      {formatINR(vendor.advancePaid)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-amber-700">
                      {formatINR(vendor.balanceDue)}
                    </TableCell>
                    <TableCell>
                      {vendor.assignedEvents && vendor.assignedEvents.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {vendor.assignedEvents.map((evt) => (
                            <Badge key={evt.eventId} variant="outline" className="text-xs bg-slate-50">
                              {evt.eventName}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not assigned</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-navy-900">Add New Vendor</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {formError && (
                <div className="p-3 mb-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateVendor} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input id="businessName" name="businessName" required placeholder="e.g. Royal Caterers" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                      <option value="caterer">Caterer</option>
                      <option value="decorator">Decorator</option>
                      <option value="photographer">Photographer</option>
                      <option value="videographer">Videographer</option>
                      <option value="makeup">Makeup Artist</option>
                      <option value="dj">DJ & Sound</option>
                      <option value="priest">Pandit</option>
                      <option value="florist">Florist</option>
                      <option value="transport">Transport</option>
                      <option value="venue">Venue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <Input id="contactName" name="contactName" required placeholder="e.g. Raj Sharma" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="vendor@example.com" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bookingStatus">Booking Status</Label>
                    <select
                      id="bookingStatus"
                      name="bookingStatus"
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                      <option value="inquiry">Inquiry</option>
                      <option value="quoted">Quoted</option>
                      <option value="booked">Booked</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="quotedPrice">Quoted Price (₹)</Label>
                    <Input id="quotedPrice" name="quotedPrice" type="number" min="0" defaultValue="0" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="agreedPrice">Agreed Price (₹)</Label>
                    <Input id="agreedPrice" name="agreedPrice" type="number" min="0" defaultValue="0" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="advancePaid">Advance Paid (₹)</Label>
                    <Input id="advancePaid" name="advancePaid" type="number" min="0" defaultValue="0" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes">Notes / Special Instructions</Label>
                  <Input id="notes" name="notes" placeholder="Special requirements, team size, equipment notes..." />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-burgundy-600 hover:bg-burgundy-700">
                    {isSubmitting ? "Saving..." : "Save Vendor"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
