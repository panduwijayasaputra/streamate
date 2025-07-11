-- Insert test message
INSERT INTO messages (
    id,
    "streamId",
    "platformMessageId",
    "authorId",
    "authorName",
    content,
    "processingStatus",
    "requiresResponse",
    "isEscalated",
    "createdAt"
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'platform123',
    'user123',
    'TestUser',
    'Test message for feedback',
    'processed',
    true,
    false,
    now()
);

-- Insert test response
INSERT INTO responses (
    id,
    "messageId",
    content,
    metadata,
    status,
    "createdAt"
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Test AI response for feedback testing',
    '{"streamerId": "8e2e7fdf-e77c-4521-8e23-d9ec03547d4a", "streamId": "11111111-1111-1111-1111-111111111111"}',
    'generated',
    now()
); 