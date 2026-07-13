package com.g9team10.backend.service;

import com.g9team10.backend.dto.ContentSearchResponseDTO;
import com.g9team10.backend.model.Content;
import com.g9team10.backend.model.Tag;
import com.g9team10.backend.repository.ContentSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ContentSearchService {

    private final ContentSearchRepository contentSearchRepository;

    public List<ContentSearchResponseDTO> searchByTags(List<String> tags) {
        List<String> normalized = tags.stream()
                .map(t -> t.trim().toLowerCase())
                .distinct()
                .toList();

        List<Content> resultados = contentSearchRepository.findByAllTagNames(normalized, normalized.size());

        return resultados.stream()
                .map(c -> new ContentSearchResponseDTO(
                        c.getId(),
                        c.getTitle(),
                        c.getText(),
                        c.getCategory(),
                        c.getProbability(),
                        c.getTags().stream().map(Tag::getName).toList()))
                .toList();
    }
}