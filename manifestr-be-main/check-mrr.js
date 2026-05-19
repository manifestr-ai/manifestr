require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkMRR() {
  console.log('\n🔍 Checking MRR Data...\n');
  
  // Get all active subscriptions
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')
    .in('status', ['active', 'trialing']);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`📊 Found ${subscriptions.length} active subscription(s):\n`);

  let totalMRR = 0;

  subscriptions.forEach((sub, index) => {
    console.log(`Subscription ${index + 1}:`);
    console.log(`  - User ID: ${sub.user_id}`);
    console.log(`  - Tier: ${sub.tier}`);
    console.log(`  - Status: ${sub.status}`);
    console.log(`  - Amount: $${(sub.amount_cents / 100).toFixed(2)} (${sub.amount_cents} cents)`);
    console.log(`  - Billing: ${sub.billing_interval}`);
    console.log(`  - Created: ${new Date(sub.created_at).toLocaleString()}`);
    
    // Calculate MRR
    let mrr = 0;
    if (sub.billing_interval === 'annual') {
      mrr = sub.amount_cents / 12;
      console.log(`  - MRR Contribution: $${(mrr / 100).toFixed(2)} (annual ÷ 12)`);
    } else {
      mrr = sub.amount_cents;
      console.log(`  - MRR Contribution: $${(mrr / 100).toFixed(2)}`);
    }
    
    totalMRR += mrr;
    console.log('');
  });

  console.log('='.repeat(50));
  console.log(`💰 Total MRR: $${(totalMRR / 100).toFixed(2)}`);
  console.log('='.repeat(50));
  
  // Check addon purchases
  const { data: addons } = await supabase
    .from('addon_purchases')
    .select('*')
    .eq('status', 'completed');
    
  if (addons && addons.length > 0) {
    console.log(`\n🎁 Addon Purchases: ${addons.length}`);
    let totalAddonRevenue = 0;
    addons.forEach((addon) => {
      console.log(`  - ${addon.addon_name}: $${addon.amount_paid}`);
      totalAddonRevenue += addon.amount_paid;
    });
    console.log(`  Total Addon Revenue: $${totalAddonRevenue.toFixed(2)}`);
  }
}

checkMRR().then(() => process.exit(0));
