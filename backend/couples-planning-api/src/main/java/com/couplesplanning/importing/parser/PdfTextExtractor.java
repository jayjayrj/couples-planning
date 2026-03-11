package com.couplesplanning.importing.parser;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfTextExtractor {

    private final PdfOcrExtractor pdfOcrExtractor;

    public PdfTextExtractor(PdfOcrExtractor pdfOcrExtractor) {
        this.pdfOcrExtractor = pdfOcrExtractor;
    }

    public String extractText(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (shouldUseOcr(text)) {
                return pdfOcrExtractor.extractText(document);
            }

            return text;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao ler PDF", e);
        }
    }

    private boolean shouldUseOcr(String text) {
        return text == null || text.trim().length() < 100;
    }
}