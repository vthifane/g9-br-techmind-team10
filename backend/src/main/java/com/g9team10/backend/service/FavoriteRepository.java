package com.g9team10.backend.service;

import com.g9team10.backend.model.Favorite;
import com.g9team10.backend.model.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    @Query("select f from Favorite f join fetch f.content where f.user.id = :userId order by f.createdAt DESC")
    List<Favorite> findByUser(Long userId);
}