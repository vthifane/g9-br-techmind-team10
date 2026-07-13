package com.g9team10.backend.controller;

import com.g9team10.backend.dto.ContentRequestDTO;
import com.g9team10.backend.dto.ContentResponseDTO;
import com.g9team10.backend.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/content")
@Tag(name = "Análise de Conteúdo", description = "Endpoint responsável pela classificação de conteúdos")
public class ContentController {

    private final ContentService contentService;

    @Operation(
            summary = "Analisar conteúdo",
            description = "Recebe um conteúdo, realiza a análise e retorna o resultado."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Conteúdo analisado com sucesso",
            content = @Content(schema = @Schema(implementation = ContentResponseDTO.class))
    )
    @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos enviados na requisição"
    )
    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public ContentResponseDTO analysis(@RequestBody @Valid ContentRequestDTO request) {
        return contentService.analysis(request);
    }


}
