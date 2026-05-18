import api from '../lib/api'

/**
 * Get subscription status including usage metrics
 */
export async function getSubscriptionStatus() {
  const response = await api.get('/api/subscriptions/status')
  return response.data
}

/**
 * Get billing details
 */
export async function getBillingDetails() {
  const response = await api.get('/api/subscriptions/billing-details')
  return response.data
}

/**
 * Get seat usage
 */
export async function getSeatUsage() {
  const response = await api.get('/api/subscriptions/seat-usage')
  return response.data
}

/**
 * Cancel subscription
 */
export async function cancelSubscription() {
  const response = await api.post('/api/subscriptions/cancel')
  return response.data
}

/**
 * Create checkout session
 */
export async function createCheckoutSession(tier, interval) {
  const response = await api.post('/api/subscriptions/create-checkout-session', {
    tier,
    interval
  })
  return response.data
}
