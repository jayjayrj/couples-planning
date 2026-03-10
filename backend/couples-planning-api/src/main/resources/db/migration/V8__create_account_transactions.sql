ALTER TABLE expenses ADD COLUMN account_id BIGINT;
ALTER TABLE expenses ADD COLUMN paid_at TIMESTAMP NULL;

ALTER TABLE incomes ADD COLUMN account_id BIGINT;
ALTER TABLE incomes ADD COLUMN realized_at TIMESTAMP NULL;

CREATE TABLE account_transactions (
                                      id BIGSERIAL PRIMARY KEY,
                                      household_id BIGINT NOT NULL,
                                      account_id BIGINT NOT NULL,
                                      type VARCHAR(30) NOT NULL,
                                      direction VARCHAR(10) NOT NULL,
                                      amount NUMERIC(19,2) NOT NULL,
                                      transaction_date DATE NOT NULL,
                                      reference_type VARCHAR(30) NOT NULL,
                                      reference_id BIGINT,
                                      description VARCHAR(255) NOT NULL,
                                      created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_account_transactions_account_id
    ON account_transactions(account_id);

CREATE INDEX idx_account_transactions_household_id
    ON account_transactions(household_id);

CREATE INDEX idx_account_transactions_reference
    ON account_transactions(reference_type, reference_id, household_id);