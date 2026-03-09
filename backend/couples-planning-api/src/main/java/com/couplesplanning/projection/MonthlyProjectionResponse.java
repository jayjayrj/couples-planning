package com.couplesplanning.projection;

import java.math.BigDecimal;

public record MonthlyProjectionResponse(
        String month,
        BigDecimal balance
) {}