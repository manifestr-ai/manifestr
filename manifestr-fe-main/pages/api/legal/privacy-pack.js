function siteOrigin(req) {
  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env) return env.replace(/\/$/, '')
  const host = req.headers.host
  if (!host) return ''
  const proto = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'
  return `${proto}://${host}`
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }

  const origin = siteOrigin(req)
  const p = (path) => (origin ? `${origin}${path}` : path)

  const body = `MANIFESTR Privacy Pack
======================

This document lists official privacy and trust resources for MANIFESTR LLC.
For the latest versions, always refer to the live pages below.

Primary policies
----------------
• Privacy Policy: ${p('/privacy')}
• Cookie Policy: ${p('/cookies')}
• Terms of Service: ${p('/terms-of-service')}

Security & trust
----------------
• Security overview: ${p('/security')}
• Investor Trust Center: ${p('/security/investor-trust-center')}

Contact
-------
• privacy@manifestr.com
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename="MANIFESTR-Privacy-Pack.txt"')
  return res.status(200).send(body)
}
