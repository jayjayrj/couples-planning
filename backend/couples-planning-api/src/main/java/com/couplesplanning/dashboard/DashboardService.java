package com.couplesplanning.dashboard;

import com.couplesplanning.account.AccountRepository;
import com.couplesplanning.expense.Expense;
import com.couplesplanning.expense.ExpenseRepository;
import com.couplesplanning.expense.ExpenseStatus;
import com.couplesplanning.expense.RecurrenceType;
import com.couplesplanning.income.Income;
import com.couplesplanning.income.IncomeRepository;
import com.couplesplanning.shared.tenancy.HouseholdContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AccountRepository accountRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    public DashboardSummaryResponse getSummary() {
        Long householdId = HouseholdContext.getCurrentHouseholdId();
        YearMonth currentMonth = YearMonth.now();

        BigDecimal currentBalance = accountRepository.findByHouseholdId(householdId)
                .stream()
                .map(account -> account.getCurrentBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMonthlyIncome = incomeRepository.findByHouseholdId(householdId)
                .stream()
                .filter(income -> occursInMonth(income, currentMonth))
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalMonthlyExpense = expenseRepository.findByHouseholdIdAndStatus(householdId, ExpenseStatus.PENDING)
                .stream()
                .filter(expense -> occursInMonth(expense, currentMonth))
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal projectedMonthEndBalance = currentBalance
                .add(totalMonthlyIncome)
                .subtract(totalMonthlyExpense);

        return new DashboardSummaryResponse(
                currentBalance,
                totalMonthlyIncome,
                totalMonthlyExpense,
                projectedMonthEndBalance
        );
    }

    public List<UpcomingExpenseResponse> getUpcomingExpenses() {
        Long householdId = HouseholdContext.getCurrentHouseholdId();
        LocalDate today = LocalDate.now();

        return expenseRepository.findByHouseholdIdAndStatus(householdId, ExpenseStatus.PENDING)
                .stream()
                .map(expense -> mapUpcomingExpense(expense, today))
                .filter(item -> item.dueDate() != null && !item.dueDate().isBefore(today))
                .sorted(Comparator.comparing(UpcomingExpenseResponse::dueDate))
                .limit(10)
                .toList();
    }

    private boolean occursInMonth(Income income, YearMonth month) {
        if (income.getRecurrenceType() == RecurrenceType.ONCE) {
            return YearMonth.from(income.getStartDate()).equals(month);
        }

        if (income.getStartDate().isAfter(month.atEndOfMonth())) {
            return false;
        }

        return income.getEndDate() == null || !income.getEndDate().isBefore(month.atDay(1));
    }

    private boolean occursInMonth(Expense expense, YearMonth month) {
        if (expense.getRecurrenceType() == RecurrenceType.ONCE) {
            return YearMonth.from(expense.getStartDate()).equals(month);
        }

        if (expense.getStartDate().isAfter(month.atEndOfMonth())) {
            return false;
        }

        return expense.getEndDate() == null || !expense.getEndDate().isBefore(month.atDay(1));
    }

    private UpcomingExpenseResponse mapUpcomingExpense(Expense expense, LocalDate today) {
        LocalDate dueDate = resolveDueDate(expense, today);
        return new UpcomingExpenseResponse(
                expense.getId(),
                expense.getDescription(),
                expense.getAmount(),
                dueDate
        );
    }

    private LocalDate resolveDueDate(Expense expense, LocalDate today) {
        if (expense.getRecurrenceType() == RecurrenceType.ONCE) {
            return expense.getStartDate();
        }

        if (expense.getDayOfMonth() == null) {
            return null;
        }

        int safeDay = Math.min(expense.getDayOfMonth(), today.lengthOfMonth());
        LocalDate dueThisMonth = today.withDayOfMonth(safeDay);

        if (!dueThisMonth.isBefore(today)) {
            return dueThisMonth;
        }

        LocalDate nextMonth = today.plusMonths(1).withDayOfMonth(1);
        int nextSafeDay = Math.min(expense.getDayOfMonth(), nextMonth.lengthOfMonth());
        return nextMonth.withDayOfMonth(nextSafeDay);
    }
}