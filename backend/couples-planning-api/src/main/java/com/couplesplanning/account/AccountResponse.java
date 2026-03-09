package com.couplesplanning.account;

import java.math.BigDecimal;

public record AccountResponse(
        Long id,
        String name,
        AccountType type,
        BigDecimal currentBalance
) {}