package com.couplesplanning.importing.dto;

public class ConfirmImportResponseDto {

    private int importedCount;
    private int skippedDuplicates;

    public ConfirmImportResponseDto(int importedCount, int skippedDuplicates) {
        this.importedCount = importedCount;
        this.skippedDuplicates = skippedDuplicates;
    }

    public int getImportedCount() {
        return importedCount;
    }

    public int getSkippedDuplicates() {
        return skippedDuplicates;
    }
}
