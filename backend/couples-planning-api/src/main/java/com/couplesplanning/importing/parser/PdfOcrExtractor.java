package com.couplesplanning.importing.parser;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;

@Service
public class PdfOcrExtractor {

    public String extractText(PDDocument document) {
        try {
            ITesseract tesseract = new Tesseract();
            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
            tesseract.setLanguage("por");

            PDFRenderer renderer = new PDFRenderer(document);

            // ajustar conforme ambiente
            tesseract.setLanguage("por");
            // tesseract.setDatapath("/opt/tessdata");

            StringBuilder fullText = new StringBuilder();

            for (int page = 0; page < document.getNumberOfPages(); page++) {
                BufferedImage image = renderer.renderImageWithDPI(page, 300);

                String pageText = tesseract.doOCR(image);
                fullText.append(pageText).append("\n");
            }

            return fullText.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao executar OCR no PDF", e);
        }
    }
}
