package com.couplesplanning.importing.parser;

import com.couplesplanning.importing.domain.ParsedTransaction;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TransactionLineParser {

    private static final Pattern LINE_PATTERN = Pattern.compile(
            "^(\\d{2}/\\d{2})\\s+(.+?)\\s+(\\d{1,3}(?:\\.\\d{3})*,\\d{2})$"
    );

    public Optional<ParsedTransaction> parse(String line) {
        if (line == null || line.isBlank()) {
            return Optional.empty();
        }

        String normalizedLine = normalizeSpaces(line);

        Matcher matcher = LINE_PATTERN.matcher(normalizedLine);
        if (!matcher.matches()) {
            return Optional.empty();
        }

        String dayMonth = matcher.group(1);
        String description = matcher.group(2).trim();
        String amountText = matcher.group(3);

        LocalDate transactionDate = resolveDate(dayMonth);
        BigDecimal amount = parseAmount(amountText);

        ParsedTransaction transaction = new ParsedTransaction();
        transaction.setTransactionDate(transactionDate);
        transaction.setDescription(description);
        transaction.setAmount(amount);
        transaction.setType("EXPENSE");
        transaction.setCategorySuggestion(null);
        transaction.setPossibleDuplicate(false);
        transaction.setConfidence(0.95);
        transaction.setRawLine(line);

        return Optional.of(transaction);
    }

    private String normalizeSpaces(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private BigDecimal parseAmount(String value) {
        String normalized = value.replace(".", "").replace(",", ".");
        return new BigDecimal(normalized);
    }

    private LocalDate resolveDate(String dayMonth) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        int currentYear = Year.now().getValue();
        LocalDate candidate = LocalDate.parse(dayMonth + "/" + currentYear, formatter);

        LocalDate now = LocalDate.now();
        if (candidate.isAfter(now.plusDays(5))) {
            candidate = candidate.minusYears(1);
        }

        return candidate;
    }
}