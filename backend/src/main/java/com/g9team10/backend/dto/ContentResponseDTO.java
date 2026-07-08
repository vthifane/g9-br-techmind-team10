package com.g9team10.backend.dto;

import java.util.List;

public record ContentResponseDTO(String category, Double probability, List<String> additionalInformation) {
}
