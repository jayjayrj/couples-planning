CREATE TABLE goals (
                       id BIGSERIAL PRIMARY KEY,
                       household_id BIGINT NOT NULL,
                       name VARCHAR(255) NOT NULL,
                       target_amount NUMERIC(15,2) NOT NULL,
                       current_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
                       target_date DATE,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);