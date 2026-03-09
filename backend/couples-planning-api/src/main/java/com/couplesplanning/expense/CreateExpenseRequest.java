package com.couplesplanning.expense;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateExpenseRequest(

        @NotBlank
        String description,

        @NotNull
        @DecimalMin(value = "0.01")
        BigDecimal amount,

        @NotNull
        RecurrenceType recurrenceType,

        @NotNull
        LocalDate startDate,

        LocalDate endDate,

        Integer dayOfMonth

) {
}