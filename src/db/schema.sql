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
