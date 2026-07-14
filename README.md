<p align=center>
  <img src=public/logo.png alt=Logo width=250 />
</p>

<h1 align=center>World Cooking</h1>

<p>A full-stack culinary journey app where you cook your way through 196 countries, earn passport stamps, and build a personal recipe journal.</p>
 
Live app: **[World Cooking](https://world-cooking.vercel.app/)**
 
---

<h4>📔 About the Project</h4>

<p>
  <b>World Cooking</b> turns cooking into a global adventure. Each challenge assigns you a country, you explore its food culture, cook one of its dishes, document the experience, and earn a passport stamp. <b>The goal is to taste every country in the world.</b>
  
  More than just a recipe finder, it's a virtual cultural exchange with a delicious result! You can pick a <b>specific country</b> or take a culinary leap of faith with a <b>random destination</b>. Either way, we make researching and choosing a dish an exciting part of the journey.
</p>

<h4>🔪 Core Features</h4>

  <h5>🗺️ Challenge</h5>
    <ul>
      <li>Pick a country manually via a searchable dropdown, or hit <b>Discover Country</b> for a random one you haven't tasted yet</li>
      <li>Each challenge page shows AI-generated food culture, top 5 must-try dishes (each linking to a Google search), and a chef's tip</li>
      <li>Log what you cooked, add ingredients, method, an introduction, and a photo</li>
      <li>Multiple recipes per country, each gets its own expandable card</li>
      <li>Mark the challenge as Done to earn your stamp, or Cancel to discard it</li>
    </ul>

  <h5>📘 Passport</h5>
    <ul>
      <li>Book-style passport with swipe/drag navigation</li>
      <li>Each completed country earns an ink-stamped flag</li>
      <li>Profile page with avatar, name, date of birth and progress bar</li>
      <li>Click any stamp to see logged recipes, each links directly to its Journal entry</li>
    </ul>

  <h5>📖 Journal</h5>
    <ul>
      <li>Every logged recipe appears as a card with photo, country flag, date, and entry number</li>
      <li>Search by recipe name or country</li>
      <li>Filter by continent</li>
      <li>Click any card to open the full entry, view or edit all fields including photo</li>
    </ul>

<h4>🍴 Tech Stack</h4>

<p>This app is baked in <b>Vite</b>, whisked with <b>React</b> and seasoned with <b>Tailwind CSS</b> flavours. It's served on <b>Supabase</b> for a persistent savoury finish, with <b>Postgres</b> holding the recipes, <b>Auth</b> keeping the kitchen secure, and <b>Storage</b> preserving every food photo. A pinch of <b>Gemini AI</b> adds the cultural garnish, and the whole dish is plated fresh on <b>Vercel</b>.</p>

<h4>📈 Database Schema</h4>
 
```
profiles
  user_id, passport_number, avatar_id, first_name, last_name, date_of_birth
 
tasted_countries
  user_id, country, created_at
 
recipes
  user_id, tasted_country_id, name, intro, ingredients, method,
  photo_url, entry_number (auto-assigned), created_at
 
current_challenge
  user_id, country, recipes (jsonb)
 
country_info
  country (PK), food_culture, top_dishes (jsonb), chefs_tip, image_url
```
 
All user tables have Row Level Security enabled and can only read and write their own data. `country_info` is public read-only.

<h4>💾 Storage</h4>
 
Recipe photos are stored in a Supabase Storage bucket (`recipe-photos`). Photos are compressed client-side to ~500KB before upload and validated against PNG/JPEG magic bytes. Each user's photos are stored under their own folder and only accessible by them.

<h4>💻Local Development</h4>

<h5>Prerequisites</h5>
  <ul>
    <li>Node.js 18+</li>
    <li>pnpm</li>
    <li>Supabase project</li>
  </ul>

<h5>Setup</h5>
<b>1. Clone the repository</b>

```
git clone https://github.com/purpleantlers/world-cooking.git

cd world-cooking
```

<b>2. Install dependencies</b>

```
pnpm install
```

<b>3. Create your environment file</b>

```
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

<b>4. Environment variables</b>

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Never commit `.env`, it's in `.gitignore`.

<b>5. Run tests</b>

```
pnpm test
```

<b>6. Start the dev server</b>

```
pnpm dev
```

<h5>Populating Country Info (AI)</h5>

The `country_info` table is populated once using the Gemini API via a Node script:

<b>1. Create the script .env file</b>

```
cp scripts/.env.example scripts/.env
```

Fill in `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`

<b>2. Run the script (takes ~15 minutes for all 196 countries)</b>

```
node scripts/populateCountryInfo.js
```

The script skips countries already in the table, so it's safe to re-run if interrupted.

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

<h4>👨‍🍳 Contact</h4>
   <p>
    <a href='https://purpleantlers.dev'>
      <b>Purple Antlers</b>
    </a>
    <br />
    <i>info@purpleantlers.dev</i>
   </p>
