package com.couplesplanning.income;

import com.couplesplanning.expense.RecurrenceType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateIncomeRequest(

        @NotBlank
        String description,

        @NotNull
        @DecimalMin("0.01")
        BigDecimal amount,

        @NotNull
        RecurrenceType recurrenceType,

        @NotNull
        LocalDate startDate,

        LocalDate endDate,

        Integer dayOfMonth,

        @NotNull
        Long accountId

) {}