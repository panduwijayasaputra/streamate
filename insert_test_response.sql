INSERT INTO responses (
    id, 
    "messageId", 
    "streamerId", 
    "streamId", 
    content, 
    "isAIResponse", 
    "responseType", 
    "effectiveness", 
    "createdAt", 
    "updatedAt"
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'test123',
    '550e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'Test AI response for feedback testing',
    true,
    'auto',
    0.8,
    now(),
    now()
); 