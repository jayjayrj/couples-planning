package com.couplesplanning.expense;

import com.couplesplanning.account.Account;
import com.couplesplanning.account.AccountRepository;
import com.couplesplanning.ledger.AccountLedgerService;
import com.couplesplanning.ledger.ReferenceType;
import com.couplesplanning.shared.exception.BusinessException;
import com.couplesplanning.shared.exception.ResourceNotFoundException;
import com.couplesplanning.shared.tenancy.HouseholdContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final AccountLedgerService accountLedgerService;
    private final AccountRepository accountRepository;

    @Transactional
    public ExpenseResponse create(CreateExpenseRequest request) {
        validateRequest(request.recurrenceType(), request.startDate(), request.endDate(), request.dayOfMonth());

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Expense expense = Expense.builder()
                .householdId(householdId)
                .accountId(request.accountId())
                .description(request.description())
                .amount(request.amount())
                .recurrenceType(request.recurrenceType())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .dayOfMonth(request.dayOfMonth())
                .status(ExpenseStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Expense saved = expenseRepository.save(expense);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> list(ExpenseStatus status) {
        Long householdId = HouseholdContext.getCurrentHouseholdId();

        List<Expense> expenses = status == null
                ? expenseRepository.findByHouseholdId(householdId)
                : expenseRepository.findByHouseholdIdAndStatus(householdId, status);

        Map<Long, String> accountNamesById = accountRepository.findByHouseholdId(householdId).stream()
                .collect(Collectors.toMap(Account::getId, Account::getName));

        return expenses.stream()
                .map(expense -> toResponse(expense, accountNamesById))
                .toList();
    }

    @Transactional
    public ExpenseResponse update(Long expenseId, UpdateExpenseRequest request) {
        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Expense expense = expenseRepository.findByIdAndHouseholdId(expenseId, householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        RecurrenceType recurrenceType = request.recurrenceType() != null ? request.recurrenceType() : expense.getRecurrenceType();
        var startDate = request.startDate() != null ? request.startDate() : expense.getStartDate();
        var endDate = request.endDate() != null ? request.endDate() : expense.getEndDate();
        Integer dayOfMonth = request.dayOfMonth() != null ? request.dayOfMonth() : expense.getDayOfMonth();

        validateRequest(recurrenceType, startDate, endDate, dayOfMonth);

        if (request.description() != null) {
            expense.setDescription(request.description());
        }
        if (request.amount() != null) {
            expense.setAmount(request.amount());
        }
        if (request.recurrenceType() != null) {
            expense.setRecurrenceType(request.recurrenceType());
        }
        if (request.startDate() != null) {
            expense.setStartDate(request.startDate());
        }
        expense.setEndDate(request.endDate());
        expense.setDayOfMonth(request.dayOfMonth());

        if (request.status() != null) {
            expense.setStatus(request.status());
        }

        Expense saved = expenseRepository.save(expense);
        return toResponse(saved);
    }

    @Transactional
    public ExpenseResponse markAsPaid(Long expenseId) {
        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Expense expense = expenseRepository.findByIdAndHouseholdId(expenseId, householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (expense.getStatus() == ExpenseStatus.PAID) {
            throw new BusinessException("Expense already paid");
        }

        if (expense.getAccountId() == null) {
            throw new BusinessException("Expense has no account assigned");
        }

        expense.setStatus(ExpenseStatus.PAID);
        expense.setPaidAt(LocalDateTime.now());

        Expense saved = expenseRepository.save(expense);

        accountLedgerService.debit(
                householdId,
                saved.getAccountId(),
                saved.getAmount(),
                saved.getStartDate(),
                ReferenceType.EXPENSE,
                saved.getId(),
                saved.getDescription()
        );

        return toResponse(saved);
    }

    @Transactional
    public void delete(Long expenseId) {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Expense expense = expenseRepository.findByIdAndHouseholdId(expenseId, householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (expense.getStatus() == ExpenseStatus.PAID && expense.getAccountId() != null) {

            accountLedgerService.credit(
                    householdId,
                    expense.getAccountId(),
                    expense.getAmount(),
                    expense.getStartDate(),
                    ReferenceType.EXPENSE,
                    expense.getId(),
                    "Reversal: " + expense.getDescription()
            );
        }

        expenseRepository.delete(expense);
    }

    private void validateRequest(
            RecurrenceType recurrenceType,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            Integer dayOfMonth
    ) {
        if (endDate != null && endDate.isBefore(startDate)) {
            throw new BusinessException("endDate cannot be before startDate");
        }

        if (recurrenceType == RecurrenceType.MONTHLY && dayOfMonth == null) {
            throw new BusinessException("dayOfMonth is required for MONTHLY recurrence");
        }

        if (recurrenceType == RecurrenceType.ONCE && dayOfMonth != null) {
            throw new BusinessException("dayOfMonth must be null for ONCE recurrence");
        }

        if (dayOfMonth != null && (dayOfMonth < 1 || dayOfMonth > 31)) {
            throw new BusinessException("dayOfMonth must be between 1 and 31");
        }
    }

    private ExpenseResponse toResponse(Expense expense, Map<Long, String> accountNamesById) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getAccountId(),
                expense.getAccountId() != null ? accountNamesById.get(expense.getAccountId()) : null,
                expense.getDescription(),
                expense.getAmount(),
                expense.getRecurrenceType(),
                expense.getStartDate(),
                expense.getEndDate(),
                expense.getDayOfMonth(),
                expense.getStatus()
        );
    }

    private ExpenseResponse toResponse(Expense expense) {
        String accountName = null;

        if (expense.getAccountId() != null) {
            accountName = accountRepository.findByIdAndHouseholdId(
                    expense.getAccountId(),
                    expense.getHouseholdId()
            ).map(Account::getName).orElse(null);
        }

        return new ExpenseResponse(
                expense.getId(),
                expense.getAccountId(),
                accountName,
                expense.getDescription(),
                expense.getAmount(),
                expense.getRecurrenceType(),
                expense.getStartDate(),
                expense.getEndDate(),
                expense.getDayOfMonth(),
                expense.getStatus()
        );
    }
}