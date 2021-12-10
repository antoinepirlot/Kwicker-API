DROP SCHEMA IF EXISTS kwicker CASCADE;

CREATE SCHEMA kwicker;
SET TIMEZONE='Europe/Brussels';

CREATE TABLE kwicker.users
(
    id_user   SERIAL PRIMARY KEY,
    forename  VARCHAR(50)  NOT NULL CHECK (forename <> ''),
    lastname  VARCHAR(50)  NOT NULL CHECK (lastname <> ''),
    email     VARCHAR(100) NOT NULL CHECK (email <> '') UNIQUE,
    username  VARCHAR(100) NOT NULL CHECK (username <> '') UNIQUE,
    image     VARCHAR(100) CHECK (image <> ''),
    password  VARCHAR(100) NOT NULL CHECK (password <> ''),
    is_active BOOLEAN      NOT NULL DEFAULT TRUE,
    is_admin  BOOLEAN      NOT NULL DEFAULT FALSE,
    biography VARCHAR(500) NULL,
    date_creation DATE NOT NULL DEFAULT NOW()
);

CREATE TABLE kwicker.posts
(
    id_post     SERIAL PRIMARY KEY,
    id_user     INTEGER      NOT NULL,
    image       VARCHAR(100) CHECK (image <> ''),
    message     VARCHAR(300) NOT NULL CHECK (message <> ''),
    parent_post INTEGER,
    is_removed  BOOLEAN NOT NULL DEFAULT FALSE,
    date_creation DATE NOT NULL DEFAULT NOW(),
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

INSERT INTO kwicker.users (forename, lastname, email, username, password) VALUES ('Antoine', 'Pirlot', 'antoine.pirlot@vinci.be', 'lepirelot' ,'mdp');
INSERT INTO kwicker.users (forename, lastname, email, username, password) VALUES ('Denis', 'Victor', 'victor.denis@vinci.be', 'vivi','mdp');
INSERT INTO kwicker.users (forename, lastname, email, username, password) VALUES ('Soulaymane', 'Gharroudi', 'soulaymane.gharroudi@vinci.be', 'souli','mdp');
INSERT INTO kwicker.users (forename, lastname, email, username, password) VALUES ('François', 'Bardijn', 'francois.bardijn@vinci.be', 'françois', 'mdp');

INSERT INTO kwicker.posts (id_user, message) VALUES (1, 'Hello World!');
INSERT INTO kwicker.posts (id_user, message) VALUES (1, 'Bye World!');
INSERT INTO kwicker.posts (id_user, message) VALUES (2, 'Je m''appelle Victor et j''aime les présentations orale en anglais');
INSERT INTO kwicker.posts (id_user, message) VALUES (2, 'J''aime ma moto');
INSERT INTO kwicker.posts (id_user, message) VALUES (3, 'Je lis des livres dans le métro et je rate l''arrêt :p');
INSERT INTO kwicker.posts (id_user, message) VALUES (3, 'Ça bosse dure ici.');
INSERT INTO kwicker.posts (id_user, message) VALUES (4, 'JS le sang');
INSERT INTO kwicker.posts (id_user, message) VALUES (4, 'Je m''appelle François');