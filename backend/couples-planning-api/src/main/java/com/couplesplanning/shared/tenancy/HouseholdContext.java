package com.couplesplanning.shared.tenancy;

public class HouseholdContext {

    private static final ThreadLocal<Long> CURRENT_HOUSEHOLD = new ThreadLocal<>();

    public static void setCurrentHouseholdId(Long householdId) {
        CURRENT_HOUSEHOLD.set(householdId);
    }

    public static Long getCurrentHouseholdId() {
        return CURRENT_HOUSEHOLD.get();
    }

    public static void clear() {
        CURRENT_HOUSEHOLD.remove();
    }
}