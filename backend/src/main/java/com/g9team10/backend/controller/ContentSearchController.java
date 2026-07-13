package com.g9team10.backend.controller;

import com.g9team10.backend.dto.ContentSearchResponseDTO;
import com.g9team10.backend.service.ContentSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class ContentSearchController {

    private final ContentSearchService contentSearchService;

    @GetMapping("/content/search")
    public List<ContentSearchResponseDTO> search(@RequestParam List<String> tags) {
        return contentSearchService.searchByTags(tags);
    }
}