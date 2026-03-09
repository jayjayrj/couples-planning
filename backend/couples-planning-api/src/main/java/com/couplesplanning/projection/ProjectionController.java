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
        return projectionService.calculateProjection(months);
    }
}