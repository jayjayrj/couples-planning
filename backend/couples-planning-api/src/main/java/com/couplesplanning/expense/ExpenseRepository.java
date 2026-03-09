package com.couplesplanning.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByHouseholdId(Long householdId);

    List<Expense> findByHouseholdIdAndStatus(Long householdId, ExpenseStatus status);

    Optional<Expense> findByIdAndHouseholdId(Long id, Long householdId);
}