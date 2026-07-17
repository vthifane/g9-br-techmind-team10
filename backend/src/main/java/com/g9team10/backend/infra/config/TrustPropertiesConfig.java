package com.g9team10.backend.infra.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class TrustPropertiesConfig {

    @Value("${content.trust.low-threshold}")
    private double lowThreshold;

    public boolean isLowConfidence(Double probability) {
        return probability != null && probability < lowThreshold;
    }
}
