package com.couplesplanning.goal;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoalResponse create(@RequestBody @Valid CreateGoalRequest request) {
        return goalService.create(request);
    }

    @GetMapping
    public List<GoalResponse> list() {
        return goalService.list();
    }

    @PatchMapping("/{id}")
    public GoalResponse update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateGoalRequest request
    ) {
        return goalService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        goalService.delete(id);
    }
}