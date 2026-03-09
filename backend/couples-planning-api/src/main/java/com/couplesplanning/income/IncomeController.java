package com.couplesplanning.income;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incomes")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @PostMapping
    public IncomeResponse create(@RequestBody @Valid CreateIncomeRequest request) {
        return incomeService.create(request);
    }

    @GetMapping
    public List<IncomeResponse> list() {
        return incomeService.list();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        incomeService.delete(id);
    }
}