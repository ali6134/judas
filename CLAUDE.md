# Judas

> Fact-checking AI search results. Find out what LLMs really say about your brand.

## What Judas Is

Judas is a fact-checking tool that detects when LLMs (ChatGPT, Gemini, Perplexity, Claude, etc.) spread false or outdated information about a brand. It compares LLM-generated answers against a verified ground truth and surfaces discrepancies in a dashboard.

The name references the biblical betrayer: LLMs betray brands by repeating false facts. Judas reveals the betrayal.

## What Judas Does

1. Pulls AI search responses from Peec AI via MCP
2. Extracts factual claims from those responses
3. Compares each claim against a verified ground truth file
4. Classifies discrepancies (correct, outdated, false, hallucinated)
5. Visualizes everything in a dashboard

## Project Structure

```
judas/
├── CLAUDE.md                    # This file. Master instructions.
├── README.md                    # Public-facing documentation
├── ground-truth/
│   └── ag1.json                 # Verified facts about AG1 (the test brand)
├── prompts/
│   ├── fact-extraction.md       # System prompt for extracting claims
│   └── fact-comparison.md       # System prompt for comparing to ground truth
├── dashboard/
│   ├── index.html               # Standalone dashboard entry point
│   ├── app.jsx                  # React components
│   └── styles.css               # Judas branding
├── data/
│   ├── raw/                     # Raw JSON pulled from Peec MCP
│   └── analyzed/                # Comparison results, ready for dashboard
├── assets/
│   └── logo.svg                 # White Spartan helmet logo
└── .mcp.json                    # Peec MCP server config
```

## Brand Guidelines

### Name
Always written as "Judas". Never "JUDAS" or "judas". Tagline: "What LLMs really say about your brand."

### Logo
A stylized white Spartan helmet. Minimal lines, recognizable silhouette, plume on top. White only, never colored. Works on both light and dark backgrounds.

### Colors

Primary palette (use these as CSS variables):

```css
--judas-green: #0d4f3c;          /* Primary brand green, darkish, ikon-like */
--judas-green-light: #e8f3ee;    /* Background tint */
--judas-green-bright: #1a7a5c;   /* Hover, active states */
--judas-white: #ffffff;          /* Backgrounds, cards */
--judas-off-white: #f8faf9;      /* Subtle background variation */
--judas-text: #0a1f17;           /* Body text, very dark green-black */
--judas-text-muted: #5a6f64;     /* Secondary text */
--judas-border: #d4e3db;         /* Borders, dividers */

/* Status colors for fact verdicts */
--judas-correct: #1a7a5c;        /* Green, fact is accurate */
--judas-outdated: #c9a227;       /* Amber, was true but no longer */
--judas-false: #c1342c;          /* Red, factually wrong */
--judas-hallucinated: #6b21a8;   /* Purple, made-up entirely */
--judas-unknown: #9ca3af;        /* Gray, LLM did not address */
```

### Typography
Headers: Inter or system-ui, weight 600-700.
Body: Inter or system-ui, weight 400.
Monospace (for facts and quotes): JetBrains Mono or system monospace.

### Tone
Forensic, calm, factual. Never sensational in the UI itself. The drama is in the data, not the design. Avoid words like "shocking" or "exposed". Use "discrepancy", "deviation", "unverified".

## How To Use Peec MCP

The Peec MCP server is configured in `.mcp.json` and connects to `https://api.peec.ai/mcp` via OAuth.

Key capabilities of the Peec MCP relevant to Judas:

- Pull brand visibility data across ChatGPT, Perplexity, Gemini, Google AI Overviews, Google AI Mode, Claude, Microsoft Copilot, Grok
- Get raw LLM responses for tracked prompts
- Pull markdown content of cited source URLs (critical for forensics phase)
- Filter by date, model, topic, country

When invoking Peec tools, prefer narrow date ranges (last 7 or 30 days) to avoid token bloat. Always request structured data and the cited sources, not just summaries.

## Workflow Phases

Judas runs in three distinct phases. Each phase produces structured JSON that feeds the next.

### Phase 1: Interrogation (Pull Raw Data)

Goal: Get every recent LLM response that mentions the tracked brand.

Action: Call Peec MCP to retrieve all responses for the brand's tracked prompts in the last 7 days. Save raw output to `data/raw/{brand}-{date}.json`.

Expected structure per response:
```json
{
  "prompt": "string",
  "model": "chatgpt|gemini|perplexity|...",
  "response_text": "string",
  "cited_sources": [{"url": "string", "title": "string"}],
  "timestamp": "ISO 8601",
  "country": "string"
}
```

### Phase 2: Fact Extraction

Goal: Pull every factual claim out of every response.

Action: For each response in raw data, identify factual claims about the brand. Use the prompt template in `prompts/fact-extraction.md`.

