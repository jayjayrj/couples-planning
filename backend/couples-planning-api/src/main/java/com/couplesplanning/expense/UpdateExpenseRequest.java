package com.couplesplanning.expense;

import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateExpenseRequest(
        String description,
        @DecimalMin(value = "0.01")
        BigDecimal amount,
        RecurrenceType recurrenceType,
        LocalDate startDate,
        LocalDate endDate,
        Integer dayOfMonth,
        ExpenseStatus status
) {
}