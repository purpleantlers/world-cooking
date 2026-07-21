import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Env Variables: Simple manual parser
const envPath = resolve(__dirname, '.env')
const envVars = {}
try {
  const envFile = readFileSync(envPath, 'utf8')
  // Normalize Windows (\r\n) and Unix (\n) line endings
  for (const line of envFile.replace(/\r/g, '').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    // Remove any surrounding quotes from the value
    const value = trimmed
      .slice(eqIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '')
    envVars[key] = value
  }
} catch {
  console.error(
    '❌ Could not read scripts/.env — see instructions at the bottom of this file.',
  )
  process.exit(1)
}

const SUPABASE_URL = envVars.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY
const GEMINI_API_KEY = envVars.GEMINI_API_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
  console.error(
    '❌ Missing env vars. Check scripts/.env has SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY.',
  )
  process.exit(1)
}

// Debug: confirm keys loaded correctly
const mask = (s) =>
  s ? `${s.slice(0, 6)}...${s.slice(-6)} (${s.length} chars)` : 'MISSING'
console.log('   SUPABASE_URL:              ', SUPABASE_URL)
console.log('   SUPABASE_SERVICE_ROLE_KEY: ', mask(SUPABASE_SERVICE_ROLE_KEY))
console.log('   GEMINI_API_KEY:            ', mask(GEMINI_API_KEY))
console.log('')

// Country list
const world = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Costa Rica',
  "Côte d'Ivoire",
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Federated States of Micronesia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Republic of the Congo',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'São Tomé and Príncipe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]

// Supabase REST API helpers
const supabaseHeaders = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  Prefer: 'return=minimal',
}

const supabaseGet = async (table, select = '*') => {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`
  const res = await fetch(url, { headers: supabaseHeaders })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GET ${table} failed (${res.status}): ${err}`)
  }
  return res.json()
}

const supabaseInsert = async (table, row) => {
  const url = `${SUPABASE_URL}/rest/v1/${table}`
  const res = await fetch(url, {
    method: 'POST',
    headers: supabaseHeaders,
    body: JSON.stringify(row),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`INSERT ${table} failed (${res.status}): ${err}`)
  }
}

// Gemini Call
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`

const buildPrompt = (
  country,
) => `You are a culinary expert. Generate food culture content for ${country} as a single JSON object.

Rules:
- Respond with ONLY raw JSON. No markdown, no backticks, no explanation before or after.
- food_culture: exactly 2 sentences, under 300 characters total.
- top_dishes: exactly 5 items, each with name (under 40 chars) and description (under 70 chars).
- chefs_tip: one sentence under 150 characters.

{"food_culture":"...","top_dishes":[{"name":"...","description":"..."},{"name":"...","description":"..."},{"name":"...","description":"..."},{"name":"...","description":"..."},{"name":"...","description":"..."}],"chefs_tip":"..."}

Now generate for: ${country}`

async function fetchCountryInfo(country) {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(country) }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!raw) throw new Error('Empty response from Gemini')

  // Strip any accidental markdown fences
  const clean = raw
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error(`Could not parse JSON for ${country}:\n${clean}`)
  }
}

// Helpers
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const pad = (n, width) => String(n).padStart(width, '0')

// Main
async function main() {
  console.log('🌍 World Cooking — Country Info Populator')
  console.log(`   ${world.length} countries to process\n`)

  // Fetch already-populated countries to skip them
  let existing
  try {
    existing = await supabaseGet('country_info', 'country')
  } catch (err) {
    console.error('❌ Could not fetch existing rows:', err.message)
    process.exit(1)
  }

  const done = new Set(existing.map((r) => r.country))
  const remaining = world.filter((c) => !done.has(c))

  console.log(`   ✅ Already done: ${done.size}`)
  console.log(`   ⏳ Remaining:    ${remaining.length}\n`)

  if (remaining.length === 0) {
    console.log('🎉 All countries already populated!')
    return
  }

  let succeeded = 0
  let failed = 0
  const errors = []

  for (let i = 0; i < remaining.length; i++) {
    const country = remaining[i]
    const progress = `[${pad(i + 1, 3)}/${pad(remaining.length, 3)}]`

    process.stdout.write(`${progress} ${country}… `)

    try {
      const info = await fetchCountryInfo(country)

      // Validate shape before inserting
      if (
        !info.food_culture ||
        !Array.isArray(info.top_dishes) ||
        info.top_dishes.length !== 5 ||
        !info.chefs_tip
      ) {
        throw new Error(
          'Response missing required fields or wrong top_dishes length',
        )
      }

      await supabaseInsert('country_info', {
        country,
        food_culture: info.food_culture,
        top_dishes: info.top_dishes,
        chefs_tip: info.chefs_tip,
      })

      console.log('✅')
      succeeded++
    } catch (err) {
      console.log(`❌ ${err.message}`)
      errors.push({ country, error: err.message })
      failed++
    }

    // Rate limit: wait 4.5s between calls, but skip the wait after the last item
    if (i < remaining.length - 1) {
      await sleep(4500)
    }
  }

  console.log('\nSummary:')
  console.log(`✅ Succeeded: ${succeeded}`)
  console.log(`❌ Failed:    ${failed}`)

  if (errors.length > 0) {
    console.log('\nFailed countries (re-run the script to retry them):')
    errors.forEach(({ country, error }) =>
      console.log(`  • ${country}: ${error}`),
    )
  }

  console.log('\n🏁 Done.')
}

main()
