package com.couplesplanning.importing.service;

import com.couplesplanning.importing.domain.ParsedTransaction;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DuplicateDetectionService {

    /**
     * Stub inicial.
     * Depois você liga esse serviço ao módulo expense/ledger
     * para procurar duplicidade real no banco.
     */
    public void markPossibleDuplicates(List<ParsedTransaction> items, Long householdId, Long accountId) {
        if (items == null || items.isEmpty()) {
            return;
        }

        for (ParsedTransaction item : items) {
            item.setPossibleDuplicate(false);
        }
    }
}