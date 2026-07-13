package com.g9team10.backend.repository;

import com.g9team10.backend.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentRepository extends JpaRepository<Content, Long> {
}