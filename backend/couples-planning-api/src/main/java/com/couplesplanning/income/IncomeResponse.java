package com.couplesplanning.income;

import com.couplesplanning.expense.RecurrenceType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IncomeResponse(
        Long id,
        Long accountId,
        String description,
        BigDecimal amount,
        RecurrenceType recurrenceType,
        LocalDate startDate,
        LocalDate endDate,
        Integer dayOfMonth
) {}