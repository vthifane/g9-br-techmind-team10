SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM content_tag;
DELETE FROM content;
DELETE FROM tag;

SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE tag AUTO_INCREMENT = 1;
ALTER TABLE content AUTO_INCREMENT = 1;

INSERT INTO tag (id, name)
VALUES
       (1, 'backend'),
       (2, 'java'),
       (3, 'spring-boot'),
       (4, 'api-rest'),
       (5, 'dto'),
       (6, 'validation'),

       (7, 'frontend'),
       (8, 'html'),
       (9, 'css'),
       (10, 'javascript'),
       (11, 'react'),
       (12, 'responsive-design'),

       (13, 'data-science'),
       (14, 'python'),
       (15, 'pandas'),
       (16, 'scikit-learn'),
       (17, 'tf-idf'),
       (18, 'machine-learning'),

       (19, 'cloud'),
       (20, 'oci'),
       (21, 'compute'),
       (22, 'docker'),
       (23, 'object-storage'),
       (24, 'terraform'),

       (25, 'database'),
       (26, 'sql'),
       (27, 'nosql'),
       (28, 'h2'),
       (29, 'jpa'),
       (30, 'repository'),

       (31, 'security'),
       (32, 'authentication'),
       (33, 'authorization'),
       (34, 'jwt'),
       (35, 'token'),
       (36, 'spring-security');

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES
       (1, 'Introdução ao Spring Boot',
        'Conceitos básicos para criação de APIs REST com Java e Spring Boot.',
        'backend', 0.890, '2026-06-01 09:15:00'),

       (2, 'Validação de dados com Bean Validation',
        'Uso de anotações como @NotBlank e @Valid para validar entradas da API.',
        'backend', 0.840, '2026-06-02 10:30:00'),

       (3, 'Componentização com React',
        'Uso de componentes, estado e eventos para construir interfaces reutilizáveis.',
        'frontend', 0.910, '2026-06-03 09:00:00'),

       (4, 'Design responsivo com CSS Grid',
        'Organização de telas adaptáveis usando CSS, grid, media queries e espaçamentos fluidos.',
        'frontend', 0.870, '2026-06-04 13:10:00'),

       (5, 'TF-IDF na classificação de textos',
        'Representação numérica de textos para modelos de machine learning com Python.',
        'data-science', 0.880, '2026-06-05 15:25:00'),

       (6, 'Classificação com Scikit-Learn',
        'Treinamento de modelos com pandas, scikit-learn e regressão logística.',
        'data-science', 0.860, '2026-06-06 08:40:00'),

       (7, 'Object Storage na OCI',
        'Armazenamento de arquivos, modelos e resultados JSON em buckets da OCI.',
        'cloud', 0.860, '2026-06-07 10:00:00'),

       (8, 'Deploy com Docker em OCI Compute',
        'Uso de uma máquina virtual para hospedar frontend, backend e serviços auxiliares com Docker.',
        'cloud', 0.900, '2026-06-08 09:50:00'),

       (9, 'Consultas SQL com filtros',
        'Uso de SELECT, WHERE e ORDER BY para recuperar dados específicos.',
        'database', 0.840, '2026-06-09 10:00:00'),

       (10, 'Persistência com JPA',
        'Mapeamento de entidades Java para tabelas e uso de repositories.',
        'database', 0.830, '2026-06-10 10:00:00'),

       (11, 'Autenticação com JWT',
        'Uso de token JWT para autenticar usuários em uma API Spring Security.',
        'security', 0.820, '2026-06-11 11:00:00'),

       (12, 'Autorização em APIs',
        'Controle de acesso a endpoints protegidos com regras de autorização.',
        'security', 0.810, '2026-06-12 12:00:00');

INSERT INTO content_tag (content_id, tag_id)
VALUES
       (1, 1),
       (1, 2),
       (1, 3),
       (1, 4),

       (2, 1),
       (2, 2),
       (2, 5),
       (2, 6),

       (3, 7),
       (3, 10),
       (3, 11),

       (4, 7),
       (4, 9),
       (4, 12),

       (5, 13),
       (5, 14),
       (5, 17),
       (5, 18),

       (6, 13),
       (6, 14),
       (6, 15),
       (6, 16),

       (7, 19),
       (7, 20),
       (7, 23),

       (8, 19),
       (8, 20),
       (8, 21),
       (8, 22),

       (9, 25),
       (9, 26),

       (10, 25),
       (10, 2),
       (10, 29),
       (10, 30),

       (11, 31),
       (11, 32),
       (11, 34),
       (11, 35),
       (11, 36),

       (12, 31),
       (12, 33),
       (12, 36);