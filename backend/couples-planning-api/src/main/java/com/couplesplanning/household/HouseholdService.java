package com.couplesplanning.household;

import com.couplesplanning.membership.Membership;
import com.couplesplanning.membership.MembershipRepository;
import com.couplesplanning.membership.MembershipRole;
import com.couplesplanning.shared.exception.ResourceNotFoundException;
import com.couplesplanning.user.User;
import com.couplesplanning.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;

    @Transactional
    public HouseholdResponse create(Long authenticatedUserId, CreateHouseholdRequest request) {
        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        Household household = Household.builder()
                .name(request.name())
                .createdAt(LocalDateTime.now())
                .build();

        Household savedHousehold = householdRepository.save(household);

        Membership membership = Membership.builder()
                .user(user)
                .household(savedHousehold)
                .role(MembershipRole.OWNER)
                .createdAt(LocalDateTime.now())
                .build();

        membershipRepository.save(membership);

        return new HouseholdResponse(
                savedHousehold.getId(),
                savedHousehold.getName()
        );
    }

    @Transactional(readOnly = true)
    public List<HouseholdResponse> listByUser(Long authenticatedUserId) {
        return membershipRepository.findByUser_Id(authenticatedUserId)
                .stream()
                .map(membership -> new HouseholdResponse(
                        membership.getHousehold().getId(),
                        membership.getHousehold().getName()
                ))
                .toList();
    }
}