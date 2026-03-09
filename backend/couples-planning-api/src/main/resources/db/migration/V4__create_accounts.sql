CREATE TABLE accounts (
                          id BIGSERIAL PRIMARY KEY,
                          household_id BIGINT NOT NULL,
                          name VARCHAR(255) NOT NULL,
                          type VARCHAR(50) NOT NULL,
                          current_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_accounts_household
                              FOREIGN KEY (household_id)
                                  REFERENCES households(id)
);