CREATE DATABASE IF NOT EXISTS liberty DEFAULT CHARACTER SET utf8mb4;

USE liberty;

CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  sponsor_id int,
  invite_code varchar(20) NOT NULL,
  available_balance decimal(12, 2) NOT NULL DEFAULT 0,
  pending_balance decimal(12, 2) NOT NULL DEFAULT 0,
  total_balance_received decimal(12, 2) NOT NULL DEFAULT 0,
  kyc_verified boolean NOT NULL DEFAULT false,
  email_verified boolean NOT NULL DEFAULT false,
  email varchar(100) NOT NULL,
  password_hash char(60) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
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
VALUES ('5bc12gh49c', 1, 1, 'admin@admin.com', '$2a$08$4/36O823ItMtjqgjsKTJh.vHFru8ob0FwyInH9kkTj.0zic/y6CwW', 'admin', 'Admin', 'Admin', '99999999999', '999999999', '2000-01-01', 'Brazil', 'São Paulo', 'São Paulo', '999999999', NOW());

CREATE TABLE plans (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(30) NOT NULL,
  price decimal(12, 2) NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id)
) ENGINE=InnoDB;
INSERT INTO plans (name, price) VALUES ('starter', 100.00);
INSERT INTO plans (name, price) VALUES ('junior', 200.00);
INSERT INTO plans (name, price) VALUES ('senior', 300.00);
INSERT INTO plans (name, price) VALUES ('master', 500.00);

CREATE TABLE contracts (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  plan_id int NOT NULL,
  status ENUM('waiting_payment', 'payment_confirmed', 'payment_denied', 'completed') NOT NULL DEFAULT 'waiting_payment',
  payment_type ENUM('pix') NOT NULL,
  total_received DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_contracts_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT fk_contracts_plan_id_plans_id FOREIGN KEY (plan_id) REFERENCES plans (id)
) ENGINE=InnoDB;

CREATE TABLE contracts_uploads (
  id int NOT NULL AUTO_INCREMENT,
  contract_id int NOT NULL,
  filename varchar(100) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_cu_contract_id_contracts_id FOREIGN KEY (contract_id) REFERENCES contracts (id)
);

CREATE TABLE withdraws (
  id int NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  status ENUM('pending', 'paid'),
  value DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT pk_wiwhdraws_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE wallets (
  id int NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('pix'),
  value VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT pk_wallets_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE multilevel_records (
  id int NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  from_user_id INT NOT NULL,
  from_contract_id INT NOT NULL,
  type ENUM('contract_payment_bonus', 'daily_bonus') NOT NULL,
  level SMALLINT NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_mr_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT fk_mr_from_user_id_users_id FOREIGN KEY (from_user_id) REFERENCES users (id),
  CONSTRAINT fk_mr_from_contract_id FOREIGN KEY (from_contract_id) REFERENCES contracts (id)
) ENGINE=InnoDB;

CREATE TABLE daily_bonus (
  id int NOT NULL AUTO_INCREMENT,
  percentage DECIMAL(5, 2) NOT NULL,
  date DATE NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT uc_date UNIQUE (date)
) ENGINE=InnoDB;

CREATE TABLE daily_bonus_records (
  id int NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  from_contract_id INT NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_dbr_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT fk_dbr_from_contract_id FOREIGN KEY (from_contract_id) REFERENCES contracts (id)
) ENGINE=InnoDB;

CREATE TABLE email_validations (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  used boolean NOT NULL DEFAULT false,
  code char(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_email_validations_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT uc_code UNIQUE (code)
);

CREATE TABLE reset_password_validations (
  id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  used boolean NOT NULL DEFAULT false,
  code char(30) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_reset_password_validations_user_id_users_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT uc_code UNIQUE (code)
);

CREATE TABLE kyc_requests (
  id int NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  status ENUM('pending', 'approved', 'denied') NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_kycr_user_id_users_id FOREIGN KEY (user_id) REFERENCES users( id)
) ENGINE=InnoDB;

CREATE TABLE kyc_requests_uploads (
  id int NOT NULL AUTO_INCREMENT,
  kyc_request_id int NOT NULL,
  filename varchar(100) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT pk_id PRIMARY KEY (id),
  CONSTRAINT fk_kycru_kyc_request_kycr_id FOREIGN KEY (kyc_request_id) REFERENCES kyc_requests (id)
);