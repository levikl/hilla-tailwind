CREATE TABLE IF NOT EXISTS media_rule (
    id               BIGSERIAL PRIMARY KEY,
    name             TEXT      NOT NULL,
    target_directory TEXT
);
