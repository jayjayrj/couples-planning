package com.couplesplanning.goal;

import com.couplesplanning.shared.exception.BusinessException;
import com.couplesplanning.shared.exception.ResourceNotFoundException;
import com.couplesplanning.shared.tenancy.HouseholdContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;

    @Transactional
    public GoalResponse create(CreateGoalRequest request) {
        validateAmounts(request.targetAmount(), request.currentAmount());

        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Goal goal = Goal.builder()
                .householdId(householdId)
                .name(request.name())
                .targetAmount(request.targetAmount())
                .currentAmount(request.currentAmount())
                .targetDate(request.targetDate())
                .createdAt(LocalDateTime.now())
                .build();

        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<GoalResponse> list() {
        Long householdId = HouseholdContext.getCurrentHouseholdId();

        return goalRepository.findByHouseholdId(householdId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public GoalResponse update(Long id, UpdateGoalRequest request) {
        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Goal goal = goalRepository.findByIdAndHouseholdId(id, householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        BigDecimal targetAmount = request.targetAmount() != null ? request.targetAmount() : goal.getTargetAmount();
        BigDecimal currentAmount = request.currentAmount() != null ? request.currentAmount() : goal.getCurrentAmount();

        validateAmounts(targetAmount, currentAmount);

        if (request.name() != null) {
            goal.setName(request.name());
        }
        if (request.targetAmount() != null) {
            goal.setTargetAmount(request.targetAmount());
        }
        if (request.currentAmount() != null) {
            goal.setCurrentAmount(request.currentAmount());
        }
        if (request.targetDate() != null) {
            goal.setTargetDate(request.targetDate());
        }

        Goal saved = goalRepository.save(goal);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Long householdId = HouseholdContext.getCurrentHouseholdId();

        Goal goal = goalRepository.findByIdAndHouseholdId(id, householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found"));

        goalRepository.delete(goal);
    }

    private void validateAmounts(BigDecimal targetAmount, BigDecimal currentAmount) {
        if (targetAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("targetAmount must be greater than zero");
        }

        if (currentAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("currentAmount cannot be negative");
        }

        if (currentAmount.compareTo(targetAmount) > 0) {
            throw new BusinessException("currentAmount cannot be greater than targetAmount");
        }
    }

    private GoalResponse toResponse(Goal goal) {
        BigDecimal progressPercentage = goal.getCurrentAmount()
                .multiply(BigDecimal.valueOf(100))
                .divide(goal.getTargetAmount(), 2, RoundingMode.HALF_UP);

        return new GoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getTargetDate(),
                progressPercentage
        );
    }
}