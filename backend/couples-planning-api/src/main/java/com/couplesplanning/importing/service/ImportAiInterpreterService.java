package com.couplesplanning.importing.service;

import com.couplesplanning.importing.domain.DocumentType;
import com.couplesplanning.importing.domain.ParsedTransaction;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImportAiInterpreterService {

    /**
     * Stub inicial.
     * Por enquanto, tenta extrair linhas simples contendo valor.
     * Depois você troca este método pela chamada real para OpenAI.
     */
    public List<ParsedTransaction> interpret(String extractedText, DocumentType documentType) {
        List<ParsedTransaction> items = new ArrayList<>();

        if (extractedText == null || extractedText.isBlank()) {
            return items;
        }

        String[] lines = extractedText.split("\\r?\\n");

        for (String rawLine : lines) {
            if (rawLine == null || rawLine.isBlank()) {
                continue;
            }

            String line = rawLine.trim();

            // Regra bem simples para MVP:
            // tenta capturar linhas com padrão de valor brasileiro "123,45"
            if (line.matches(".*\\d{1,3}(\\.\\d{3})*,\\d{2}.*")) {
                BigDecimal amount = extractAmount(line);
                if (amount == null) {
                    continue;
                }

                ParsedTransaction tx = new ParsedTransaction();
                tx.setTransactionDate(LocalDate.now());
                tx.setDescription(cleanDescription(line));
                tx.setAmount(amount.abs());
                tx.setType(inferType(documentType, amount));
                tx.setCategorySuggestion(null);
                tx.setPossibleDuplicate(false);
                tx.setConfidence(0.55);
                tx.setRawLine(rawLine);

                items.add(tx);
            }
        }

        return items;
    }

    private BigDecimal extractAmount(String line) {
        String[] tokens = line.split("\\s+");

        for (int i = tokens.length - 1; i >= 0; i--) {
            String token = tokens[i].replace("R$", "").trim();

            if (token.matches("-?\\d{1,3}(\\.\\d{3})*,\\d{2}")) {
                String normalized = token.replace(".", "").replace(",", ".");
                try {
                    return new BigDecimal(normalized);
                } catch (NumberFormatException ignored) {
                }
            }
        }

        return null;
    }

    private String cleanDescription(String line) {
        return line.replaceAll("-?\\d{1,3}(\\.\\d{3})*,\\d{2}", "").replace("R$", "").trim();
    }

    private String inferType(DocumentType documentType, BigDecimal amount) {
        if (documentType == DocumentType.CREDIT_CARD_BILL) {
            return "EXPENSE";
        }

        if (amount.signum() < 0) {
            return "EXPENSE";
        }

        return "UNKNOWN";
    }
}