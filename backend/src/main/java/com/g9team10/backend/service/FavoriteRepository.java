package com.g9team10.backend.service;

import com.g9team10.backend.model.Favorite;
import com.g9team10.backend.model.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
}