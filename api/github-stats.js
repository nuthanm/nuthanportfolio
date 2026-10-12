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

function sumContributionCounts(htmlText) {
  const dataCountMatches = htmlText.match(/data-count="(\d+)"/g) || []
  if (dataCountMatches.length > 0) {
    return dataCountMatches.reduce((sum, item) => {
      const count = Number(item.replace(/[^\d]/g, ''))
      return Number.isFinite(count) ? sum + count : sum
    }, 0)
  }

  // Newer GitHub calendar markup often exposes counts via aria-label tooltips
  const tooltipMatches = htmlText.matchAll(/aria-label="[^"]*?(\d+)\s+contribution/gi)
  let total = 0
  let found = false
  for (const match of tooltipMatches) {
    found = true
    total += Number(match[1]) || 0
  }

  return found ? total : 0
}

function parseContributionTotalFromHtml(htmlText) {
  const match = htmlText.match(/([\d,]+)\s+contributions\s+in\s+\d{4}/i)
  if (!match) {
    return 0
  }

  const count = Number(String(match[1]).replace(/,/g, ''))
  return Number.isFinite(count) ? count : 0
}

async function fetchContributionsForYear(username, year) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const isCurrentYear = year === currentYear

  const fromText = `${year}-01-01`
  const toText = isCurrentYear ? now.toISOString().slice(0, 10) : `${year}-12-31`

  const response = await fetch(
    `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${fromText}&to=${toText}`,
    {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'nuthan-portfolio',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Unable to fetch GitHub contribution graph.')
  }

  const htmlText = await response.text()
  const headingTotal = parseContributionTotalFromHtml(htmlText)
  if (headingTotal > 0) {
    return headingTotal
  }

  return sumContributionCounts(htmlText)
}

async function fetchContributionsSoFar(username, fromDateText) {
  const from = new Date(fromDateText)
  if (Number.isNaN(from.getTime())) {
    throw new Error('Invalid GitHub account creation date.')
  }

  const now = new Date()
  const startYear = from.getFullYear()
  const endYear = now.getFullYear()
  const years = []
  for (let year = startYear; year <= endYear; year += 1) {
    years.push(year)
  }

  const totals = await Promise.all(years.map((year) => fetchContributionsForYear(username, year)))
  return totals.reduce((sum, count) => sum + count, 0)
}

async function fetchContributionsCurrentYear(username) {
  return fetchContributionsForYear(username, new Date().getFullYear())
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
