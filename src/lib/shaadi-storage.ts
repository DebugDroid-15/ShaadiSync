"use client";

import {
  Wedding,
  WeddingFunction,
  Guest,
  CateringPlan,
  Vendor,
  BudgetSummary,
  Expense,
  PaymentRecord,
  TaskItem,
  ParkingArea,
  ParkingAllocation,
  TransportTrip,
  AccommodationProperty,
  RoomInventory,
  RoomAllocation,
  LogisticsSummary,
  AttendanceRecord,
  EventAttendanceDashboard,
} from "@/types/models";
import {
  MOCK_WEDDINGS,
  MOCK_FUNCTIONS,
  MOCK_GUESTS,
  MOCK_CATERING_PLANS,
  MOCK_VENDORS,
  MOCK_BUDGET,
  MOCK_EXPENSES,
  MOCK_PAYMENTS,
  MOCK_TASKS,
  MOCK_PARKING_AREAS,
  MOCK_PARKING_ALLOCATIONS,
  MOCK_TRANSPORT_TRIPS,
  MOCK_ACCOMMODATION_PROPERTIES,
  MOCK_ROOM_INVENTORY,
  MOCK_ROOM_ALLOCATIONS,
  MOCK_LOGISTICS_SUMMARY,
  MOCK_ATTENDANCE_DASHBOARDS,
  MOCK_ATTENDANCE_RECORDS,
} from "@/lib/mock-data";

const STORAGE_KEYS = {
  INITIALIZED: "shaadisync_initialized",
  DATA_MODE: "shaadisync_data_mode", // "clean" | "demo" | "custom"
  WEDDINGS: "shaadisync_weddings",
  FUNCTIONS: "shaadisync_functions",
  GUESTS: "shaadisync_guests",
  CATERING: "shaadisync_catering",
  VENDORS: "shaadisync_vendors",
  BUDGET: "shaadisync_budget",
  EXPENSES: "shaadisync_expenses",
  PAYMENTS: "shaadisync_payments",
  TASKS: "shaadisync_tasks",
  PARKING_AREAS: "shaadisync_parking_areas",
  PARKING_ALLOCATIONS: "shaadisync_parking_allocations",
  TRANSPORT_TRIPS: "shaadisync_transport_trips",
  ACCOMMODATION_PROPERTIES: "shaadisync_accommodation_properties",
  ROOM_INVENTORY: "shaadisync_room_inventory",
  ROOM_ALLOCATIONS: "shaadisync_room_allocations",
  LOGISTICS_SUMMARY: "shaadisync_logistics_summary",
  ATTENDANCE_DASHBOARDS: "shaadisync_attendance_dashboards",
  ATTENDANCE_RECORDS: "shaadisync_attendance_records",
};

// Safe JSON parser with fallback
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event to sync cross-component in same window
    window.dispatchEvent(new CustomEvent("shaadisync_storage_update", { detail: { key } }));
  } catch (e) {
    console.error("Failed to write to localStorage", e);
  }
}

