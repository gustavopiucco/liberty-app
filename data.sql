CREATE DATABASE IF NOT EXISTS liberty DEFAULT CHARACTER SET utf8mb4;

USE liberty;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(100) NOT NULL,
  password_hash char(60) NOT NULL,
  role enum('admin', 'user'),
  first_name varchar(30) NOT NULL,
  last_name varchar(60) NOT NULL,
  cpf char(11) NOT NULL,
  phone varchar(20) NOT NULL,
  birth_date date NOT NULL,
  country varchar(30) NOT NULL,
  city varchar(50) NOT NULL,
  state varchar(50) NOT NULL,
  postal_code varchar(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT uc_email UNIQUE (email),
  CONSTRAINT uc_cpf UNIQUE (cpf)
) ENGINE=InnoDB;