# Healthy-or-Not: Ingredient Safety Analyzer Skill

## Description
Analyze product ingredient lists for internationally banned substances, harmful chemicals, and long-term human safety risks. Produces a structured safety report with a 1–10 human safety score for long-term use. Use this skill whenever a user uploads or pastes a product label, ingredient list, or composition panel and asks about safety, banned substances, harmful chemicals, or wants a product rated for human use. Trigger phrases include: "is this safe?", "analyze ingredients", "banned ingredients?", "rate this product", "long-term effects", "harmful chemicals", "check composition". Always trigger when user shows a product label or ingredient list and wants safety verification.

## Purpose
This skill enables systematic, evidence-based analysis of any product's ingredient list (food, cosmetic, pharmaceutical, Ayurvedic/herbal, or personal care) against:

- International banned substance databases (EU, US FDA, WHO, IARC, Codex Alimentarius)
- Long-term human health risk models for each ingredient class
- A standardized 1–10 Human Safety Score for long-term daily use

## Trigger Conditions
Use this skill when the user:

- Uploads a photo of a product label or ingredient list
- Pastes a raw composition text
- Asks "is this safe?", "what's harmful here?", "banned ingredients?", "rate this product"
- Wants a comparison of multiple products by safety score
- Questions the safety of specific ingredients in a product

---

## Step 1 — Extract & Normalize Ingredients
Before analysis, extract every ingredient from the label into a structured list:

**FORMAT:**
- Ingredient Common Name (Scientific/INCI Name) | Concentration % | Role

**Rules:**
- Convert traditional/Ayurvedic names to their scientific equivalents for cross-referencing
- Note exact concentrations where available — dose is critical to toxicology
- Separate ACTIVE ingredients from EXCIPIENTS (inactive base ingredients)
- Flag any illegible, ambiguous, or partially visible ingredients as [UNCLEAR — verify]

---

## Step 2 — Banned & Restricted Substance Check
Cross-reference each ingredient against the following regulatory databases:

### 2A — EU Cosmetics Regulation (EC 1223/2009)
- Annex II: Prohibited substances (1,300+ banned chemicals)
- Annex III: Restricted substances (allowed only below specified limits)
- Annex IV: Permitted colorants
- Annex V: Permitted preservatives
- Annex VI: Permitted UV filters

### 2B — US FDA Regulations
- FDA Prohibited & Restricted Ingredients (21 CFR)
- OTC Drug monographs for toothpaste, sunscreen, antacids, etc.
- GRAS (Generally Recognized As Safe) status for food ingredients
- FDA Import Alert lists

### 2C — WHO & IARC Classifications
- IARC Group 1: Known human carcinogens
- IARC Group 2A: Probable human carcinogens
- IARC Group 2B: Possible human carcinogens
- WHO Essential Medicines and banned substance lists

### 2D — India-Specific (CDSCO / AYUSH)
- CDSCO banned drug combinations
- AYUSH Ministry approved vs. restricted herbs
- Drugs and Cosmetics Act Schedule compliance

### 2E — Other Key References
- California Prop 65 (carcinogens + reproductive toxins)
- EWG Skin Deep Database hazard scores
- REACH (EU chemical registration)
- Codex Alimentarius (food standards)

### Output Format for Step 2:
| Ingredient | Concentration | Regulatory Status | Banned In | Risk Basis |
| :--- | :--- | :--- | :--- | :--- |
| Example Ingredient | 2.5% | ⚠️ RESTRICTED | EU Annex III | Limit 1% in rinse-off |
| Example Ingredient | 1% | 🚫 BANNED | US FDA OTC | Not permitted in toothpaste |
| Example Ingredient | 25% | ✅ PERMITTED | All major jurisdictions | GRAS, below threshold |

**Status Icons:**
- 🚫 **BANNED** — Explicitly prohibited in one or more major jurisdictions
- ⚠️ **RESTRICTED** — Permitted only under specific concentration limits or conditions
- ⚠️ **WATCH** — Not formally banned but flagged by health agencies or peer-reviewed research
- ✅ **PERMITTED** — Cleared in all major regulatory frameworks at given concentration
- ❓ **UNCLEAR** — Insufficient data or ambiguous regulatory status

---

## Step 3 — Long-Term Human Risk Assessment
For each ingredient, assess risk across 5 dimensions using a **Low / Medium / High / Very High** scale:

