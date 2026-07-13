package com.g9team10.backend.controller;

import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/conteudos")
@Tag(name = "Conteúdos", description = "Endpoints para análise de textos")
public class ConteudoController {

    @Operation(
            summary = "Analisar texto",
            description = "Recebe um texto e retorna a categoria prevista, a probabilidade e informações adicionais."
    )
    @ApiResponse(
            responseCode = "200",
            description = "Texto analisado com sucesso",
            content = @Content(
                    examples = @ExampleObject(
                            value = """
                            {
                              "categoria": "Backend",
                              "probabilidade": 0.89,
                              "informacoes_adicionais": [
                                "Java",
                                "Spring Boot",
                                "API REST"
                              ]
                            }
                            """
                    )
            )
    )
    @ApiResponse(
            responseCode = "400",
            description = "Erro ao analisar texto"

    )
    @PostMapping
    public Map<String, Object> analisarTexto(@RequestBody Map<String, String> payload) {
        String texto = payload.get("texto");

        // MOCK: Por enquanto responde fixo. Depois chamamos o Python.
        return Map.of(
                "categoria", "Backend",
                "probabilidade", 0.89,
                "informacoes_adicionais", List.of("Java", "Spring Boot", "API REST")
        );
    }
}
