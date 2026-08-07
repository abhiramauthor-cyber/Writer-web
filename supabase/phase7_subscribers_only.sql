-- Also ensure subscribers table exists (fixes "schema cache" error if it was missing)
CREATE TABLE IF NOT EXISTS subscribers (
  email text primary key,
  status text not null default 'active',
  created_at timestamptz default now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert subscribers') THEN
    CREATE POLICY "Public insert subscribers" 
    ON subscribers 
    FOR INSERT 
    WITH CHECK (true);
  END IF;
END $$;

-- Only admins can view subscribers
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin read subscribers') THEN
    CREATE POLICY "Admin read subscribers" 
    ON subscribers 
    FOR SELECT 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
  END IF;
END $$;

-- Only admins can delete subscribers
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete subscribers') THEN
    CREATE POLICY "Admin delete subscribers" 
    ON subscribers 
    FOR DELETE 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
  END IF;
END $$;
