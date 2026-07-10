package com.g9team10.backend.service;

import com.g9team10.backend.dto.TagGroupResponseDTO;
import com.g9team10.backend.dto.TagResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagCatalogService {

    public List<TagGroupResponseDTO> getAcceptedTags(){
        return List.of(
                new TagGroupResponseDTO(
                        "backend",
                        "Backend",
                        List.of(
                                new TagResponseDTO("java","Java"),
                                new TagResponseDTO("spring-boot","Spring Boot"),
                                new TagResponseDTO("api-rest","API REST"),
                                new TagResponseDTO("dto","DTO"),
                                new TagResponseDTO("validation","Validation")
                        )
                ),
                new TagGroupResponseDTO(
                        "frontend",
                        "Frontend",
                        List.of(
                                new TagResponseDTO("html", "HTML"),
                                new TagResponseDTO("css", "CSS"),
                                new TagResponseDTO("javascript", "JavaScript"),
                                new TagResponseDTO("react", "React"),
                                new TagResponseDTO("responsive-design", "Responsive Design")
                        )
                ),
                new TagGroupResponseDTO(
                        "data-science",
                        "Data Science",
                        List.of(
                                new TagResponseDTO("python", "Python"),
                                new TagResponseDTO("pandas", "Pandas"),
                                new TagResponseDTO("scikit-learn", "Scikit-Learn"),
                                new TagResponseDTO("tf-idf", "TF-IDF"),
                                new TagResponseDTO("machine-learning", "Machine Learning")
                        )
                ),
                new TagGroupResponseDTO(
                        "cloud",
                        "Cloud",
                        List.of(
                                new TagResponseDTO("oci", "OCI"),
                                new TagResponseDTO("compute", "Compute"),
                                new TagResponseDTO("docker", "Docker"),
                                new TagResponseDTO("object-storage", "Object Storage"),
                                new TagResponseDTO("terraform", "Terraform")
                        )
                ),
                new TagGroupResponseDTO(
                        "database",
                        "Database",
                        List.of(
                                new TagResponseDTO("sql", "SQL"),
                                new TagResponseDTO("nosql", "NoSQL"),
                                new TagResponseDTO("h2", "H2"),
                                new TagResponseDTO("jpa", "JPA"),
                                new TagResponseDTO("repository", "Repository")
                        )
                ),
                new TagGroupResponseDTO(
                        "security",
                        "Security",
                        List.of(
                                new TagResponseDTO("authentication", "Authentication"),
                                new TagResponseDTO("authorization", "Authorization"),
                                new TagResponseDTO("jwt", "JWT"),
                                new TagResponseDTO("token", "Token"),
                                new TagResponseDTO("spring-security", "Spring Security")
                        )
                )
        );
    }
}
