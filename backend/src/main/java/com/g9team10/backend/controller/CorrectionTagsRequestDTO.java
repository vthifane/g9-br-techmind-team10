package com.g9team10.backend.controller;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CorrectionTagsRequestDTO(@NotEmpty List<@NotBlank String> tags) {
}
