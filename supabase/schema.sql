-- ─────────────────────────────────────────────────────────────────────────
-- Khuraak Multi Cuisine Restaurant — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed categories
INSERT INTO menu_categories (name, sort_order) VALUES
  ('Starters',       1),
  ('Mains',          2),
  ('Breads',         3),
  ('Rice & Biryani', 4),
  ('Desserts',       5),
  ('Drinks',         6);


-- 2. Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id          SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES menu_categories(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  image_url   TEXT,
  tags        TEXT[] DEFAULT '{}',   -- ['veg','nonveg','vegan','spicy']
  available   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
-- Public can read available items
CREATE POLICY "Public read menu" ON menu_items FOR SELECT USING (available = TRUE);
-- Only authenticated (admin) can write
CREATE POLICY "Admin write menu" ON menu_items FOR ALL USING (auth.role() = 'authenticated');


-- 3. Reservations
CREATE TABLE IF NOT EXISTS reservations (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  date       DATE NOT NULL,
  time       TEXT NOT NULL,
  guests     INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 120),
  address    TEXT,
  notes      TEXT,
  status     TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','declined','rescheduled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
-- Anyone can insert (book a table)
CREATE POLICY "Public insert reservations" ON reservations FOR INSERT WITH CHECK (TRUE);
-- Only admin can read / update
CREATE POLICY "Admin manage reservations" ON reservations FOR ALL USING (auth.role() = 'authenticated');


-- 4. Event Enquiries
CREATE TABLE IF NOT EXISTS event_enquiries (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  event_type    TEXT NOT NULL,   -- birthday, anniversary, corporate, kitty, ring, other
  date          DATE NOT NULL,
  guests        INTEGER,
  location_type TEXT DEFAULT 'restaurant' CHECK (location_type IN ('restaurant','offsite')),
  notes         TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','declined')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE event_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert events" ON event_enquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin manage events" ON event_enquiries FOR ALL USING (auth.role() = 'authenticated');


-- 5. Settings
CREATE TABLE IF NOT EXISTS settings (
  id                  SERIAL PRIMARY KEY,
  opening_hours       JSONB DEFAULT '{}',   -- { "mon": "11:00-23:30", ... }
  holiday_closures    DATE[],
  admin_whatsapp      TEXT[],               -- admin phone numbers for alerts
  seating_capacity    INTEGER DEFAULT 120,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (TRUE);
CREATE POLICY "Admin write settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Seed default settings
INSERT INTO settings (seating_capacity) VALUES (120);


-- 6. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  rating     INTEGER CHECK (rating >= 1 AND rating <= 5),
  text       TEXT NOT NULL,
  approved   BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (approved = TRUE);
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admin manage reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');


-- ─── Trigger: auto-update updated_at ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_reservations
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_menu_items
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
