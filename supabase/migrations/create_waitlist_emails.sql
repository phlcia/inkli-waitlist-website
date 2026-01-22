-- Create waitlist_emails table
CREATE TABLE IF NOT EXISTS waitlist_emails (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on email for faster lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_waitlist_emails_email ON waitlist_emails(email);

-- Add comment to table
COMMENT ON TABLE waitlist_emails IS 'Stores email addresses for the Inkli waitlist';
