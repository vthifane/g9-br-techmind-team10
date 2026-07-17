package com.g9team10.backend.repository;

import com.g9team10.backend.dto.ContentCountDTO;
import com.g9team10.backend.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContentCountRepository extends JpaRepository<Content, Long> {

    @Query("""
        SELECT new com.g9team10.backend.dto.ContentCountDTO(
            c.category,
            COUNT(c)
        )
        FROM Content c
        GROUP BY c.category
        ORDER BY c.category
    """)
    List<ContentCountDTO> countByCategory();

}
