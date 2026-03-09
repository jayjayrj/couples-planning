package com.couplesplanning.projection;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/projection")
@RequiredArgsConstructor
public class ProjectionController {

    private final ProjectionService projectionService;

    @GetMapping
    public ProjectionResponse getProjection(
            @RequestParam(defaultValue = "12") int months
    ) {
        if (months < 1 || months > 60) {
            throw new IllegalArgumentException("months must be between 1 and 60");
        }

        return projectionService.calculateProjection(months);
    }
}