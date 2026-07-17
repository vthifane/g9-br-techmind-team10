package com.g9team10.backend.controller;

import com.g9team10.backend.dto.ContentCountDTO;
import com.g9team10.backend.service.ContentCountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/content/count")
@RequiredArgsConstructor
@Tag(name = "Contador de Conteúdo", description = "Endpoint responsável pela contagem de conteúdos")
public class ContentCountController {

    private final ContentCountService service;

    @GetMapping
    public ResponseEntity<List<ContentCountDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
}
