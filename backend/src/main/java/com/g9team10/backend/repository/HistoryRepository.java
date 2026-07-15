package com.g9team10.backend.repository;

import com.g9team10.backend.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    @Query("""
            select h from History h join fetch h.content
            where h.accessedAt = (
                select max(h2.accessedAt) from History h2
                where h2.user.id = h.user.id and h2.content.id = h.content.id
                )
                and h.user.id = :userId
                order by h.accessedAt DESC
            """)
    List<History> findRecentByUser(Long userId);
}