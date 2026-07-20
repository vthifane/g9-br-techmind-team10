package com.g9team10.backend.model;

import com.g9team10.backend.dto.ContentRequestDTO;
import com.g9team10.backend.dto.ModelPredictResponseDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "content")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String text;
    private String category;
    private Double probability;
    private String level;
    @CreationTimestamp
    private OffsetDateTime dateProcessing;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "content_tag",
            joinColumns = @JoinColumn(name = "content_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    public Content(ContentRequestDTO contentRequest, ModelPredictResponseDTO modelPredictResponse) {
        this.title = contentRequest.title();
        this.text = contentRequest.text();
        this.category =  modelPredictResponse.category();
        this.probability = modelPredictResponse.probability();
    }

    public void addTag(Tag tag) {
        getTags().add(tag);
    }

    public void setLevel(String level) {
        this.level = level;
    }
}