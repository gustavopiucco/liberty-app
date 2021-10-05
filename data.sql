CREATE DATABASE IF NOT EXISTS liberty DEFAULT CHARACTER SET utf8mb4;

USE liberty;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(100) NOT NULL,
  password_hash char(60) NOT NULL,
  role enum('admin', 'user'),
  first_name varchar(20) NOT NULL,
  last_name varchar(60) NOT NULL,
  cpf char(11) NOT NULL,
  phone varchar(20) NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT uc_email UNIQUE (email),
  CONSTRAINT uc_cpf UNIQUE (cpf)
) ENGINE=InnoDB;