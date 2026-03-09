package com.couplesplanning.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpcomingExpenseResponse(
        Long id,
        String description,
        BigDecimal amount,
        LocalDate dueDate
) {
}