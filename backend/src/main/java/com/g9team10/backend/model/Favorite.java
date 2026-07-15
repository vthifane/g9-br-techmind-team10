package com.g9team10.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "favorite")
public class Favorite {

    @EmbeddedId
    private FavoriteId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    private User user;

    @ManyToOne
    @MapsId("contentId")
    private Content content;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    public Favorite(User user, Content content) {
        this.id = new FavoriteId(user.getId(), content.getId());
        this.user = user;
        this.content = content;
    }
}
