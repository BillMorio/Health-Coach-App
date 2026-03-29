import { createClient } from '@supabase/supabase-js';

// STRATEGIC HARDCODED CREDENTIALS (BYPASSING ENV ERRORS)
const SUPABASE_URL = 'https://dreensbtfzezeddphqyu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gU6bXusI9oZWYt2IweD_RA_PowDGOGP'; // Updated to NEW Publishable Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
