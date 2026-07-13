package com.g9team10.backend.service;

import com.g9team10.backend.dto.ContentRequestDTO;
import com.g9team10.backend.dto.ContentResponseDTO;
import com.g9team10.backend.dto.ModelPredictRequestDTO;
import com.g9team10.backend.dto.ModelPredictResponseDTO;
import com.g9team10.backend.model.Content;
import com.g9team10.backend.model.Tag;
import com.g9team10.backend.repository.ContentRepository;
import com.g9team10.backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ContentService {

    private final ModelPredictionService modelPredictionService;
    private final TagRepository tagRepository;
    private final ContentRepository contentRepository;

    public ContentResponseDTO analysis(ContentRequestDTO request) {
        ModelPredictRequestDTO predictRequest = new ModelPredictRequestDTO(request.title(), request.text());
        ModelPredictResponseDTO response = modelPredictionService.predict(predictRequest);

        Content content = new Content(request, response);
        List<String> tags = response.tags();
        if (tags != null) {
            for (String grossValue : tags) {
                String normalizedValue = grossValue.trim().toLowerCase();

                Tag tag = tagRepository.findByName(normalizedValue)
                        .orElseGet(() -> tagRepository.save(new Tag(normalizedValue)));

                content.addTag(tag);
            }
        }

        contentRepository.save(content);

        return new ContentResponseDTO(response.category(),
                response.probability(),
                response.tags());
    }
}
