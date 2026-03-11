package com.couplesplanning.auth;

import com.couplesplanning.household.Household;
import com.couplesplanning.household.HouseholdRepository;
import com.couplesplanning.membership.Membership;
import com.couplesplanning.membership.MembershipRepository;
import com.couplesplanning.membership.MembershipRole;
import com.couplesplanning.shared.exception.BusinessException;
import com.couplesplanning.shared.exception.UnauthorizedException;
import com.couplesplanning.shared.security.AuthenticatedUser;
import com.couplesplanning.shared.security.JwtService;
import com.couplesplanning.user.User;
import com.couplesplanning.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final HouseholdRepository householdRepository;
    private final MembershipRepository membershipRepository;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already registered");
        }

        OffsetDateTime now = OffsetDateTime.now();

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .createdAt(now)
                .updatedAt(now)
                .build();

        User savedUser = userRepository.save(user);

        // criar household padrão
        Household household = Household.builder()
                .name(request.householdName())
                .createdAt(now.toLocalDateTime())
                .build();

        Household savedHousehold = householdRepository.save(household);

        // criar membership OWNER
        Membership membership = Membership.builder()
                .user(savedUser)
                .household(savedHousehold)
                .role(MembershipRole.OWNER)
                .createdAt(now.toLocalDateTime())
                .build();

        membershipRepository.save(membership);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                "User registered successfully"
        );
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        boolean passwordMatches = passwordEncoder.matches(request.password(), user.getPasswordHash());

        if (!passwordMatches) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl()
        );
    }

    public AuthMeResponse me(AuthenticatedUser authenticatedUser) {

        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return new AuthMeResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl()
        );
    }
}