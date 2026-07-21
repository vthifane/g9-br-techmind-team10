package com.g9team10.backend.repository;

import com.g9team10.backend.model.Content;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ContentSearchRepository extends JpaRepository<Content, Long> {

    @EntityGraph(attributePaths = "tags")
    @Query("""
        SELECT c FROM Content c
        WHERE c.id IN (
            SELECT c2.id FROM Content c2
            JOIN c2.tags t2
            WHERE t2.name IN :tags
            GROUP BY c2.id
            HAVING COUNT(DISTINCT t2.name) = :qtdTags
        )
        ORDER BY c.dateProcessing DESC
    """)
    List<Content> findByAllTagNames(@Param("tags") List<String> tags, @Param("qtdTags") long qtdTags);
}