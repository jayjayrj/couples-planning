package com.couplesplanning.dashboard;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        BigDecimal currentBalance,
        BigDecimal totalMonthlyIncome,
        BigDecimal totalMonthlyExpense,
        BigDecimal projectedMonthEndBalance
) {
}