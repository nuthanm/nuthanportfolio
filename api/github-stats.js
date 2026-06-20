const GITHUB_API_BASE = 'https://api.github.com'

function parseGithubUsername(value) {
  if (!value) return ''
  const trimmed = String(value).trim()

  if (!trimmed.includes('http')) {
    return trimmed.replace(/^@/, '')
  }

  try {
    const url = new URL(trimmed)
    const parts = url.pathname.split('/').filter(Boolean)
    return (parts[0] || '').replace(/^@/, '')
  } catch (_error) {
    return ''
  }
}

async function fetchUserStats(username) {
  const response = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'nuthan-portfolio',
    },
  })

  if (!response.ok) {
    throw new Error('Unable to fetch GitHub user profile.')
  }

  const data = await response.json()
  return {
    publicRepos: Number(data.public_repos || 0),
    createdAt: String(data.created_at || ''),
  }
}

function sumContributionCounts(svgText) {
  const matches = svgText.match(/data-count="(\d+)"/g) || []
  return matches.reduce((sum, item) => {
    const count = Number(item.replace(/[^\d]/g, ''))
    return Number.isFinite(count) ? sum + count : sum
  }, 0)
}

async function fetchContributionsSoFar(username, fromDateText) {
  const now = new Date()
  const from = new Date(fromDateText)

  if (Number.isNaN(from.getTime())) {
    throw new Error('Invalid GitHub account creation date.')
  }

  const fromText = from.toISOString().slice(0, 10)
  const toText = now.toISOString().slice(0, 10)

  const response = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${fromText}&to=${toText}`,
    {
      headers: {
        Accept: 'image/svg+xml,text/plain,*/*',
        'User-Agent': 'nuthan-portfolio',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Unable to fetch GitHub contribution graph.')
  }

  const svgText = await response.text()
  return sumContributionCounts(svgText)
}

async function fetchContributionsCurrentYear(username) {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const fromText = startOfYear.toISOString().slice(0, 10)
  const toText = now.toISOString().slice(0, 10)

  const response = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${fromText}&to=${toText}`,
    {
      headers: {
        Accept: 'image/svg+xml,text/plain,*/*',
        'User-Agent': 'nuthan-portfolio',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Unable to fetch GitHub current-year contributions.')
  }

  const svgText = await response.text()
  return sumContributionCounts(svgText)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).json({ ok: false, error: 'Method not allowed.' })
    return
  }

  try {
    const username = parseGithubUsername(req.query?.username)
    if (!username) {
      res.status(400).json({ ok: false, error: 'GitHub username is required.' })
      return
    }

    const userStats = await fetchUserStats(username)
    const [contributionsCurrentYear, contributionsSoFar] = await Promise.all([
      fetchContributionsCurrentYear(username),
      fetchContributionsSoFar(username, userStats.createdAt),
    ])

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json({
      ok: true,
      username,
      publicRepos: userStats.publicRepos,
      contributionsCurrentYear,
      contributionsSoFar,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('GitHub stats endpoint error:', error)
    res.status(500).json({ ok: false, error: 'Unable to fetch GitHub stats right now.' })
  }
}
