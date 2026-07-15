CREATE TABLE favorite
(
    user_id    NUMBER(19) NOT NULL,
    content_id NUMBER(19) NOT NULL,
    created_at TIMESTAMP  NOT NULL,

    PRIMARY KEY (user_id, content_id),
    CONSTRAINT fk_favorite_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_favorite_content FOREIGN KEY (content_id) REFERENCES content (id) ON DELETE CASCADE
)