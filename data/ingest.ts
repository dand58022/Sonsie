export type CsvImportCategory = "ingredient" | "supply" | "tool" | "unmapped"

export type CsvImportMatchStatus = "matched" | "needs_review" | "unmatched"

export interface CsvSampleFileMetadata {
  fileName: string
  source: string
  businessDate: string
  location: string
  uploadedBy: string
}

export interface CsvParsedOrderRow {
  id: string
  sourceRow: number
  itemName: string
  category: CsvImportCategory
  quantity: number
  unit: string
  source: string
  businessDate: string
  matchStatus: CsvImportMatchStatus
  confidence: number
  matchedInventoryItemId?: string
  matchedInventoryItemName?: string
  message?: string
}

export interface CsvImportSummary {
  totalRows: number
  matchedRows: number
  needsReviewRows: number
  unmatchedRows: number
  warnings: string[]
}

export const mockCsvSampleFile: CsvSampleFileMetadata = {
  fileName: "gen-cerritos-orders-2026-04-13.csv",
  source: "POS daily order export",
  businessDate: "2026-04-13",
  location: "Back Bay / Newbury Street",
  uploadedBy: "Opening manager",
}

export const mockCsvParsedRows: CsvParsedOrderRow[] = [
  {
    id: "csv-001",
    sourceRow: 2,
    itemName: "Chadol Baegi Orders",
    category: "ingredient",
    quantity: 20,
    unit: "lbs",
    source: mockCsvSampleFile.source,
    businessDate: mockCsvSampleFile.businessDate,
    matchStatus: "matched",
    confidence: 98,
    matchedInventoryItemId: "1",
    matchedInventoryItemName: "Chadol Baegi (Brisket)",
  },
  {
    id: "csv-002",
    sourceRow: 3,
    itemName: "Bulgogi Dinner Portions",
    category: "ingredient",
    quantity: 15,
    unit: "lbs",
    source: mockCsvSampleFile.source,
    businessDate: mockCsvSampleFile.businessDate,
    matchStatus: "matched",
    confidence: 96,
    matchedInventoryItemId: "2",
    matchedInventoryItemName: "Bulgogi (Marinated Beef)",
  },
  {
    id: "csv-003",
    sourceRow: 4,
    itemName: "Galbi Premium Set",
    category: "ingredient",
    quantity: 8,
    unit: "lbs",
    source: mockCsvSampleFile.source,
    businessDate: mockCsvSampleFile.businessDate,
    matchStatus: "needs_review",
    confidence: 78,
    matchedInventoryItemId: "4",
    matchedInventoryItemName: "Galbi (Short Ribs)",
    message: "Projected usage would leave this item below reorder point.",
  },
  {
    id: "csv-004",
    sourceRow: 5,
    itemName: "Green Onion Banchan Prep",
    category: "ingredient",
    quantity: 25,
    unit: "bunches",
    source: mockCsvSampleFile.source,
    businessDate: mockCsvSampleFile.businessDate,
    matchStatus: "needs_review",
    confidence: 74,
    matchedInventoryItemId: "11",
    matchedInventoryItemName: "Green Onions",
    message: "Unit conversion should be reviewed before import.",
  },
  {
    id: "csv-005",
    sourceRow: 6,
    itemName: "Perilla Leaf Add-ons",
    category: "ingredient",
    quantity: 4,
    unit: "packs",
    source: mockCsvSampleFile.source,
    businessDate: mockCsvSampleFile.businessDate,
    matchStatus: "matched",
    confidence: 91,
    matchedInventoryItemId: "14",
    matchedInventoryItemName: "Perilla Leaves",
  },
  {
    id: "csv-006",
    sourceRow: 7,
    itemName: "Disposable Chopstick Settings",
    category: "supply",
    quantity: 320,
    unit: "pairs",
    source: mockCsvSampleFile.source,
    businessDate: mockCsvSampleFile.businessDate,
    matchStatus: "matched",
    confidence: 94,
    matchedInventoryItemId: "20",
    matchedInventoryItemName: "Chopsticks (Disposable)",
  },
  {
    id: "csv-007",
    sourceRow: 8,
    itemName: "Chef's Special Combo",
    category: "unmapped",
    quantity: 11,
    unit: "orders",
    source: mockCsvSampleFile.source,
    businessDate: mockCsvSampleFile.businessDate,
    matchStatus: "unmatched",
    confidence: 36,
    message: "No clear inventory mapping exists for this POS menu item.",
  },
  {
    id: "csv-008",
    sourceRow: 9,
    itemName: "Grill Scissor Service Pull",
    category: "tool",
    quantity: 3,
    unit: "units",
    source: mockCsvSampleFile.source,
    businessDate: mockCsvSampleFile.businessDate,
    matchStatus: "needs_review",
    confidence: 69,
    matchedInventoryItemId: "26",
    matchedInventoryItemName: "BBQ Scissors",
    message: "Tool rows should create a review task, not a stock deduction.",
  },
]

export const mockCsvTemplateRows = [
  "business_date,source,item_name,category,quantity,unit",
  "2026-04-13,POS daily order export,Chadol Baegi Orders,ingredient,20,lbs",
  "2026-04-13,POS daily order export,Disposable Chopstick Settings,supply,320,pairs",
]

export function getCsvImportSummary(rows: CsvParsedOrderRow[]): CsvImportSummary {
  const matchedRows = rows.filter((row) => row.matchStatus === "matched").length
  const needsReviewRows = rows.filter((row) => row.matchStatus === "needs_review").length
  const unmatchedRows = rows.filter((row) => row.matchStatus === "unmatched").length
  const warnings = rows
    .filter((row) => row.matchStatus !== "matched" || row.message)
    .map((row) => `Row ${row.sourceRow}: ${row.message ?? "Mapping needs review."}`)

  return {
    totalRows: rows.length,
    matchedRows,
    needsReviewRows,
    unmatchedRows,
    warnings,
  }
}