A factual claim is any statement that can be objectively verified. Examples for AG1:
- "AG1 was founded in 2010"
- "AG1 contains 75 ingredients"
- "AG1 costs $99 per month"

Subjective statements ("AG1 is overpriced", "AG1 tastes bad") are NOT factual claims and should be skipped in this phase.

Output structure:
```json
{
  "response_id": "string",
  "claims": [
    {
      "claim_text": "string",
      "fact_category": "founding_year|founder|pricing|ingredient_count|...",
      "claimed_value": "string"
    }
  ]
}
```

### Phase 3: Comparison

Goal: Compare each claim to the ground truth and classify.

Action: Load `ground-truth/{brand}.json`. For each extracted claim, compare claimed_value to ground truth value. Use the prompt template in `prompts/fact-comparison.md`.

Classifications:
- **correct**: Matches ground truth exactly or within acceptable variance
- **outdated**: Was true historically but no longer (e.g. old pricing, old company name)
- **false**: Contradicts ground truth, never was true
- **hallucinated**: References something that does not exist (fake person, fake product)
- **unverifiable**: Cannot be checked against ground truth (note for ground truth expansion)

Output adds verdict and severity (1-5) to each claim.

## Dashboard Requirements

Single-page React app, lives in `dashboard/`. Loads analyzed JSON from `data/analyzed/`.

### Layout

**Header** (full width, white background, bottom border)
- Judas logo (white helmet on green circle, 32px)
- Wordmark "Judas" next to logo
- Right side: brand selector dropdown, date range, refresh button

**Hero Row** (4 cards, equal width)
- Per LLM (ChatGPT, Gemini, Perplexity, Claude, etc.) one card
- Big number: "Fact Accuracy Score" as percentage
- Small text below: "X claims checked, Y discrepancies found"
- Color: card background white, accent color is Judas green
- Score below 70% triggers a small red dot indicator

**Fact Matrix** (full width below hero)
- Rows: fact categories from ground truth (founding_year, founder, pricing, etc.)
- Columns: LLMs
- Cells: colored squares using verdict colors from brand palette
- Click a cell: opens detail panel from the right

**Detail Panel** (slides in from right when cell clicked)
- Shows the specific LLM response with the false claim highlighted
- Shows ground truth value side by side
- Lists the cited sources from that response (URL + title only, no content scraping in MVP)
- Shows the verdict and severity

**Trend Strip** (bottom, full width)
- Sparkline per fact category
- Shows accuracy percentage over last 30 days
- Hover reveals exact percentages per day

### Visual Notes

- Lots of whitespace. The interface should feel like a forensic report, not a SaaS dashboard.
- Cards have subtle borders, no heavy shadows.
- Use monospace font for displaying actual claim text and excerpts (it's evidence, treat it as code).
- Animations are minimal: fade-in on load, slide for detail panel. No bouncing, no pulsing.

## Test Brand: AG1

The MVP uses AG1 (formerly Athletic Greens) as the test case. Ground truth is in `ground-truth/ag1.json`.

AG1 is interesting because:
- It has significant LLM-coverage (Andrew Huberman partnership, fitness influencer marketing)
- It has factual ambiguity in the wild (rebranded from Athletic Greens, multiple price points, ingredient claims debated)
- It has had real controversies (ingredient sourcing, pricing) which create rich source content
- It is a known brand, good for demo and shareability

## Build Order for MVP

If starting from scratch, follow this order:

1. Set up `.mcp.json` with Peec connection
2. Manually research and write `ground-truth/ag1.json`
3. Configure 10-15 fact-finding prompts in Peec dashboard for AG1
4. Wait 24-48 hours for Peec to collect responses
5. Run Phase 1 (pull raw data via MCP)
6. Run Phase 2 + 3 in one Claude session (extraction + comparison)
7. Build dashboard with mocked data first, swap to real data

This three-phase MVP is enough to demonstrate the concept and submit. Source forensics and action playbooks are deliberately out of scope for the first version.

## Submission Goals (Peec MCP Challenge)

This project is built for the Peec MCP Challenge. Judging weighs Usefulness 40%, Creativity 30%, Execution 20%, Community 10%.

Things to optimize for:
- Demo video showing a real false claim being detected
- Screenshots of the dashboard with real data
- A LinkedIn post sharing the most surprising finding (e.g. "Gemini thinks AG1 was founded by [wrong person]")
- The repo should be clean enough that someone could fork it and point it at their own brand

## Things to Not Do

- Do not invent ground truth values. If a fact is uncertain, mark it as such in the JSON and skip it during comparison.
- Do not let Claude classify subjective opinions as "false". Sentiment is not the job here, factual accuracy is.
- Do not scrape the open web. All source content comes through Peec MCP.
- Do not store API keys, credentials, or PII in the repo.
- Do not call this "AI fact-checking". Call it "fact-checking AI". The distinction matters.
