package com.couplesplanning.importing.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ConfirmImportedItemDto {

    @NotNull
    private LocalDate transactionDate;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal amount;

    @NotBlank
    private String type;

    private Long categoryId;
    private String categoryName;
    private Boolean ignoreDuplicateWarning;

    public ConfirmImportedItemDto() {
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Boolean getIgnoreDuplicateWarning() {
        return ignoreDuplicateWarning;
    }

    public void setIgnoreDuplicateWarning(Boolean ignoreDuplicateWarning) {
        this.ignoreDuplicateWarning = ignoreDuplicateWarning;
    }
}