### Risk Dimensions:
1. **Systemic Toxicity**: Is the ingredient absorbed through skin/mucosa into the bloodstream? What are cumulative effects?
2. **Carcinogenicity**: Any evidence of cancer risk — IARC classification, animal studies, epidemiological data.
3. **Endocrine Disruption**: Does it interfere with hormonal systems (estrogen, testosterone, thyroid)?
4. **Organ Toxicity**: Liver, kidney, neurological, or reproductive organ damage with chronic exposure.
5. **Sensitization / Allergenicity**: Contact allergy, anaphylaxis risk, or cumulative sensitization over time.

### Risk Assessment Table:
| Ingredient | Systemic Toxicity | Carcinogenicity | Endocrine Disruption | Organ Toxicity | Sensitization | Overall Risk |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [Name] | Low | Low | None | Low | Medium | **LOW** |
| [Name] | High | IARC 2B | Suspected | Liver | High | **HIGH** |

---

## Step 4 — Special Population Warnings
Always flag risks for:

| Population | Trigger Ingredients | Warning |
| :--- | :--- | :--- |
| Children < 6 years | Camphor, Fluoride >1000ppm, essential oils | Seizure/toxicity risk if swallowed |
| Pregnant women | Abortifacients, retinoids, high-dose herbs | Miscarriage / developmental risk |
| Elderly | Nephrotoxic herbs, high-sodium compounds | Organ burden risk |
| Kidney/Liver disease | Hepatotoxic herbs, high aluminum compounds | Contraindicated |
| Allergy-prone | Latex cross-reactors, common allergen families | Anaphylaxis risk |

---

## Step 5 — Human Safety Scoring Model (1–10 Scale)

### Scoring Framework
The final Human Safety Score for Long-Term Daily Use is calculated across 6 weighted criteria:

| Criterion | Weight | Description |
| :--- | :--- | :--- |
| Banned/Restricted Ingredient Presence | 30% | Penalty per banned/restricted ingredient found |
| Carcinogen Load | 20% | IARC classifications present, weighted by group |
| Endocrine Disruptor Load | 15% | Number and potency of EDC ingredients |
| Abrasive / Erosion Risk | 10% | For topical products — physical damage potential |
| Systemic Absorption Risk | 15% | Route of exposure × concentration × bioavailability |
| Regulatory Approval Breadth | 10% | How many major jurisdictions permit this formulation |

### Score Calculation Method:
**Start at: 10.0 (perfect safety)**

**Deductions:**
- Each **BANNED** ingredient found: -2.0 points
- Each **RESTRICTED** ingredient (over limit): -1.5 points
- Each **IARC Group 1** carcinogen: -2.5 points
- Each **IARC Group 2A** carcinogen: -1.5 points
- Each **IARC Group 2B** carcinogen: -0.75 points
- Each confirmed **endocrine disruptor**: -1.0 points
- **Suspected** endocrine disruptor: -0.5 points
- High abrasive score (RDA > 150): -1.0 points
- Medium abrasive score (RDA 100–150): -0.5 points
- High systemic absorption risk: -1.0 points
- Special population risk (severe): -0.5 points

**Bonuses (max +1.0):**
- Full regulatory compliance all jurisdictions: +0.5
- Clinically proven efficacy for claims made: +0.3
- Transparent full disclosure labeling: +0.2

**Floor: 1.0** (never below 1)
**Ceiling: 10.0**

### Score Interpretation:
| Score | Rating | Meaning |
| :--- | :--- | :--- |
| 9.0 – 10.0 | 🟢 **EXCELLENT** | Safe for long-term daily use across all populations |
| 7.5 – 8.9 | 🟢 **GOOD** | Safe for most adults; minor concerns for special populations |
| 6.0 – 7.4 | 🟡 **MODERATE** | Generally safe with precautions; monitor long-term use |
| 4.5 – 5.9 | 🟠 **CAUTION** | Notable risks; limit frequency or avoid for vulnerable groups |
| 3.0 – 4.4 | 🔴 **POOR** | Significant safety concerns; not recommended for daily use |
| 1.0 – 2.9 | 🔴 **UNSAFE** | Banned ingredients or severe health risks; do not use |

---

