package com.couplesplanning.projection;

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
import java.time.Clock;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectionService {

    private final AccountRepository accountRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    private final Clock clock = Clock.systemDefaultZone();

    public ProjectionResponse calculateProjection(int months) {
        Long householdId = HouseholdContext.getCurrentHouseholdId();

        BigDecimal currentBalance = accountRepository.findByHouseholdId(householdId)
                .stream()
                .map(account -> defaultIfNull(account.getCurrentBalance()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Income> incomes = incomeRepository.findByHouseholdId(householdId);
        List<Expense> expenses = expenseRepository.findByHouseholdIdAndStatus(
                householdId,
                ExpenseStatus.PENDING
        );

        List<MonthlyProjectionResponse> projection = new ArrayList<>();
        BigDecimal runningBalance = currentBalance;

        YearMonth baseMonth = YearMonth.now(clock);

        for (int i = 0; i < months; i++) {
            YearMonth targetMonth = baseMonth.plusMonths(i);

            BigDecimal monthIncome = calculateIncomeForMonth(incomes, targetMonth);
            BigDecimal monthExpense = calculateExpenseForMonth(expenses, targetMonth);

            runningBalance = runningBalance
                    .add(monthIncome)
                    .subtract(monthExpense);

            projection.add(new MonthlyProjectionResponse(
                    targetMonth.toString(),
                    runningBalance
            ));
        }

        List<ForecastExpenseResponse> forecastExpenses = buildForecastExpenses(expenses);

        return new ProjectionResponse(currentBalance, projection, forecastExpenses);
    }

    private BigDecimal calculateIncomeForMonth(List<Income> incomes, YearMonth month) {
        BigDecimal total = BigDecimal.ZERO;

        for (Income income : incomes) {
            if (income == null || income.getRecurrenceType() == null || income.getStartDate() == null) {
                continue;
            }

            if (!occursInMonth(
                    income.getRecurrenceType(),
                    income.getStartDate(),
                    income.getEndDate(),
                    month
            )) {
                continue;
            }

            total = total.add(defaultIfNull(income.getAmount()));
        }

        return total;
    }

    private BigDecimal calculateExpenseForMonth(List<Expense> expenses, YearMonth month) {
        BigDecimal total = BigDecimal.ZERO;

        for (Expense expense : expenses) {
            if (expense == null || expense.getRecurrenceType() == null || expense.getStartDate() == null) {
                continue;
            }

            if (!occursInMonth(
                    expense.getRecurrenceType(),
                    expense.getStartDate(),
                    expense.getEndDate(),
                    month
            )) {
                continue;
            }

            total = total.add(defaultIfNull(expense.getAmount()));
        }

        return total;
    }

    private boolean occursInMonth(
            RecurrenceType recurrenceType,
            LocalDate startDate,
            LocalDate endDate,
            YearMonth targetMonth
    ) {
        return switch (recurrenceType) {
            case ONCE -> occursOnceInMonth(startDate, targetMonth);
            case MONTHLY -> occursMonthlyInMonth(startDate, endDate, targetMonth);
        };
    }

    private boolean occursOnceInMonth(LocalDate startDate, YearMonth targetMonth) {
        return YearMonth.from(startDate).equals(targetMonth);
    }

    private boolean occursMonthlyInMonth(
            LocalDate startDate,
            LocalDate endDate,
            YearMonth targetMonth
    ) {
        LocalDate firstDayOfTargetMonth = targetMonth.atDay(1);
        LocalDate lastDayOfTargetMonth = targetMonth.atEndOfMonth();

        boolean startsBeforeOrInsideMonth = !startDate.isAfter(lastDayOfTargetMonth);
        boolean endsAfterOrInsideMonth = endDate == null || !endDate.isBefore(firstDayOfTargetMonth);

        return startsBeforeOrInsideMonth && endsAfterOrInsideMonth;
    }

    private List<ForecastExpenseResponse> buildForecastExpenses(List<Expense> expenses) {
        return expenses.stream()
                .filter(expense -> expense != null && expense.getRecurrenceType() == RecurrenceType.MONTHLY)
                .sorted(
                        Comparator.comparing(
                                Expense::getDayOfMonth,
                                Comparator.nullsLast(Integer::compareTo)
                        ).thenComparing(
                                Expense::getDescription,
                                Comparator.nullsLast(String::compareToIgnoreCase)
                        )
                )
                .map(expense -> new ForecastExpenseResponse(
                        expense.getId(),
                        expense.getDescription(),
                        defaultIfNull(expense.getAmount()),
                        expense.getDayOfMonth()
                ))
                .toList();
    }

    private BigDecimal defaultIfNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}