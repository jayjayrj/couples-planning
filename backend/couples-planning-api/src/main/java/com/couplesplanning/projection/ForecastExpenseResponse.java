package com.couplesplanning.projection;

import java.math.BigDecimal;

public record ForecastExpenseResponse(
        Long id,
        String description,
        BigDecimal amount,
        Integer dayOfMonth
) {}