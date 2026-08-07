-- Phase 7: Contact Inbox

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read')),
  created_at timestamptz default now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
CREATE POLICY "Public insert contact_messages" 
ON contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only admins can read/update/delete contact messages
CREATE POLICY "Admin read contact_messages" 
ON contact_messages 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admin update contact_messages" 
ON contact_messages 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admin delete contact_messages" 
ON contact_messages 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Also ensure subscribers table exists (fixes "schema cache" error if it was missing)
CREATE TABLE IF NOT EXISTS subscribers (
  email text primary key,
  status text not null default 'active',
  created_at timestamptz default now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Public insert subscribers" 
ON subscribers 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view/delete subscribers
CREATE POLICY "Admin read subscribers" 
ON subscribers 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Admin delete subscribers" 
ON subscribers 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
