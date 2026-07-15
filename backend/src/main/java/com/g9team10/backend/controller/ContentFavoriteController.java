package com.g9team10.backend.controller;

import com.g9team10.backend.model.User;
import com.g9team10.backend.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/content")
public class ContentFavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Void> checkFavorite(@PathVariable Long id, @AuthenticationPrincipal User user) {
        favoriteService.check(user, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<Void> uncheckFavorite(){
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/favorites")
    public ResponseEntity<Void> listFavorites(){
        return ResponseEntity.noContent().build();
    }
}
