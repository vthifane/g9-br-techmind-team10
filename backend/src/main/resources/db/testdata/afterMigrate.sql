DELETE FROM content_tag;
DELETE FROM content;
DELETE FROM tag;

INSERT INTO tag (id, name)
VALUES (1, 'backend');

INSERT INTO tag (id, name)
VALUES (2, 'java');

INSERT INTO tag (id, name)
VALUES (3, 'spring-boot');

INSERT INTO tag (id, name)
VALUES (4, 'api-rest');

INSERT INTO tag (id, name)
VALUES (5, 'dto');

INSERT INTO tag (id, name)
VALUES (6, 'validation');

INSERT INTO tag (id, name)
VALUES (7, 'frontend');

INSERT INTO tag (id, name)
VALUES (8, 'html');

INSERT INTO tag (id, name)
VALUES (9, 'css');

INSERT INTO tag (id, name)
VALUES (10, 'javascript');

INSERT INTO tag (id, name)
VALUES (11, 'react');

INSERT INTO tag (id, name)
VALUES (12, 'responsive-design');

INSERT INTO tag (id, name)
VALUES (13, 'data-science');

INSERT INTO tag (id, name)
VALUES (14, 'python');

INSERT INTO tag (id, name)
VALUES (15, 'pandas');

INSERT INTO tag (id, name)
VALUES (16, 'scikit-learn');

INSERT INTO tag (id, name)
VALUES (17, 'tf-idf');

INSERT INTO tag (id, name)
VALUES (18, 'machine-learning');

INSERT INTO tag (id, name)
VALUES (19, 'cloud');

INSERT INTO tag (id, name)
VALUES (20, 'oci');

INSERT INTO tag (id, name)
VALUES (21, 'compute');

INSERT INTO tag (id, name)
VALUES (22, 'docker');

INSERT INTO tag (id, name)
VALUES (23, 'object-storage');

INSERT INTO tag (id, name)
VALUES (24, 'terraform');

INSERT INTO tag (id, name)
VALUES (25, 'database');

INSERT INTO tag (id, name)
VALUES (26, 'sql');

INSERT INTO tag (id, name)
VALUES (27, 'nosql');

INSERT INTO tag (id, name)
VALUES (28, 'h2');

INSERT INTO tag (id, name)
VALUES (29, 'jpa');

INSERT INTO tag (id, name)
VALUES (30, 'repository');

INSERT INTO tag (id, name)
VALUES (31, 'security');

INSERT INTO tag (id, name)
VALUES (32, 'authentication');

INSERT INTO tag (id, name)
VALUES (33, 'authorization');

INSERT INTO tag (id, name)
VALUES (34, 'jwt');

INSERT INTO tag (id, name)
VALUES (35, 'token');

INSERT INTO tag (id, name)
VALUES (36, 'spring-security');

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    1,
    'Introdução ao Spring Boot',
    'Conceitos básicos para criação de APIs REST com Java e Spring Boot.',
    'backend',
    0.890,
    TIMESTAMP '2026-06-01 09:15:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    2,
    'Validação de dados com Bean Validation',
    'Uso de anotações como @NotBlank e @Valid para validar entradas da API.',
    'backend',
    0.840,
    TIMESTAMP '2026-06-02 10:30:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    3,
    'Componentização com React',
    'Uso de componentes, estado e eventos para construir interfaces reutilizáveis.',
    'frontend',
    0.910,
    TIMESTAMP '2026-06-03 09:00:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    4,
    'Design responsivo com CSS Grid',
    'Organização de telas adaptáveis usando CSS, grid, media queries e espaçamentos fluidos.',
    'frontend',
    0.870,
    TIMESTAMP '2026-06-04 13:10:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    5,
    'TF-IDF na classificação de textos',
    'Representação numérica de textos para modelos de machine learning com Python.',
    'data-science',
    0.880,
    TIMESTAMP '2026-06-05 15:25:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    6,
    'Classificação com Scikit-Learn',
    'Treinamento de modelos com pandas, scikit-learn e regressão logística.',
    'data-science',
    0.860,
    TIMESTAMP '2026-06-06 08:40:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    7,
    'Object Storage na OCI',
    'Armazenamento de arquivos, modelos e resultados JSON em buckets da OCI.',
    'cloud',
    0.860,
    TIMESTAMP '2026-06-07 10:00:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    8,
    'Deploy com Docker em OCI Compute',
    'Uso de uma máquina virtual para hospedar frontend, backend e serviços auxiliares com Docker.',
    'cloud',
    0.900,
    TIMESTAMP '2026-06-08 09:50:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    9,
    'Consultas SQL com filtros',
    'Uso de SELECT, WHERE e ORDER BY para recuperar dados específicos.',
    'database',
    0.840,
    TIMESTAMP '2026-06-09 10:00:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    10,
    'Persistência com JPA',
    'Mapeamento de entidades Java para tabelas e uso de repositories.',
    'database',
    0.830,
    TIMESTAMP '2026-06-10 10:00:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    11,
    'Autenticação com JWT',
    'Uso de token JWT para autenticar usuários em uma API Spring Security.',
    'security',
    0.820,
    TIMESTAMP '2026-06-11 11:00:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
    12,
    'Autorização em APIs',
    'Controle de acesso a endpoints protegidos com regras de autorização.',
    'security',
    0.810,
    TIMESTAMP '2026-06-12 12:00:00'
);

