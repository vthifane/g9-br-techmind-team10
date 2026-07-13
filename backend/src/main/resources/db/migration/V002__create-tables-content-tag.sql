CREATE TABLE content
(
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    title           VARCHAR(200)  NOT NULL,
    text            TEXT          NOT NULL,
    category        VARCHAR(50)   NOT NULL,
    probability     DECIMAL(4, 3) NOT NULL,
    date_processing TIMESTAMP     NOT NULL,

    PRIMARY KEY (id)
);

CREATE TABLE tag
(
    id   BIGINT       NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,

    PRIMARY KEY (id),
    CONSTRAINT uk_tag_valor UNIQUE (name)
);

CREATE TABLE content_tag
(
    content_id BIGINT NOT NULL,
    tag_id     BIGINT NOT NULL,

    PRIMARY KEY (content_id, tag_id),
    CONSTRAINT fk_content_tag_content
        FOREIGN KEY (content_id) REFERENCES content (id) ON DELETE CASCADE,
    CONSTRAINT fk_content_tag_tag
        FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE
);