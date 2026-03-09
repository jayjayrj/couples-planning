CREATE TABLE incomes (
                         id BIGSERIAL PRIMARY KEY,
                         household_id BIGINT NOT NULL,
                         description VARCHAR(255) NOT NULL,
                         amount NUMERIC(15,2) NOT NULL,
                         recurrence_type VARCHAR(50) NOT NULL,
                         start_date DATE NOT NULL,
                         end_date DATE,
                         day_of_month INT,
                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);