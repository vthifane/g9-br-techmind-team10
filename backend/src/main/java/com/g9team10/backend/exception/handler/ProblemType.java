package com.g9team10.backend.exception.handler;

import lombok.Getter;

@Getter
public enum ProblemType {

    INVALID_REQUEST("/invalid-request", "Invalid request"),
    BUSINESS_ERROR("/business-error", "Business error"),
    INVALID_CREDENTIALS("/invalid-credentials", "Invalid credentials"),
    RESOURCE_NOT_FOUND("/resource-not-found", "Resource not found"),
    INCOMPREHENSIBLE_MESSAGE("/incomprehensible-message", "Incomprehensible message"),
    ;

    private final String title;
    private final String uri;

    ProblemType(String path, String title) {
        this.uri = "http://localhost:8080" + path; // trocar para link de prod do back-end
        this.title = title;
    }
}
