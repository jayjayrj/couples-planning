package com.couplesplanning.auth;

public record AuthMeResponse(
        Long id,
        String email,
        String fullName,
        String avatarUrl
) {
}