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

  const body = `MANIFESTR Cookie Compliance Framework (summary)
=============================================

This summary supports internal and vendor alignment with MANIFESTR’s public
Cookie Policy. It is not legal advice. The binding policy is always:

  ${p('/cookies')}

Cookie categories (high level)
------------------------------
1. Essential (strictly necessary) — required for core platform operation; not optional.
2. Functional — preferences and UX enhancements; can be declined where law allows.
3. Performance & analytics — product improvement; used only with consent where required.
4. Advertising & marketing — off by default; only with explicit opt-in where used.

User control
------------
• In-product and site guidance: ${p('/cookies#control')}
• Browser/device settings for blocking or clearing cookies.

Contact
-------
• privacy@manifestr.com
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="MANIFESTR-Cookie-Compliance-Framework.txt"'
  )
  return res.status(200).send(body)
}
