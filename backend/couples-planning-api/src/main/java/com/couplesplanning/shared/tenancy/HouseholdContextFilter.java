package com.couplesplanning.shared.tenancy;

import com.couplesplanning.membership.MembershipRepository;
import com.couplesplanning.shared.exception.UnauthorizedException;
import com.couplesplanning.shared.security.AuthenticatedUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class HouseholdContextFilter extends OncePerRequestFilter {

    private final MembershipRepository membershipRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String householdHeader = request.getHeader("X-Household-Id");

        if (householdHeader != null) {

            Long householdId = Long.valueOf(householdHeader);

            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            if (principal instanceof AuthenticatedUser user) {

                boolean belongs = membershipRepository
                        .existsByUser_IdAndHousehold_Id(user.getId(), householdId);

                if (!belongs) {
                    throw new UnauthorizedException("User does not belong to this household");
                }

                HouseholdContext.setCurrentHouseholdId(householdId);
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            HouseholdContext.clear();
        }
    }
}