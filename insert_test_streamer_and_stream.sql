-- Insert test streamer
INSERT INTO streamers (
    id,
    email,
    username,
    "displayName",
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'test@example.com',
    'teststreamer',
    'Test Streamer',
    true,
    now(),
    now()
)
ON CONFLICT (id) DO NOTHING;

-- Insert test stream
INSERT INTO streams (
    id,
    "streamerId",
    title,
    platform,
    status,
    "createdAt",
    "updatedAt"
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    '8e2e7fdf-e77c-4521-8e23-d9ec03547d4a',
    'Test Stream',
    'youtube',
    'active',
    now(),
    now()
)
ON CONFLICT (id) DO NOTHING; 