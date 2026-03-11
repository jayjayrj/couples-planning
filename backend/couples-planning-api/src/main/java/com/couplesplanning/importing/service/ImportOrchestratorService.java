package com.couplesplanning.importing.service;

import com.couplesplanning.account.Account;
import com.couplesplanning.account.AccountRepository;
import com.couplesplanning.expense.CreateExpenseRequest;
import com.couplesplanning.expense.ExpenseResponse;
import com.couplesplanning.expense.ExpenseService;
import com.couplesplanning.expense.RecurrenceType;
import com.couplesplanning.importing.domain.DocumentType;
import com.couplesplanning.importing.domain.ParsedTransaction;
import com.couplesplanning.importing.dto.*;
import com.couplesplanning.importing.parser.DocumentTypeDetector;
import com.couplesplanning.importing.parser.PdfTextExtractor;
import com.couplesplanning.importing.parser.TransactionLineParser;
import com.couplesplanning.income.CreateIncomeRequest;
import com.couplesplanning.income.IncomeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ImportOrchestratorService {

    private final PdfTextExtractor pdfTextExtractor;
    private final DocumentTypeDetector documentTypeDetector;
    private final ImportAiInterpreterService importAiInterpreterService;
    private final DuplicateDetectionService duplicateDetectionService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final AccountRepository accountRepository;
    private final TransactionLineParser transactionLineParser;

    public ImportOrchestratorService(
            PdfTextExtractor pdfTextExtractor,
            DocumentTypeDetector documentTypeDetector,
            ImportAiInterpreterService importAiInterpreterService,
            DuplicateDetectionService duplicateDetectionService,
            IncomeService incomeService,
            ExpenseService expenseService,
            AccountRepository accountRepository,
            TransactionLineParser transactionLineParser
    ) {
        this.pdfTextExtractor = pdfTextExtractor;
        this.documentTypeDetector = documentTypeDetector;
        this.importAiInterpreterService = importAiInterpreterService;
        this.duplicateDetectionService = duplicateDetectionService;
        this.incomeService = incomeService;
        this.expenseService = expenseService;
        this.accountRepository = accountRepository;
        this.transactionLineParser = transactionLineParser;
    }

    public ImportPreviewResponseDto preview(MultipartFile file, Long householdId, Long accountId) {
        String extractedText = pdfTextExtractor.extractText(file);

        DocumentType documentType = documentTypeDetector.detect(extractedText);

        List<String> lines = extractedText.lines().toList();

        List<ParsedTransaction> parsedItems = lines.stream()
                .map(transactionLineParser::parse)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();

        duplicateDetectionService.markPossibleDuplicates(parsedItems, householdId, accountId);

        ImportPreviewResponseDto response = new ImportPreviewResponseDto();
        response.setImportId(UUID.randomUUID().toString());
        response.setFileName(file.getOriginalFilename());
        response.setDocumentType(documentType.name());
        response.setTotalItems(parsedItems.size());
        response.setItems(parsedItems.stream().map(this::toDto).toList());

        if (documentType == DocumentType.UNKNOWN) {
            response.getWarnings().add("Não foi possível identificar com segurança o tipo do documento.");
        }

        if (parsedItems.isEmpty()) {
            response.getWarnings().add("Nenhuma transação foi identificada no PDF.");
        }

        return response;
    }

    @Transactional
    public ConfirmImportResponseDto confirm(ConfirmImportRequestDto request) {

        Account account = accountRepository
                .findById(request.getTargetAccountId())
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        if (!account.getHouseholdId().equals(request.getTargetHouseholdId())) {
            throw new RuntimeException("Conta não pertence ao household informado");
        }

        int importedCount = 0;
        int skippedDuplicates = 0;

        for (ConfirmImportedItemDto item : request.getSelectedItems()) {

            String type = item.getType();

            if (isIncomeType(type)) {

                incomeService.create(new CreateIncomeRequest(
                        item.getDescription(),
                        item.getAmount(),
                        RecurrenceType.ONCE,
                        item.getTransactionDate(),
                        null,
                        null,
                        request.getTargetAccountId()
                ));

                importedCount++;
                continue;
            }

            if (isExpenseType(type)) {

                var createdExpense = expenseService.create(new CreateExpenseRequest(
                        item.getDescription(),
                        item.getAmount(),
                        RecurrenceType.ONCE,
                        item.getTransactionDate(),
                        null,
                        null,
                        request.getTargetAccountId()
                ));

                expenseService.markAsPaid(createdExpense.id());

                importedCount++;
            }
        }

        return new ConfirmImportResponseDto(importedCount, skippedDuplicates);
    }

    private ImportedTransactionDto toDto(ParsedTransaction item) {
        ImportedTransactionDto dto = new ImportedTransactionDto();
        dto.setTransactionDate(item.getTransactionDate());
        dto.setDescription(item.getDescription());
        dto.setAmount(item.getAmount());
        dto.setType(item.getType());
        dto.setCategorySuggestion(item.getCategorySuggestion());
        dto.setPossibleDuplicate(item.isPossibleDuplicate());
        dto.setConfidence(item.getConfidence());
        dto.setRawLine(item.getRawLine());
        return dto;
    }

    private boolean isIncomeType(String type) {
        return "INCOME".equalsIgnoreCase(type) || "CREDIT".equalsIgnoreCase(type);
    }

    private boolean isExpenseType(String type) {
        return "EXPENSE".equalsIgnoreCase(type) || "DEBIT".equalsIgnoreCase(type);
    }
}