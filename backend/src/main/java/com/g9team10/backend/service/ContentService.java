package com.g9team10.backend.service;

import com.g9team10.backend.dto.ContentRequestDTO;
import com.g9team10.backend.dto.ContentResponseDTO;
import com.g9team10.backend.dto.ModelPredictRequestDTO;
import com.g9team10.backend.dto.ModelPredictResponseDTO;
import com.g9team10.backend.exception.ContentNotFoundException;
import com.g9team10.backend.model.Content;
import com.g9team10.backend.model.Tag;
import com.g9team10.backend.repository.ContentRepository;
import com.g9team10.backend.repository.TagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ContentService {

    private final ModelPredictionService modelPredictionService;
    private final TagRepository tagRepository;
    private final ContentRepository contentRepository;

    @Transactional
    public ContentResponseDTO analysis(ContentRequestDTO request) {
        ModelPredictRequestDTO predictRequest = new ModelPredictRequestDTO(request.title(), request.text());
        ModelPredictResponseDTO response = modelPredictionService.predict(predictRequest);

        Content content = new Content(request, response);
        List<String> tags = response.tags();

        if (tags != null) {
            for (String grossValue : tags) {
                String normalizedValue = normalizeTagKey(grossValue);

                Tag tag = findOrCreateTag(normalizedValue);

                content.addTag(tag);
            }
        }

        contentRepository.save(content);

        return new ContentResponseDTO(
                response.category(),
                response.probability(),
                response.tags()
        );
    }

    public Content find(Long contentId) {
        return contentRepository.findById(contentId)
                .orElseThrow(() -> new ContentNotFoundException(contentId));
    }

    @Transactional
    public Content fixTags(Long id, List<String> fixedTags) {
        Content content = find(id);

        Set<Tag> normalizeTags = fixedTags.stream()
                .map(this::normalizeTagKey)
                .filter(tag -> !tag.isBlank())
                .distinct()
                .map(this::findOrCreateTag)
                .collect(Collectors.toSet());

        content.getTags().clear();
        content.getTags().addAll(normalizeTags);
        content.review();

        return contentRepository.save(content);
    }

    @Transactional
    public Content confirmTags(Long id) {
        Content content = find(id);
        content.review();

        return contentRepository.save(content);
    }

    private Tag findOrCreateTag(String normalizedValue) {
        return tagRepository.findByName(normalizedValue)
                .orElseGet(() -> tagRepository.save(new Tag(normalizedValue)));
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