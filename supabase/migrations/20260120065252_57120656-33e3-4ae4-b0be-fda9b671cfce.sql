-- Insert weekly expenses with proper date casting
INSERT INTO weekly_expenses (plot_id, week_ending, amount, notes)
SELECT p.id, '2026-01-13'::date, 15000, 'Casual laborers for pruning'
FROM plots p WHERE p.name = 'Homa Bay Township Plot'
UNION ALL
SELECT p.id, '2026-01-06'::date, 12000, 'Weekly labor costs'
FROM plots p WHERE p.name = 'Homa Bay Township Plot'
UNION ALL
SELECT p.id, '2025-12-30'::date, 18000, 'Holiday period workers'
FROM plots p WHERE p.name = 'Homa Bay Township Plot'
UNION ALL
SELECT p.id, '2026-01-13'::date, 22000, 'Harvest season workers'
FROM plots p WHERE p.name = 'Rachuonyo South Farm'
UNION ALL
SELECT p.id, '2026-01-06'::date, 19000, 'Regular weekly labor'
FROM plots p WHERE p.name = 'Rachuonyo South Farm'
UNION ALL
SELECT p.id, '2026-01-13'::date, 11000, 'Maintenance crew'
FROM plots p WHERE p.name = 'Suba North Plantation'
UNION ALL
SELECT p.id, '2026-01-06'::date, 14000, 'Weeding team'
FROM plots p WHERE p.name = 'Suba North Plantation'
UNION ALL
SELECT p.id, '2026-01-13'::date, 25000, 'Expanded workforce for harvest'
FROM plots p WHERE p.name = 'Mbita Point Fields'
UNION ALL
SELECT p.id, '2026-01-06'::date, 17000, 'Field preparation team'
FROM plots p WHERE p.name = 'Mbita Point Fields'
UNION ALL
SELECT p.id, '2026-01-13'::date, 32000, 'Peak season labor'
FROM plots p WHERE p.name = 'Kendu Bay Estate'
UNION ALL
SELECT p.id, '2026-01-06'::date, 28000, 'Harvest workers'
FROM plots p WHERE p.name = 'Kendu Bay Estate'
UNION ALL
SELECT p.id, '2025-12-30'::date, 26000, 'End of year operations'
FROM plots p WHERE p.name = 'Kendu Bay Estate';

-- Insert lease payments with proper date casting
INSERT INTO lease_payments (plot_id, due_date, amount, status, paid_date)
SELECT p.id, '2026-02-15'::date, 45000, 'pending', NULL
FROM plots p WHERE p.name = 'Homa Bay Township Plot'
UNION ALL
SELECT p.id, '2025-11-15'::date, 45000, 'paid', '2025-11-14'::date
FROM plots p WHERE p.name = 'Homa Bay Township Plot'
UNION ALL
SELECT p.id, '2026-02-01'::date, 60000, 'pending', NULL
FROM plots p WHERE p.name = 'Rachuonyo South Farm'
UNION ALL
SELECT p.id, '2025-11-01'::date, 60000, 'paid', '2025-10-31'::date
FROM plots p WHERE p.name = 'Rachuonyo South Farm'
UNION ALL
SELECT p.id, '2026-03-01'::date, 38000, 'pending', NULL
FROM plots p WHERE p.name = 'Suba North Plantation'
UNION ALL
SELECT p.id, '2025-12-01'::date, 38000, 'paid', '2025-11-28'::date
FROM plots p WHERE p.name = 'Suba North Plantation'
UNION ALL
SELECT p.id, '2026-02-20'::date, 52000, 'pending', NULL
FROM plots p WHERE p.name = 'Mbita Point Fields'
UNION ALL
SELECT p.id, '2025-11-20'::date, 52000, 'paid', '2025-11-19'::date
FROM plots p WHERE p.name = 'Mbita Point Fields'
UNION ALL
SELECT p.id, '2026-01-30'::date, 72000, 'pending', NULL
FROM plots p WHERE p.name = 'Kendu Bay Estate'
UNION ALL
SELECT p.id, '2025-10-30'::date, 72000, 'paid', '2025-10-29'::date
FROM plots p WHERE p.name = 'Kendu Bay Estate';