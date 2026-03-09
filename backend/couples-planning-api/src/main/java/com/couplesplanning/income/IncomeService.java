package com.couplesplanning.income;

import com.couplesplanning.shared.exception.ResourceNotFoundException;
import com.couplesplanning.shared.tenancy.HouseholdContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public IncomeResponse create(CreateIncomeRequest request) {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Income income = Income.builder()
                .householdId(householdId)
                .description(request.description())
                .amount(request.amount())
                .recurrenceType(request.recurrenceType())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .dayOfMonth(request.dayOfMonth())
                .createdAt(LocalDateTime.now())
                .build();

        Income saved = incomeRepository.save(income);

        return toResponse(saved);
    }

    public List<IncomeResponse> list() {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        return incomeRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void delete(Long id) {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Income income = incomeRepository
                .findByIdAndHouseholdId(id, householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found"));

        incomeRepository.delete(income);
    }

    private IncomeResponse toResponse(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getDescription(),
                income.getAmount(),
                income.getRecurrenceType(),
                income.getStartDate(),
                income.getEndDate(),
                income.getDayOfMonth()
        );
    }
}