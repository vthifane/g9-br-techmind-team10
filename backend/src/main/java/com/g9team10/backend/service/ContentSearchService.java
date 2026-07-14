package com.g9team10.backend.service;

import com.g9team10.backend.dto.ContentSearchResponseDTO;
import com.g9team10.backend.model.Content;
import com.g9team10.backend.model.Tag;
import com.g9team10.backend.repository.ContentSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ContentSearchService {

    private final ContentSearchRepository contentSearchRepository;

    public List<ContentSearchResponseDTO> searchByTags(List<String> tags) {
        List<String> normalized = tags.stream()
                .map(this::normalizeTagKey)
                .filter(tag -> !tag.isBlank())
                .distinct()
                .toList();

        List<Content> results = contentSearchRepository.findByAllTagNames(normalized, normalized.size());

        return results.stream()
                .map(content -> new ContentSearchResponseDTO(
                        content.getId(),
                        content.getTitle(),
                        content.getText(),
                        content.getCategory(),
                        content.getProbability(),
                        content.getTags().stream().map(Tag::getName).toList()
                ))
                .toList();
    }

    private String normalizeTagKey(String value) {
        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }
}