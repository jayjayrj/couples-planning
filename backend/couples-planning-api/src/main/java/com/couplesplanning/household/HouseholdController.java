package com.couplesplanning.household;

import com.couplesplanning.shared.security.AuthenticatedUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/households")
@RequiredArgsConstructor
public class HouseholdController {

    private final HouseholdService householdService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HouseholdResponse create(
            @RequestBody @Valid CreateHouseholdRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        return householdService.create(authenticatedUser.getId(), request);
    }

    @GetMapping
    public List<HouseholdResponse> list(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser
    ) {
        return householdService.listByUser(authenticatedUser.getId());
    }
}