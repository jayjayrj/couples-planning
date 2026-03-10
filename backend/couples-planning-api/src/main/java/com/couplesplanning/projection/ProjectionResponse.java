package com.couplesplanning.projection;

import java.math.BigDecimal;
import java.util.List;

public record ProjectionResponse(
        BigDecimal currentBalance,
        List<MonthlyProjectionResponse> projection,
        List<ForecastExpenseResponse> forecastExpenses
) {}