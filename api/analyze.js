export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' });
  }

  const systemInstructions = `
# Healthy-or-Not: Ingredient Safety Analyzer Skill - FULL LOGIC

## Step 1 — Extract & Normalize Ingredients
Identify ingredients from names, URLs, or lists. Convert to scientific/INCI names. Note concentrations.

## Step 2 — Banned & Restricted Check (EU, FDA, IARC, WHO, CDSCO, Prop 65)
Check against Annex II/III (EU), FDA monographs, IARC 1/2A/2B, etc.

## Step 3 — Long-Term Human Risk Assessment
Evaluate Systemic Toxicity, Carcinogenicity, Endocrine Disruption, Organ Toxicity, and Sensitization on Low/Medium/High scale.

## Step 4 — Special Population Warnings
Flag risks for Children (Camphor, Fluoride), Pregnant women (Retinoids), etc.

## Step 5 — Human Safety Scoring Model (1–10)
Base: 10.0
- BANNED: -2.0
- IARC 1: -2.5
- IARC 2A: -1.5
- IARC 2B: -0.75
- EDC: -1.0
- Special Pop Risk: -0.5
Floor: 1.0, Ceiling: 10.0

## Step 7 — Final Report Format
═══════════════════════════════════════════════════
**INGREDIENT SAFETY ANALYSIS REPORT**
═══════════════════════════════════════════════════
**Product** : [Name]
**Category** : [Type]
**Analysis by** : Healthy-or-Not v1.0
───────────────────────────────────────────────────
**BANNED INGREDIENTS FOUND** : [N] 🚫
**RESTRICTED INGREDIENTS FOUND** : [N] ⚠️
... [Follow exact MD structure]

Return ONLY a JSON object:
{
  "productName": "...",
  "category": "...",
  "score": 1.0-10.0,
  "rating": "...",
  "riskLevel": "...",
  "riskDescription": "...",
  "flaggedIngredients": [{"name":"...","status":"...","basis":"...","reason":"..."}],
  "safeIngredients": [{"name":"...","why":"..."}],
  "riskMetrics": {"systemicToxicity":"...","carcinogenicity":"...","endocrineDisruption":"...","organToxicity":"...","sensitization":"..."},
  "bannedCount": 0,
  "restrictedCount": 0,
  "carcinogenFlags": 0,
  "endocrineDisruptors": 0,
  "populationWarnings": [{"pop":"...","trigger":"...","warning":"..."}],
  "recommendation": "...",
  "rawReport": "The full Monospace Report string following Step 7 exactly"
}
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1500,
        system: systemInstructions,
        messages: [{ role: 'user', content: `Analyze this product: ${input}` }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const content = data.content[0].text;
    const json = JSON.parse(content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1));
    
    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ error: 'Failed to communicate with AI: ' + error.message });
  }
}
