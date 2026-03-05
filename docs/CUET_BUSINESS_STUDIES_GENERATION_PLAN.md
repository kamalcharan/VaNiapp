# CUET Business Studies Question Generation — Batch Registry & Protocol

> **Created:** 2026-03-05
> **Target:** 640 questions across 12 chapters, 16 batches
> **Batch size:** 40 questions per batch (see type mix below)
> **CUET-only** — no NEET copy needed (Business Studies is not a NEET subject)

---

## Approach

- **1 batch = 1 topic cluster = 40 questions** (CUET type mix)
- Each batch outputs ONE JSON file:
  - `Qbank/CUET/business-studies/{chapter-folder}/batch-YYYY-MM-DD/{topic_id}.json`
- **ID format:** `cuet-bst-{abbrev}-{nn}` (e.g. `cuet-bst-fayol-principles-01`)
- Mark each batch DONE after saving. Commit and push after all batches complete.
- **Question type mix per 40-question batch:**
  - MCQ: 20 (5 easy, 10 medium, 5 hard)
  - Assertion-Reasoning: 4 (2 medium, 2 hard)
  - True-False: 4 (2 TRUE easy, 2 FALSE easy)
  - Match-the-Following: 2 (1 medium, 1 hard)
  - Fill-in-Blanks: 2 (1 easy, 1 medium)
  - Scenario-Based: 4 (2 medium, 2 hard) — use real business/management case studies
  - Logical-Sequence: 2 (1 medium, 1 hard) — use for management process steps
  - Diagram-Based: 2 (1 medium, 1 hard) — use for org charts, hierarchy diagrams, process flows

> **Note:** Business Studies is theory-heavy, so scenario-based gets 4 (up from 2 in accountancy)
> and diagram-based drops to 2 (down from 4 in accountancy, since no journal entries/ledgers).

---

## Batch Registry

### Chapter 1: Nature and Significance of Management (`cuet-bst-nature-mgmt`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B01 | `cuet-bst-nature-mgmt-concepts` | Management Definition, Objectives, Art/Science/Profession, Levels (Top/Middle/Operational), Functions (POSDC), Coordination | 40 | PENDING |
| | | **Chapter 1 Total** | **40** | |

### Chapter 2: Principles of Management (`cuet-bst-principles`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B02 | `cuet-bst-fayol-principles` | Fayol's 14 Principles — Division of Work, Authority & Responsibility, Discipline, Unity of Command/Direction, Scalar Chain, Esprit de Corps, etc. | 40 | PENDING |
| B03 | `cuet-bst-taylor-scientific` | Taylor's Scientific Management — Principles, Techniques, Functional Foremanship, Method/Time/Motion Study, Fayol vs Taylor | 40 | PENDING |
| | | **Chapter 2 Total** | **80** | |

### Chapter 3: Business Environment (`cuet-bst-environment`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B04 | `cuet-bst-env-dimensions-lpg` | Dimensions (Economic, Social, Technological, Political, Legal), LPG Reforms 1991, Demonetisation, Government Policy Impact | 40 | PENDING |
| | | **Chapter 3 Total** | **40** | |

### Chapter 4: Planning (`cuet-bst-planning`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B05 | `cuet-bst-planning-types` | Planning Process (Steps), Types of Plans (Objectives, Policies, Strategies, Procedures, Rules, Programmes, Budgets), Limitations | 40 | PENDING |
| | | **Chapter 4 Total** | **40** | |

### Chapter 5: Organising (`cuet-bst-organising`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B06 | `cuet-bst-organising-structures` | Organising Process, Functional vs Divisional Structure, Formal vs Informal Organisation, Delegation, Decentralisation | 40 | PENDING |
| | | **Chapter 5 Total** | **40** | |

### Chapter 6: Staffing (`cuet-bst-staffing`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B07 | `cuet-bst-staffing-process` | Recruitment (Internal/External Sources), Selection Process Steps, Training Methods (On-the-Job, Off-the-Job), HRM Concept | 40 | PENDING |
| | | **Chapter 6 Total** | **40** | |

### Chapter 7: Directing (`cuet-bst-directing`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B08 | `cuet-bst-directing-motivation` | Directing Elements, Motivation (Maslow's Hierarchy, Herzberg's Two-Factor Theory), Financial & Non-Financial Incentives | 40 | PENDING |
| B09 | `cuet-bst-directing-leadership` | Leadership Styles (Autocratic, Democratic, Laissez-faire), Communication (Process, Types, Barriers), Supervision | 40 | PENDING |
| | | **Chapter 7 Total** | **80** | |

### Chapter 8: Controlling (`cuet-bst-controlling`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B10 | `cuet-bst-controlling-process` | Controlling Process (Steps), Techniques (Budgetary Control, Ratio Analysis, PERT), Planning vs Controlling Relationship, Deviations | 40 | PENDING |
| | | **Chapter 8 Total** | **40** | |