## Step 6 — Product Comparison Mode
When comparing 2+ products, generate a side-by-side safety comparison:

**COMPARISON TABLE FORMAT:**

| Criterion | Product A | Product B | Product C |
| :--- | :--- | :--- | :--- |
| Banned Ingredients | 0 | 1 | 0 |
| Restricted Ingredients | 1 | 2 | 0 |
| IARC Carcinogens | None | Group 2B | None |
| Endocrine Disruptors | 0 | 1 | 0 |
| Abrasive Risk (RDA) | Medium | High | Low |
| Special Population Warnings | 2 | 3 | 1 |
| Regulatory Compliance | Partial | Poor | Full |
| ───────────────────────────── | ─────────── | ─────────── | ─────────── |
| **SAFETY SCORE / 10** | **7.2 🟡** | **4.8 🟠** | **8.9 🟢** |
| **RECOMMENDATION** | Moderate | Caution | Good |

*Always declare the winner with a brief rationale.*

---

## Step 7 — Final Report Structure
Every analysis must conclude with this standardized report:

═══════════════════════════════════════════════════
**INGREDIENT SAFETY ANALYSIS REPORT**
═══════════════════════════════════════════════════
**Product** : [Name]
**Category** : [Toothpaste / Cosmetic / Food / etc.]
**Analysis by** : Healthy-or-Not v1.0
───────────────────────────────────────────────────
**BANNED INGREDIENTS FOUND** : [N] 🚫
**RESTRICTED INGREDIENTS FOUND** : [N] ⚠️
**CARCINOGEN FLAGS** : [N]
**ENDOCRINE DISRUPTORS** : [N]
**SPECIAL POPULATION WARNINGS** : [N]
───────────────────────────────────────────────────
**LONG-TERM HUMAN SAFETY SCORE** : [X.X / 10] [emoji]
**RATING** : [EXCELLENT/GOOD/etc.]
───────────────────────────────────────────────────
**TOP 3 CONCERNS:**
1. [Most critical issue]
2. [Second issue]
3. [Third issue]

**TOP 3 SAFE/BENEFICIAL INGREDIENTS:**
1. [Best ingredient + why]
2. [Second ingredient]
3. [Third ingredient]

**RECOMMENDATION:**
[1–2 sentence plain English verdict on whether to use this product long-term]
═══════════════════════════════════════════════════

---

## Important Disclaimers
⚕️ **Medical Disclaimer**: This analysis is based on publicly available regulatory data and peer-reviewed research. It is not a substitute for professional medical or pharmacological advice. Ingredient safety can vary based on individual health conditions, allergies, and cumulative exposure from multiple products.

📋 **Regulatory Note**: Regulations differ by country. An ingredient banned in the EU may be permitted in India or the US. Always verify against your local regulatory authority.

🌿 **Ayurvedic/Herbal Note**: Herbal/traditional ingredients often have limited clinical trial data compared to synthetic compounds. Safety assessments for herbal products rely on traditional use records, ethnopharmacology literature, and available toxicology studies.

---

## Reference Databases
| Database | URL / Source | Covers |
| :--- | :--- | :--- |
| EU Cosmetics Ingredient Database | [CosIng](https://ec.europa.eu/growth/tools-databases/cosing/) | EU banned/restricted cosmetic ingredients |
| FDA Cosmetics Prohibited List | [fda.gov](https://www.fda.gov/cosmetics/cosmetics-laws-regulations/prohibited-restricted-ingredients-cosmetics) | US cosmetic restrictions |
| IARC Monographs | [monographs.iarc.who.int](https://monographs.iarc.who.int/) | Carcinogen classifications |
| EWG Skin Deep | [ewg.org/skindeep](https://www.ewg.org/skindeep/) | Hazard scores 1–10 |
| Prop 65 List | [oehha.ca.gov](https://oehha.ca.gov/proposition-65/proposition-65-list) | CA carcinogens + reproductive toxins |
| PubChem | [pubchem.ncbi.nlm.nih.gov](https://pubchem.ncbi.nlm.nih.gov/) | Chemical safety data |
| AYUSH Guidelines | [ayush.gov.in](https://ayush.gov.in/) | India Ayurvedic formulation rules |
| CDSCO Banned Drugs | [cdsco.gov.in](https://cdsco.gov.in/) | India banned drug combinations |
