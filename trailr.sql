DROP DATABASE IF EXISTS trailr;

CREATE DATABASE trailr;

USE trailr;

CREATE TABLE users (
  id int AUTO_INCREMENT,
  id_google varchar(255),
  name varchar(255),
  photo_url varchar(255),
  PRIMARY KEY (id)
);

CREATE TABLE trails (
  id int,
  name varchar(255),
  url varchar(255),
  description varchar(255),
  city varchar(50),
  region varchar(50),
  country varchar(50),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  thumbnail varchar(255),
  status ENUM('active', 'inactive') NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE photos (
  id int AUTO_INCREMENT,
  url varchar(255),
  description varchar(255),
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_at timestamp,
  id_trail int,
  id_user int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_trail) REFERENCES trails(id),
  FOREIGN KEY (id_user) REFERENCES users(id)
);

CREATE TABLE rating_difficulty (
  id int AUTO_INCREMENT,
  value float(2, 1),
  id_user int,
  id_trail int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (id_trail) REFERENCES trails(id)
);

CREATE TABLE rating_likeability (
  id int AUTO_INCREMENT,
  value float(2, 1),
  id_user int,
  id_trail int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (id_trail) REFERENCES trails(id)
);

CREATE TABLE comments (
  id int AUTO_INCREMENT,
  text varchar(140),
  created_at timestamp,
  id_user int,
  id_photo int,
  PRIMARY KEY (id),
  FOREIGN KEY (id_user) REFERENCES users(id),
  FOREIGN KEY (id_photo) REFERENCES photos(id)
);

CREATE TABLE favorites (
  id int AUTO_INCREMENT,
  id_user int,
  id_trail int,
  PRIMARY KEY (id)
);

-- ALTER TABLE `photos` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
-- ALTER TABLE `photos` ADD FOREIGN KEY (`id_trail`) REFERENCES `trails` (`id`);
-- ALTER TABLE `comments` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
-- ALTER TABLE `comments` ADD FOREIGN KEY (`id_photo`) REFERENCES `photos` (`id`);
-- ALTER TABLE `rating_likeability` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
-- ALTER TABLE `rating_likeability` ADD FOREIGN KEY (`id_trail`) REFERENCES `trails` (`id`);
-- ALTER TABLE `rating_difficulty` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
-- ALTER TABLE `rating_difficulty` ADD FOREIGN KEY (`id_trail`) REFERENCES `trails` (`id`);
-- ALTER TABLE `favorites` ADD FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
-- ALTER TABLE `favorites` ADD FOREIGN KEY (`id_trail`) REFERENCES `trails` (`id`);

-- mysql -u <USER> < trailr.sql
