CREATE TABLE memberships (
                             id BIGSERIAL PRIMARY KEY,
                             user_id BIGINT NOT NULL,
                             household_id BIGINT NOT NULL,
                             role VARCHAR(50) NOT NULL,
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                             CONSTRAINT fk_memberships_user
                                 FOREIGN KEY (user_id) REFERENCES users(id),

                             CONSTRAINT fk_memberships_household
                                 FOREIGN KEY (household_id) REFERENCES households(id),

                             CONSTRAINT uk_membership_user_household
                                 UNIQUE (user_id, household_id)
);