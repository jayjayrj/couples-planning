package com.couplesplanning.importing.parser;

import com.couplesplanning.importing.domain.DocumentType;
import org.springframework.stereotype.Component;

@Component
public class DocumentTypeDetector {

    public DocumentType detect(String extractedText) {
        if (extractedText == null || extractedText.isBlank()) {
            return DocumentType.UNKNOWN;
        }

        String normalized = extractedText.toLowerCase();

        boolean looksLikeCreditCardBill =
                normalized.contains("fatura") ||
                        normalized.contains("cartão") ||
                        normalized.contains("cartao") ||
                        normalized.contains("vencimento") ||
                        normalized.contains("limite disponível") ||
                        normalized.contains("limite disponivel") ||
                        normalized.contains("pagamento mínimo") ||
                        normalized.contains("pagamento minimo");

        if (looksLikeCreditCardBill) {
            return DocumentType.CREDIT_CARD_BILL;
        }

        boolean looksLikeBankStatement =
                normalized.contains("saldo anterior") ||
                        normalized.contains("saldo atual") ||
                        normalized.contains("extrato") ||
                        normalized.contains("agência") ||
                        normalized.contains("agencia") ||
                        normalized.contains("conta corrente");

        if (looksLikeBankStatement) {
            return DocumentType.BANK_STATEMENT;
        }

        return DocumentType.UNKNOWN;
    }
}