/* ============================================================
   MacroLens — personal AI macro tracker
   Photo/text food analysis via Claude API (claude-opus-4-8),
   personalized macro plan, daily logging, trends. All data local.
   ============================================================ */
"use strict";

/* ---------------- Accounts ---------------- */
const Accounts = {
  KEY: "macrolens.accounts",
  reg: null,
  load() {
    try { this.reg = JSON.parse(localStorage.getItem(this.KEY)) || null; }
    catch { this.reg = null; }
    if (!this.reg) this.reg = { accounts: [], lastActive: null };
    this.migrateLegacy();
    return this.reg;
  },
  save() { localStorage.setItem(this.KEY, JSON.stringify(this.reg)); },
  // Pre-account versions stored everything under one key — fold it into the first account
  migrateLegacy() {
    const legacy = localStorage.getItem("macrolens.v1");
    if (!legacy) return;
    try {
      const data = JSON.parse(legacy);
      const id = "acct_" + Date.now().toString(36);
      this.reg.accounts.push({ id, name: (data.profile && data.profile.name) || "Me", created: Date.now(), pinHash: null, salt: null });
      localStorage.setItem("macrolens.data." + id, legacy);
      this.reg.lastActive = id;
      this.save();
    } catch { /* corrupted legacy data — drop it */ }
    localStorage.removeItem("macrolens.v1");
  },
  get(id) { return this.reg.accounts.find((a) => a.id === id); },
  create(name) {
    const id = "acct_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const acct = { id, name: name || "New user", created: Date.now(), pinHash: null, salt: null };
    this.reg.accounts.push(acct);
    this.save();
    return acct;
  },
  remove(id) {
    this.reg.accounts = this.reg.accounts.filter((a) => a.id !== id);
    if (this.reg.lastActive === id) this.reg.lastActive = null;
    localStorage.removeItem("macrolens.data." + id);
    this.save();
  },
  async hashPin(pin, salt) {
    const msg = salt + ":" + pin;
    if (crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    // non-secure-context fallback (http on LAN): weak but better than nothing
    let h = 2166136261;
    for (let i = 0; i < msg.length; i++) { h ^= msg.charCodeAt(i); h = Math.imul(h, 16777619); }
    return "fnv" + (h >>> 0).toString(16);
  },
  async setPin(id, pin) {
    const a = this.get(id);
    if (!a) return;
    if (!pin) { a.pinHash = null; a.salt = null; }
    else {
      a.salt = Math.random().toString(36).slice(2, 10);
      a.pinHash = await this.hashPin(pin, a.salt);
    }
    this.save();
  },
  async verifyPin(id, pin) {
    const a = this.get(id);
    if (!a || !a.pinHash) return true;
    return (await this.hashPin(pin, a.salt)) === a.pinHash;
  },
};

/* ---------------- Per-account storage ---------------- */
let CURRENT = null; // active account id
let S = null;       // active account's data
const Store = {
  key() { return "macrolens.data." + CURRENT; },
  load(accountId) {
    CURRENT = accountId;
    let d = null;
    try { d = JSON.parse(localStorage.getItem(this.key())); } catch { /* fresh */ }
    S = d || { onboarded: false, profile: {}, plan: {}, apiKey: "", log: {}, foods: {} };
    if (!S.foods) S.foods = {}; // accounts created before the food library existed
    this.reconcileFutureDays();
    this.backfillFoods();
    return S;
  },

  // Recover meals the old UTC-date bug filed under a future day. Any log dated
  // after today (local) is impossible real data — it was an evening meal pushed
  // forward one day by UTC. Pull those meals back onto the prior calendar day.
  reconcileFutureDays() {
    const today = todayKey();
    let moved = 0;
    for (const key of Object.keys(S.log || {})) {
      if (key <= today) continue;
      const src = S.log[key];
      const [y, m, dd] = key.split("-").map(Number);
      const prev = dateKey(new Date(y, m - 1, dd - 1));
      const dst = (S.log[prev] = S.log[prev] || { meals: [], weight: null });
      dst.meals = (dst.meals || []).concat(src.meals || []);
      if (dst.weight == null && src.weight != null) dst.weight = src.weight;
      moved += (src.meals || []).length;
      delete S.log[key];
    }
    if (moved) { S._recoveredMeals = (S._recoveredMeals || 0) + moved; this.save(); }
  },

  // One-time: seed the food library from meals logged before the library existed
  backfillFoods() {
    if (S.foodsBackfilled) return;
    for (const day of Object.values(S.log || {})) {
      for (const m of (day.meals || [])) {
        if (!m.name) continue;
        const key = String(m.name).trim().toLowerCase();
        const ex = S.foods[key];
        if (ex) {
          ex.count += 1;
          ex.lastUsed = Math.max(ex.lastUsed || 0, m.id || 0);
        } else {
          S.foods[key] = {
            name: m.name,
            count: 1,
            lastUsed: m.id || Date.now(),
            items: (m.items || []).map(({ mult, ...it }) => ({ ...it })),
            health: m.health ? { ...m.health } : null,
            assumptions: [],
          };
        }
      }
    }
    S.foodsBackfilled = true;
    this.save();
  },
  save() { if (CURRENT) localStorage.setItem(this.key(), JSON.stringify(S)); },
};

/* ---------------- Utilities ---------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const round = (n, d = 0) => { const f = 10 ** d; return Math.round((+n || 0) * f) / f; };

// LOCAL calendar date (YYYY-MM-DD). Using toISOString() here was a bug: it
// returns UTC, so the "day" rolled over in the early evening for anyone west
// of UTC (e.g. Mountain Time flips at ~5–6pm), wiping the Today view early.
function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return dateKey(d);
}
function prettyDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (key === todayKey()) return "Today";
  if (key === todayKey(-1)) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
function dayEntry(key = todayKey()) {
  if (!S.log[key]) S.log[key] = { meals: [], weight: null };
  return S.log[key];
}
function toast(msg, ms = 2200) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.add("hidden"), ms);
}
const KG_PER_LB = 0.45359237;
function displayWeight(kg) {
  return S.profile.units === "metric" ? `${round(kg, 1)} kg` : `${round(kg / KG_PER_LB, 1)} lb`;
}

/* ---------------- Plan math (Mifflin-St Jeor) ---------------- */
const PACES = {
  cut: [
    { v: 0.25, label: "Chill · −0.25 kg/wk" },
    { v: 0.5, label: "Steady · −0.5 kg/wk" },
    { v: 0.75, label: "Aggressive · −0.75 kg/wk" },
  ],
  bulk: [
    { v: 0.125, label: "Lean · +0.125 kg/wk" },
    { v: 0.25, label: "Standard · +0.25 kg/wk" },
    { v: 0.5, label: "Fast · +0.5 kg/wk" },
  ],
  maintain: [{ v: 0, label: "Maintain" }],
};

function computePlan(p) {
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === "male" ? 5 : -161);
  const tdee = bmr * p.activity;
  // 7700 kcal ≈ 1 kg of body fat
  const dailyAdj = (p.pace * 7700) / 7;
  let calories = p.goal === "cut" ? tdee - dailyAdj : p.goal === "bulk" ? tdee + dailyAdj : tdee;
  calories = Math.max(calories, Math.max(1200, bmr * 0.95)); // never starve below a safe floor
  const proteinPerKg = p.goal === "cut" ? 2.2 : p.goal === "bulk" ? 2.0 : 1.8;
  const protein = p.weightKg * proteinPerKg;
  let fat = Math.max((calories * 0.27) / 9, p.weightKg * 0.6); // ~27% cals, min 0.6 g/kg for hormones
  let carbs = (calories - protein * 4 - fat * 9) / 4;
  if (carbs < 50) { carbs = 50; fat = (calories - protein * 4 - carbs * 4) / 9; }
  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee), calories: Math.round(calories),
    protein: Math.round(protein), carbs: Math.round(carbs), fat: Math.round(fat),
  };
}

/* ============================================================
   LOGIN — account picker
   ============================================================ */
const Login = {
  show() {
    $("#main").classList.add("hidden");
    $("#onboarding").classList.add("hidden");
    $("#login").classList.remove("hidden");
    const accts = Accounts.reg.accounts;
    $("#login-body").innerHTML = `
      <div class="ob-hero">🔍</div>
      <h1>MacroLens</h1>
      <p class="lead">${accts.length ? "Who's tracking?" : "Snap your food, know your macros.<br>Create an account to get started."}</p>
      <div class="choice-list" style="margin-top:28px">
        ${accts.map((a) => `
          <button onclick="Login.pick('${a.id}')">
            <b>${esc(a.name)}</b>
            <span>${a.pinHash ? "🔒 PIN protected" : "Tap to open"}</span>
          </button>`).join("")}
        <button onclick="Login.newAccount()" style="border-style:dashed">
          <b>＋ ${accts.length ? "New account" : "Create my account"}</b>
          <span>Own profile, plan &amp; progress</span>
        </button>
      </div>
      <div id="pin-area"></div>`;
    $("#login").scrollTo(0, 0);
  },

  pick(id) {
    const a = Accounts.get(id);
    if (!a) return;
    if (!a.pinHash) return this.enter(id);
    $("#pin-area").innerHTML = `
      <label>PIN for ${esc(a.name)}
        <input id="pin-in" type="password" inputmode="numeric" maxlength="8" placeholder="••••" autocomplete="off">
      </label>
      <button class="btn primary big" onclick="Login.tryPin('${id}')">Unlock</button>`;
    $("#pin-in").focus();
    $("#pin-in").addEventListener("keydown", (e) => { if (e.key === "Enter") this.tryPin(id); });
  },

  async tryPin(id) {
    if (await Accounts.verifyPin(id, $("#pin-in").value)) this.enter(id);
    else { toast("Wrong PIN"); $("#pin-in").value = ""; }
  },

  enter(id) {
    Accounts.reg.lastActive = id;
    Accounts.save();
    Store.load(id);
    $("#login").classList.add("hidden");
    if (S.onboarded) App.boot();
    else OB.startFresh();
  },

  newAccount() {
    const acct = Accounts.create("");
    this.enter(acct.id); // fresh data → straight into onboarding
  },

  logout() {
    Accounts.reg.lastActive = null;
    Accounts.save();
    CURRENT = null; S = null;
    Sheet.close();
    this.show();
  },
};

