# MacroLens 🔍

Personal AI macro tracker for iPhone. Snap a photo of your food (or describe it), and Claude analyzes every item — portions, calories, full macros, a 1–10 health score, an eat-it-or-skip-it verdict, and what the food actually does to your body — all weighed against **your** personal plan.

## Getting it on your iPhone 15

1. **Deploy this branch.** The app lives in `public/macro-tracker/`, so once the site deploys (e.g. Vercel), it's live at `https://<your-domain>/macro-tracker/`.
2. **Open that URL in Safari** on your iPhone.
3. Tap **Share → Add to Home Screen**. It installs like a native app: full screen, its own icon, works offline for logging.

## First launch

The app walks you through onboarding:

- Your stats (age, sex, height, weight) and activity level
- Your goal (lose fat / maintain / build muscle) and pace
- It computes your plan with the Mifflin-St Jeor equation: BMR → TDEE → calorie target, plus protein (1.8–2.2 g/kg by goal), fat, and carb targets

## Enabling AI photo analysis

Analysis runs on **Claude Opus 4.8** using your own Anthropic API key:

1. Go to [console.anthropic.com](https://console.anthropic.com) → **API keys** → create a key
2. Paste it during onboarding, or later in **Settings → Anthropic API key**

The key and all your data live only in your phone's browser storage. Photos go directly from your phone to Anthropic's API — no middleman server.

> Typical cost: a photo analysis is roughly 1–3¢ per meal at Opus 4.8 pricing.

## Features

- 📷 **Photo + text analysis** — per-item breakdown with portion estimates, confidence ratings, and stated assumptions; fix any portion with the ×0.25 stepper and everything recalculates
- 🧠 **Health verdicts** — 1–10 score, "Eat it / Fine in moderation / Think twice / Skip it," pros & cons, physiological effects, and how it fits your remaining macros *today*
- ❓ **"Should I eat this?"** — check a food without logging it
- ☀️ **Today dashboard** — calorie ring, protein/carb/fat bars, meal log, streak, morning weight
- 📈 **Trends** — 14-day calories & protein vs target, weight trend, adherence stats
- ⚙️ **Adaptive plan** — logging your weight updates the profile; edit anything in Settings and the plan rebuilds
- 📤 **Export** — dump all data to JSON anytime

## Accuracy notes

The prompt forces item-by-item analysis, portion estimation from visual references, USDA-style nutrient values, restaurant-preparation assumptions (hidden oils/sauces), and internal consistency checks (calories ≈ 4P + 4C + 9F). Structured JSON output means the numbers always parse. Even so: photo-based estimation is ±10–20% at best — the portion steppers and the text field ("double rice, no beans") are there to close the gap. Consistency beats precision.
