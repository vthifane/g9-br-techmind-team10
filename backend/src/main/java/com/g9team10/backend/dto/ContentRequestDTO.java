package com.g9team10.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record ContentRequestDTO(@NotEmpty String title, @NotEmpty @Size(min = 10) String text) {
}
