CREATE TABLE User (
    id INT AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    user VARCHAR (100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
);