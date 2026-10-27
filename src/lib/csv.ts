import { csvGuestRowSchema, type CsvGuestRow, type CsvImportResult } from "./validations/events-guests";

/**
 * Robust CSV parser that handles quoted cells, commas inside quotes, CRLF/LF line breaks.
 */
export function parseCsvText(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++; // skip LF
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Validates and transforms parsed CSV rows into structured Guest records.
 * Reports row-level error numbers and descriptive error messages.
 */
export function validateGuestCsv(csvText: string): CsvImportResult {
  const rawRows = parseCsvText(csvText);

  if (rawRows.length === 0) {
    return {
      success: false,
      totalRows: 0,
      importedCount: 0,
      errorCount: 1,
      errors: [{ rowNumber: 0, rawRow: {}, errors: ["CSV file is completely empty."] }],
      validRows: [],
    };
  }

  // Header parsing & normalization
  const rawHeader = rawRows[0];
  const headerMap: Record<string, number> = {};

  rawHeader.forEach((h, index) => {
    const normalized = h.toLowerCase().replace(/[^a-z0-9]/g, "");
    headerMap[normalized] = index;
  });

  const getColVal = (row: string[], ...aliases: string[]): string => {
    for (const alias of aliases) {
      const idx = headerMap[alias.toLowerCase().replace(/[^a-z0-9]/g, "")];
      if (idx !== undefined && row[idx] !== undefined) {
        return row[idx].trim();
      }
    }
    return "";
  };

  const validRows: CsvGuestRow[] = [];
  const errors: CsvImportResult["errors"] = [];

  // Iterate rows (1-based index for user reporting)
  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    const rowNumber = i + 1;

    const rowObj: Record<string, string> = {
      firstName: getColVal(row, "first_name", "firstname", "first name", "name"),
      lastName: getColVal(row, "last_name", "lastname", "last name", "surname"),
      phone: getColVal(row, "phone", "mobile", "contact", "phone number"),
      email: getColVal(row, "email", "email address"),
      side: getColVal(row, "side", "guest_side"),
      category: getColVal(row, "category", "guest_category", "relation"),
      ageGroup: getColVal(row, "age_group", "age", "adult_child"),
      dietaryPref: getColVal(row, "dietary_pref", "diet", "dietary preference", "food"),
      allergies: getColVal(row, "allergies", "allergies_notes"),
      isVip: getColVal(row, "is_vip", "vip"),
      familyName: getColVal(row, "family_name", "household", "family"),
    };

    // If firstName is compound (e.g. "Rajesh Sharma") and lastName is blank, split cleanly
    if (rowObj.firstName && !rowObj.lastName && rowObj.firstName.includes(" ")) {
      const parts = rowObj.firstName.split(" ");
      rowObj.firstName = parts[0];
      rowObj.lastName = parts.slice(1).join(" ");
    }

    const validation = csvGuestRowSchema.safeParse(rowObj);

    if (validation.success) {
      validRows.push(validation.data);
    } else {
      errors.push({
        rowNumber,
        rawRow: rowObj,
        errors: validation.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
    }
  }

  return {
    success: errors.length === 0,
    totalRows: rawRows.length - 1,
    importedCount: validRows.length,
    errorCount: errors.length,
    errors,
    validRows,
  };
}

/**
 * Generates properly formatted CSV string for guest export
 */
export function exportGuestsToCsv(
  guests: Array<{
    firstName: string;
    lastName: string;
    side: string;
    category: string;
    ageGroup: string;
    phone?: string | null;
    email?: string | null;
    dietaryPref?: string;
    allergiesNotes?: string | null;
    isVip: boolean;
    familyName?: string | null;
    invitedEventsCount?: number;
  }>
): string {
  const headers = [
    "First Name",
    "Last Name",
    "Side",
    "Category",
    "Age Group",
    "Phone",
    "Email",
    "Dietary Preference",
    "Allergies",
    "VIP",
    "Household / Family",
    "Invited Ceremonies",
  ];

  const escapeCell = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    let str = String(val);
    // Protect against spreadsheet formula injection (=, +, -, @, \t, \r)
    if (/^[=+\-@\t\r]/.test(str)) {
      str = `'${str}`;
    }
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = guests.map((g) => [
    escapeCell(g.firstName),
    escapeCell(g.lastName),
    escapeCell(g.side),
    escapeCell(g.category),
    escapeCell(g.ageGroup),
    escapeCell(g.phone || ""),
    escapeCell(g.email || ""),
    escapeCell(g.dietaryPref || "veg"),
    escapeCell(g.allergiesNotes || ""),
    escapeCell(g.isVip ? "Yes" : "No"),
    escapeCell(g.familyName || ""),
    escapeCell(g.invitedEventsCount !== undefined ? g.invitedEventsCount : ""),
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
}
