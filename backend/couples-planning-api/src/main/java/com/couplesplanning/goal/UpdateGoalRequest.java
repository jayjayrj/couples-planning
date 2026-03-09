package com.couplesplanning.goal;

import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateGoalRequest(
        String name,
        @DecimalMin(value = "0.01")
        BigDecimal targetAmount,
        @DecimalMin(value = "0.00")
        BigDecimal currentAmount,
        LocalDate targetDate
) {
}