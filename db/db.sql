DROP SCHEMA IF EXISTS kwicker CASCADE;

CREATE SCHEMA kwicker;
SET TIMEZONE = 'Europe/Brussels';

CREATE TABLE kwicker.users
(
    user_id       SERIAL PRIMARY KEY,
    forename      VARCHAR(50)  NOT NULL CHECK (forename <> ''),
    lastname      VARCHAR(50)  NOT NULL CHECK (lastname <> ''),
    email         VARCHAR(100) NOT NULL CHECK (email <> '') UNIQUE,
    username      VARCHAR(100) NOT NULL CHECK (username <> '') UNIQUE,
    image         BYTEA        NULL CHECK (image <> ''),
    password      VARCHAR(60)  NOT NULL CHECK (password <> ''),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    is_admin      BOOLEAN      NOT NULL DEFAULT FALSE,
    biography     VARCHAR(500) NULL,
    creation_date TIMESTAMP    NOT NULL DEFAULT NOW()
--     date_creation DATE    NOT NULL DEFAULT NOW()
);

CREATE TABLE kwicker.posts
(
    post_id         SERIAL PRIMARY KEY,
    user_id         INTEGER      NOT NULL,
    image           VARCHAR(300) CHECK (image <> '' OR image IS NULL),
    message         VARCHAR(300) NOT NULL CHECK (message <> ''),
    parent_post     INTEGER,
    is_removed      BOOLEAN      NOT NULL DEFAULT FALSE,
    creation_date   TIMESTAMP    NOT NULL DEFAULT NOW(),
--     date_creation   TIMESTAMP    NOT NULL DEFAULT NOW(),
--     hour_creation TIME NOT NULL DEFAULT now(),
    number_of_likes INT          NOT NULL DEFAULT 0 CHECK (number_of_likes >= 0),
    FOREIGN KEY (user_id) REFERENCES kwicker.users (user_id),
    FOREIGN KEY (parent_post) REFERENCES kwicker.posts (post_id)
);

CREATE TABLE kwicker.follows
(
    user_followed_id INTEGER REFERENCES kwicker.users (user_id) NOT NULL,
    user_follower_id INTEGER REFERENCES kwicker.users (user_id) NOT NULL,
    PRIMARY KEY (user_followed_id, user_follower_id)
);Z

