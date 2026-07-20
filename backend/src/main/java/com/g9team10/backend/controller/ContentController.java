package com.g9team10.backend.controller;

import com.g9team10.backend.dto.ContentDetailDTO;
import com.g9team10.backend.dto.ContentRequestDTO;
import com.g9team10.backend.dto.ContentResponseDTO;
import com.g9team10.backend.infra.config.TrustPropertiesConfig;
import com.g9team10.backend.model.User;
import com.g9team10.backend.service.ContentService;
import com.g9team10.backend.service.HistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/content")
@Tag(name = "Análise de Conteúdo", description = "Endpoint responsável pela classificação de conteúdos")
public class ContentController {

    private final ContentService contentService;
    private final HistoryService historyService;
    private final TrustPropertiesConfig trustProperties;

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
    public ResponseEntity<ContentResponseDTO> analysis(@RequestBody @Valid ContentRequestDTO request) {
        return ResponseEntity.ok(contentService.analysis(request));
    }

    @Operation(
            summary = "Acessar conteúdo",
            description = "Acessa conteúdo analisado e salvo no banco de dados."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Conteúdo encontrado",
            content = @Content(schema = @Schema(implementation = ContentResponseDTO.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "Conteúdo não encontrado"
    )
    @GetMapping("/{id}")
    public ResponseEntity<ContentDetailDTO> getContent(@PathVariable Long id, @AuthenticationPrincipal User user) {
        var content = contentService.find(id);
        historyService.registerView(user, id);
        return ResponseEntity.ok(ContentDetailDTO.fromEntity(content, trustProperties));
    }

    @PutMapping("/{id}/tags")
    public ResponseEntity<ContentDetailDTO> fixTags(
            @PathVariable Long id,
            @Valid @RequestBody CorrectionTagsRequestDTO request
    ) {
        var content = contentService.fixTags(id, request.tags());
        return ResponseEntity.ok(ContentDetailDTO.fromEntity(content, trustProperties));
    }

    @PatchMapping("/{id}/tags/confirm")
    public ResponseEntity<ContentDetailDTO> confirmTags(@PathVariable Long id) {
        var content = contentService.confirmTags(id);
        return ResponseEntity.ok(ContentDetailDTO.fromEntity(content, trustProperties));
    }
}