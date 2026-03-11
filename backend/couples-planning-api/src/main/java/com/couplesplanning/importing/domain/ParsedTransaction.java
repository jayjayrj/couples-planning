package com.couplesplanning.importing.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ParsedTransaction {

    private LocalDate transactionDate;
    private String description;
    private BigDecimal amount;
    private String type; // EXPENSE, INCOME, TRANSFER, UNKNOWN
    private String categorySuggestion;
    private boolean possibleDuplicate;
    private Double confidence;
    private String rawLine;

    public ParsedTransaction() {
    }

    public ParsedTransaction(
            LocalDate transactionDate,
            String description,
            BigDecimal amount,
            String type,
            String categorySuggestion,
            boolean possibleDuplicate,
            Double confidence,
            String rawLine
    ) {
        this.transactionDate = transactionDate;
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.categorySuggestion = categorySuggestion;
        this.possibleDuplicate = possibleDuplicate;
        this.confidence = confidence;
        this.rawLine = rawLine;
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


    public String getCategorySuggestion() {
        return categorySuggestion;
    }

    public void setCategorySuggestion(String categorySuggestion) {
        this.categorySuggestion = categorySuggestion;
    }

    public boolean isPossibleDuplicate() {
        return possibleDuplicate;
    }

    public void setPossibleDuplicate(boolean possibleDuplicate) {
        this.possibleDuplicate = possibleDuplicate;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getRawLine() {
        return rawLine;
    }

    public void setRawLine(String rawLine) {
        this.rawLine = rawLine;
    }
}