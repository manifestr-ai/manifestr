// Load environment variables FIRST (using require to ensure it runs before any imports)
require('dotenv').config();

import App from './app';

// No TypeORM initialization needed - using Supabase directly!
const app = new App();
app.listen(() => {
    console.log('🔑 CLAUDE_API_KEY:', process.env.CLAUDE_API_KEY ? `Found (${process.env.CLAUDE_API_KEY.substring(0, 15)}...)` : ' MISSING');
});
