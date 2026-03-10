package com.couplesplanning.income;

import com.couplesplanning.ledger.AccountLedgerService;
import com.couplesplanning.ledger.ReferenceType;
import com.couplesplanning.shared.exception.ResourceNotFoundException;
import com.couplesplanning.shared.tenancy.HouseholdContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;
    private final AccountLedgerService accountLedgerService;

    @Transactional
    public IncomeResponse create(CreateIncomeRequest request) {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Income income = Income.builder()
                .householdId(householdId)
                .accountId(request.accountId())
                .description(request.description())
                .amount(request.amount())
                .recurrenceType(request.recurrenceType())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .dayOfMonth(request.dayOfMonth())
                .realizedAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        Income saved = incomeRepository.save(income);

        accountLedgerService.credit(
                householdId,
                saved.getAccountId(),
                saved.getAmount(),
                saved.getStartDate(),
                ReferenceType.INCOME,
                saved.getId(),
                saved.getDescription()
        );

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<IncomeResponse> list() {
        Long householdId = HouseholdContext.getCurrentHouseholdId();

        return incomeRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void delete(Long id) {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Income income = incomeRepository
                .findByIdAndHouseholdId(id, householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));

        if (income.getAccountId() != null) {

            accountLedgerService.reverse(
                    householdId,
                    income.getAccountId(),
                    income.getAmount(),
                    income.getStartDate(),
                    ReferenceType.INCOME,
                    income.getId(),
                    income.getDescription()
            );
        }

        incomeRepository.delete(income);
    }

    private IncomeResponse toResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getAccountId(),
                income.getDescription(),
                income.getAmount(),
                income.getRecurrenceType(),
                income.getStartDate(),
                income.getEndDate(),
                income.getDayOfMonth()
        );
    }
}