/* ============================================================
   ONBOARDING
   ============================================================ */
const OB = {
  step: 0, TOTAL: 6,
  draft: { sex: "male", units: "imperial", activity: null, goal: null, pace: null, provider: "gemini" },

  // Fresh account: wipe the wizard's previous state before starting
  startFresh() {
    this.step = 0;
    this.draft = { sex: "male", units: "imperial", activity: null, goal: null, pace: null, provider: "gemini" };
    ["#ob-name", "#ob-age", "#ob-hft", "#ob-hin", "#ob-wlb", "#ob-hcm", "#ob-wkg", "#ob-key", "#ob-pin", "#ob-notes"]
      .forEach((sel) => { const el = $(sel); if (el) el.value = ""; });
    $$("#ob-activity button, #ob-goal button").forEach((b) => b.classList.remove("on"));
    $("#ob-pace-wrap").classList.add("hidden");
    $("#ob-goal-next").classList.add("hidden");
    $$(".ob-step").forEach((s) => s.classList.toggle("hidden", +s.dataset.step !== 0));
    this.start();
  },

  start() {
    $("#onboarding").classList.remove("hidden");
    $("#main").classList.add("hidden");
    this.renderProgress();
    this.bind();
    // Prefill when editing an existing profile
    const p = S.profile;
    if (p && p.age) {
      $("#ob-name").value = p.name || "";
      $("#ob-age").value = p.age;
      this.draft.sex = p.sex; this.draft.units = p.units;
      if (p.units === "metric") {
        $("#ob-hcm").value = round(p.heightCm); $("#ob-wkg").value = round(p.weightKg, 1);
      } else {
        const totalIn = p.heightCm / 2.54;
        $("#ob-hft").value = Math.floor(totalIn / 12); $("#ob-hin").value = Math.round(totalIn % 12);
        $("#ob-wlb").value = round(p.weightKg / KG_PER_LB, 1);
      }
      if ($("#ob-notes")) $("#ob-notes").value = p.notes || "";
      this.syncSegs();
    } else {
      this.syncSegs();
    }
  },

  bind() {
    if (this._bound) return; this._bound = true;
    const segTap = (id, key, cb) => {
      $(id).addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        this.draft[key] = b.dataset.v;
        this.syncSegs(); cb && cb();
      });
    };
    segTap("#ob-sex", "sex");
    segTap("#ob-units", "units", () => {
      $("#ob-imperial").classList.toggle("hidden", this.draft.units === "metric");
      $("#ob-metric").classList.toggle("hidden", this.draft.units !== "metric");
    });
    segTap("#ob-provider", "provider", () => this.updateProviderUI());
    $("#ob-activity").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      this.draft.activity = parseFloat(b.dataset.v);
      $$("#ob-activity button").forEach((x) => x.classList.toggle("on", x === b));
      setTimeout(() => this.next(), 250);
    });
    $("#ob-goal").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      this.draft.goal = b.dataset.v;
      $$("#ob-goal button").forEach((x) => x.classList.toggle("on", x === b));
      this.renderPace();
    });
    $("#ob-pace").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      this.draft.pace = parseFloat(b.dataset.v);
      $$("#ob-pace button").forEach((x) => x.classList.toggle("on", x === b));
      $("#ob-goal-next").classList.remove("hidden");
    });
  },

  syncSegs() {
    $$("#ob-sex button").forEach((b) => b.classList.toggle("on", b.dataset.v === this.draft.sex));
    $$("#ob-units button").forEach((b) => b.classList.toggle("on", b.dataset.v === this.draft.units));
    $("#ob-imperial").classList.toggle("hidden", this.draft.units === "metric");
    $("#ob-metric").classList.toggle("hidden", this.draft.units !== "metric");
    this.updateProviderUI();
  },

  updateProviderUI() {
    const p = PROVIDERS[this.draft.provider] || PROVIDERS.gemini;
    $$("#ob-provider button").forEach((b) => b.classList.toggle("on", b.dataset.v === this.draft.provider));
    $("#ob-provider-hint").textContent = p.hint;
    $("#ob-key").placeholder = p.placeholder;
  },

  renderPace() {
    const wrap = $("#ob-pace-wrap"), seg = $("#ob-pace");
    const opts = PACES[this.draft.goal];
    seg.innerHTML = opts.map((o) => `<button data-v="${o.v}">${o.label}</button>`).join("");
    wrap.classList.remove("hidden");
    $("#ob-pace-label").textContent = this.draft.goal === "maintain" ? "Pace" : "How fast?";
    if (this.draft.goal === "maintain") {
      this.draft.pace = 0;
      seg.querySelector("button").classList.add("on");
      $("#ob-goal-next").classList.remove("hidden");
    } else {
      this.draft.pace = null;
      $("#ob-goal-next").classList.add("hidden");
    }
  },

  renderProgress() {
    $("#ob-progress").innerHTML = Array.from({ length: this.TOTAL }, (_, i) =>
      `<i class="${i <= this.step ? "on" : ""}"></i>`).join("");
  },

  validate(step) {
    const d = this.draft;
    if (step === 1) {
      d.name = $("#ob-name").value.trim() || "there";
      d.age = parseInt($("#ob-age").value, 10);
      if (!d.age || d.age < 13 || d.age > 100) return "Enter a valid age";
      if (d.units === "metric") {
        d.heightCm = parseFloat($("#ob-hcm").value);
        d.weightKg = parseFloat($("#ob-wkg").value);
      } else {
        const ft = parseFloat($("#ob-hft").value), inch = parseFloat($("#ob-hin").value) || 0;
        d.heightCm = (ft * 12 + inch) * 2.54;
        d.weightKg = parseFloat($("#ob-wlb").value) * KG_PER_LB;
      }
      if (!d.heightCm || d.heightCm < 90 || d.heightCm > 250) return "Enter a valid height";
      if (!d.weightKg || d.weightKg < 30 || d.weightKg > 350) return "Enter a valid weight";
    }
    if (step === 2 && !d.activity) return "Pick an activity level";
    if (step === 3 && (d.goal === null || d.pace === null)) return "Pick a goal";
    return null;
  },

  next() {
    const err = this.validate(this.step);
    if (err) { toast(err); return; }
    this.step++;
    if (this.step === 4) this.renderPlan();
    $$(".ob-step").forEach((s) => s.classList.toggle("hidden", +s.dataset.step !== this.step));
    this.renderProgress();
    $("#onboarding").scrollTo(0, 0);
  },

  renderPlan() {
    const plan = computePlan(this.draft);
    this.draft._plan = plan;
    $("#plan-title").textContent = `${this.draft.name === "there" ? "Your" : this.draft.name + "'s"} plan`;
    const goalTxt = { cut: "fat loss", maintain: "maintenance", bulk: "muscle gain" }[this.draft.goal];
    $("#plan-card").innerHTML = `
      <div class="plan-card">
        <div class="plan-cal"><div class="num">${plan.calories.toLocaleString()}</div><div class="lbl">calories / day for ${goalTxt}</div></div>
        <div class="plan-macros">
          <div><div class="num">${plan.protein}g</div><div class="lbl"><span class="dot p"></span>Protein</div></div>
          <div><div class="num">${plan.carbs}g</div><div class="lbl"><span class="dot c"></span>Carbs</div></div>
          <div><div class="num">${plan.fat}g</div><div class="lbl"><span class="dot f"></span>Fat</div></div>
        </div>
        <div class="plan-meta">
          BMR ${plan.bmr.toLocaleString()} kcal · TDEE ${plan.tdee.toLocaleString()} kcal<br>
          Protein set at ${this.draft.goal === "cut" ? "2.2" : this.draft.goal === "bulk" ? "2.0" : "1.8"} g/kg to ${this.draft.goal === "cut" ? "protect muscle in a deficit" : this.draft.goal === "bulk" ? "maximize muscle growth" : "support recomposition"}.
        </div>
      </div>`;
  },

  async finish(withKey) {
    S.provider = this.draft.provider || "gemini";
    if (withKey) {
      const k = $("#ob-key").value.trim();
      if (!k) { toast("Paste your API key, or tap Skip"); return; }
      if (S.provider === "gemini") S.geminiKey = k;
      else S.apiKey = k;
    }
    const d = this.draft;
    d.notes = $("#ob-notes") ? $("#ob-notes").value.trim() : (d.notes || "");
    S.profile = {
      name: d.name, age: d.age, sex: d.sex, units: d.units,
      heightCm: d.heightCm, weightKg: d.weightKg,
      activity: d.activity, goal: d.goal, pace: d.pace, notes: d.notes,
    };
    S.plan = d._plan || computePlan(d);
    S.onboarded = true;
    Store.save();
    // Sync the account record: display name + optional PIN
    const acct = Accounts.get(CURRENT);
    if (acct) {
      acct.name = d.name === "there" ? "Me" : d.name;
      const pin = $("#ob-pin") ? $("#ob-pin").value.trim() : "";
      if (pin) await Accounts.setPin(CURRENT, pin);
      Accounts.save();
    }
    $("#onboarding").classList.add("hidden");
    App.boot();
    toast(`Plan ready — ${S.plan.calories.toLocaleString()} kcal/day 💪`);
    // If notes were given and a key exists, let the AI fine-tune the targets
    if (d.notes && AI.hasKey()) App.tunePlanFromNotes(true);
  },
};

