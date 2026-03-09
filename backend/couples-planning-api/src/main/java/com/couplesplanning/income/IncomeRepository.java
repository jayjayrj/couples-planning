package com.couplesplanning.income;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByHouseholdId(Long householdId);

    Optional<Income> findByIdAndHouseholdId(Long id, Long householdId);
}