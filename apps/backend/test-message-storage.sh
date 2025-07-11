#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Testing Message Storage Endpoints"
echo "=================================="

# Test 1: Create a test message
echo -e "\n1. Creating test message..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "streamId": "test-stream-123",
    "platformMessageId": "yt-msg-456",
    "authorId": "user-789",
    "authorName": "TestUser",
    "authorAvatar": "https://example.com/avatar.jpg",
    "content": "What is the best strategy for this game?",
    "metadata": {
      "isModerator": false,
      "isSubscriber": true,
      "badges": ["subscriber"],
      "emotes": []
    }
  }')

echo "Create Response: $CREATE_RESPONSE"
MESSAGE_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -n "$MESSAGE_ID" ]; then
    echo "✅ Message created with ID: $MESSAGE_ID"
else
    echo "❌ Failed to create message"
    exit 1
fi

# Test 2: Get all messages
echo -e "\n2. Getting all messages..."
GET_ALL_RESPONSE=$(curl -s -X GET "$BASE_URL/messages?limit=10&offset=0")
echo "Get All Response: $GET_ALL_RESPONSE"

# Test 3: Get message by ID
echo -e "\n3. Getting message by ID..."
GET_BY_ID_RESPONSE=$(curl -s -X GET "$BASE_URL/messages/$MESSAGE_ID")
echo "Get By ID Response: $GET_BY_ID_RESPONSE"

# Test 4: Update message status
echo -e "\n4. Updating message status..."
UPDATE_STATUS_RESPONSE=$(curl -s -X PUT "$BASE_URL/messages/$MESSAGE_ID/status" \
  -H "Content-Type: application/json" \
  -d '{"status": "processed"}')
echo "Update Status Response: $UPDATE_STATUS_RESPONSE"

# Test 5: Mark message for response
echo -e "\n5. Marking message for response..."
MARK_RESPONSE_RESPONSE=$(curl -s -X PUT "$BASE_URL/messages/$MESSAGE_ID/response" \
  -H "Content-Type: application/json" \
  -d '{"requiresResponse": true}')
echo "Mark Response Response: $MARK_RESPONSE_RESPONSE"

# Test 6: Mark message as escalated
echo -e "\n6. Marking message as escalated..."
MARK_ESCALATED_RESPONSE=$(curl -s -X PUT "$BASE_URL/messages/$MESSAGE_ID/escalate" \
  -H "Content-Type: application/json" \
  -d '{"isEscalated": true}')
echo "Mark Escalated Response: $MARK_ESCALATED_RESPONSE"

# Test 7: Get analytics for stream
echo -e "\n7. Getting analytics for stream..."
ANALYTICS_RESPONSE=$(curl -s -X GET "$BASE_URL/messages/stream/test-stream-123/analytics")
echo "Analytics Response: $ANALYTICS_RESPONSE"

# Test 8: Get questions for stream
echo -e "\n8. Getting questions for stream..."
QUESTIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/messages/stream/test-stream-123/questions")
echo "Questions Response: $QUESTIONS_RESPONSE"

# Test 9: Get escalated messages for stream
echo -e "\n9. Getting escalated messages for stream..."
ESCALATED_RESPONSE=$(curl -s -X GET "$BASE_URL/messages/stream/test-stream-123/escalated")
echo "Escalated Response: $ESCALATED_RESPONSE"

# Test 10: Update message
echo -e "\n10. Updating message..."
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/messages/$MESSAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "processingStatus": "processed",
    "requiresResponse": true,
    "isEscalated": true,
    "analysis": {
      "isQuestion": true,
      "questionType": "game-specific",
      "sentiment": "neutral",
      "priority": "high",
      "keywords": ["strategy", "game", "best"]
    }
  }')
echo "Update Response: $UPDATE_RESPONSE"

# Test 11: Delete message (optional - uncomment to test)
# echo -e "\n11. Deleting message..."
# DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/messages/$MESSAGE_ID")
# echo "Delete Response: $DELETE_RESPONSE"

echo -e "\n✅ Message Storage Endpoints Test Complete!"
echo "=============================================" 