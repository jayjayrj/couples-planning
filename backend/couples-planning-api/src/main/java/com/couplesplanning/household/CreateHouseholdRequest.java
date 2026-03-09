package com.couplesplanning.household;

import jakarta.validation.constraints.NotBlank;

public record CreateHouseholdRequest(
        @NotBlank
        String name
) {
}