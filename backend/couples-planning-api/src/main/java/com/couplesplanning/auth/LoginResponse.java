package com.couplesplanning.auth;

public record LoginResponse(
        String accessToken,
        String tokenType,
        Long userId,
        String email,
        String fullName,
        String avatarUrl
) {
}