-- Rename Phase-0 walkthrough events table out of the way before Phase 1
-- creates the new activity_events table.

alter table if exists events rename to walkthrough_events;
alter index if exists idx_events_employee rename to idx_walkthrough_events_employee;
