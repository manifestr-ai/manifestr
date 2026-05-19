require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkMonthlyRevenue() {
  const now = new Date();
  
  // THIS MONTH
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  console.log('\n📅 THIS MONTH (May 2026)');
  console.log(`   Period: ${startOfThisMonth.toLocaleDateString()} - ${now.toLocaleDateString()}\n`);
  
  const { data: thisMonthSubs } = await supabase
    .from('subscriptions')
    .select('amount_cents, tier, created_at')
    .gte('created_at', startOfThisMonth.toISOString())
    .in('status', ['active', 'trialing']);

  console.log(`   New Subscriptions: ${thisMonthSubs?.length || 0}`);
  let thisMonthRevenue = 0;
  if (thisMonthSubs) {
    thisMonthSubs.forEach(sub => {
      const amount = (sub.amount_cents || 0) / 100;
      console.log(`     - ${sub.tier}: $${amount.toFixed(2)} (${new Date(sub.created_at).toLocaleDateString()})`);
      thisMonthRevenue += amount;
    });
  }
  console.log(`   💰 Total Revenue This Month: $${thisMonthRevenue.toFixed(2)}\n`);

  // LAST MONTH
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  console.log('📅 LAST MONTH (April 2026)');
  console.log(`   Period: ${startOfLastMonth.toLocaleDateString()} - ${endOfLastMonth.toLocaleDateString()}\n`);

  const { data: lastMonthSubs } = await supabase
    .from('subscriptions')
    .select('amount_cents, tier, created_at')
    .gte('created_at', startOfLastMonth.toISOString())
    .lte('created_at', endOfLastMonth.toISOString())
    .in('status', ['active', 'trialing', 'canceled']);

  console.log(`   New Subscriptions: ${lastMonthSubs?.length || 0}`);
  let lastMonthRevenue = 0;
  if (lastMonthSubs) {
    lastMonthSubs.forEach(sub => {
      const amount = (sub.amount_cents || 0) / 100;
      console.log(`     - ${sub.tier}: $${amount.toFixed(2)} (${new Date(sub.created_at).toLocaleDateString()})`);
      lastMonthRevenue += amount;
    });
  }
  console.log(`   💰 Total Revenue Last Month: $${lastMonthRevenue.toFixed(2)}\n`);

  // CALCULATION
  console.log('='.repeat(60));
  console.log(`📊 REVENUE COMPARISON:`);
  console.log(`   This Month: $${thisMonthRevenue.toFixed(2)}`);
  console.log(`   Last Month: $${lastMonthRevenue.toFixed(2)}`);
  
  if (lastMonthRevenue > 0) {
    const change = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    console.log(`   Change: ${change >= 0 ? '+' : ''}${change.toFixed(1)}%`);
  } else {
    console.log(`   Change: N/A (no previous revenue)`);
  }
  console.log('='.repeat(60));
}

checkMonthlyRevenue().then(() => process.exit(0));
