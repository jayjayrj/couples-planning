import { apiFetch } from "./api";

export type ImportedTransaction = {
  transactionDate: string;
  description: string;
  amount: number;
  type: string;
  categorySuggestion?: string | null;
  possibleDuplicate: boolean;
  confidence: number;
  rawLine: string;
};

export type ImportPreviewResponse = {
  importId: string;
  documentType: string;
  fileName: string;
  totalItems: number;
  warnings: string[];
  items: ImportedTransaction[];
};

export type ConfirmImportResponse = {
  importedCount: number;
  skippedDuplicates: number;
  skippedInvalidItems?: number;
};

export async function confirmPdfImport(payload: {
  importId: string;
  targetAccountId: number;
  targetHouseholdId: number;
  selectedItems: ImportedTransaction[];
}): Promise<ConfirmImportResponse> {
  return apiFetch("/api/imports/pdf/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}