Full technical PRD — ready to hand to your AI coding assistant. Here's what's packed in:
13 sections covering everything implementation-ready:

Complete Postgres schema — all 18 tables with column types, FKs, constraints, and JSONB shapes called out (including the new appointments, appointment_types, coach_availability tables)
All frontend routes — 8 auth/coach/client pages mapped to named components, so your assistant knows exactly what to scaffold
Full API surface — 40+ route handlers across client management, progress, programs, check-ins, and appointments (method + path + description)
Appointment scheduling spec — both coach-initiated and client-initiated booking flows, availability slot computation, status lifecycle, and a full notifications matrix for appointment events
RLS policies — table-by-table rules so Supabase security is wired correctly from the start
Component architecture — 12 shared components + shadcn/ui components mapped to their use cases
Design tokens — dark theme (#0F0F0F), lime accent (#9EF01A), surface cards, matching the Forge reference screenshot

The 5 open questions in Section 12 are the ones to resolve before your assistant touches the appointment booking flow — specifically whether client bookings are auto-confirmed or require coach approval, as that changes the status flow and notification logic.