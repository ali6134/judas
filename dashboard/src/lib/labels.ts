import type { ModelId, Verdict } from "../types";

export const MODELS: ModelId[] = ["chatgpt", "perplexity", "google-ai-overview"];

export const MODEL_LABEL: Record<ModelId, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  "google-ai-overview": "Google AI Overview",
};

export const CATEGORY_LABELS: Record<string, string> = {
  founding_year: "Founding year",
  founder: "Founder",
  current_ceo: "Current CEO",
  ceo_change_date: "CEO change date",
  former_name: "Former name",
  monthly_subscription_price_usd: "Monthly subscription · USD",
  monthly_subscription_price_eur: "Monthly subscription · EUR",
  one_time_purchase_price_usd: "One-time price · USD",
  ingredient_count: "Ingredient count",
  current_formula_name: "Current formula name",
  headquarters: "Headquarters",
  company_registration: "Company registration",
  valuation_usd: "Valuation · USD",
  total_funding_raised_usd: "Total funding · USD",
  founder_nationality: "Founder nationality",
  primary_certification: "Primary certification",
  money_back_guarantee_days: "Money-back guarantee",
  main_competitors: "Main competitors",
  notable_endorsers: "Notable endorsers",
  other: "Uncategorized",
};

export const VERDICT_LABEL: Record<Verdict, string> = {
  correct: "correct",
  outdated: "outdated",
  false: "false",
  hallucinated: "hallucinated",
  unverifiable: "unverifiable",
};

export const VERDICT_RANK: Record<Verdict, number> = {
  hallucinated: 4,
  false: 3,
  outdated: 2,
  unverifiable: 1,
  correct: 0,
};
