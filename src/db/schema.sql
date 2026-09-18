CREATE TABLE IF NOT EXISTS rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  name text NOT NULL,
  attending text NOT NULL CHECK (attending IN ('yes', 'no')),
  guests integer NOT NULL CHECK (guests >= 1 AND guests <= 12),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS rsvps_event_slug_created_at_idx
  ON rsvps (event_slug, created_at DESC);

CREATE TABLE IF NOT EXISTS organizers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint NOT NULL UNIQUE,
  first_name text NOT NULL DEFAULT '',
  username text,
  pending_payment_slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES organizers (id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  content jsonb NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  draft_reminded_at timestamptz,
  draft_warned_at timestamptz,
  CONSTRAINT events_status_check CHECK (status IN ('draft', 'pending_approval', 'active'))
);

CREATE INDEX IF NOT EXISTS events_organizer_id_idx ON events (organizer_id);

ALTER TABLE events ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';
ALTER TABLE events ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('draft', 'pending_approval', 'active'));
ALTER TABLE organizers ADD COLUMN IF NOT EXISTS pending_payment_slug text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at timestamptz;
UPDATE events SET updated_at = created_at WHERE updated_at IS NULL;
ALTER TABLE events ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE events ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE events ADD COLUMN IF NOT EXISTS draft_reminded_at timestamptz;
ALTER TABLE events ADD COLUMN IF NOT EXISTS draft_warned_at timestamptz;
