 DROP DATABASE FacebookClone;

CREATE DATABASE FacebookClone;

USE FacebookClone;

CREATE TABLE roles(
    id INT AUTO_INCREMENT NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users(
    id INT AUTO_INCREMENT NOT NULL,
    firstName VARCHAR(255) NOT NULL ,
    lastName VARCHAR(255) NOT NULL ,
    birthdate VARCHAR(255),
    country VARCHAR(255),
    image VARCHAR(255),
    bio VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    PRIMARY KEY (id),
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE posts(
    id INT AUTO_INCREMENT NOT NULL,
    content VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    PRIMARY KEY (id),
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE comments(
    id INT AUTO_INCREMENT NOT NULL,
    comment VARCHAR(255),
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    commenter_id INT,
    FOREIGN KEY (commenter_id) REFERENCES users(id),
    is_deleted TINYINT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE likes(
    id INT AUTO_INCREMENT NOT NULL,
    is_liked  TINYINT DEFAULT 0,
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    is_deleted TINYINT DEFAULT 0,
    PRIMARY KEY (id)
);


CREATE TABLE friends(
    id INT AUTO_INCREMENT NOT NULL, 
    source_id INT,
    FOREIGN KEY (source_id) REFERENCES users(id),
    target_id INT,
    FOREIGN KEY (target_id) REFERENCES users(id),
    PRIMARY KEY (id),
    is_deleted TINYINT DEFAULT 0
);


CREATE TABLE permissions(
    id INT AUTO_INCREMENT NOT NULL, 
    permission VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    is_deleted TINYINT DEFAULT 0
);

CREATE TABLE role_permission(
    id INT AUTO_INCREMENT NOT NULL,
    role_id INT,
    permission_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    PRIMARY KEY (id)
);

