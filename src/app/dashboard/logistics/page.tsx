"use client";

import * as React from "react";
import {
  Car,
  Bus,
  Hotel,
  ShieldAlert,
  Plus,
  Download,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Key,
  Calendar,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MOCK_PARKING_AREAS,
  MOCK_PARKING_ALLOCATIONS,
  MOCK_TRANSPORT_TRIPS,
  MOCK_ACCOMMODATION_PROPERTIES,
  MOCK_ROOM_INVENTORY,
  MOCK_ROOM_ALLOCATIONS,
  MOCK_LOGISTICS_SUMMARY,
} from "@/lib/mock-data";
import {
  ParkingArea,
  ParkingAllocation,
  TransportTrip,
  AccommodationProperty,
  RoomInventory,
  RoomAllocation,
  LogisticsSummary,
} from "@/types/models";
import {
  createParkingAllocationAction,
  createTransportTripAction,
  createRoomAllocationAction,
} from "@/lib/actions/logistics";
import { ShaadiStorage } from "@/lib/shaadi-storage";

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = React.useState<"parking" | "transport" | "accommodation">("parking");
  const [summary, setSummary] = React.useState<LogisticsSummary>({
    parking: { totalCapacity: 0, allocatedSpaces: 0, remainingCapacity: 0, utilisationPercentage: 0 },
    transport: { activeTrips: 0, totalSeatCapacity: 0, assignedPassengers: 0, availableSeats: 0 },
    accommodation: {
      totalRooms: 0,
      occupiedRooms: 0,
      vacantRooms: 0,
      occupancyRate: 0,
      upcomingArrivals: 0,
      upcomingDepartures: 0,
    },
  });
  const [parkingAreas, setParkingAreas] = React.useState<ParkingArea[]>([]);
  const [parkingAllocs, setParkingAllocs] = React.useState<ParkingAllocation[]>([]);
  const [trips, setTrips] = React.useState<TransportTrip[]>([]);
  const [rooms, setRooms] = React.useState<RoomInventory[]>([]);
  const [roomAllocs, setRoomAllocs] = React.useState<RoomAllocation[]>([]);

  React.useEffect(() => {
    const s = ShaadiStorage.getLogisticsSummary();
    if (s && s.parking && s.transport && s.accommodation) {
      setSummary(s);
    }
    setParkingAreas(ShaadiStorage.getParkingAreas() || []);
    setParkingAllocs(ShaadiStorage.getParkingAllocations() || []);
    setTrips(ShaadiStorage.getTransportTrips() || []);
    setRooms(ShaadiStorage.getRoomInventory() || []);
    setRoomAllocs(ShaadiStorage.getRoomAllocations() || []);
  }, []);

  // Modals state
  const [isParkingModalOpen, setIsParkingModalOpen] = React.useState(false);
  const [isTripModalOpen, setIsTripModalOpen] = React.useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // CSV Export
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = "";

    if (activeTab === "parking") {
      filename = `ShaadiSync_Parking_Allocations_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Parking Area", "Guest / Household", "Vehicle Type", "Reg Number", "Slot", "Driver Phone", "Status"];
      rows = parkingAllocs.map((p) => [
        `"${p.parkingAreaName || ""}"`,
        `"${p.guestName || p.householdName || "General"}"`,
        p.vehicleType,
        `"${p.vehicleRegistration || ""}"`,
        `"${p.slotNumber || ""}"`,
        `"${p.driverPhone || ""}"`,
        p.status,
      ]);
    } else if (activeTab === "transport") {
      filename = `ShaadiSync_Transport_Manifest_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Trip Title", "Origin", "Destination", "Pickup Time", "Capacity", "Assigned Passengers", "Status"];
      rows = trips.map((t) => [
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.origin}"`,
        `"${t.destination}"`,
        `"${t.scheduledPickupTime}"`,
        String(t.totalCapacity || 0),
        String(t.passengerCount || 0),
        t.status,
      ]);
    } else {
      filename = `ShaadiSync_Room_Allocations_${new Date().toISOString().split("T")[0]}.csv`;
      headers = ["Property", "Room Number", "Guest / Family", "Occupancy", "Check-in", "Check-out", "Status"];
      rows = roomAllocs.map((r) => [
        `"${r.propertyName || ""}"`,
        r.roomNumber || "",
        `"${r.guestName || r.householdName || ""}"`,
        String(r.occupancyCount),
        r.checkInDate,
        r.checkOutDate,
        r.status,
      ]);
    }

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Parking Allocation
  const handleCreateParkingAlloc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("weddingId", "wed-aarav-diya");

    try {
      const res = await createParkingAllocationAction(formData);
      if (!res.success) {
        setFormError(res.error || "Failed to assign parking.");
      } else if (res.data) {
        const updated = [res.data as ParkingAllocation, ...parkingAllocs];
        setParkingAllocs(updated);
        ShaadiStorage.saveParkingAllocations(updated);
        setIsParkingModalOpen(false);
      }
    } catch {
      setFormError("Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create Transport Trip
  const handleCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("weddingId", "wed-aarav-diya");
    formData.append("vehicleId", "tv-01"); // default mock fleet

    try {
      const res = await createTransportTripAction(formData);
      if (!res.success) {
        setFormError(res.error || "Failed to schedule shuttle route.");
      } else if (res.data) {
        const updated = [res.data as TransportTrip, ...trips];
        setTrips(updated);
        ShaadiStorage.saveTransportTrips(updated);
        setIsTripModalOpen(false);
      }
    } catch {
      setFormError("Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create Room Allocation
  const handleCreateRoomAlloc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("weddingId", "wed-aarav-diya");

    try {
      const res = await createRoomAllocationAction(formData);
      if (!res.success) {
        setFormError(res.error || "Failed to allocate room.");
      } else if (res.data) {
        const updated = [res.data as RoomAllocation, ...roomAllocs];
        setRoomAllocs(updated);
        ShaadiStorage.saveRoomAllocations(updated);
        setIsRoomModalOpen(false);
      }
    } catch {
      setFormError("Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
            Logistics, Parking, Transport & Rooms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capacity management for venue parking, airport transfer shuttles, and guest hotel room inventory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 border-slate-200"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Export CSV
          </Button>

          {activeTab === "parking" && (
            <Button
              size="sm"
              onClick={() => setIsParkingModalOpen(true)}
              className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Allocate Parking
            </Button>
          )}

          {activeTab === "transport" && (
            <Button
              size="sm"
              onClick={() => setIsTripModalOpen(true)}
              className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Schedule Shuttle Route
            </Button>
          )}

          {activeTab === "accommodation" && (
            <Button
              size="sm"
              onClick={() => setIsRoomModalOpen(true)}
              className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Assign Room
            </Button>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Parking Utilisation
              <Car className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">
              {summary?.parking?.allocatedSpaces || 0} / {summary?.parking?.totalCapacity || 0} Slots
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.parking?.remainingCapacity || 0} spaces remaining ({summary?.parking?.utilisationPercentage || 0}% allocated)
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Transport Fleet & Shuttles
              <Bus className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">
              {summary?.transport?.assignedPassengers || 0} / {summary?.transport?.totalSeatCapacity || 0} Seats
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.transport?.availableSeats || 0} available across {summary?.transport?.activeTrips || 0} active routes
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Hotel Room Occupancy
              <Hotel className="h-4 w-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy-900">
              {summary?.accommodation?.occupiedRooms || 0} / {summary?.accommodation?.totalRooms || 0} Rooms
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {summary?.accommodation?.vacantRooms || 0} vacant ({summary?.accommodation?.occupancyRate || 0}% occupancy rate)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("parking")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "parking"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Parking Areas & Slots ({parkingAllocs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("transport")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "transport"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Shuttle Routes & Pickups ({trips.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("accommodation")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "accommodation"
              ? "border-burgundy-600 text-burgundy-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Room Inventory & Assignments ({roomAllocs.length})
        </button>
      </div>

      {/* TAB 1: Parking */}
      {activeTab === "parking" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parkingAreas.map((area) => (
              <Card key={area.id} className="border-slate-200 bg-white">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-navy-900">{area.name}</CardTitle>
                    <Badge variant="outline" className="text-xs font-mono">
                      {area.allocatedCount || 0} / {area.totalCapacity} Slots
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-slate-600 space-y-1">
                  <p>{area.locationDescription}</p>
                  <div className="flex gap-2 pt-1">
                    {area.isValetAvailable && <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">Valet Parking</Badge>}
                    {area.isAccessible && <Badge className="bg-blue-50 text-blue-800 border-blue-200 text-[10px]">Wheelchair Accessible</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-slate-200 bg-white">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-base font-semibold text-navy-900">
                Allocated Vehicle Slots
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Facility</TableHead>
                    <TableHead>Slot #</TableHead>
                    <TableHead>Guest / Household</TableHead>
                    <TableHead>Vehicle & Reg #</TableHead>
                    <TableHead>Driver Contact</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parkingAllocs.map((alloc) => (
                    <TableRow key={alloc.id} className="hover:bg-slate-50">
                      <TableCell className="font-semibold text-navy-900">{alloc.parkingAreaName || "Main Parking"}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-burgundy-700">{alloc.slotNumber || "Open Slot"}</TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-800">{alloc.guestName || "General Guest"}</div>
                        {alloc.householdName && <div className="text-xs text-slate-400">{alloc.householdName}</div>}
                      </TableCell>
                      <TableCell>
                        <div className="capitalize text-slate-700">{alloc.vehicleType}</div>
                        <div className="font-mono text-xs text-slate-400">{alloc.vehicleRegistration || "Registration TBD"}</div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">
                        {alloc.driverName} {alloc.driverPhone && `(${alloc.driverPhone})`}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 capitalize">
                          {alloc.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Transport */}
      {activeTab === "transport" && (
        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-navy-900">
              Airport & Station Transfer Manifests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Route Title</TableHead>
                  <TableHead>Origin & Destination</TableHead>
                  <TableHead>Pickup Time</TableHead>
                  <TableHead>Vehicle & Capacity</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="font-semibold text-navy-900">{trip.title}</div>
                      {trip.pickupPoint && <div className="text-xs text-slate-500">Pickup: {trip.pickupPoint}</div>}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700">
                      <div><span className="font-semibold text-slate-900">From:</span> {trip.origin}</div>
                      <div><span className="font-semibold text-slate-900">To:</span> {trip.destination}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-700">
                      {new Date(trip.scheduledPickupTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-slate-800 capitalize">{trip.vehicleType?.replace("_", " ") || "Tempo"}</div>
                      <div className="text-[11px] text-slate-400">{trip.vehicleProviderName}</div>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-navy-900">{trip.passengerCount || 0}</span> / {trip.totalCapacity || 15}
                      <span className="text-xs text-slate-400 block">({trip.availableSeats || 0} open)</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {trip.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Accommodation */}
      {activeTab === "accommodation" && (
        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-base font-semibold text-navy-900">
              Hotel Room Allocations & Check-in Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Room # & Type</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Guest / Household</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead>Check-in / Check-out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomAllocs.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="font-bold font-mono text-navy-900">Room {r.roomNumber}</div>
                      <div className="text-xs text-slate-500 capitalize">Deluxe Suite</div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-800">{r.propertyName}</TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-900">{r.guestName || "Family Group"}</div>
                      {r.householdName && <div className="text-xs text-slate-400">{r.householdName}</div>}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{r.occupancyCount} Persons</TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {r.checkInDate} to {r.checkOutDate}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 capitalize">
                        {r.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* MODAL 1: Allocate Parking */}
      {isParkingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-navy-900">Allocate Parking Slot</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {formError && (
                <div className="p-3 mb-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateParkingAlloc} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="parkingAreaId">Parking Area *</Label>
                  <select
                    id="parkingAreaId"
                    name="parkingAreaId"
                    required
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  >
                    {parkingAreas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.remainingCapacity || 0} slots open)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="tempo_traveller">Tempo Traveller</option>
                      <option value="mini_bus">Mini Bus</option>
                      <option value="two_wheeler">Two Wheeler</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="vehicleRegistration">Registration Number</Label>
                    <Input id="vehicleRegistration" name="vehicleRegistration" placeholder="e.g. RJ-14-CB-1122" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="driverName">Driver / Guest Name</Label>
                    <Input id="driverName" name="driverName" placeholder="Driver name" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="driverPhone">Driver Phone</Label>
                    <Input id="driverPhone" name="driverPhone" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="slotNumber">Slot Number</Label>
                    <Input id="slotNumber" name="slotNumber" placeholder="e.g. P-12" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="status">Allocation Status</Label>
                    <select
                      id="status"
                      name="status"
                      className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                    >
                      <option value="allocated">Allocated</option>
                      <option value="reserved">Reserved</option>
                      <option value="arrived">Arrived</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsParkingModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                    {isSubmitting ? "Allocating..." : "Allocate Slot"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL 2: Schedule Shuttle */}
      {isTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-navy-900">Schedule Shuttle Trip</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {formError && (
                <div className="p-3 mb-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Trip / Route Title *</Label>
                  <Input id="title" name="title" required placeholder="e.g. Airport Arrival Shuttle - Group A" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="origin">Origin *</Label>
                    <Input id="origin" name="origin" required placeholder="e.g. Udaipur Airport" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input id="destination" name="destination" required placeholder="e.g. Lake Palace Resort" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="pickupPoint">Pickup Meeting Point</Label>
                    <Input id="pickupPoint" name="pickupPoint" placeholder="e.g. Gate 2 Column B" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="scheduledPickupTime">Pickup Date & Time *</Label>
                    <Input id="scheduledPickupTime" name="scheduledPickupTime" type="datetime-local" required />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsTripModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                    {isSubmitting ? "Scheduling..." : "Schedule Shuttle"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL 3: Assign Room */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-navy-900">Assign Hotel Room</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {formError && (
                <div className="p-3 mb-4 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateRoomAlloc} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="roomId">Select Room *</Label>
                  <select
                    id="roomId"
                    name="roomId"
                    required
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} ({r.propertyName}) - Max {r.maxOccupancy} Persons ({r.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="occupancyCount">Occupancy Count (Persons) *</Label>
                  <Input id="occupancyCount" name="occupancyCount" type="number" min="1" max="10" defaultValue="2" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="checkInDate">Check-in Date *</Label>
                    <Input id="checkInDate" name="checkInDate" type="date" required defaultValue="2026-11-20" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="checkOutDate">Check-out Date *</Label>
                    <Input id="checkOutDate" name="checkOutDate" type="date" required defaultValue="2026-11-23" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes">Notes & Family Allocation Requirements</Label>
                  <Input id="notes" name="notes" placeholder="Extra rollaway bed, crib, early arrival..." />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setIsRoomModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                    {isSubmitting ? "Assigning..." : "Assign Room"}
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
