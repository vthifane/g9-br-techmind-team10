package com.g9team10.backend.controller;

import com.g9team10.backend.dto.TagGroupResponseDTO;
import com.g9team10.backend.service.TagCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RequiredArgsConstructor
@RestController
public class TagController {

    private final TagCatalogService tagCatalogService;

    @GetMapping("/tags")
    public List<TagGroupResponseDTO> getAcceptedTags(){
        return tagCatalogService.getAcceptedTags();
    }
}
