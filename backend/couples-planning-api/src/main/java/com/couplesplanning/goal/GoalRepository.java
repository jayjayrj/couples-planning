package com.couplesplanning.goal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends JpaRepository<Goal, Long> {

    List<Goal> findByHouseholdId(Long householdId);

    Optional<Goal> findByIdAndHouseholdId(Long id, Long householdId);
}