/* ============================================================
   AI — food analysis (Claude or Gemini)
   ============================================================ */
const PROVIDERS = {
  gemini: {
    label: "Google Gemini",
    model: "Gemini 2.5 Flash",
    cost: "Free",
    hint: "Free — no credit card needed. Get a key at aistudio.google.com → \"Get API key\". Strong accuracy; the free tier covers a couple hundred analyses per day.",
    placeholder: "AIza…",
  },
  claude: {
    label: "Anthropic Claude",
    model: "Claude Opus 4.8",
    cost: "~2–4¢ / meal",
    hint: "The most accurate photo analysis (Claude Opus 4.8). Pay-as-you-go, roughly 2–4¢ per analysis (and your food library makes repeats free). Get a key at console.anthropic.com → API keys.",
    placeholder: "sk-ant-…",
  },
};

const AI = {
  MODEL: "claude-opus-4-8",
  GEMINI_MODEL: "gemini-2.5-flash",

  provider() { return S.provider === "gemini" ? "gemini" : "claude"; },
  hasKey() { return this.provider() === "gemini" ? !!S.geminiKey : !!S.apiKey; },

  schema: {
    type: "object",
    additionalProperties: false,
    required: ["meal_name", "items", "health", "assumptions"],
    properties: {
      meal_name: { type: "string", description: "Short human name for this food/meal, e.g. 'Chicken burrito bowl'" },
      items: {
        type: "array",
        description: "Every distinct food item, analyzed separately",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["name", "portion", "grams", "calories", "protein_g", "carbs_g", "fat_g", "fiber_g", "sugar_g", "sodium_mg", "confidence"],
          properties: {
            name: { type: "string" },
            portion: { type: "string", description: "Human-readable portion, e.g. '1 cup, cooked' or '~180g fillet'" },
            grams: { type: "number", description: "Estimated weight in grams" },
            calories: { type: "number" },
            protein_g: { type: "number" },
            carbs_g: { type: "number" },
            fat_g: { type: "number" },
            fiber_g: { type: "number" },
            sugar_g: { type: "number" },
            sodium_mg: { type: "number" },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
          },
        },
      },
      health: {
        type: "object",
        additionalProperties: false,
        required: ["score", "verdict", "summary", "pros", "cons", "body_effects", "fit_with_goals"],
        properties: {
          score: { type: "integer", description: "Overall healthfulness 1-10 (10 = extremely nutritious whole food)" },
          verdict: { type: "string", enum: ["eat_it", "ok_in_moderation", "think_twice", "skip_it"] },
          summary: { type: "string", description: "One-sentence bottom line for this user specifically" },
          pros: { type: "array", items: { type: "string" } },
          cons: { type: "array", items: { type: "string" } },
          body_effects: { type: "string", description: "2-4 sentences: what this food does physiologically (blood sugar, satiety, digestion, inflammation, energy)" },
          fit_with_goals: { type: "string", description: "1-2 sentences: how it fits this user's remaining macros and goal today" },
        },
      },
      assumptions: { type: "array", items: { type: "string" }, description: "Key assumptions made (cooking oil, dressing, hidden ingredients, portion basis)" },
    },
  },

  systemPrompt() {
    const p = S.profile, plan = S.plan;
    const t = App.dayTotals(todayKey());
    return `You are the analysis engine inside MacroLens, a personal macro-tracking app. Your job is maximally accurate nutritional analysis of foods from photos and/or text descriptions.

Accuracy rules:
- Identify every distinct food item separately. Never lump a plate into one generic entry.
- Estimate portion sizes carefully. Use visual references when a photo is provided: plate diameter (~27cm dinner plate), utensils, hands, cans, standard containers. State the gram estimate you used.
- Base nutrient values on USDA FoodData Central-style reference data for the cooked/prepared form shown.
- Account for the invisible stuff: cooking oil/butter (restaurant food typically +100-250 kcal from added fats), dressings, sauces, sugar in drinks. If the food looks restaurant-made, assume restaurant preparation.
- If a photo is ambiguous, choose the most likely interpretation and record it under assumptions, and lower the confidence rating on affected items.
- Numbers must be internally consistent: calories ≈ 4×protein + 4×carbs + 9×fat (±10% for fiber/alcohol rounding).

Health analysis rules:
- Score 1-10 on overall healthfulness: nutrient density, processing level, fiber, protein quality, added sugar, sodium, saturated/trans fat.
- The verdict must weigh BOTH intrinsic healthfulness AND this specific user's goals and remaining budget today.
- body_effects: explain concretely what happens in the body after eating this (glycemic response, satiety hormones, digestion speed, inflammation, energy curve). Be scientific but plain-spoken. No fearmongering; no moralizing.
- Be honest. If it's junk, say so and say why. If it's fine, don't invent problems.

User context (use it for the verdict and fit_with_goals):
- ${p.sex}, ${p.age}y, ${round(p.heightCm)}cm, ${round(p.weightKg, 1)}kg. Goal: ${p.goal === "cut" ? "fat loss" : p.goal === "bulk" ? "muscle gain" : "maintenance"}.
- Daily targets: ${plan.calories} kcal, ${plan.protein}g protein, ${plan.carbs}g carbs, ${plan.fat}g fat.
- Already eaten today: ${Math.round(t.calories)} kcal, ${Math.round(t.protein)}g P, ${Math.round(t.carbs)}g C, ${Math.round(t.fat)}g F.
- Remaining today: ${Math.max(0, Math.round(plan.calories - t.calories))} kcal, ${Math.max(0, Math.round(plan.protein - t.protein))}g protein.${p.notes ? `
- The user's own notes about their diet, preferences, and situation (weigh these in the verdict, pros/cons, and fit_with_goals — e.g. honor allergies, dietary style, and personal targets): "${p.notes}"` : ""}`;
  },

  planSchema: {
    type: "object",
    additionalProperties: false,
    required: ["calories", "protein_g", "carbs_g", "fat_g", "reason"],
    properties: {
      calories: { type: "integer" },
      protein_g: { type: "integer" },
      carbs_g: { type: "integer" },
      fat_g: { type: "integer" },
      reason: { type: "string", description: "One or two plain sentences on what you changed and why, addressed to the user. If nothing needed changing, say the baseline already fits their notes." },
    },
  },

  // Adjust the computed macro targets based on the user's free-text notes.
  async adjustPlan(profile, baseline) {
    if (!this.hasKey()) throw new Error("NO_KEY");
    const sys = `You tune a daily macro plan for a personal nutrition app. A baseline plan was computed with the Mifflin-St Jeor equation. Adjust the four daily targets ONLY if the user's notes warrant it (dietary style like keto/vegan/low-carb, training demands, medical/allergy considerations, or an explicit personal target such as "protein around 200g"). Keep changes safe, evidence-based, and modest — never below ~1200 kcal or ~0.6 g/kg fat. If the notes don't call for changes, return the baseline numbers unchanged and say so. Keep calories roughly consistent with 4×protein + 4×carbs + 9×fat.`;
    const user = `Profile: ${profile.sex}, ${profile.age}y, ${round(profile.heightCm)}cm, ${round(profile.weightKg, 1)}kg, goal ${profile.goal}.
Baseline targets: ${baseline.calories} kcal, ${baseline.protein}g protein, ${baseline.carbs}g carbs, ${baseline.fat}g fat.
User's notes: "${profile.notes}"
Return the adjusted daily targets.`;

    if (this.provider() === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.GEMINI_MODEL}:generateContent?key=${encodeURIComponent(S.geminiKey)}`;
      const res = await fetch(url, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sys }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { responseMimeType: "application/json", responseSchema: this.geminiSchema(this.planSchema), maxOutputTokens: 2048 },
        }),
      });
      if (!res.ok) throw new Error(`Gemini error (${res.status})`);
      const data = await res.json();
      const txt = data.candidates?.[0]?.content?.parts?.map((x) => x.text || "").join("");
      if (!txt) throw new Error("Empty response");
      return JSON.parse(txt);
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": S.apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({
        model: this.MODEL, max_tokens: 1500,
        output_config: { format: { type: "json_schema", schema: this.planSchema }, effort: "low" },
        system: sys, messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) throw new Error(`API error (${res.status})`);
    const data = await res.json();
    this.trackUsage(data.usage);
    const textBlock = (data.content || []).find((b) => b.type === "text");
    if (!textBlock) throw new Error("Empty response");
    return JSON.parse(textBlock.text);
  },

  async analyze({ images = [], text }) {
    if (!this.hasKey()) throw new Error("NO_KEY");
    const multi = images.length > 1
      ? `These ${images.length} photos belong to ONE log entry — they may show the same food from different angles, or separate plates/items of the same meal. Identify every distinct food across all photos, but never double-count a food that appears in more than one photo. `
      : "";
    const userText = (text && text.trim())
      ? `${multi}Analyze this food. Additional context from me: ${text.trim()}`
      : `${multi}Analyze this food${images.length ? " photo" + (images.length > 1 ? "s" : "") : ""}. Break down every item with portions and full macros, then give the health analysis.`;
    const parsed = this.provider() === "gemini"
      ? await this.callGemini({ images, userText })
      : await this.callClaude({ images, userText });
    // Normalize + attach per-item multiplier for portion adjustment
    parsed.items = (parsed.items || []).map((it) => ({ ...it, mult: 1 }));
    return parsed;
  },

  async callClaude({ images, userText }) {
    const content = images.map((p) => ({
      type: "image",
      source: { type: "base64", media_type: p.mediaType, data: p.base64 },
    }));
    content.push({ type: "text", text: userText });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": S.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: this.MODEL,
        // Cost controls: medium effort trims thinking/output tokens (the
        // expensive side at $25/MTok) while keeping Opus-level analysis;
        // max_tokens caps any runaway response.
        max_tokens: 4000,
        thinking: { type: "adaptive" },
        output_config: { format: { type: "json_schema", schema: this.schema }, effort: "medium" },
        system: this.systemPrompt(),
        messages: [{ role: "user", content }],
      }),
    });

    if (!res.ok) {
      let msg = `API error (${res.status})`;
      try {
        const e = await res.json();
        if (e?.error?.message) msg = e.error.message;
      } catch { /* keep generic message */ }
      if (res.status === 401) msg = "API key was rejected. Check it in Settings.";
      if (res.status === 429) msg = "Rate limited — wait a few seconds and try again.";
      if (res.status === 529) msg = "Claude is overloaded right now — try again in a moment.";
      throw new Error(msg);
    }

    const data = await res.json();
    if (data.stop_reason === "refusal") throw new Error("The AI declined to analyze this image. Try a different photo or describe the food in text.");
    const textBlock = (data.content || []).find((b) => b.type === "text");
    if (!textBlock) throw new Error("Empty response from the AI — try again.");
    let parsed;
    try { parsed = JSON.parse(textBlock.text); }
    catch { throw new Error("Couldn't parse the analysis — try again."); }
    parsed._costUSD = this.trackUsage(data.usage);
    return parsed;
  },

  // Opus 4.8 pricing: $5 / 1M input tokens, $25 / 1M output tokens
  trackUsage(usage) {
    if (!usage) return null;
    const inTok = (usage.input_tokens || 0) + (usage.cache_creation_input_tokens || 0) + (usage.cache_read_input_tokens || 0);
    const outTok = usage.output_tokens || 0;
    const cost = (inTok * 5 + outTok * 25) / 1e6;
    S.usage = S.usage || { inTok: 0, outTok: 0, cost: 0, calls: 0 };
    S.usage.inTok += inTok; S.usage.outTok += outTok;
    S.usage.cost += cost; S.usage.calls += 1;
    Store.save();
    return cost;
  },

  // Gemini's responseSchema rejects additionalProperties — strip it recursively
  geminiSchema(schema = this.schema) {
    const strip = (s) => {
      if (Array.isArray(s)) return s.map(strip);
      if (s && typeof s === "object") {
        const o = {};
        for (const [k, v] of Object.entries(s)) if (k !== "additionalProperties") o[k] = strip(v);
        return o;
      }
      return s;
    };
    return strip(schema);
  },

  async callGemini({ images, userText }) {
    const parts = images.map((p) => ({ inlineData: { mimeType: p.mediaType, data: p.base64 } }));
    parts.push({ text: userText });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.GEMINI_MODEL}:generateContent?key=${encodeURIComponent(S.geminiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: this.systemPrompt() }] },
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: this.geminiSchema(),
          maxOutputTokens: 16384,
        },
      }),
    });

    if (!res.ok) {
      let msg = `Gemini API error (${res.status})`;
      try {
        const e = await res.json();
        if (e?.error?.message) msg = e.error.message;
      } catch { /* keep generic message */ }
      if (res.status === 400 || res.status === 403) msg = "Gemini API key was rejected. Check it in Settings → AI provider.";
      if (res.status === 429) msg = "Gemini free-tier limit hit — wait a minute and try again (or switch to Claude in Settings).";
      if (res.status === 503) msg = "Gemini is overloaded right now — try again in a moment.";
      throw new Error(msg);
    }

    const data = await res.json();
    const cand = data.candidates && data.candidates[0];
    const txt = cand?.content?.parts?.map((p) => p.text || "").join("");
    if (!txt) {
      throw new Error(cand?.finishReason === "SAFETY"
        ? "Gemini declined to analyze this image. Try a different photo or describe the food in text."
        : "Empty response from Gemini — try again.");
    }
    try { return JSON.parse(txt); }
    catch { throw new Error("Couldn't parse the analysis — try again."); }
  },
};

/* Downscale an image file — 1280px is plenty for plate-level detail and
   costs a fraction of the tokens of a full-resolution photo */
function fileToScaledBase64(file, maxEdge = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width: w, height: h } = img;
      const scale = Math.min(1, maxEdge / Math.max(w, h));
      w = Math.round(w * scale); h = Math.round(h * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve({ base64: dataUrl.split(",")[1], dataUrl, mediaType: "image/jpeg" });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Couldn't read that image")); };
    img.src = url;
  });
}

/* ============================================================
   FOOD LIBRARY — auto-remembers every logged food
   ============================================================ */
const Library = {
  MAX: 200,

  keyFor(name) { return String(name || "").trim().toLowerCase(); },

  upsert(result) {
    const key = this.keyFor(result.meal_name);
    if (!key) return;
    const existing = S.foods[key];
    S.foods[key] = {
      name: result.meal_name,
      count: (existing?.count || 0) + 1,
      lastUsed: Date.now(),
      // Store base (unscaled) per-item values so portion steppers start fresh
      items: result.items.map(({ mult, ...it }) => ({ ...it })),
      health: result.health ? { ...result.health } : null,
      assumptions: result.assumptions || [],
    };
    // Evict least-used entries past the cap
    const keys = Object.keys(S.foods);
    if (keys.length > this.MAX) {
      keys.sort((a, b) => (S.foods[a].count - S.foods[b].count) || (S.foods[a].lastUsed - S.foods[b].lastUsed));
      for (const k of keys.slice(0, keys.length - this.MAX)) delete S.foods[k];
    }
  },

  list(query = "") {
    const q = query.trim().toLowerCase();
    return Object.entries(S.foods)
      .filter(([, f]) => !q
        || f.name.toLowerCase().includes(q)
        || (f.items || []).some((it) => it.name.toLowerCase().includes(q)))
      .sort(([, a], [, b]) => (b.count - a.count) || (b.lastUsed - a.lastUsed))
      .slice(0, q ? 20 : 8);
  },

  remove(key) { delete S.foods[key]; Store.save(); },

  calsOf(f) { return Math.round((f.items || []).reduce((a, it) => a + (+it.calories || 0), 0)); },
  proteinOf(f) { return Math.round((f.items || []).reduce((a, it) => a + (+it.protein_g || 0), 0)); },
};

/* ============================================================
   ADD / ANALYZE SHEET
   ============================================================ */
const Sheet = {
  photos: [], // [{base64, dataUrl, mediaType}]
  MAX_PHOTOS: 4,
  result: null,
  mealType: null,

  open(html) {
    $("#sheet-content").innerHTML = html;
    $("#sheet").classList.remove("hidden");
    $("#sheet-backdrop").classList.remove("hidden");
    $("#sheet").scrollTo(0, 0);
  },
  close() {
    $("#sheet").classList.add("hidden");
    $("#sheet-backdrop").classList.add("hidden");
    this.photos = []; this.result = null;
  },

  openAdd() {
    this.photos = []; this.result = null;
    const hour = new Date().getHours();
    this.mealType = hour < 10 ? "Breakfast" : hour < 14 ? "Lunch" : hour < 17 ? "Snack" : "Dinner";
    const day = App.viewDate || todayKey();
    this.open(`
      <div class="sheet-title">Add food</div>
      ${day !== todayKey() ? `<p class="hint" style="color:var(--accent);font-weight:700;margin-top:2px">📅 Adding to ${esc(prettyDate(day))}</p>` : ""}
      <p class="hint">Snap it, describe it, or both — the more context, the more accurate.</p>
      <div class="add-modes">
        <div class="add-mode" onclick="$('#cam-input').click()"><span class="big-ico">📷</span>Camera</div>
        <div class="add-mode" onclick="$('#lib-input').click()"><span class="big-ico">🖼️</span>Library</div>
      </div>
      <input id="cam-input" type="file" accept="image/*" capture="environment" class="hidden" onchange="Sheet.onFile(this)">
      <input id="lib-input" type="file" accept="image/*" multiple class="hidden" onchange="Sheet.onFile(this)">
      <div id="photo-slot"></div>
      <p class="hint" style="margin-top:2px">Up to ${this.MAX_PHOTOS} photos per entry — different angles or separate plates. Tap Camera again to add another shot.</p>
      <label>Describe it (optional with photo)
        <textarea id="food-text" rows="2" placeholder="e.g. Chipotle chicken bowl, double rice, no beans…"></textarea>
      </label>
      <div class="meal-type-picker" id="mt-picker">${this.mealTypeBtns()}</div>
      <button class="btn primary big" onclick="Sheet.analyze(false)">🔍 Analyze &amp; log</button>
      <button class="btn ghost" onclick="Sheet.analyze(true)">Just check it — should I eat this?</button>
      <div class="section-head" style="margin:22px 2px 8px"><h3>My foods</h3><span class="muted">${Object.keys(S.foods).length ? "tap to log instantly — no AI needed" : ""}</span></div>
      ${Object.keys(S.foods).length ? `
      <input id="food-search" type="search" placeholder="Search your saved foods…" autocomplete="off">
      <div id="food-lib"></div>` : `
      <p class="hint" style="margin-top:4px">Every food you log gets saved here automatically. Analyze something once, and next time it's a one-tap re-log — no photo, no AI call.</p>`}
    `);
    $("#mt-picker").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      this.mealType = b.dataset.v;
      $$("#mt-picker button").forEach((x) => x.classList.toggle("on", x.dataset.v === this.mealType));
    });
    if ($("#food-lib")) {
      this.renderLib("");
      $("#food-search").addEventListener("input", (e) => this.renderLib(e.target.value));
      $("#food-lib").addEventListener("click", (e) => {
        const del = e.target.closest("[data-del]");
        if (del) {
          Library.remove(del.dataset.del);
          this.renderLib($("#food-search").value);
          toast("Removed from your foods");
          return;
        }
        const row = e.target.closest("[data-key]");
        if (row) this.quickLog(row.dataset.key);
      });
    }
  },

  renderLib(query) {
    const lib = $("#food-lib");
    if (!lib) return;
    const entries = Library.list(query);
    lib.innerHTML = entries.length
      ? entries.map(([key, f]) => `
        <div class="lib-row" data-key="${esc(key)}">
          <div class="lib-main">
            <div class="lib-name">${esc(f.name)}</div>
            <div class="lib-sub">${Library.calsOf(f)} kcal · ${Library.proteinOf(f)}g protein${f.count > 1 ? ` · logged ${f.count}×` : ""}${f.health ? ` · ${f.health.score}/10` : ""}</div>
          </div>
          <button class="lib-del" aria-label="Remove" data-del="${esc(key)}">✕</button>
        </div>`).join("")
      : `<p class="hint" style="text-align:center;margin:14px 0">No saved foods match that.</p>`;
  },

  quickLog(key) {
    const f = S.foods[key];
    if (!f) return;
    const plan = S.plan, t = App.dayTotals(todayKey());
    const cal = Library.calsOf(f), pr = Library.proteinOf(f);
    const calLeft = Math.round(plan.calories - t.calories - cal);
    const pLeft = Math.max(0, Math.round(plan.protein - t.protein - pr));
    this.result = {
      meal_name: f.name,
      items: (f.items || []).map((it) => ({ ...it, mult: 1 })),
      health: f.health
        ? { ...f.health, fit_with_goals: `After this you'd have about ${calLeft.toLocaleString()} kcal ${calLeft >= 0 ? "left" : "over"} and ${pLeft}g protein still to hit today.` }
        : null,
      assumptions: f.assumptions || [],
      _fromLibrary: true,
    };
    this.renderResult(false);
  },

  mealTypeBtns() {
    return ["Breakfast", "Lunch", "Dinner", "Snack"]
      .map((m) => `<button data-v="${m}" class="${m === this.mealType ? "on" : ""}">${m}</button>`).join("");
  },

  async onFile(input) {
    const files = [...(input.files || [])];
    input.value = "";
    let capped = false;
    for (const file of files) {
      if (this.photos.length >= this.MAX_PHOTOS) { capped = true; break; }
      try { this.photos.push(await fileToScaledBase64(file)); }
      catch (e) { toast(e.message); }
    }
    if (capped) toast(`Max ${this.MAX_PHOTOS} photos per entry`);
    this.renderPhotos();
  },

  renderPhotos() {
    const slot = $("#photo-slot");
    if (!slot) return;
    slot.innerHTML = this.photos.length
      ? `<div class="photo-grid">
          ${this.photos.map((p, i) => `
            <div class="photo-thumb">
              <img src="${p.dataUrl}" alt="Food photo ${i + 1}">
              <button aria-label="Remove photo" onclick="Sheet.removePhoto(${i})">✕</button>
            </div>`).join("")}
          ${this.photos.length < this.MAX_PHOTOS ? `<button class="photo-add" onclick="$('#lib-input').click()">＋</button>` : ""}
        </div>`
      : "";
  },

  removePhoto(i) {
    this.photos.splice(i, 1);
    this.renderPhotos();
  },

  async analyze(checkOnly) {
    const text = $("#food-text") ? $("#food-text").value : "";
    if (!this.photos.length && !text.trim()) { toast("Add a photo or a description first"); return; }
    if (!AI.hasKey()) { App.aiSettings(true); return; }
    const photos = this.photos; // keep across the sheet re-render
    const phases = ["Identifying foods…", "Estimating portions…", "Computing macros…", "Judging healthfulness…"];
    this.open(`
      <div class="analyzing">
        <div class="spinner"></div>
        <b>Analyzing your food</b>
        <div class="phase" id="phase">${phases[0]}</div>
      </div>`);
    let pi = 0;
    const ph = setInterval(() => { pi = (pi + 1) % phases.length; const el = $("#phase"); if (el) el.textContent = phases[pi]; }, 2600);

    try {
      const result = await AI.analyze({ images: photos, text });
      this.result = result;
      this.renderResult(checkOnly);
    } catch (e) {
      this.open(`
        <div class="sheet-title">Hmm, that didn't work</div>
        <div class="err-box">${esc(e.message === "NO_KEY" ? "No API key set — add one in Settings." : e.message)}</div>
        <button class="btn primary big" onclick="Sheet.openAdd()">Try again</button>
      `);
    } finally { clearInterval(ph); }
  },

  scaledTotals() {
    const t = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, sugar_g: 0, sodium_mg: 0 };
    for (const it of this.result.items) {
      for (const k of Object.keys(t)) t[k] += (+it[k] || 0) * it.mult;
    }
    return t;
  },

  bump(idx, delta) {
    const it = this.result.items[idx];
    it.mult = Math.max(0.25, Math.min(4, round(it.mult + delta, 2)));
    this.refreshNumbers();
  },

  refreshNumbers() {
    const t = this.scaledTotals();
    $("#r-cal").textContent = Math.round(t.calories);
    $("#r-p").textContent = round(t.protein_g) + "g";
    $("#r-c").textContent = round(t.carbs_g) + "g";
    $("#r-f").textContent = round(t.fat_g) + "g";
    this.result.items.forEach((it, i) => {
      const row = $(`#item-${i}`);
      if (!row) return;
      row.querySelector(".mult").textContent = "×" + it.mult;
      row.querySelector(".item-kcal").textContent = Math.round(it.calories * it.mult) + " kcal";
      row.querySelector(".item-macros").textContent =
        `P ${round(it.protein_g * it.mult)}g · C ${round(it.carbs_g * it.mult)}g · F ${round(it.fat_g * it.mult)}g · ${Math.round(it.grams * it.mult)}g`;
    });
  },

  renderResult(checkOnly) {
    const r = this.result;
    const h = r.health || { score: 5, verdict: "ok_in_moderation", summary: "", pros: [], cons: [], body_effects: "", fit_with_goals: "" };
    const verdictMap = {
      eat_it: { label: "Eat it ✅", cls: "g" },
      ok_in_moderation: { label: "Fine in moderation 👍", cls: "g" },
      think_twice: { label: "Think twice ⚠️", cls: "w" },
      skip_it: { label: "Skip it ❌", cls: "b" },
    };
    const v = verdictMap[h.verdict] || verdictMap.think_twice;
    const scoreColor = h.score >= 7 ? "var(--good)" : h.score >= 4 ? "var(--warn)" : "var(--bad)";
    const t = this.scaledTotals();

    this.open(`
      <div class="sheet-title">${esc(r.meal_name)}</div>
      ${r._fromLibrary ? `<p class="hint" style="margin-top:2px">📌 From your food library — saved from a previous analysis. Adjust portions if needed.</p>`
        : r._costUSD != null ? `<p class="hint" style="margin-top:2px">💰 This analysis cost ≈ ${(r._costUSD * 100).toFixed(1)}¢ — log it once and it's free from your library forever.</p>`
        : ""}

      <div class="result-score">
        <div class="score-circle" style="background:${scoreColor}">${h.score}</div>
        <div>
          <div class="verdict-title">${v.label}</div>
          <div class="verdict-sub">${esc(h.summary)}</div>
        </div>
      </div>

      <div class="totals-strip">
        <div><div class="num" id="r-cal">${Math.round(t.calories)}</div><div class="lbl">kcal</div></div>
        <div><div class="num" id="r-p" style="color:var(--protein)">${round(t.protein_g)}g</div><div class="lbl">protein</div></div>
        <div><div class="num" id="r-c" style="color:var(--carbs)">${round(t.carbs_g)}g</div><div class="lbl">carbs</div></div>
        <div><div class="num" id="r-f" style="color:var(--fat)">${round(t.fat_g)}g</div><div class="lbl">fat</div></div>
      </div>

      ${r.items.map((it, i) => `
        <div class="item-row" id="item-${i}">
          <div class="item-top">
            <div>
              <div class="item-name">${esc(it.name)}<span class="conf ${it.confidence}">${it.confidence}</span></div>
              <div class="item-portion">${esc(it.portion)}</div>
            </div>
            <div class="item-kcal">${Math.round(it.calories)} kcal</div>
          </div>
          <div class="item-macros">P ${round(it.protein_g)}g · C ${round(it.carbs_g)}g · F ${round(it.fat_g)}g · ${Math.round(it.grams)}g</div>
          <div class="portion-adjust">
            <span class="muted" style="font-size:12px">Portion off?</span>
            <button onclick="Sheet.bump(${i},-0.25)">−</button>
            <span class="mult">×1</span>
            <button onclick="Sheet.bump(${i},0.25)">+</button>
          </div>
        </div>`).join("")}

      <div class="pros-cons">
        <div class="pros"><h4>Upside</h4><ul>${(h.pros || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="cons"><h4>Downside</h4><ul>${(h.cons || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      </div>

      <div class="body-fx"><h4>What it does to your body</h4><p>${esc(h.body_effects)}</p></div>
      <div class="body-fx"><h4>Fit with your goals today</h4><p>${esc(h.fit_with_goals)}</p></div>

      ${r.assumptions?.length ? `<div class="assumptions"><b>Assumptions:</b> ${r.assumptions.map(esc).join(" · ")}</div>` : ""}

      <div class="meal-type-picker" id="mt-picker2">${this.mealTypeBtns()}</div>
      <button class="btn primary big" onclick="Sheet.log()">Log to ${checkOnly ? "diary" : esc(this.mealType)}</button>
      <button class="btn ghost" onclick="Sheet.close()">${checkOnly ? "Don't log — I was just checking" : "Discard"}</button>
    `);
    $("#mt-picker2").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      this.mealType = b.dataset.v;
      $$("#mt-picker2 button").forEach((x) => x.classList.toggle("on", x.dataset.v === this.mealType));
    });
  },

  log() {
    const r = this.result;
    const t = this.scaledTotals();
    const targetDay = App.viewDate || todayKey();
    dayEntry(targetDay).meals.push({
      id: Date.now(),
      time: new Date().toTimeString().slice(0, 5),
      mealType: this.mealType,
      name: r.meal_name,
      items: r.items.map((it) => ({
        name: it.name, portion: it.portion, mult: it.mult,
        grams: round(it.grams * it.mult), calories: round(it.calories * it.mult),
        protein_g: round(it.protein_g * it.mult, 1), carbs_g: round(it.carbs_g * it.mult, 1), fat_g: round(it.fat_g * it.mult, 1),
      })),
      totals: {
        calories: round(t.calories), protein: round(t.protein_g, 1),
        carbs: round(t.carbs_g, 1), fat: round(t.fat_g, 1),
        fiber: round(t.fiber_g, 1), sugar: round(t.sugar_g, 1), sodium: round(t.sodium_mg),
      },
      health: r.health ? { score: r.health.score, verdict: r.health.verdict, summary: r.health.summary } : null,
    });
    Library.upsert(r); // grow the personal food library with every log
    Store.save();
    this.close();
    App.renderToday();
    toast(`Logged ${Math.round(t.calories)} kcal${targetDay !== todayKey() ? " to " + prettyDate(targetDay) : ""} ✔️`);
  },

  viewMeal(dayKey, id) {
    const m = (S.log[dayKey]?.meals || []).find((x) => x.id === id);
    if (!m) return;
    const verdictMap = { eat_it: ["Eat it ✅", "g"], ok_in_moderation: ["Fine in moderation 👍", "g"], think_twice: ["Think twice ⚠️", "w"], skip_it: ["Skip it ❌", "b"] };
    const v = m.health ? (verdictMap[m.health.verdict] || ["", "w"]) : null;
    this.open(`
      <div class="sheet-title">${esc(m.name)}</div>
      <p class="hint">${esc(m.mealType)} · ${esc(m.time)}</p>
      <div class="totals-strip">
        <div><div class="num">${Math.round(m.totals.calories)}</div><div class="lbl">kcal</div></div>
        <div><div class="num" style="color:var(--protein)">${round(m.totals.protein)}g</div><div class="lbl">protein</div></div>
        <div><div class="num" style="color:var(--carbs)">${round(m.totals.carbs)}g</div><div class="lbl">carbs</div></div>
        <div><div class="num" style="color:var(--fat)">${round(m.totals.fat)}g</div><div class="lbl">fat</div></div>
      </div>
      ${(m.items || []).map((it) => `
        <div class="item-row">
          <div class="item-top">
            <div><div class="item-name">${esc(it.name)}</div><div class="item-portion">${esc(it.portion)}${it.mult !== 1 ? ` ×${it.mult}` : ""}</div></div>
            <div class="item-kcal">${Math.round(it.calories)} kcal</div>
          </div>
          <div class="item-macros">P ${round(it.protein_g)}g · C ${round(it.carbs_g)}g · F ${round(it.fat_g)}g</div>
        </div>`).join("")}
      ${m.health ? `<div class="body-fx"><h4>Verdict at the time</h4><p><span class="health-pill ${v[1]}">${v[0]}</span><br>${esc(m.health.summary)}</p></div>` : ""}
      <button class="btn danger big" onclick="Sheet.deleteMeal('${dayKey}',${m.id})">Delete this entry</button>
      <button class="btn ghost" onclick="Sheet.close()">Close</button>
    `);
  },

  deleteMeal(dayKey, id) {
    const d = S.log[dayKey];
    if (!d) return;
    d.meals = d.meals.filter((m) => m.id !== id);
    Store.save();
    this.close();
    App.renderToday();
    toast("Entry deleted");
  },
};

/* ============================================================
   MAIN APP — Today / Trends / Settings
   ============================================================ */
const App = {
  boot() {
    $("#main").classList.remove("hidden");
    this.bindTabs();
    this.showView("today"); // always land on Today, even if the previous session left another tab active
  },

  bindTabs() {
    if (this._bound) return; this._bound = true;
    $$("#tabbar button[data-view]").forEach((b) => {
      b.addEventListener("click", () => this.showView(b.dataset.view));
    });
  },

  showView(name) {
    $$("#tabbar button[data-view]").forEach((b) => b.classList.toggle("active", b.dataset.view === name));
    $$(".view").forEach((v) => v.classList.toggle("hidden", v.id !== "view-" + name));
    if (name === "today") { this.viewDate = todayKey(); this.renderToday(); }
    if (name === "trends") this.renderTrends();
    if (name === "settings") this.renderSettings();
    window.scrollTo(0, 0);
  },

  dayTotals(key) {
    const d = S.log[key];
    const t = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    if (!d) return t;
    for (const m of d.meals) {
      t.calories += m.totals.calories; t.protein += m.totals.protein;
      t.carbs += m.totals.carbs; t.fat += m.totals.fat;
    }
    return t;
  },

  streak() {
    let n = 0;
    for (let i = 0; ; i++) {
      const d = S.log[todayKey(-i)];
      const logged = d && d.meals.length > 0;
      if (logged) n++;
      else if (i === 0) continue; // today not logged yet doesn't break the streak
      else break;
    }
    return n;
  },

  viewDate: null,

  shiftDay(delta) {
    const [y, m, d] = (this.viewDate || todayKey()).split("-").map(Number);
    const key = dateKey(new Date(y, m - 1, d + delta));
    if (key > todayKey()) return; // no logging into the future
    this.viewDate = key;
    this.renderToday();
  },
  goToday() { this.viewDate = todayKey(); this.renderToday(); },

  renderToday() {
    const key = this.viewDate || (this.viewDate = todayKey());
    const isToday = key === todayKey();
    const plan = S.plan, t = this.dayTotals(key);
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    $("#greeting").textContent = isToday ? `${greet}, ${S.profile.name || "you"}` : `${S.profile.name || "You"}'s day`;
    $("#today-date").innerHTML =
      `<button class="day-nav" onclick="App.shiftDay(-1)" aria-label="Previous day">‹</button>` +
      `<span class="day-label"${isToday ? "" : ' onclick="App.goToday()"'}>${esc(prettyDate(key))}${isToday ? "" : " · tap for today"}</span>` +
      `<button class="day-nav" onclick="App.shiftDay(1)" aria-label="Next day"${isToday ? " disabled" : ""}>›</button>`;
    $("#streak-chip").textContent = `🔥 ${this.streak()}`;

    // Ring
    const left = plan.calories - t.calories;
    const pct = Math.min(1, t.calories / plan.calories);
    const C = 2 * Math.PI * 52;
    const ring = $("#ring-fg");
    ring.style.strokeDashoffset = C * (1 - pct);
    ring.classList.toggle("over", left < 0);
    $("#cal-left").textContent = Math.abs(Math.round(left)).toLocaleString();
    $("#cal-left-label").textContent = left >= 0 ? "kcal left" : "kcal over";

    // Macro bars
    const setBar = (bar, num, val, target, unit = "g") => {
      $(bar).style.width = Math.min(100, (val / target) * 100) + "%";
      $(num).textContent = `${Math.round(val)} / ${target}${unit}`;
    };
    setBar("#p-bar", "#p-num", t.protein, plan.protein);
    setBar("#c-bar", "#c-num", t.carbs, plan.carbs);
    setBar("#f-bar", "#f-num", t.fat, plan.fat);

    // Meals
    const meals = dayEntry(key).meals;
    $("#meal-cal-sum").textContent = meals.length ? `${Math.round(t.calories)} kcal eaten` : "";
    const verdictPill = (h) => {
      if (!h) return "";
      const map = { eat_it: ["Healthy pick", "g"], ok_in_moderation: ["Decent choice", "g"], think_twice: ["Borderline", "w"], skip_it: ["Not great", "b"] };
      const [label, cls] = map[h.verdict] || ["", "w"];
      return `<span class="health-pill ${cls}">${h.score}/10 · ${label}</span>`;
    };
    $("#meal-list").innerHTML = meals.length
      ? meals.map((m) => `
        <div class="meal-card" onclick="Sheet.viewMeal('${key}',${m.id})">
          <div class="meal-top">
            <div>
              <div class="meal-name">${esc(m.name)}</div>
              <div class="meal-sub">${esc(m.mealType)} · ${esc(m.time)}</div>
            </div>
            <div class="meal-kcal">${Math.round(m.totals.calories)} kcal</div>
          </div>
          <div class="meal-macros">
            <span style="color:var(--protein)">P ${round(m.totals.protein)}g</span>
            <span style="color:var(--carbs)">C ${round(m.totals.carbs)}g</span>
            <span style="color:var(--fat)">F ${round(m.totals.fat)}g</span>
          </div>
          ${verdictPill(m.health)}
        </div>`).join("")
      : `<div class="empty-meals">${isToday ? "Nothing logged yet.<br>Tap <b>＋</b> to snap your first meal 📷" : "Nothing logged for this day.<br>Tap <b>＋</b> to add a meal here."}</div>`;

    // Weight
    const w = dayEntry(key).weight;
    $("#weight-unit").textContent = S.profile.units === "metric" ? "kg" : "lb";
    $("#weight-input").value = w != null
      ? (S.profile.units === "metric" ? round(w, 1) : round(w / KG_PER_LB, 1))
      : "";
  },

  saveWeight() {
    const v = parseFloat($("#weight-input").value);
    if (!v) { toast("Enter a weight first"); return; }
    const key = this.viewDate || todayKey();
    const kg = S.profile.units === "metric" ? v : v * KG_PER_LB;
    dayEntry(key).weight = kg;
    // keep profile weight fresh (only when logging today's weight)
    if (key === todayKey()) S.profile.weightKg = kg;
    Store.save();
    toast("Weight saved");
  },

  /* ---------- Trends ---------- */
  renderTrends() {
    const N = 14;
    const days = Array.from({ length: N }, (_, i) => {
      const key = todayKey(-(N - 1 - i));
      return { key, t: this.dayTotals(key), w: S.log[key]?.weight ?? null, logged: (S.log[key]?.meals || []).length > 0 };
    });
    const loggedDays = days.filter((d) => d.logged);
    const avg = (fn) => loggedDays.length ? Math.round(loggedDays.reduce((a, d) => a + fn(d), 0) / loggedDays.length) : 0;
    const avgCal = avg((d) => d.t.calories);
    const avgP = avg((d) => d.t.protein);
    const weights = days.filter((d) => d.w != null);
    const wDelta = weights.length >= 2 ? weights[weights.length - 1].w - weights[0].w : null;

    const onTarget = loggedDays.filter((d) => Math.abs(d.t.calories - S.plan.calories) <= S.plan.calories * 0.1).length;

    $("#trends-body").innerHTML = `
      <div class="stat-tiles">
        <div class="stat-tile"><div class="num">${avgCal.toLocaleString()}</div><div class="lbl">avg kcal/day (14d)</div></div>
        <div class="stat-tile"><div class="num">${avgP}g</div><div class="lbl">avg protein/day</div></div>
        <div class="stat-tile"><div class="num">${wDelta != null ? (wDelta > 0 ? "+" : "") + (S.profile.units === "metric" ? round(wDelta, 1) + " kg" : round(wDelta / KG_PER_LB, 1) + " lb") : "—"}</div><div class="lbl">weight change (14d)</div></div>
        <div class="stat-tile"><div class="num">${onTarget}/${loggedDays.length || 0}</div><div class="lbl">days within 10% of target</div></div>
      </div>
      <div class="chart-card">
        <h4>Calories vs target</h4>
        ${this.barChart(days.map((d) => d.t.calories), S.plan.calories)}
        <div class="chart-legend"><span><span class="dot" style="background:var(--accent)"></span>eaten</span><span>― target ${S.plan.calories.toLocaleString()}</span></div>
      </div>
      <div class="chart-card">
        <h4>Protein vs target</h4>
        ${this.barChart(days.map((d) => d.t.protein), S.plan.protein, "var(--protein)")}
        <div class="chart-legend"><span><span class="dot p"></span>grams</span><span>― target ${S.plan.protein}g</span></div>
      </div>
      ${weights.length >= 2 ? `
      <div class="chart-card">
        <h4>Weight</h4>
        ${this.lineChart(days.map((d) => d.w))}
      </div>` : `<p class="hint" style="text-align:center">Log your morning weight on the Today tab to see your weight trend here.</p>`}
    `;
  },

  barChart(values, target, color = "var(--accent)") {
    const W = 320, H = 120, pad = 4;
    const maxV = Math.max(target * 1.25, ...values, 1);
    const bw = (W - pad * 2) / values.length;
    const y = (v) => H - 14 - (v / maxV) * (H - 22);
    const bars = values.map((v, i) => {
      const bh = Math.max(v > 0 ? 3 : 0, (v / maxV) * (H - 22));
      return `<rect x="${pad + i * bw + bw * 0.15}" y="${H - 14 - bh}" width="${bw * 0.7}" height="${bh}" rx="2.5" fill="${color}" opacity="${i === values.length - 1 ? 1 : 0.55}"/>`;
    }).join("");
    const ty = y(target);
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="14 day chart">
      ${bars}
      <line x1="${pad}" x2="${W - pad}" y1="${ty}" y2="${ty}" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/>
      <text x="${pad}" y="${H - 2}" font-size="9" fill="var(--muted)">14 days ago</text>
      <text x="${W - pad}" y="${H - 2}" font-size="9" fill="var(--muted)" text-anchor="end">today</text>
    </svg>`;
  },

  lineChart(values) {
    const W = 320, H = 120, pad = 8;
    const pts = values.map((v, i) => ({ v, i })).filter((p) => p.v != null);
    if (pts.length < 2) return "";
    const vs = pts.map((p) => p.v);
    const min = Math.min(...vs), max = Math.max(...vs);
    const span = Math.max(max - min, 0.5);
    const x = (i) => pad + (i / (values.length - 1)) * (W - pad * 2);
    const y = (v) => 12 + (1 - (v - min) / span) * (H - 34);
    const path = pts.map((p, idx) => `${idx === 0 ? "M" : "L"}${round(x(p.i), 1)},${round(y(p.v), 1)}`).join(" ");
    const dots = pts.map((p) => `<circle cx="${round(x(p.i), 1)}" cy="${round(y(p.v), 1)}" r="3" fill="var(--accent)"/>`).join("");
    const fmt = (kg) => S.profile.units === "metric" ? round(kg, 1) : round(kg / KG_PER_LB, 1);
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="weight trend">
      <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${dots}
      <text x="${pad}" y="${H - 2}" font-size="9" fill="var(--muted)">${fmt(pts[0].v)}</text>
      <text x="${W - pad}" y="${H - 2}" font-size="9" fill="var(--muted)" text-anchor="end">${fmt(pts[pts.length - 1].v)} ${S.profile.units === "metric" ? "kg" : "lb"}</text>
    </svg>`;
  },

  /* ---------- Settings ---------- */
  renderSettings() {
    const p = S.profile, plan = S.plan;
    const goalTxt = { cut: "Lose fat", maintain: "Maintain", bulk: "Build muscle" }[p.goal];
    const acct = Accounts.get(CURRENT);
    $("#settings-body").innerHTML = `
      <div class="set-group">
        <div class="set-row"><span class="k">Account</span><span class="v">${esc(acct?.name || p.name || "")}</span></div>
        <div class="set-row tappable" onclick="App.changePin()"><span class="k">Account PIN</span><span class="v">${acct?.pinHash ? "On" : "Off"}</span></div>
        <div class="set-row tappable" onclick="Login.logout()"><span class="k">Switch account / log out</span><span class="v"></span></div>
      </div>
      <div class="set-group">
        <div class="set-row tappable" onclick="App.editTargets()"><span class="k">Daily targets</span><span class="v">${plan.calories.toLocaleString()} kcal · ${plan.protein}P/${plan.carbs}C/${plan.fat}F${plan.custom ? " · custom" : ""}</span></div>
        <div class="set-row"><span class="k">Goal</span><span class="v">${goalTxt}</span></div>
        <div class="set-row"><span class="k">Current weight</span><span class="v">${displayWeight(p.weightKg)}</span></div>
        <div class="set-row tappable" onclick="App.editNotes()"><span class="k">Notes for the AI</span><span class="v">${p.notes ? esc(p.notes.slice(0, 24)) + (p.notes.length > 24 ? "…" : "") : "None"}</span></div>
        <div class="set-row tappable" onclick="App.editProfile()"><span class="k">Edit profile &amp; rebuild plan</span><span class="v"></span></div>
      </div>

      <div class="set-group">
        <div class="set-row tappable" onclick="App.aiSettings()"><span class="k">AI provider</span><span class="v">${PROVIDERS[AI.provider()].model} · ${AI.hasKey() ? "key set" : "no key"}</span></div>
        ${S.usage?.calls ? `<div class="set-row"><span class="k">Opus spend (this account)</span><span class="v">$${S.usage.cost.toFixed(2)} · ${S.usage.calls} ${S.usage.calls === 1 ? "analysis" : "analyses"}</span></div>` : ""}
      </div>
      <p class="set-note">Analysis runs directly from your phone to the AI provider with your own key — Gemini is free, Claude is the most accurate. Nothing is sent anywhere else; all logs stay on this device.</p>

      <div class="set-group">
        <div class="set-row tappable" onclick="App.exportData()"><span class="k">Export my data (JSON)</span><span class="v"></span></div>
        <div class="set-row tappable" onclick="App.resetAll()"><span class="k" style="color:var(--danger)">Delete this account</span><span class="v"></span></div>
      </div>
      <p class="set-note">MacroLens v1.0 — built for ${esc(p.name || "you")}. Estimates are estimates: even lab analysis of identical meals varies ±10-20%. Consistency beats precision.</p>
    `;
  },

  editNotes() {
    Sheet.open(`
      <div class="sheet-title">Notes for the AI</div>
      <p class="hint">Diet style, allergies, training, injuries, personal targets. Used in your plan and every food verdict.</p>
      <label>Your notes<textarea id="set-notes" rows="5" placeholder="e.g. Vegetarian. Marathon training. Lactose intolerant. Protein target ~200g.">${esc(S.profile.notes || "")}</textarea></label>
      <button class="btn primary big" onclick="App.saveNotes()">Save notes</button>
      <button class="btn" onclick="App.saveNotes(true)">✨ Save &amp; re-tune my plan with AI</button>
      <button class="btn ghost" onclick="Sheet.close()">Cancel</button>
    `);
  },

  saveNotes(thenTune) {
    S.profile.notes = $("#set-notes").value.trim();
    Store.save();
    if (thenTune) { this.tunePlanFromNotes(false); }
    else { Sheet.close(); this.renderSettings(); toast("Notes saved"); }
  },

  editProfile() {
    // Re-run onboarding from the profile step, keeping data
    OB.step = 0;
    $$(".ob-step").forEach((s) => s.classList.toggle("hidden", +s.dataset.step !== 0));
    OB.start();
    OB.next(); // jump past welcome into step 1
  },

  // One AI call that re-tunes the targets from the user's notes.
  async tunePlanFromNotes(silentIfNoNotes) {
    const notes = (S.profile.notes || "").trim();
    if (!notes) { if (!silentIfNoNotes) toast("Add notes in Edit profile first"); return; }
    if (!AI.hasKey()) { if (!silentIfNoNotes) App.aiSettings(true); return; }
    const baseline = computePlan(S.profile); // always tune from the clean computed baseline
    toast("Tuning your plan from your notes…", 4000);
    try {
      const adj = await AI.adjustPlan(S.profile, baseline);
      S.plan = {
        ...baseline,
        calories: Math.max(1000, Math.round(adj.calories)),
        protein: Math.max(20, Math.round(adj.protein_g)),
        carbs: Math.max(0, Math.round(adj.carbs_g)),
        fat: Math.max(10, Math.round(adj.fat_g)),
        custom: true, tunedReason: adj.reason,
      };
      Store.save();
      if ($("#view-settings") && !$("#view-settings").classList.contains("hidden")) this.renderSettings();
      Sheet.open(`
        <div class="sheet-title">Plan tuned ✨</div>
        <p class="hint">${esc(adj.reason)}</p>
        <div class="totals-strip">
          <div><div class="num">${S.plan.calories.toLocaleString()}</div><div class="lbl">kcal</div></div>
          <div><div class="num" style="color:var(--protein)">${S.plan.protein}g</div><div class="lbl">protein</div></div>
          <div><div class="num" style="color:var(--carbs)">${S.plan.carbs}g</div><div class="lbl">carbs</div></div>
          <div><div class="num" style="color:var(--fat)">${S.plan.fat}g</div><div class="lbl">fat</div></div>
        </div>
        <button class="btn primary big" onclick="Sheet.close();App.renderToday()">Done</button>
        <button class="btn ghost" onclick="App.resetTargets();Sheet.close()">Undo — use the plain computed plan</button>
      `);
    } catch (e) {
      toast(e.message.includes("NO_KEY") ? "Add an AI key first" : "Couldn't tune the plan — try again");
    }
  },

  editTargets() {
    const p = S.plan;
    const hasNotes = !!(S.profile.notes || "").trim();
    Sheet.open(`
      <div class="sheet-title">Daily targets</div>
      <p class="hint">The recommended plan is a starting point — set your own numbers if you know what works for you.</p>
      <label>Calories (kcal)<input id="t-cal" type="number" inputmode="numeric" value="${p.calories}"></label>
      <label>Protein (g)<input id="t-p" type="number" inputmode="numeric" value="${p.protein}"></label>
      <label>Carbs (g)<input id="t-c" type="number" inputmode="numeric" value="${p.carbs}"></label>
      <label>Fat (g)<input id="t-f" type="number" inputmode="numeric" value="${p.fat}"></label>
      <p class="hint" id="t-check"></p>
      ${p.tunedReason ? `<p class="hint">✨ AI-tuned: ${esc(p.tunedReason)}</p>` : ""}
      <button class="btn primary big" onclick="App.saveTargets()">Save targets</button>
      <button class="btn" onclick="App.tunePlanFromNotes(false)">✨ ${hasNotes ? "Re-tune from my notes with AI" : "Tune from notes (add notes first)"}</button>
      <button class="btn ghost" onclick="App.resetTargets()">↺ Reset to recommended plan</button>
    `);
    const check = () => {
      const pr = +$("#t-p").value || 0, cb = +$("#t-c").value || 0, ft = +$("#t-f").value || 0;
      const cal = +$("#t-cal").value || 0;
      const fromMacros = Math.round(pr * 4 + cb * 4 + ft * 9);
      const diff = cal - fromMacros;
      $("#t-check").textContent = `Your macros add up to ≈ ${fromMacros.toLocaleString()} kcal` +
        (Math.abs(diff) > cal * 0.08 && cal > 0 ? ` — that's ${Math.abs(diff)} ${diff > 0 ? "under" : "over"} your calorie number. Not a problem, just so you know.` : " — lines up with your calorie target.");
    };
    ["t-cal", "t-p", "t-c", "t-f"].forEach((id) => $("#" + id).addEventListener("input", check));
    check();
  },

  saveTargets() {
    const cal = Math.round(+$("#t-cal").value);
    const pr = Math.round(+$("#t-p").value);
    const cb = Math.round(+$("#t-c").value);
    const ft = Math.round(+$("#t-f").value);
    if (!cal || cal < 800 || cal > 10000) { toast("Calories should be between 800 and 10,000"); return; }
    if (!pr || pr < 20 || pr > 500) { toast("Protein should be between 20 and 500g"); return; }
    if (cb < 0 || cb > 1200 || ft < 5 || ft > 400) { toast("Check your carb and fat numbers"); return; }
    S.plan.calories = cal; S.plan.protein = pr; S.plan.carbs = cb; S.plan.fat = ft;
    S.plan.custom = true;
    Store.save();
    Sheet.close();
    this.renderSettings();
    toast("Targets updated 🎯");
  },

  resetTargets() {
    S.plan = computePlan(S.profile);
    Store.save();
    Sheet.close();
    this.renderSettings();
    toast(`Back to recommended — ${S.plan.calories.toLocaleString()} kcal`);
  },

  _aiSel: null,
  aiSettings(fromAdd = false) {
    this._aiSel = AI.provider();
    Sheet.open(`
      <div class="sheet-title">AI provider</div>
      ${fromAdd ? `<p class="hint">Analysis needs an AI key first — it's stored only on this phone.</p>` : ""}
      <div class="seg" id="prov-seg" style="margin-top:10px">
        <button data-v="gemini">Gemini · Free</button>
        <button data-v="claude">Claude · Best</button>
      </div>
      <p class="hint" id="prov-hint"></p>
      <label>API key<input id="prov-key" type="password" autocomplete="off"></label>
      <button class="btn primary big" onclick="App.saveAiSettings(${fromAdd})">Save</button>
      <button class="btn ghost" onclick="${fromAdd ? "Sheet.openAdd()" : "Sheet.close()"}">Cancel</button>
    `);
    const sync = () => {
      const p = PROVIDERS[this._aiSel];
      $$("#prov-seg button").forEach((b) => b.classList.toggle("on", b.dataset.v === this._aiSel));
      $("#prov-hint").textContent = p.hint;
      const keyEl = $("#prov-key");
      keyEl.placeholder = p.placeholder;
      keyEl.value = this._aiSel === "gemini" ? (S.geminiKey || "") : (S.apiKey || "");
    };
    $("#prov-seg").addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      this._aiSel = b.dataset.v;
      sync();
    });
    sync();
  },

  saveAiSettings(fromAdd) {
    const k = $("#prov-key").value.trim();
    S.provider = this._aiSel;
    if (this._aiSel === "gemini") S.geminiKey = k;
    else S.apiKey = k;
    Store.save();
    toast(k ? "Saved — using " + PROVIDERS[this._aiSel].model : "Provider saved (no key yet)");
    if (fromAdd) Sheet.openAdd();
    else { Sheet.close(); this.renderSettings(); }
  },

  exportData() {
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `macrolens-export-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  },

  changePin() {
    const acct = Accounts.get(CURRENT);
    const on = !!acct?.pinHash;
    Sheet.open(`
      <div class="sheet-title">Account PIN</div>
      <p class="hint">${on
        ? "A PIN is ON — this account asks for it every time the app opens. Set a new one below, or turn it off."
        : "A PIN is OFF — this account opens without asking. Turn it on to keep it private on a shared phone."}</p>
      <label>${on ? "New PIN" : "PIN"} (4–8 digits)<input id="new-pin" type="password" inputmode="numeric" maxlength="8" placeholder="••••" autocomplete="off"></label>
      <button class="btn primary big" onclick="App.savePin()">${on ? "Change PIN" : "Turn on PIN"}</button>
      ${on ? `<button class="btn danger" onclick="App.turnOffPin()">Turn off PIN</button>` : ""}
      <button class="btn ghost" onclick="Sheet.close()">Cancel</button>
    `);
  },

  async savePin() {
    const pin = $("#new-pin").value.trim();
    if (!/^\d{4,8}$/.test(pin)) { toast("Enter 4–8 digits"); return; }
    await Accounts.setPin(CURRENT, pin);
    Sheet.close();
    App.renderSettings();
    toast("PIN turned on 🔒");
  },

  async turnOffPin() {
    await Accounts.setPin(CURRENT, ""); // empty clears the PIN
    Sheet.close();
    App.renderSettings();
    toast("PIN turned off");
  },

  resetAll() {
    const acct = Accounts.get(CURRENT);
    if (!confirm(`Delete the account "${acct?.name || ""}" with its profile, plan, and all logged meals? This cannot be undone.`)) return;
    Accounts.remove(CURRENT);
    CURRENT = null; S = null;
    location.reload();
  },
};

/* ---------------- Boot ---------------- */
window.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/macro-tracker/sw.js").catch(() => {});
  }
  Accounts.load();
  // Always open on the account picker so you can choose (or create) an account.
  Login.show();
});
