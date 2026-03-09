CREATE TABLE expenses (
                          id BIGSERIAL PRIMARY KEY,
                          household_id BIGINT NOT NULL,
                          description VARCHAR(255) NOT NULL,
                          amount NUMERIC(15,2) NOT NULL,
                          recurrence_type VARCHAR(50) NOT NULL,
                          start_date DATE NOT NULL,
                          end_date DATE,
                          day_of_month INT,
                          status VARCHAR(50) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT ck_expenses_day_of_month
                              CHECK (day_of_month IS NULL OR (day_of_month >= 1 AND day_of_month <= 31))
);