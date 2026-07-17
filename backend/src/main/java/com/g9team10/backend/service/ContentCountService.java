package com.g9team10.backend.service;

import com.g9team10.backend.dto.ContentCountDTO;
import com.g9team10.backend.repository.ContentCountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentCountService {
    private final ContentCountRepository repository;

    public List<ContentCountDTO> findAll() {
        return repository.countByCategory();
    }
}
