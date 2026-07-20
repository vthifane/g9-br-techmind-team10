package com.g9team10.backend.infra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean(name = "modelWebClient")
    public WebClient webClient() {
        // alterar para url do serviço python ;
        String modelBaseUrl = "http://localhost:8081";
        return WebClient.builder()
                .baseUrl(modelBaseUrl)
                .build();
    }
    @Bean(name = "geminiWebClient")
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }
}
