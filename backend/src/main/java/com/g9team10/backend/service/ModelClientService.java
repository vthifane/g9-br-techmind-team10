package com.g9team10.backend.service;

import com.g9team10.backend.dto.ModelPredictRequestDTO;
import com.g9team10.backend.dto.ModelPredictResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class ModelClientService {

    private final WebClient webClient;

    public ModelPredictResponseDTO predict(ModelPredictRequestDTO request) {
        try {
            return webClient.post()
                    .uri("/predict")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(ModelPredictResponseDTO.class)
                    .retryWhen(Retry.backoff(1, Duration.ofSeconds(2)))
                    .block();
        } catch (Exception e) {
            System.out.println(e.getClass().getName());
            return null;
        }
    }
}
