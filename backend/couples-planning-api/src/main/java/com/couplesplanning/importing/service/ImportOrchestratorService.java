package com.couplesplanning.importing.service;

import com.couplesplanning.importing.domain.DocumentType;
import com.couplesplanning.importing.domain.ParsedTransaction;
import com.couplesplanning.importing.dto.ConfirmImportRequestDto;
import com.couplesplanning.importing.dto.ImportPreviewResponseDto;
import com.couplesplanning.importing.dto.ImportedTransactionDto;
import com.couplesplanning.importing.parser.DocumentTypeDetector;
import com.couplesplanning.importing.parser.PdfTextExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class ImportOrchestratorService {

    private final PdfTextExtractor pdfTextExtractor;
    private final DocumentTypeDetector documentTypeDetector;
    private final ImportAiInterpreterService importAiInterpreterService;
    private final DuplicateDetectionService duplicateDetectionService;

    public ImportOrchestratorService(
            PdfTextExtractor pdfTextExtractor,
            DocumentTypeDetector documentTypeDetector,
            ImportAiInterpreterService importAiInterpreterService,
            DuplicateDetectionService duplicateDetectionService
    ) {
        this.pdfTextExtractor = pdfTextExtractor;
        this.documentTypeDetector = documentTypeDetector;
        this.importAiInterpreterService = importAiInterpreterService;
        this.duplicateDetectionService = duplicateDetectionService;
    }

    public ImportPreviewResponseDto preview(MultipartFile file, Long householdId, Long accountId) {
        String extractedText = pdfTextExtractor.extractText(file);
        DocumentType documentType = documentTypeDetector.detect(extractedText);

        List<ParsedTransaction> parsedItems =
                importAiInterpreterService.interpret(extractedText, documentType);

        duplicateDetectionService.markPossibleDuplicates(parsedItems, householdId, accountId);

        ImportPreviewResponseDto response = new ImportPreviewResponseDto();
        response.setImportId(UUID.randomUUID().toString());
        response.setFileName(file.getOriginalFilename());
        response.setDocumentType(documentType.name());
        response.setTotalItems(parsedItems.size());
        response.setItems(
                parsedItems.stream()
                        .map(this::toDto)
                        .toList()
        );

        if (documentType == DocumentType.UNKNOWN) {
            response.getWarnings().add("Não foi possível identificar com segurança o tipo do documento.");
        }

        if (parsedItems.isEmpty()) {
            response.getWarnings().add("Nenhuma transação foi identificada no PDF.");
        }

        return response;
    }

    public String confirm(ConfirmImportRequestDto request) {
        // MVP:
        // aqui você ainda NÃO grava no expense/income.
        // apenas valida e devolve sucesso.
        // próximo passo é integrar com expenseService/incomeService.
        return "Importação confirmada com sucesso. Itens recebidos: " + request.getSelectedItems().size();
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
}