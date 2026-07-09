package com.g9team10.backend.exception.handler;

import lombok.Getter;

@Getter
public enum ProblemType {

    INVALID_REQUEST("/invalid-request", "Invalid request");

    private final String title;
    private final String uri;

    ProblemType(String path, String title) {
        this.uri = "http://localhost:8080" + path; // trocar para link de prod do back-end
        this.title = title;
    }
}
