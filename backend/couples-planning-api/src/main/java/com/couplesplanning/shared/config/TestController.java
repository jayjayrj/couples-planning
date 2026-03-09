package com.couplesplanning.shared.config;

import com.couplesplanning.shared.exception.BusinessException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test-error")
    public String testError() {
        throw new BusinessException("Erro de negócio de teste");
    }
}