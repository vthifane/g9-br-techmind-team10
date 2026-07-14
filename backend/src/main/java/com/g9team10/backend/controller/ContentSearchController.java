package com.g9team10.backend.controller;

import com.g9team10.backend.dto.ContentSearchResponseDTO;
import com.g9team10.backend.service.ContentSearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@Tag(name = "Busca de Conteúdo", description = "Endpoint responsável pela busca de conteúdos")
public class ContentSearchController {

    private final ContentSearchService contentSearchService;

    @Operation(
            summary = "Busca conteúdo",
            description = "Busca um conteúdo, já classificado, por meio das tags "
    )
    @ApiResponse(
            responseCode = "200",
            description = "Conteúdo foi achado com sucesso!"

    )
    @ApiResponse(
            responseCode = "400",
            description = "Erro ao buscar o conteúdo"

    )
    @GetMapping("/content/search")
    public List<ContentSearchResponseDTO> search(@RequestParam List<String> tags) {
        return contentSearchService.searchByTags(tags);
    }
}