# CUET Accountancy Question Generation — Batch Registry & Protocol

> **Created:** 2026-03-01
> **Target:** 720 questions across 11 chapters, 18 batches
> **Batch size:** 40 questions per batch (see type mix in CUET_GENERATION_PROMPT.md)
> **CUET-only** — no NEET copy needed (Accountancy is not a NEET subject)

---

## Approach

- **1 batch = 1 topic = 40 questions** (CUET type mix)
- Each batch outputs ONE JSON file:
  - `Qbank/CUET/accountancy/{chapter-folder}/batch-YYYY-MM-DD/{topic_id}.json`
- **ID format:** `cuet-acc-{abbrev}-{nn}` (e.g. `cuet-acc-partner-goodwill-01`)
- Mark each batch DONE after saving. Commit and push after all batches complete.
- **Question type mix per 40-question batch:**
  - MCQ: 20 (5 easy, 10 medium, 5 hard)
  - Diagram-Based: 4 (1 easy, 2 medium, 1 hard) — use for journal entries, ledger formats, balance sheet layouts
  - Assertion-Reasoning: 4 (2 medium, 2 hard)
  - True-False: 4 (2 TRUE easy, 2 FALSE easy)
  - Match-the-Following: 2 (1 medium, 1 hard)
  - Fill-in-Blanks: 2 (1 easy, 1 medium)
  - Scenario-Based: 2 (1 medium, 1 hard) — use practical business scenarios
  - Logical-Sequence: 2 (1 medium, 1 hard) — use for accounting procedure steps

---

## Batch Registry

### Chapter 1: Accounting for Partnership — Basic Concepts (`cuet-acc-partnership-basics`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B01 | `cuet-acc-partner-fundamentals` | Partnership Deed, Capital Accounts (Fixed & Fluctuating), Interest on Capital/Drawings | 40 | PENDING |
| B02 | `cuet-acc-partner-goodwill` | Goodwill Valuation (Average Profit, Super Profit, Capitalisation), Profit Sharing, Salary & Commission | 40 | PENDING |
| | | **Chapter 1 Total** | **80** | |

### Chapter 2: Change in Profit-Sharing Ratio (`cuet-acc-profit-sharing`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B03 | `cuet-acc-psr-change` | Gaining Ratio, Sacrificing Ratio, Revaluation of Assets/Liabilities, Treatment of Reserves & Goodwill | 40 | PENDING |
| | | **Chapter 2 Total** | **40** | |

### Chapter 3: Admission of a Partner (`cuet-acc-partner-admission`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B04 | `cuet-acc-admission-goodwill` | New Profit-Sharing Ratio, Sacrificing Ratio, Goodwill Treatment (Premium, Hidden, Raised & Written Off) | 40 | PENDING |
| B05 | `cuet-acc-admission-adjustments` | Revaluation Account, Capital Adjustments, New Partner's Capital, Reserves Distribution | 40 | PENDING |
| | | **Chapter 3 Total** | **80** | |

### Chapter 4: Retirement and Death of a Partner (`cuet-acc-partner-retirement`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B06 | `cuet-acc-retire-settlement` | New Ratio, Gaining Ratio, Goodwill Treatment on Retirement, Revaluation Account | 40 | PENDING |
| B07 | `cuet-acc-retire-death` | Settlement of Retiring Partner's Account, Death of Partner (Executor's Account), Joint Life Policy, Share of Profit till Death | 40 | PENDING |
| | | **Chapter 4 Total** | **80** | |

### Chapter 5: Dissolution of Partnership Firm (`cuet-acc-dissolution`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B08 | `cuet-acc-dissolution` | Settlement of Accounts, Realisation Account, Treatment of Unrecorded Assets/Liabilities, Garner vs. Murray, Firm vs. Partner Distinction | 40 | PENDING |
| | | **Chapter 5 Total** | **40** | |

### Chapter 6: Accounting for Share Capital (`cuet-acc-share-capital`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B09 | `cuet-acc-shares-issue` | Types of Shares (Equity, Preference), Issue of Shares (At Par, Premium, Discount), Oversubscription, Pro-rata Allotment | 40 | PENDING |
| B10 | `cuet-acc-shares-forfeiture` | Forfeiture of Shares, Re-issue of Forfeited Shares, Share Capital in Balance Sheet, ESOP Basics | 40 | PENDING |
| | | **Chapter 6 Total** | **80** | |

