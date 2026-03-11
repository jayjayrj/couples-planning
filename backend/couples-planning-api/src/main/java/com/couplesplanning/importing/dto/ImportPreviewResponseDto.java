package com.couplesplanning.importing.dto;

import java.util.ArrayList;
import java.util.List;

public class ImportPreviewResponseDto {

    private String importId;
    private String documentType;
    private String fileName;
    private Integer totalItems;
    private List<String> warnings = new ArrayList<>();
    private List<ImportedTransactionDto> items = new ArrayList<>();

    public ImportPreviewResponseDto() {
    }

    public String getImportId() {
        return importId;
    }

    public void setImportId(String importId) {
        this.importId = importId;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    public List<ImportedTransactionDto> getItems() {
        return items;
    }

    public void setItems(List<ImportedTransactionDto> items) {
        this.items = items;
    }
}