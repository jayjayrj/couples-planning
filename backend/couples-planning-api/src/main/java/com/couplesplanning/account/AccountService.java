package com.couplesplanning.account;

import com.couplesplanning.shared.tenancy.HouseholdContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountResponse create(CreateAccountRequest request) {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Account account = Account.builder()
                .householdId(householdId)
                .currentBalance(request.initialBalance() != null ? request.initialBalance() : BigDecimal.ZERO)
                .name(request.name())
                .type(request.type())
                .currentBalance(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .build();

        Account saved = accountRepository.save(account);

        return new AccountResponse(
                saved.getId(),
                saved.getName(),
                saved.getType(),
                saved.getCurrentBalance()
        );
    }

    public List<AccountResponse> list() {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        return accountRepository.findByHouseholdId(householdId)
                .stream()
                .map(a -> new AccountResponse(
                        a.getId(),
                        a.getName(),
                        a.getType(),
                        a.getCurrentBalance()
                ))
                .toList();
    }
}