INSERT INTO content (id, title, text, category, probability, date_processing)
VALUES (
           13,
           'Introdução ao Docker Compose',
           'Visão geral sobre como orquestrar múltiplos containers utilizando Docker Compose.',
           'cloud',
           0.215,
           TIMESTAMP '2026-06-13 09:30:00'
       );

INSERT INTO content_tag (content_id, tag_id) VALUES (1, 1);
INSERT INTO content_tag (content_id, tag_id) VALUES (1, 2);
INSERT INTO content_tag (content_id, tag_id) VALUES (1, 3);
INSERT INTO content_tag (content_id, tag_id) VALUES (1, 4);

INSERT INTO content_tag (content_id, tag_id) VALUES (2, 1);
INSERT INTO content_tag (content_id, tag_id) VALUES (2, 2);
INSERT INTO content_tag (content_id, tag_id) VALUES (2, 5);
INSERT INTO content_tag (content_id, tag_id) VALUES (2, 6);

INSERT INTO content_tag (content_id, tag_id) VALUES (3, 7);
INSERT INTO content_tag (content_id, tag_id) VALUES (3, 10);
INSERT INTO content_tag (content_id, tag_id) VALUES (3, 11);

INSERT INTO content_tag (content_id, tag_id) VALUES (4, 7);
INSERT INTO content_tag (content_id, tag_id) VALUES (4, 9);
INSERT INTO content_tag (content_id, tag_id) VALUES (4, 12);

INSERT INTO content_tag (content_id, tag_id) VALUES (5, 13);
INSERT INTO content_tag (content_id, tag_id) VALUES (5, 14);
INSERT INTO content_tag (content_id, tag_id) VALUES (5, 17);
INSERT INTO content_tag (content_id, tag_id) VALUES (5, 18);

INSERT INTO content_tag (content_id, tag_id) VALUES (6, 13);
INSERT INTO content_tag (content_id, tag_id) VALUES (6, 14);
INSERT INTO content_tag (content_id, tag_id) VALUES (6, 15);
INSERT INTO content_tag (content_id, tag_id) VALUES (6, 16);

INSERT INTO content_tag (content_id, tag_id) VALUES (7, 19);
INSERT INTO content_tag (content_id, tag_id) VALUES (7, 20);
INSERT INTO content_tag (content_id, tag_id) VALUES (7, 23);

INSERT INTO content_tag (content_id, tag_id) VALUES (8, 19);
INSERT INTO content_tag (content_id, tag_id) VALUES (8, 20);
INSERT INTO content_tag (content_id, tag_id) VALUES (8, 21);
INSERT INTO content_tag (content_id, tag_id) VALUES (8, 22);

INSERT INTO content_tag (content_id, tag_id) VALUES (9, 25);
INSERT INTO content_tag (content_id, tag_id) VALUES (9, 26);

INSERT INTO content_tag (content_id, tag_id) VALUES (10, 25);
INSERT INTO content_tag (content_id, tag_id) VALUES (10, 2);
INSERT INTO content_tag (content_id, tag_id) VALUES (10, 29);
INSERT INTO content_tag (content_id, tag_id) VALUES (10, 30);

INSERT INTO content_tag (content_id, tag_id) VALUES (11, 31);
INSERT INTO content_tag (content_id, tag_id) VALUES (11, 32);
INSERT INTO content_tag (content_id, tag_id) VALUES (11, 34);
INSERT INTO content_tag (content_id, tag_id) VALUES (11, 35);
INSERT INTO content_tag (content_id, tag_id) VALUES (11, 36);

INSERT INTO content_tag (content_id, tag_id) VALUES (12, 31);
INSERT INTO content_tag (content_id, tag_id) VALUES (12, 33);
INSERT INTO content_tag (content_id, tag_id) VALUES (12, 36);

INSERT INTO content_tag (content_id, tag_id) VALUES (13, 19);
INSERT INTO content_tag (content_id, tag_id) VALUES (13, 22);