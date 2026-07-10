package com.g9team10.backend.dto;

import java.util.List;

public record TagGroupResponseDTO(
        String key,
        String label,
        List<TagResponseDTO> subTags
) {
}
