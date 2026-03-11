package com.couplesplanning.importing.controller;

import com.couplesplanning.importing.dto.ConfirmImportRequestDto;
import com.couplesplanning.importing.dto.ImportPreviewResponseDto;
import com.couplesplanning.importing.service.ImportOrchestratorService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/imports")
public class ImportController {

    private final ImportOrchestratorService importOrchestratorService;

    public ImportController(ImportOrchestratorService importOrchestratorService) {
        this.importOrchestratorService = importOrchestratorService;
    }

    @PostMapping(value = "/pdf/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportPreviewResponseDto> previewPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("householdId") Long householdId,
            @RequestParam("accountId") Long accountId
    ) {
        ImportPreviewResponseDto response =
                importOrchestratorService.preview(file, householdId, accountId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/pdf/confirm")
    public ResponseEntity<Map<String, String>> confirmImport(
            @Valid @RequestBody ConfirmImportRequestDto request
    ) {
        String message = importOrchestratorService.confirm(request);
        return ResponseEntity.ok(Map.of("message", message));
    }
}