CREATE TABLE kwicker.likes
(
    user_id INTEGER REFERENCES kwicker.users (user_id) NOT NULL,
    post_id INTEGER REFERENCES kwicker.posts (post_id) NOT NULL,
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE kwicker.reports
(
    post_id INTEGER,
    user_id INTEGER,
    message VARCHAR(300) NOT NULL CHECK ( message <> '' ),
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (user_id) REFERENCES kwicker.users (user_id),
    FOREIGN KEY (post_id) REFERENCES kwicker.posts (post_id)

);

CREATE TABLE kwicker.messages
(
    message_id         SERIAL PRIMARY KEY,
    sender_id          INTEGER CHECK ( sender_id <> recipient_id ),
    recipient_id       INTEGER CHECK ( recipient_id <> sender_id ),
    message            TEXT NOT NULL CHECK ( message <> '' ),
    creation_date      TIMESTAMP    NOT NULL DEFAULT NOW(),
--     date_creation   TIMESTAMP    NOT NULL DEFAULT NOW(),
--     hour_creation TIME NOT NULL DEFAULT now(),
    FOREIGN KEY (sender_id) REFERENCES kwicker.users (user_id),
    FOREIGN KEY (recipient_id) REFERENCES kwicker.users (user_id)
);

CREATE OR REPLACE FUNCTION kwicker.add_like() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE kwicker.posts
    SET number_of_likes = number_of_likes + 1
    WHERE post_id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_like
    AFTER INSERT
    ON kwicker.likes
    FOR EACH ROW
EXECUTE PROCEDURE kwicker.add_like();

CREATE OR REPLACE FUNCTION kwicker.delete_like() RETURNS TRIGGER AS
$$
BEGIN
    UPDATE kwicker.posts
    SET number_of_likes = number_of_likes - 1
    WHERE post_id = OLD.post_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_like
    AFTER DELETE
    ON kwicker.likes
    FOR EACH ROW
EXECUTE PROCEDURE kwicker.delete_like();

INSERT INTO kwicker.users (forename, lastname, email, username, password)
VALUES ('Antoine', 'Pirlot', 'antoine.pirlot@vinci.be', 'lepirelot', 'mdp');
INSERT INTO kwicker.users (forename, lastname, email, username, password)
VALUES ('Denis', 'Victor', 'victor.denis@vinci.be', 'vivi',
        '$2b$10$OSF1BQzAii/ERK/lDBceDekhEZWK4af/HYSeQ3nvIpJB8EaUTPLsS');
INSERT INTO kwicker.users (forename, lastname, email, username, password)
VALUES ('Soulaymane', 'Gharroudi', 'soulaymane.gharroudi@vinci.be', 'souli', 'mdp');
INSERT INTO kwicker.users (forename, lastname, email, username, password)
VALUES ('François', 'Bardijn', 'francois.bardijn@vinci.be', 'françois',
        '$2b$10$o9QC86bWZINZ8bPzYHOBSOagWB5647r7ygm4Pg2xgvT6qE0qSYaCC');

INSERT INTO kwicker.posts (user_id, message)
VALUES (1, 'Hello World!');
INSERT INTO kwicker.posts (user_id, message)
VALUES (1, 'Bye World!');
INSERT INTO kwicker.posts (user_id, message)
VALUES (2, 'Je m''appelle Victor et j''aime les présentations orale en anglais');
INSERT INTO kwicker.posts (user_id, message)
VALUES (2, 'J''aime ma moto');
INSERT INTO kwicker.posts (user_id, message)
VALUES (3, 'Je lis des livres dans le métro et je rate l''arrêt :p');
INSERT INTO kwicker.posts (user_id, message)
VALUES (3, 'Ça bosse dure ici.');
INSERT INTO kwicker.posts (user_id, message)
VALUES (4, 'JS le sang');
INSERT INTO kwicker.posts (user_id, message)
VALUES (4, 'Je m''appelle François');

INSERT INTO kwicker.likes (user_id, post_id)
VALUES (1, 4);
INSERT INTO kwicker.likes (user_id, post_id)
VALUES (2, 8);
INSERT INTO kwicker.likes (user_id, post_id)
VALUES (3, 5);
INSERT INTO kwicker.likes (user_id, post_id)
VALUES (4, 8);

INSERT INTO kwicker.messages (sender_id, recipient_id, message)
VALUES (1, 3, 'Hello');
INSERT INTO kwicker.messages (sender_id, recipient_id, message)
VALUES (3, 1, 'Hello Comment ça va?');

INSERT INTO kwicker.messages (sender_id, recipient_id, message)
VALUES (1, 4, 'Soulaymane m''a répondu');

INSERT INTO kwicker.users (forename, lastname, email, username, password, biography, is_admin)
VALUES ('François', 'Bardijn', 'guillaume.feron@student.vinci.be', 'gf',
        '$2b$10$o9QC86bWZINZ8bPzYHOBSOagWB5647r7ygm4Pg2xgvT6qE0qSYaCC',
        'Famed singer-songwriter John Lennon founded the Beatles, a band that impacted the popular music scene like no other',
        true);


INSERT INTO kwicker.users (forename, lastname, email, username, password, biography)
VALUES ('Guillaume', 'Feron', 'francois.bardijn@student.vinci.be', 'fb',
        '$2b$10$o9QC86bWZINZ8bPzYHOBSOagWB5647r7ygm4Pg2xgvT6qE0qSYaCC',
        'Known as the ''Queen of Tejano Music,'' Selena Quintanilla was a beloved Latin recording artist who was killed by the president of her fan club at the age of 23.');

INSERT INTO kwicker.users (forename, lastname, email, username, password, is_active, biography)
VALUES ('Alex', 'Ottoy', 'alex.ottoy@student.vinci.be', 'ao',
        '$2y$10$9dO3uO/2uSdMjpWMrCcCz.VzypZIYiKcxLSv8Xcm8HMXs5837wHpO', false,
        'He was a scholar and minister who led the civil rights movement. After his assassination, he was memorialized by Martin Luther King Jr. Day.');



-- INSERT INTO kwicker.posts(id_user,message,parent_post,is_removed,id_post) VALUES (1,'Lorem ipsum dolor sit amet. Aut veniam eaque nam quia nobis et recusandae tenetur qui nisi nihil sed temporibus maxime eum ullam inventore 33 quasi sunt. Et modi Quis sed voluptatem similique est quas magnam qui neque consequuntur? Et itaque velit ut Quis itaque et aliquam neque ea voluptas aperiam sit dicta nesciunt et consectetur dolorem qui praesentium omnis! Hic dolorem debitis sed libero suscipit ut eius doloremque!',NULL,false,1);
-- INSERT INTO kwicker.posts(id_user,message,parent_post,is_removed,id_post) VALUES (1,'Sit quod eligendi sit magnam necessitatibus hic rerum blanditiis. Et facilis quidem id dolorem velit ut voluptatem nemo qui adipisci velit aut unde tempora et fugiat fugiat et neque omnis. Et sint porro et maxime facere nam consequatur omnis ut assumenda deleniti! Quo fugiat soluta et odio qui quisquam totam in illum provident et obcaecati magni eos iste fugiat et dicta laudantium.',NULL,false,2);
-- INSERT INTO kwicker.posts(id_user,message,parent_post,is_removed,id_post) VALUES (1,'Sit dolor quibusdam et dolores officia eum accusamus excepturi et internos quibusdam aut ipsam dicta. Cum exercitationem voluptatibus et minus reiciendis sit officiis praesentium qui officiis dolor?',NULL,false,3);
-- INSERT INTO kwicker.posts(id_user,message,parent_post,is_removed,id_post) VALUES (2,'Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès qu''il est prêt ou que la mise en page est achevée. Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum.',NULL,false,4);
