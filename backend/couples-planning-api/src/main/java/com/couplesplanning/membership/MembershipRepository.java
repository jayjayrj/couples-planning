package com.couplesplanning.membership;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MembershipRepository extends JpaRepository<Membership, Long> {

    List<Membership> findByUser_Id(Long userId);

    boolean existsByUser_IdAndHousehold_Id(Long userId, Long householdId);
}