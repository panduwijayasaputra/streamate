const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAIPersonalitySystem() {
  console.log('🧠 Testing AI Personality Customization System...\n');

  try {
    // Test 1: Get available personality templates
    console.log('1. Getting personality templates...');
    const templatesResponse = await axios.get(
      `${BASE_URL}/ai-personality/templates`,
    );
    console.log(
      `✅ Found ${templatesResponse.data.length} personality templates:`,
    );
    templatesResponse.data.forEach((template) => {
      console.log(`   - ${template.name}: ${template.description}`);
    });
    console.log('');

    // Test 2: Create a test streamer profile first
    console.log('2. Creating test streamer profile...');
    const testStreamerId = 'test-personality-streamer-001';
    const profileResponse = await axios.post(`${BASE_URL}/streamer-profiles`, {
      streamerId: testStreamerId,
      streamerName: 'Test Personality Streamer',
      personality: {
        tone: 'casual',
        languageStyle: 'mixed',
        responseLength: 'medium',
        emojiUsage: 'minimal',
        humorLevel: 'subtle',
        formalityLevel: 'casual',
      },
      aiPreferences: {
        responseStyle: 'friendly and helpful',
        commonPhrases: ['mantap', 'keren', 'oke'],
        avoidPhrases: ['dong', 'ganteng', 'cantik'],
        favoriteTopics: ['gaming', 'streaming'],
        audienceType: 'mixed',
        interactionStyle: 'friendly',
      },
    });
    console.log('✅ Test streamer profile created');
    console.log('');

    // Test 3: Analyze current personality
    console.log('3. Analyzing current personality...');
    const analysisResponse = await axios.get(
      `${BASE_URL}/ai-personality/streamer/${testStreamerId}/analysis`,
    );
    console.log('✅ Personality analysis:');
    console.log(`   - Tone: ${analysisResponse.data.currentPersonality.tone}`);
    console.log(
      `   - Language Style: ${analysisResponse.data.currentPersonality.languageStyle}`,
    );
    console.log(
      `   - Consistency Score: ${analysisResponse.data.recommendations.consistencyScore}%`,
    );
    console.log(
      `   - Audience Fit: ${analysisResponse.data.recommendations.audienceFit}%`,
    );
    console.log('');

    // Test 4: Get recommended templates
    console.log('4. Getting recommended templates...');
    const recommendationsResponse = await axios.get(
      `${BASE_URL}/ai-personality/streamer/${testStreamerId}/templates/recommended`,
    );
    console.log('✅ Top 3 recommended templates:');
    recommendationsResponse.data.recommendedTemplates.forEach(
      (template, index) => {
        console.log(
          `   ${index + 1}. ${template.name} (${template.recommendation}) - Score: ${template.matchScore}`,
        );
      },
    );
    console.log('');

    // Test 5: Apply a personality template
    console.log('5. Applying Gaming Enthusiast template...');
    const applyTemplateResponse = await axios.post(
      `${BASE_URL}/ai-personality/streamer/${testStreamerId}/apply-template/gaming-enthusiast`,
    );
    console.log('✅ Template applied successfully');
    console.log(
      `   - New tone: ${applyTemplateResponse.data.profile.personality.tone}`,
    );
    console.log(
      `   - New emoji usage: ${applyTemplateResponse.data.profile.personality.emojiUsage}`,
    );
    console.log('');

    // Test 6: Test personality with sample messages
    console.log('6. Testing personality with sample messages...');
    const testMessages = [
      'Halo! Selamat datang!',
      'Bagaimana cara main game ini?',
      'Streamer ganteng banget!',
      'Bye bye, sampai jumpa!',
    ];

    const testResponse = await axios.post(
      `${BASE_URL}/ai-personality/streamer/${testStreamerId}/test`,
      {
        messages: testMessages,
      },
    );

    console.log('✅ Personality test results:');
    testResponse.data.responses.forEach((result, index) => {
      console.log(`   ${index + 1}. "${result.originalMessage}"`);
      console.log(`      Response: "${result.generatedResponse}"`);
      console.log(`      Match Score: ${result.personalityMatch}%`);
    });
    console.log(`   Average Match Score: ${testResponse.data.averageMatch}%`);
    console.log('');

    // Test 7: Create custom personality
    console.log('7. Creating custom personality...');
    const customPersonalityResponse = await axios.post(
      `${BASE_URL}/ai-personality/streamer/${testStreamerId}/custom`,
      {
        tone: 'energetic',
        languageStyle: 'slang-heavy',
        responseLength: 'short',
        emojiUsage: 'heavy',
        humorLevel: 'high',
        formalityLevel: 'very-casual',
        commonPhrases: ['wkwkwk', 'anjir', 'siap', 'gas'],
        avoidPhrases: ['dong', 'ganteng', 'cantik'],
        favoriteTopics: ['entertainment', 'memes', 'funny moments'],
      },
    );
    console.log('✅ Custom personality created');
    console.log(
      `   - New tone: ${customPersonalityResponse.data.profile.personality.tone}`,
    );
    console.log(
      `   - New humor level: ${customPersonalityResponse.data.profile.personality.humorLevel}`,
    );
    console.log('');

    // Test 8: Test the custom personality
    console.log('8. Testing custom personality...');
    const customTestResponse = await axios.post(
      `${BASE_URL}/ai-personality/streamer/${testStreamerId}/test`,
      {
        messages: [
          'Halo!',
          'Kamu lucu banget!',
          'Streamer ganteng!',
          'Bye bye!',
        ],
      },
    );

    console.log('✅ Custom personality test results:');
    customTestResponse.data.responses.forEach((result, index) => {
      console.log(`   ${index + 1}. "${result.originalMessage}"`);
      console.log(`      Response: "${result.generatedResponse}"`);
      console.log(`      Match Score: ${result.personalityMatch}%`);
    });
    console.log(
      `   Average Match Score: ${customTestResponse.data.averageMatch}%`,
    );
    console.log('');

    console.log('🎉 All AI Personality Customization tests passed!');
    console.log('');
    console.log('📊 Summary:');
    console.log('   ✅ Personality templates available');
    console.log('   ✅ Personality analysis working');
    console.log('   ✅ Template recommendations working');
    console.log('   ✅ Template application working');
    console.log('   ✅ Personality testing working');
    console.log('   ✅ Custom personality creation working');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAIPersonalitySystem();
