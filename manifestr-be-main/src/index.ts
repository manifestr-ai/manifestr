// Load environment variables FIRST (using require to ensure it runs before any imports)
require('dotenv').config();

import App from './app';

// No TypeORM initialization needed - using Supabase directly!
const app = new App();
app.listen(() => {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                 🚀 MANIFESTR API - STARTING                      ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝\n');
    
    console.log('🤖 AI MODELS CONFIGURATION:');
    console.log('   ├─ Text Generation: Claude Sonnet 4.0');
    console.log('   └─ Image Generation: Google Gemini (Imagen 4.0)\n');
    
    console.log('🔑 API KEY STATUS:');
    console.log('   ├─ CLAUDE_API_KEY:', process.env.CLAUDE_API_KEY ? `✅ Found (${process.env.CLAUDE_API_KEY.substring(0, 15)}...)` : ' ❌ MISSING');
    console.log('   └─ GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `✅ Found (${process.env.GEMINI_API_KEY.substring(0, 15)}...)` : ' ❌ MISSING');
    
    console.log('\n📋 DOCUMENT LOGIC FRAMEWORKS: Loaded (6 frameworks)');
    console.log('   ├─ Proposal Logic (Pitch Decks, Sales)');
    console.log('   ├─ Strategy Logic (Corporate Strategy, QBR)');
    console.log('   ├─ Report Logic (Business Reports, Analysis)');
    console.log('   ├─ Education Logic (Training, Workshops)');
    console.log('   ├─ Communication Logic (Updates, Announcements)');
    console.log('   └─ Analysis Logic (Market Analysis, Research)\n');
    
    console.log('✅ Server ready and listening\n');
    console.log('═'.repeat(68) + '\n');
});
