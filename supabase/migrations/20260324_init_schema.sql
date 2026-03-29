-- Health Coach PWA Initial Schema
-- No RLS, No Auth dependencies

-- 1. Coaches
CREATE TABLE IF NOT EXISTS coach_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#9EF01A',
    subdomain TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Programs
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coach_profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    duration_weeks INT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS program_weeks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    week_number INT NOT NULL
);

CREATE TABLE IF NOT EXISTS program_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id UUID REFERENCES program_weeks(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6)
);

CREATE TABLE IF NOT EXISTS program_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID REFERENCES program_days(id) ON DELETE CASCADE,
    block_type TEXT NOT NULL CHECK (block_type IN ('workout', 'nutrition', 'habit', 'note')),
    position INT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coach_profiles(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('invited', 'active', 'paused', 'completed')),
    goal_tag TEXT,
    date_of_birth DATE,
    gender TEXT,
    activity_level TEXT,
    dietary_restrictions TEXT,
    medical_notes TEXT,
    motivation TEXT,
    avatar_url TEXT,
    program_id UUID REFERENCES programs(id) ON NULL DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coach_profiles(id),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Progress
CREATE TABLE IF NOT EXISTS progress_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    metric_key TEXT NOT NULL,
    metric_label TEXT NOT NULL,
    value NUMERIC NOT NULL,
    unit TEXT,
    recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS progress_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    taken_at DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    metric_key TEXT NOT NULL,
    start_value NUMERIC NOT NULL,
    target_value NUMERIC NOT NULL,
    deadline DATE,
    achieved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Check-ins
CREATE TABLE IF NOT EXISTS checkin_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coach_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    custom_questions JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checkin_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    form_id UUID REFERENCES checkin_forms(id),
    submitted_at TIMESTAMPTZ DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    coach_response TEXT,
    metrics JSONB,
    answers JSONB,
    photo_url TEXT
);

-- 6. Appointments
CREATE TABLE IF NOT EXISTS appointment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coach_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    duration_min INT NOT NULL,
    description TEXT,
    color TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coach_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coach_profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    timezone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES coach_profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    appointment_type_id UUID REFERENCES appointment_types(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_min INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    coach_notes TEXT,
    meet_link TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
