package com.couplesplanning.importing.parser;

import com.couplesplanning.shared.exception.PdfTextExtractionException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class PdfTextExtractor {

    public String extractText(MultipartFile file) {
        validatePdf(file);

        try (InputStream inputStream = file.getInputStream();
             PDDocument document = Loader.loadPDF(inputStream.readAllBytes())) {

            if (document.isEncrypted()) {
                throw new PdfTextExtractionException("O PDF está protegido por senha ou criptografia.");
            }

            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            if (text == null || text.isBlank()) {
                throw new PdfTextExtractionException(
                        "Não foi possível extrair texto do PDF. Ele pode estar escaneado como imagem."
                );
            }

            return text;
        } catch (PdfTextExtractionException e) {
            throw e;
        } catch (IOException e) {
            throw new PdfTextExtractionException("Falha ao abrir ou processar o PDF.");
        }
    }

    private void validatePdf(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new PdfTextExtractionException("Arquivo PDF não informado.");
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.toLowerCase().endsWith(".pdf")) {
            throw new PdfTextExtractionException("O arquivo enviado precisa ter extensão .pdf.");
        }
    }
}