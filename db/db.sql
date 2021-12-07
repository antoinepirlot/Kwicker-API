DROP SCHEMA IF EXISTS kwicker CASCADE;

CREATE SCHEMA kwicker;

CREATE TABLE kwicker.users
(
    id_user   SERIAL PRIMARY KEY,
    forename  VARCHAR(50)  NOT NULL CHECK (forename <> ''),
    lastname  VARCHAR(50)  NOT NULL CHECK (lastname <> ''),
    email     VARCHAR(100) NOT NULL CHECK (email <> ''),
    image     VARCHAR(100) CHECK (image <> ''),
    password  VARCHAR(100) NOT NULL CHECK (password <> ''),
    is_active BOOLEAN      NOT NULL DEFAULT TRUE,
    is_admin  BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE kwicker.posts
(
    id_post     SERIAL PRIMARY KEY,
    id_user     INTEGER      NOT NULL,
    image       VARCHAR(100) CHECK (image <> ''),
    message     VARCHAR(300) NOT NULL CHECK (message <> ''),
    parent_post INTEGER,
    is_removed  BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_user) REFERENCES kwicker.users (id_user),
    FOREIGN KEY (parent_post) REFERENCES kwicker.posts (id_post)
);

CREATE TABLE kwicker.follows
(
    id_user_followed INTEGER REFERENCES kwicker.users (id_user) NOT NULL,
    id_user_follower INTEGER REFERENCES kwicker.users (id_user) NOT NULL,
    PRIMARY KEY (id_user_followed, id_user_follower)
);

CREATE TABLE kwicker.likes
(
    id_user INTEGER REFERENCES kwicker.users (id_user) NOT NULL,
    id_post INTEGER REFERENCES kwicker.posts (id_post) NOT NULL,
    PRIMARY KEY (id_user, id_post)
);

CREATE TABLE kwicker.reports
(
    id_post INTEGER      NOT NULL,
    id_user INTEGER      NOT NULL,
    message VARCHAR(300) NOT NULL CHECK ( message <> ' ' ),
    PRIMARY KEY (id_post, id_user),
    FOREIGN KEY (id_user) REFERENCES kwicker.users (id_user),
    FOREIGN KEY (id_post) REFERENCES kwicker.posts (id_post)

);

CREATE OR REPLACE VIEW kwicker.get_all_posts AS
    SELECT id_post,
           id_user,
           image,
           message,
           parent_post,
           is_removed
    FROM kwicker.posts;

CREATE OR REPLACE VIEW kwicker.get_all_users AS
    SELECT id_user,
           forename,
           lastname,
           email AS "email",
           image,
           is_active,
           is_admin
    FROM kwicker.users;