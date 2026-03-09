package com.couplesplanning.auth;

public record RegisterResponse(
        Long id,
        String email,
        String fullName,
        String message
) {
}