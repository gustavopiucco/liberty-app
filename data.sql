CREATE DATABASE IF NOT EXISTS liberty DEFAULT CHARACTER SET utf8mb4;

USE liberty;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  sponsor_id int,
  invite_code varchar(20) NOT NULL,
  kyc_verified boolean NOT NULL DEFAULT false,
  email_verified boolean NOT NULL DEFAULT false,
  email varchar(100) NOT NULL,
  password_hash char(60) NOT NULL,
  role enum('admin', 'user') DEFAULT 'user',
  first_name varchar(30) NOT NULL,
  last_name varchar(60) NOT NULL,
  cpf char(11) NOT NULL,
  phone varchar(20) NOT NULL,
  birth_date date NOT NULL,
  country varchar(30) NOT NULL,
  city varchar(50) NOT NULL,
  state varchar(50) NOT NULL,
  postal_code varchar(20) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT uc_invite_code UNIQUE (invite_code),
  CONSTRAINT uc_email UNIQUE (email),
  CONSTRAINT uc_cpf UNIQUE (cpf),
  CONSTRAINT fk_sponsor_id_users_id FOREIGN KEY (sponsor_id) REFERENCES users (id)
) ENGINE=InnoDB;
INSERT INTO users (invite_code, kyc_verified, email_verified, email, password_hash, role, first_name, last_name, cpf, phone, birth_date, country, city, state, postal_code, created_at) 
VALUES ('5bc12gh49c', 1, 1, 'admin@admin.com', '$2a$08$69AXpIyN21uYCDyTMCxnLuOro28Jv0IrcTgWZjuZczD64Vk1ThBai', 'admin', 'Admin', 'Admin', '99999999999', '999999999', '2000-01-01', 'Brazil', 'São Paulo', 'São Paulo', '999999999', NOW());

CREATE TABLE email_validations (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  code char(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_email_validations_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT uc_code UNIQUE (code)
);

CREATE TABLE reset_password_validations (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  code char(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_reset_password_validations_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT uc_code UNIQUE (code)
);