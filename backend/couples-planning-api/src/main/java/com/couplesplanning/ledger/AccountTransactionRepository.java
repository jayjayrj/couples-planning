package com.couplesplanning.ledger;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountTransactionRepository extends JpaRepository<AccountTransaction, Long> {

    List<AccountTransaction> findByAccountIdAndHouseholdId(Long accountId, Long householdId);

    Optional<AccountTransaction> findByReferenceTypeAndReferenceIdAndHouseholdId(
            ReferenceType referenceType,
            Long referenceId,
            Long householdId
    );
}