package com.couplesplanning.expense;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseResponse create(@RequestBody @Valid CreateExpenseRequest request) {
        return expenseService.create(request);
    }

    @GetMapping
    public List<ExpenseResponse> list(
            @RequestParam(required = false) ExpenseStatus status
    ) {
        return expenseService.list(status);
    }

    @PatchMapping("/{id}")
    public ExpenseResponse update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateExpenseRequest request
    ) {
        return expenseService.update(id, request);
    }

    @PatchMapping("/{id}/pay")
    public ExpenseResponse markAsPaid(@PathVariable Long id) {
        return expenseService.markAsPaid(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        expenseService.delete(id);
    }
}