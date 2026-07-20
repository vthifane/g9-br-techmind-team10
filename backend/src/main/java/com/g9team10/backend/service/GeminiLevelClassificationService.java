package com.g9team10.backend.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Classifica o nível de conhecimento (basico / intermediario / avancado) de um conteúdo.
 * <p>
 * Estratégia: tenta usar a API do Gemini (gratuita, ver application.properties) para uma
 * classificação mais "inteligente", que não depende só de palavras-chave literais.
 * Se a chave não estiver configurada, ou a chamada falhar por qualquer motivo (fora do ar,
 * timeout, rate limit), cai automaticamente para a heurística de palavra-chave — assim a
 * catalogação de conteúdo nunca quebra por causa de uma dependência externa.
 */
@Service
public class GeminiLevelClassificationService implements LevelClassificationService {

    private static final Set<String> VALID_LEVELS = Set.of("basico", "intermediario", "avancado");

    private final WebClient geminiWebClient;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-2.5-flash-lite}")
    private String model;

    public GeminiLevelClassificationService(@Qualifier("geminiWebClient") WebClient geminiWebClient) {
        this.geminiWebClient = geminiWebClient;
    }

    @Override
    public String classify(String title, String text) {
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                String aiLevel = askGemini(title, text);
                if (aiLevel != null && VALID_LEVELS.contains(aiLevel)) {
                    return aiLevel;
                }
                System.out.println("Gemini devolveu uma resposta inesperada, usando heurística de palavra-chave.");
            } catch (Exception e) {
                System.out.println("Falha ao chamar a API do Gemini (" + e.getClass().getSimpleName()
                        + "), usando heurística de palavra-chave.");
            }
        }

        return classifyByKeyword(title, text);
    }

    private String askGemini(String title, String text) {
        String prompt = """
                Classifique o nível de dificuldade do conteúdo técnico abaixo, pensando em quem for lê-lo.
                Responda com APENAS uma destas palavras, em minúsculo e sem pontuação: basico, intermediario ou avancado.

                Título: %s
                Texto: %s
                """.formatted(title, truncate(text, 2000));

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of("temperature", 0, "maxOutputTokens", 10)
        );

        Map<?, ?> response = geminiWebClient.post()
                .uri("/v1beta/models/{model}:generateContent", model)
                .header("x-goog-api-key", apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .retryWhen(Retry.backoff(1, Duration.ofSeconds(2)))
                .block();

        return extractLevel(response);
    }

    @SuppressWarnings("unchecked")
    private String extractLevel(Map<?, ?> response) {
        if (response == null) {
            return null;
        }

        var candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            return null;
        }

        var content = (Map<String, Object>) candidates.get(0).get("content");
        if (content == null) {
            return null;
        }

        var parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            return null;
        }

        Object rawText = parts.get(0).get("text");
        if (rawText == null) {
            return null;
        }

        return rawText.toString().trim().toLowerCase().replaceAll("[^a-z]", "");
    }

    private String classifyByKeyword(String title, String text) {
        String combined = (title + " " + text).toLowerCase();

        if (containsAny(combined, "iniciante", "básico", "basico", "introdução", "introducao",
                "primeiros passos", "do zero", "fundamentos")) {
            return "basico";
        }

        if (containsAny(combined, "avançado", "avancado", "arquitetura", "performance",
                "otimização", "otimizacao", "escalabilidade", "deep dive")) {
            return "avancado";
        }

        return "intermediario";
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String truncate(String text, int maxLength) {
        return text.length() <= maxLength ? text : text.substring(0, maxLength);
    }
}