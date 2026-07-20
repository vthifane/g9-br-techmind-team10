package com.g9team10.backend.dto;

import java.util.List;

public record ContentSearchResponseDTO(
        Long id,
        String title,
        String text,
        String category,
        String level,
        Double probability,
        List<String> tags
) {
}