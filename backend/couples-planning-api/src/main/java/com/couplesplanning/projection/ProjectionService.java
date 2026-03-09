package com.couplesplanning.projection;

import com.couplesplanning.account.AccountRepository;
import com.couplesplanning.expense.Expense;
import com.couplesplanning.expense.ExpenseRepository;
import com.couplesplanning.expense.ExpenseStatus;
import com.couplesplanning.income.Income;
import com.couplesplanning.income.IncomeRepository;
import com.couplesplanning.shared.tenancy.HouseholdContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectionService {

    private final AccountRepository accountRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    public ProjectionResponse calculateProjection(int months) {

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        BigDecimal currentBalance = accountRepository.findByHouseholdId(householdId)
                .stream()
                .map(a -> a.getCurrentBalance())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Income> incomes = incomeRepository.findByHouseholdId(householdId);
        List<Expense> expenses = expenseRepository.findByHouseholdIdAndStatus(householdId, ExpenseStatus.PENDING);

        List<MonthlyProjectionResponse> projection = new ArrayList<>();

        BigDecimal runningBalance = currentBalance;

        YearMonth currentMonth = YearMonth.now();

        for (int i = 0; i < months; i++) {

            YearMonth month = currentMonth.plusMonths(i);

            BigDecimal monthIncome = calculateIncomeForMonth(incomes, month);
            BigDecimal monthExpense = calculateExpenseForMonth(expenses, month);

            runningBalance = runningBalance
                    .add(monthIncome)
                    .subtract(monthExpense);

            projection.add(new MonthlyProjectionResponse(
                    month.toString(),
                    runningBalance
            ));
        }

        return new ProjectionResponse(currentBalance, projection);
    }

    private BigDecimal calculateIncomeForMonth(List<Income> incomes, YearMonth month) {

        BigDecimal total = BigDecimal.ZERO;

        for (Income income : incomes) {

            if (income.getRecurrenceType().name().equals("ONCE")) {
                if (YearMonth.from(income.getStartDate()).equals(month)) {
                    total = total.add(income.getAmount());
                }
            }

            if (income.getRecurrenceType().name().equals("MONTHLY")) {

                if (income.getStartDate().isAfter(month.atEndOfMonth())) {
                    continue;
                }

                if (income.getEndDate() != null &&
                        income.getEndDate().isBefore(month.atDay(1))) {
                    continue;
                }

                total = total.add(income.getAmount());
            }
        }

        return total;
    }

    private BigDecimal calculateExpenseForMonth(List<Expense> expenses, YearMonth month) {

        BigDecimal total = BigDecimal.ZERO;

        for (Expense expense : expenses) {

            if (expense.getRecurrenceType().name().equals("ONCE")) {
                if (YearMonth.from(expense.getStartDate()).equals(month)) {
                    total = total.add(expense.getAmount());
                }
            }

            if (expense.getRecurrenceType().name().equals("MONTHLY")) {

                if (expense.getStartDate().isAfter(month.atEndOfMonth())) {
                    continue;
                }

                if (expense.getEndDate() != null &&
                        expense.getEndDate().isBefore(month.atDay(1))) {
                    continue;
                }

                total = total.add(expense.getAmount());
            }
        }

        return total;
    }
}