export const ShaadiStorage = {
  // Check active mode
  getDataMode(): "clean" | "demo" | "custom" {
    return safeGet<"clean" | "demo" | "custom">(STORAGE_KEYS.DATA_MODE, "demo");
  },

  // 1. CLEAR ALL DATA (Clean slate for custom testing)
  clearAllToCleanSlate(): void {
    if (typeof window === "undefined") return;
    safeSet(STORAGE_KEYS.DATA_MODE, "clean");
    safeSet(STORAGE_KEYS.WEDDINGS, []);
    safeSet(STORAGE_KEYS.FUNCTIONS, []);
    safeSet(STORAGE_KEYS.GUESTS, []);
    safeSet(STORAGE_KEYS.CATERING, []);
    safeSet(STORAGE_KEYS.VENDORS, []);
    safeSet(STORAGE_KEYS.BUDGET, {
      totalBudget: 0,
      totalExpenses: 0,
      totalPaid: 0,
      balanceDue: 0,
      variancePercentage: 0,
      isOverBudget: false,
      currency: "INR",
      categories: [],
    });
    safeSet(STORAGE_KEYS.EXPENSES, []);
    safeSet(STORAGE_KEYS.PAYMENTS, []);
    safeSet(STORAGE_KEYS.TASKS, []);
    safeSet(STORAGE_KEYS.PARKING_AREAS, []);
    safeSet(STORAGE_KEYS.PARKING_ALLOCATIONS, []);
    safeSet(STORAGE_KEYS.TRANSPORT_TRIPS, []);
    safeSet(STORAGE_KEYS.ACCOMMODATION_PROPERTIES, []);
    safeSet(STORAGE_KEYS.ROOM_INVENTORY, []);
    safeSet(STORAGE_KEYS.ROOM_ALLOCATIONS, []);
    safeSet(STORAGE_KEYS.LOGISTICS_SUMMARY, {
      totalGuestsRequiringStay: 0,
      totalRoomsAllocated: 0,
      totalRoomsAvailable: 0,
      totalArrivalTrips: 0,
      totalDepartureTrips: 0,
      totalVehiclesActive: 0,
      totalParkingSlotsAllocated: 0,
      totalParkingSlotsAvailable: 0,
    });
    safeSet(STORAGE_KEYS.ATTENDANCE_DASHBOARDS, {});
    safeSet(STORAGE_KEYS.ATTENDANCE_RECORDS, []);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // 2. LOAD DEMO / SEED SCENARIO
  loadDemoScenario(): void {
    if (typeof window === "undefined") return;
    safeSet(STORAGE_KEYS.DATA_MODE, "demo");
    safeSet(STORAGE_KEYS.WEDDINGS, MOCK_WEDDINGS);
    safeSet(STORAGE_KEYS.FUNCTIONS, MOCK_FUNCTIONS);
    safeSet(STORAGE_KEYS.GUESTS, MOCK_GUESTS);
    safeSet(STORAGE_KEYS.CATERING, MOCK_CATERING_PLANS);
    safeSet(STORAGE_KEYS.VENDORS, MOCK_VENDORS);
    safeSet(STORAGE_KEYS.BUDGET, MOCK_BUDGET);
    safeSet(STORAGE_KEYS.EXPENSES, MOCK_EXPENSES);
    safeSet(STORAGE_KEYS.PAYMENTS, MOCK_PAYMENTS);
    safeSet(STORAGE_KEYS.TASKS, MOCK_TASKS);
    safeSet(STORAGE_KEYS.PARKING_AREAS, MOCK_PARKING_AREAS);
    safeSet(STORAGE_KEYS.PARKING_ALLOCATIONS, MOCK_PARKING_ALLOCATIONS);
    safeSet(STORAGE_KEYS.TRANSPORT_TRIPS, MOCK_TRANSPORT_TRIPS);
    safeSet(STORAGE_KEYS.ACCOMMODATION_PROPERTIES, MOCK_ACCOMMODATION_PROPERTIES);
    safeSet(STORAGE_KEYS.ROOM_INVENTORY, MOCK_ROOM_INVENTORY);
    safeSet(STORAGE_KEYS.ROOM_ALLOCATIONS, MOCK_ROOM_ALLOCATIONS);
    safeSet(STORAGE_KEYS.LOGISTICS_SUMMARY, MOCK_LOGISTICS_SUMMARY);
    safeSet(STORAGE_KEYS.ATTENDANCE_DASHBOARDS, MOCK_ATTENDANCE_DASHBOARDS);
    safeSet(STORAGE_KEYS.ATTENDANCE_RECORDS, MOCK_ATTENDANCE_RECORDS);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Weddings
  getWeddings(): Wedding[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_WEDDINGS;
    return safeGet<Wedding[]>(STORAGE_KEYS.WEDDINGS, []);
  },
  saveWeddings(weddings: Wedding[]): void {
    safeSet(STORAGE_KEYS.WEDDINGS, weddings);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Functions / Ceremonies
  getFunctions(): WeddingFunction[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_FUNCTIONS;
    return safeGet<WeddingFunction[]>(STORAGE_KEYS.FUNCTIONS, []);
  },
  saveFunctions(fns: WeddingFunction[]): void {
    safeSet(STORAGE_KEYS.FUNCTIONS, fns);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Guests
  getGuests(): Guest[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_GUESTS;
    return safeGet<Guest[]>(STORAGE_KEYS.GUESTS, []);
  },
  saveGuests(guests: Guest[]): void {
    safeSet(STORAGE_KEYS.GUESTS, guests);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Catering
  getCateringPlans(): CateringPlan[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_CATERING_PLANS;
    return safeGet<CateringPlan[]>(STORAGE_KEYS.CATERING, []);
  },
  saveCateringPlans(plans: CateringPlan[]): void {
    safeSet(STORAGE_KEYS.CATERING, plans);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Vendors
  getVendors(): Vendor[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_VENDORS;
    return safeGet<Vendor[]>(STORAGE_KEYS.VENDORS, []);
  },
  saveVendors(vendors: Vendor[]): void {
    safeSet(STORAGE_KEYS.VENDORS, vendors);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Budget
  getBudget(): BudgetSummary {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_BUDGET;
    return safeGet<BudgetSummary>(STORAGE_KEYS.BUDGET, MOCK_BUDGET);
  },
  saveBudget(budget: BudgetSummary): void {
    safeSet(STORAGE_KEYS.BUDGET, budget);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Expenses
  getExpenses(): Expense[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_EXPENSES;
    return safeGet<Expense[]>(STORAGE_KEYS.EXPENSES, []);
  },
  saveExpenses(expenses: Expense[]): void {
    safeSet(STORAGE_KEYS.EXPENSES, expenses);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Payments
  getPayments(): PaymentRecord[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_PAYMENTS;
    return safeGet<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  },
  savePayments(payments: PaymentRecord[]): void {
    safeSet(STORAGE_KEYS.PAYMENTS, payments);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Tasks
  getTasks(): TaskItem[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_TASKS;
    return safeGet<TaskItem[]>(STORAGE_KEYS.TASKS, []);
  },
  saveTasks(tasks: TaskItem[]): void {
    safeSet(STORAGE_KEYS.TASKS, tasks);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Logistics: Parking
  getParkingAreas(): ParkingArea[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_PARKING_AREAS;
    return safeGet<ParkingArea[]>(STORAGE_KEYS.PARKING_AREAS, []);
  },
  getParkingAllocations(): ParkingAllocation[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_PARKING_ALLOCATIONS;
    return safeGet<ParkingAllocation[]>(STORAGE_KEYS.PARKING_ALLOCATIONS, []);
  },
  saveParkingAllocations(allocations: ParkingAllocation[]): void {
    safeSet(STORAGE_KEYS.PARKING_ALLOCATIONS, allocations);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Logistics: Transport
  getTransportTrips(): TransportTrip[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_TRANSPORT_TRIPS;
    return safeGet<TransportTrip[]>(STORAGE_KEYS.TRANSPORT_TRIPS, []);
  },
  saveTransportTrips(trips: TransportTrip[]): void {
    safeSet(STORAGE_KEYS.TRANSPORT_TRIPS, trips);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Logistics: Accommodations & Rooms
  getAccommodationProperties(): AccommodationProperty[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_ACCOMMODATION_PROPERTIES;
    return safeGet<AccommodationProperty[]>(STORAGE_KEYS.ACCOMMODATION_PROPERTIES, []);
  },
  getRoomInventory(): RoomInventory[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_ROOM_INVENTORY;
    return safeGet<RoomInventory[]>(STORAGE_KEYS.ROOM_INVENTORY, []);
  },
  getRoomAllocations(): RoomAllocation[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_ROOM_ALLOCATIONS;
    return safeGet<RoomAllocation[]>(STORAGE_KEYS.ROOM_ALLOCATIONS, []);
  },
  saveRoomAllocations(allocations: RoomAllocation[]): void {
    safeSet(STORAGE_KEYS.ROOM_ALLOCATIONS, allocations);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Logistics Summary
  getLogisticsSummary(): LogisticsSummary {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_LOGISTICS_SUMMARY;
    return safeGet<LogisticsSummary>(STORAGE_KEYS.LOGISTICS_SUMMARY, MOCK_LOGISTICS_SUMMARY);
  },

  // Attendance & Check-In
  getAttendanceDashboards(): Record<string, EventAttendanceDashboard> {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_ATTENDANCE_DASHBOARDS;
    return safeGet<Record<string, EventAttendanceDashboard>>(STORAGE_KEYS.ATTENDANCE_DASHBOARDS, {});
  },
  saveAttendanceDashboards(dashboards: Record<string, EventAttendanceDashboard>): void {
    safeSet(STORAGE_KEYS.ATTENDANCE_DASHBOARDS, dashboards);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },
  getAttendanceRecords(): AttendanceRecord[] {
    const isInit = safeGet<string | null>(STORAGE_KEYS.INITIALIZED, null);
    if (!isInit) return MOCK_ATTENDANCE_RECORDS;
    return safeGet<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_RECORDS, []);
  },
  saveAttendanceRecords(records: AttendanceRecord[]): void {
    safeSet(STORAGE_KEYS.ATTENDANCE_RECORDS, records);
    safeSet(STORAGE_KEYS.INITIALIZED, "true");
  },

  // Export & Import full workspace JSON
  exportWorkspaceJson(): string {
    const dump = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      weddings: this.getWeddings(),
      functions: this.getFunctions(),
      guests: this.getGuests(),
      catering: this.getCateringPlans(),
      vendors: this.getVendors(),
      budget: this.getBudget(),
      expenses: this.getExpenses(),
      payments: this.getPayments(),
      tasks: this.getTasks(),
      parkingAllocations: this.getParkingAllocations(),
      transportTrips: this.getTransportTrips(),
      roomAllocations: this.getRoomAllocations(),
      attendanceDashboards: this.getAttendanceDashboards(),
      attendanceRecords: this.getAttendanceRecords(),
    };
    return JSON.stringify(dump, null, 2);
  },

  importWorkspaceJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.weddings) this.saveWeddings(parsed.weddings);
      if (parsed.functions) this.saveFunctions(parsed.functions);
      if (parsed.guests) this.saveGuests(parsed.guests);
      if (parsed.catering) this.saveCateringPlans(parsed.catering);
      if (parsed.vendors) this.saveVendors(parsed.vendors);
      if (parsed.budget) this.saveBudget(parsed.budget);
      if (parsed.expenses) this.saveExpenses(parsed.expenses);
      if (parsed.payments) this.savePayments(parsed.payments);
      if (parsed.tasks) this.saveTasks(parsed.tasks);
      if (parsed.parkingAllocations) this.saveParkingAllocations(parsed.parkingAllocations);
      if (parsed.transportTrips) this.saveTransportTrips(parsed.transportTrips);
      if (parsed.roomAllocations) this.saveRoomAllocations(parsed.roomAllocations);
      if (parsed.attendanceDashboards) this.saveAttendanceDashboards(parsed.attendanceDashboards);
      if (parsed.attendanceRecords) this.saveAttendanceRecords(parsed.attendanceRecords);
      safeSet(STORAGE_KEYS.DATA_MODE, "custom");
      return true;
    } catch (e) {
      console.error("Invalid JSON import", e);
      return false;
    }
  },
};
