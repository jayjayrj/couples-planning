package com.couplesplanning.expense;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseResponse(
        Long id,
        String description,
        BigDecimal amount,
        RecurrenceType recurrenceType,
        LocalDate startDate,
        LocalDate endDate,
        Integer dayOfMonth,
        ExpenseStatus status
) {
}