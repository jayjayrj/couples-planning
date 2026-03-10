CREATE UNIQUE INDEX uq_account_transactions_reference
    ON account_transactions(reference_type, reference_id, household_id);