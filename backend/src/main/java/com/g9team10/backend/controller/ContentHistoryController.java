package com.g9team10.backend.controller;

import com.g9team10.backend.dto.ContentSummaryDTO;
import com.g9team10.backend.model.Content;
import com.g9team10.backend.model.User;
import com.g9team10.backend.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/content/history")
public class ContentHistoryController {

    private final HistoryService historyService;

    @GetMapping
    public ResponseEntity<List<ContentSummaryDTO>> listFavorites(@AuthenticationPrincipal User user){
        List<Content> history = historyService.list(user.getId());
        List<ContentSummaryDTO> response = history.stream()
                .map(content -> new ContentSummaryDTO(content.getId(), content.getTitle(), content.getCategory(), content.getLevel()))
                .toList();

        return ResponseEntity.ok(response);
    }
}
