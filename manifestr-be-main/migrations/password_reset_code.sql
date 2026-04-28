CREATE TABLE password_reset_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reset_email ON password_reset_codes(email);

ALTER TABLE password_reset_codes ADD COLUMN verified BOOLEAN DEFAULT FALSE;

ALTER TABLE password_reset_codes
ALTER COLUMN expires_at TYPE TIMESTAMPTZ;