### Chapter 9: Financial Management (`cuet-bst-financial-mgmt`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B11 | `cuet-bst-fm-capital-decisions` | Financial Management Objectives, Investment Decision, Financing Decision, Capital Structure, Trading on Equity, Factors Affecting Capital Structure | 40 | PENDING |
| B12 | `cuet-bst-fm-working-dividend` | Fixed Capital (Factors Affecting), Working Capital (Factors Affecting), Dividend Decision (Factors Affecting), Financial Planning | 40 | PENDING |
| | | **Chapter 9 Total** | **80** | |

### Chapter 10: Financial Markets (`cuet-bst-financial-markets`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B13 | `cuet-bst-fmkt-instruments` | Money Market Instruments (T-Bills, CP, CD, Call Money), Capital Market (Primary vs Secondary), Stock Exchange, SEBI, Demat System | 40 | PENDING |
| | | **Chapter 10 Total** | **40** | |

### Chapter 11: Marketing Management (`cuet-bst-marketing`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B14 | `cuet-bst-mkt-product-price` | Marketing Concept, Marketing Mix Overview, Product (Branding, Packaging, Labelling, Product Life Cycle), Price (Factors Affecting) | 40 | PENDING |
| B15 | `cuet-bst-mkt-place-promotion` | Place (Channels of Distribution, Types of Intermediaries), Promotion Mix (Advertising, Sales Promotion, Personal Selling, PR) | 40 | PENDING |
| | | **Chapter 11 Total** | **80** | |

### Chapter 12: Consumer Protection (`cuet-bst-consumer-protection`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B16 | `cuet-bst-cp-act-rights` | Consumer Protection Act 2019, Consumer Rights & Responsibilities, Redressal Agencies (District/State/National Commission), NGO Role | 40 | PENDING |
| | | **Chapter 12 Total** | **40** | |

---

## Grand Total

| Metric | Count |
|--------|-------|
| Chapters | 12 |
| Batches | 16 |
| Questions per batch | 40 |
| **Total Target** | **640** |
| Generated | 0 |
| **Remaining** | **640** |

---

## Business Studies-Specific Notes

### Question Characteristics
- **Theory-heavy subject** — emphasis on concepts, definitions, differences, and application of management principles
- **Case-study/scenario questions** are key differentiator in CUET — present realistic business situations and ask students to identify principles/functions
- **Match-the-following** works well for: Fayol's principles, Maslow's needs, money market instruments, leadership styles vs features
- **Assertion-Reasoning** — strong for testing conceptual understanding (e.g., "Assertion: Management is an art. Reason: Management involves application of personal skills.")
- **Logical-sequence** — use for process steps: planning process, selection process, controlling steps, communication process
- **Diagram-based** — use for: organisational hierarchy, Maslow's pyramid, communication flow, functional vs divisional org charts

### Common CUET Business Studies Traps (use in elimination_hints)
- Confusing Unity of Command (Fayol) with Functional Foremanship (Taylor)
- Mixing up delegation (superior-subordinate) with decentralisation (organisation-wide)
- Confusing formal and informal organisation characteristics
- Mixing up internal and external recruitment sources
- Confusing financial incentives with non-financial incentives
- Mixing up primary market (new issue) with secondary market (trading)
- Confusing money market instruments (T-Bills, CP, CD)
- Mixing up advertising (paid, non-personal) with personal selling
- Confusing consumer rights (Right to Safety, Right to Information, etc.)
- Mixing up District Commission, State Commission, National Commission jurisdiction limits

### Bloom Level Guidelines
- **Remember**: Definitions, names of principles, list of rights, instrument names (easy)
- **Understand**: Explain concepts, differentiate between terms, classify examples (easy-medium)
- **Apply**: Identify which principle/function applies in a given case study (medium)
- **Analyze**: Evaluate business scenarios, compare management approaches, identify errors in strategies (hard)

---

## Session Execution Priority

Recommended order (high-weight CUET chapters first):

1. **B02-B03** Principles of Management (most tested — Fayol & Taylor)
2. **B08-B09** Directing (Motivation + Leadership — very frequently tested)
3. **B11-B12** Financial Management (Capital Structure + Working Capital)
4. **B14-B15** Marketing Management (4Ps — always tested)
5. **B13** Financial Markets (Money Market + Stock Exchange)
6. **B05** Planning (Types of Plans)
7. **B06** Organising (Structures + Delegation)
8. **B07** Staffing (Recruitment + Selection)
9. **B10** Controlling (Process + Techniques)
10. **B04** Business Environment (LPG + Demonetisation)
11. **B01** Nature & Significance (Foundational)
12. **B16** Consumer Protection (CPA 2019)

---

*Last updated: 2026-03-05*
