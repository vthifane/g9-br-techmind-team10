package com.g9team10.backend.service;

import com.g9team10.backend.model.Content;
import com.g9team10.backend.model.Favorite;
import com.g9team10.backend.model.FavoriteId;
import com.g9team10.backend.model.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class FavoriteService {

    private final ContentService contentService;
    private final FavoriteRepository favoriteRepository;

    @Transactional
    public void check(User user, Long contentId) {
        Content content = contentService.find(contentId);

        FavoriteId id = new FavoriteId(user.getId(), content.getId());
        if (favoriteRepository.existsById(id)) {
            return;
        }

        favoriteRepository.save(new Favorite(user, content));
    }

    @Transactional
    public void uncheck(User user, Long contentId) {
        Content content = contentService.find(contentId);

        FavoriteId id = new FavoriteId(user.getId(), content.getId());
        favoriteRepository.deleteById(id);
    }

    public List<Content> list(Long userId) {
        return favoriteRepository.findByUser(userId)
                .stream()
                .map(Favorite::getContent)
                .toList();
    }
}
