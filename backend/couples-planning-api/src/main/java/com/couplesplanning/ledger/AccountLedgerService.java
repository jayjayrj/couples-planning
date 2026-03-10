package com.couplesplanning.ledger;

import com.couplesplanning.account.Account;
import com.couplesplanning.account.AccountRepository;
import com.couplesplanning.shared.exception.BusinessException;
import com.couplesplanning.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AccountLedgerService {

    private final AccountRepository accountRepository;
    private final AccountTransactionRepository accountTransactionRepository;

    @Transactional
    public void credit(
            Long householdId,
            Long accountId,
            BigDecimal amount,
            LocalDate transactionDate,
            ReferenceType referenceType,
            Long referenceId,
            String description
    ) {
        validateDuplicate(referenceType, referenceId, householdId);

        Account account = loadAndValidateAccount(accountId, householdId);

        account.setCurrentBalance(account.getCurrentBalance().add(amount));

        accountTransactionRepository.save(AccountTransaction.builder()
                .householdId(householdId)
                .accountId(accountId)
                .type(AccountTransactionType.INCOME)
                .direction(TransactionDirection.CREDIT)
                .amount(amount)
                .transactionDate(transactionDate)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build());

        accountRepository.save(account);
    }

    @Transactional
    public void debit(
            Long householdId,
            Long accountId,
            BigDecimal amount,
            LocalDate transactionDate,
            ReferenceType referenceType,
            Long referenceId,
            String description
    ) {
        validateDuplicate(referenceType, referenceId, householdId);

        Account account = loadAndValidateAccount(accountId, householdId);

        account.setCurrentBalance(account.getCurrentBalance().subtract(amount));

        accountTransactionRepository.save(AccountTransaction.builder()
                .householdId(householdId)
                .accountId(accountId)
                .type(AccountTransactionType.EXPENSE)
                .direction(TransactionDirection.DEBIT)
                .amount(amount)
                .transactionDate(transactionDate)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .description(description)
                .createdAt(LocalDateTime.now())
                .build());

        accountRepository.save(account);
    }

    private Account loadAndValidateAccount(Long accountId, Long householdId) {
        Account account = accountRepository.findByIdForUpdate(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (!account.getHouseholdId().equals(householdId)) {
            throw new BusinessException("Account does not belong to current household");
        }

        return account;
    }

    private void validateDuplicate(ReferenceType referenceType, Long referenceId, Long householdId) {
        boolean alreadyExists = accountTransactionRepository
                .findByReferenceTypeAndReferenceIdAndHouseholdId(referenceType, referenceId, householdId)
                .isPresent();

        if (alreadyExists) {
            throw new BusinessException("A financial transaction already exists for this reference");
        }
    }

    @Transactional
    public void reverse(
            Long householdId,
            Long accountId,
            BigDecimal amount,
            LocalDate transactionDate,
            ReferenceType referenceType,
            Long referenceId,
            String description
    ) {

        Account account = loadAndValidateAccount(accountId, householdId);

        account.setCurrentBalance(account.getCurrentBalance().subtract(amount));

        accountTransactionRepository.save(AccountTransaction.builder()
                .householdId(householdId)
                .accountId(accountId)
                .type(AccountTransactionType.REVERSAL)
                .direction(TransactionDirection.DEBIT)
                .amount(amount)
                .transactionDate(transactionDate)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .description("Reversal: " + description)
                .createdAt(LocalDateTime.now())
                .build());

        accountRepository.save(account);
    }
}