### Chapter 7: Issue and Redemption of Debentures (`cuet-acc-debentures`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B11 | `cuet-acc-deb-issue` | Types of Debentures, Issue (At Par, Premium, Discount), Issue as Collateral Security, Interest on Debentures | 40 | PENDING |
| B12 | `cuet-acc-deb-redemption` | Redemption Methods (Lump Sum, Installment, Purchase in Open Market), Debenture Redemption Reserve, Sinking Fund | 40 | PENDING |
| | | **Chapter 7 Total** | **80** | |

### Chapter 8: Financial Statements of a Company (`cuet-acc-financial-statements`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B13 | `cuet-acc-fin-statements` | Statement of P&L (Schedule III), Balance Sheet Format, Notes to Accounts, Revenue Recognition, Provisions & Reserves | 40 | PENDING |
| | | **Chapter 8 Total** | **40** | |

### Chapter 9: Analysis of Financial Statements (`cuet-acc-statement-analysis`) — 1 batch, Target: 40

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B14 | `cuet-acc-fin-analysis` | Comparative Statements, Common-Size Statements, Trend Analysis, Horizontal & Vertical Analysis, Limitations | 40 | PENDING |
| | | **Chapter 9 Total** | **40** | |

### Chapter 10: Accounting Ratios (`cuet-acc-ratios`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B15 | `cuet-acc-ratio-liquidity` | Liquidity Ratios (Current, Quick), Solvency Ratios (Debt-Equity, Proprietary, Interest Coverage), Capital Structure | 40 | PENDING |
| B16 | `cuet-acc-ratio-profitability` | Activity Ratios (Inventory, Debtor, Creditor Turnover), Profitability Ratios (GP, NP, Operating, ROI), DuPont Analysis | 40 | PENDING |
| | | **Chapter 10 Total** | **80** | |

### Chapter 11: Cash Flow Statement (`cuet-acc-cash-flow`) — 2 batches, Target: 80

| Batch | Topic ID | Topic Name | Qs | Status |
|-------|----------|------------|-----|--------|
| B17 | `cuet-acc-cf-operating` | AS-3 (Revised), Operating Activities (Direct & Indirect Method), Adjustments for Non-Cash Items, Working Capital Changes | 40 | PENDING |
| B18 | `cuet-acc-cf-investing-financing` | Investing Activities, Financing Activities, Cash & Cash Equivalents, Interpretation of Cash Flow Statement | 40 | PENDING |
| | | **Chapter 11 Total** | **80** | |

---

## Grand Total

| Metric | Count |
|--------|-------|
| Chapters | 11 |
| Batches | 18 |
| Questions per batch | 40 |
| **Total Target** | **720** |
| Generated | 0 |
| **Remaining** | **720** |

---

## Accountancy-Specific Notes

### Question Characteristics
- **Numerical problems** are key — journal entries, ledger accounts, ratio calculations, cash flow adjustments
- **Diagram-based** questions should use accounting formats: T-accounts, journal entry layouts, balance sheet extracts
- **Scenario-based** questions should present realistic business situations (e.g., "A and B are partners sharing profits in 3:2...")
- **Logical-sequence** questions work well for accounting procedures (steps in dissolution, share issue process, etc.)

### Common CUET Accountancy Traps (use in elimination_hints)
- Confusing gaining ratio with sacrificing ratio
- Mixing up fixed vs. fluctuating capital accounts
- Forgetting to adjust goodwill already appearing in books
- Confusing cash flow from operating vs. investing activities
- Mixing up current ratio formula (CA/CL vs CL/CA)
- Forgetting to deduct provision from debtors for quick ratio
- Treating purchase of investments as operating activity
- Confusing share premium with securities premium reserve

### Bloom Level Guidelines
- **Remember**: Definitions, formulas, format recognition (easy)
- **Understand**: Classify transactions, explain concepts (easy-medium)
- **Apply**: Calculate ratios, prepare journal entries, solve numericals (medium)
- **Analyze**: Interpret statements, compare scenarios, identify errors (hard)

---

## Session Execution Priority

Recommended order (high-weight CUET chapters first):
1. **B15-B16** Accounting Ratios (most tested in CUET)
2. **B17-B18** Cash Flow Statement (frequently tested)
3. **B09-B10** Share Capital (company accounts foundation)
4. **B01-B02** Partnership Basics (Part A foundation)
5. **B04-B05** Admission of Partner
6. **B06-B07** Retirement/Death of Partner
7. **B11-B12** Debentures
8. **B03** Profit-Sharing Ratio changes
9. **B08** Dissolution
10. **B13** Financial Statements
11. **B14** Financial Statement Analysis

---

*Last updated: 2026-03-01*
