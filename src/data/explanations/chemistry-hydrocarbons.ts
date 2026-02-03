import { ChapterExplanations } from '../../types';

export const chemistryHydrocarbonsExplanations: ChapterExplanations = {
  chapterId: 'chemistry-hydrocarbons',
  subjectId: 'chemistry',
  entries: [
    // ═══════════════════════════════════════════════════════════
    //  chem-hc-001 — Simplest alkane
    //  Correct: a (methane, CH₄)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-hc-001',
      selectedOptionId: 'b',
      misconception:
        'You may have thought ethane (C₂H₆) is the simplest alkane because it is the first alkane with a C–C bond. But "simplest" means the **fewest carbon atoms**. Methane (CH₄) has just **1 carbon** and is the first member of the alkane homologous series. Ethane has 2 carbons — it is the second member.',
      correctReasoning:
        'The alkane series follows the general formula **CₙH₂ₙ₊₂**. The simplest member has n = 1, giving **CH₄ (methane)**. It is a gas at room temperature, has tetrahedral geometry (sp³ hybridization), and is the main component of natural gas.',
      tip: 'Simplest = minimum n. For alkanes, n = 1 → CH₄ (methane). For alkenes, n = 2 → C₂H₄ (ethene). For alkynes, n = 2 → C₂H₂ (ethyne).',
      conceptTag: 'alkanes',
    },
    {
      questionId: 'chem-hc-001',
      selectedOptionId: 'c',
      misconception:
        'Propane (C₃H₈) has 3 carbon atoms — it is the third member of the alkane series, not the simplest. You may have been thinking of LPG (cooking gas), which is mainly propane and butane. While propane is practically important, **methane (CH₄) with just 1 carbon** is the simplest alkane by definition.',
      correctReasoning:
        'In any homologous series, the simplest member is the one with the **smallest possible value of n** in the general formula. For alkanes (CₙH₂ₙ₊₂), n = 1 gives CH₄ (methane). Propane (n = 3) is a higher homologue.',
      tip: 'Do not confuse "commonly used" with "simplest." LPG uses propane/butane, but the simplest alkane is still methane (1 carbon).',
      conceptTag: 'alkanes',
    },
    {
      questionId: 'chem-hc-001',
      selectedOptionId: 'd',
      misconception:
        'Ethylene is the common name for **ethene (C₂H₄)**, which is an **alkene**, not an alkane. Alkenes have a **C=C double bond** and follow the formula CₙH₂ₙ. Alkanes have only **single bonds** and follow CₙH₂ₙ₊₂. You confused the two homologous series.',
      correctReasoning:
        'Methane (CH₄) is the simplest **alkane** (only single bonds, CₙH₂ₙ₊₂ with n = 1). Ethylene/ethene is an alkene with a double bond. The question specifically asks about alkanes — saturated hydrocarbons with only C–C and C–H single bonds.',
      tip: 'Alkane = single bonds only (ends in -ane). Alkene = one double bond (ends in -ene). Alkyne = one triple bond (ends in -yne). Watch the suffix carefully.',
      conceptTag: 'alkanes',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-hc-003 — Functional group in alkene
    //  Correct: c (C=C double bond)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-hc-003',
      selectedOptionId: 'a',
      misconception:
        'A C–C single bond is present in **alkanes**, not specific to alkenes. Single bonds are the baseline in all organic molecules. The **functional group** is what makes a class of compounds special and reactive. Alkenes are defined by their **C=C double bond**, which is the site of addition reactions.',
      correctReasoning:
        'Alkenes are unsaturated hydrocarbons characterized by at least one **carbon-carbon double bond (C=C)**. This double bond consists of one **sigma bond** and one **pi bond**. The pi bond is weaker and more reactive, making it the functional group that determines alkene chemistry (addition reactions).',
      tip: 'Functional group = the reactive part that defines the class. Alkene = C=C, Alkyne = C≡C, Alcohol = –OH, Aldehyde = –CHO.',
      conceptTag: 'alkenes',
    },
    {
      questionId: 'chem-hc-003',
      selectedOptionId: 'b',
      misconception:
        'A **C≡C triple bond** is the functional group of **alkynes**, not alkenes. You mixed up the two unsaturated hydrocarbon families. Alkenes have a double bond (C=C), while alkynes have a triple bond (C≡C). The triple bond has one sigma + two pi bonds, while the double bond has one sigma + one pi bond.',
      correctReasoning:
        'Alkenes: **C=C** (double bond) — general formula CₙH₂ₙ. Alkynes: C≡C (triple bond) — general formula CₙH₂ₙ₋₂. The question asks specifically about alkenes, whose defining feature is the C=C double bond.',
      tip: 'Double bond (=) → alkENE. Triple bond (≡) → alkYNE. The number of lines between carbons tells you the family.',
      conceptTag: 'alkenes',
    },
    {
      questionId: 'chem-hc-003',
      selectedOptionId: 'd',
      misconception:
        'The **–OH (hydroxyl) group** is the functional group of **alcohols**, not alkenes. Hydrocarbons by definition contain only carbon and hydrogen — no oxygen. You may have confused organic compound families. Alkenes are purely C and H with a double bond.',
      correctReasoning:
        'Alkenes are **hydrocarbons** (C and H only) with a C=C double bond as their functional group. The –OH group belongs to alcohols (R–OH). The question is about alkenes specifically, which are characterized solely by their carbon-carbon double bond.',
      tip: 'Hydrocarbons = C + H only. If you see O, N, S, or halogens, it is NOT a plain hydrocarbon. Alkene functional group is C=C, nothing else.',
      conceptTag: 'alkenes',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-hc-005 — Benzene structure type
    //  Correct: b (aromatic)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-hc-005',
      selectedOptionId: 'a',
      misconception:
        'Aliphatic hydrocarbons are **open-chain** (straight or branched) compounds like hexane, pentane, etc. Benzene is a **cyclic** compound with a special ring structure. You confused open-chain hydrocarbons with ring-based ones. Benzene\'s 6-membered ring with delocalized pi electrons makes it aromatic, not aliphatic.',
      correctReasoning:
        'Benzene (C₆H₆) is the classic **aromatic** hydrocarbon. It has a planar, cyclic structure with **6 delocalized pi electrons** (following Huckel\'s rule: 4n + 2, where n = 1). Aromatic compounds are extra stable due to **resonance/delocalization**, which is why benzene prefers substitution over addition reactions.',
      tip: 'Aliphatic = open chain (no ring) or non-aromatic ring. Aromatic = cyclic + planar + delocalized pi electrons following Huckel\'s rule (4n + 2).',
      conceptTag: 'aromatic-hydrocarbons',
    },
    {
      questionId: 'chem-hc-005',
      selectedOptionId: 'c',
      misconception:
        'Alicyclic compounds are cyclic but **NOT aromatic** — examples include cyclohexane, cyclopentane, etc. These have rings but lack the special **delocalized pi electron system** that defines aromaticity. Benzene has alternating double bonds that form a continuous ring of delocalized electrons, making it aromatic, not merely alicyclic.',
      correctReasoning:
        'Benzene is aromatic because it satisfies **all criteria for aromaticity**: (1) cyclic, (2) planar, (3) fully conjugated pi system, (4) follows Huckel\'s rule with **4n + 2 = 6 pi electrons** (n = 1). Cyclohexane (C₆H₁₂) is alicyclic — it has a ring but no pi electrons at all.',
      tip: 'Alicyclic = ring WITHOUT delocalization (cyclohexane). Aromatic = ring WITH delocalized pi electrons obeying 4n + 2 rule (benzene).',
      conceptTag: 'aromatic-hydrocarbons',
    },
    {
      questionId: 'chem-hc-005',
      selectedOptionId: 'd',
      misconception:
        'Heterocyclic compounds are ring compounds where **at least one ring atom is NOT carbon** — for example, pyridine (N in ring), furan (O in ring), thiophene (S in ring). Benzene\'s ring is made entirely of **carbon atoms** (6 C atoms), so it is NOT heterocyclic. It is a **homocyclic aromatic** compound.',
      correctReasoning:
        'Benzene (C₆H₆) is a **homocyclic aromatic** hydrocarbon — "homo" because all 6 ring atoms are carbon. Heterocyclic means a ring with a different atom (N, O, S) replacing one or more carbons. Benzene has only C in its ring, making it aromatic but not heterocyclic.',
      tip: 'Hetero = different. Heterocyclic = ring with non-carbon atom(s). Benzene = all carbons in ring = homocyclic aromatic.',
      conceptTag: 'aromatic-hydrocarbons',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-hc-008 — Markownikoff's rule applies to
    //  Correct: d (unsymmetrical alkene + HX)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-hc-008',
      selectedOptionId: 'a',
      misconception:
        'Alkanes are **saturated** hydrocarbons — they have no double or triple bonds. Markownikoff\'s rule governs **addition reactions**, which require unsaturation (a double or triple bond) as the site where new atoms add. You cannot perform addition on an alkane because there is no pi bond to break.',
      correctReasoning:
        'Markownikoff\'s rule states: when HX adds to an **unsymmetrical alkene**, **H attaches to the carbon with more H atoms** (less substituted carbon), and X attaches to the carbon with fewer H atoms (more substituted carbon). This forms the more stable **secondary or tertiary carbocation** intermediate.',
      tip: 'Markownikoff = addition reaction. Addition needs a double/triple bond. No double bond (alkane) = no addition = rule does not apply.',
      conceptTag: 'markownikoff-rule',
    },
    {
      questionId: 'chem-hc-008',
      selectedOptionId: 'b',
      misconception:
        'With a **symmetrical alkene** (like ethene CH₂=CH₂ or 2-butene CH₃CH=CHCH₃), both carbons of the double bond are equivalent. Adding H to either side gives the **same product**. Markownikoff\'s rule only matters when the two carbons of the double bond are **different** (unsymmetrical) so that there are two possible products.',
      correctReasoning:
        'Markownikoff\'s rule resolves the question of **regioselectivity** — which carbon gets H and which gets X. This question only arises in **unsymmetrical alkenes** (like propene CH₃CH=CH₂) where the two double-bond carbons have different substitution. In symmetrical alkenes, both possible products are identical.',
      tip: 'If both sides of the double bond look the same, the rule is irrelevant (you get one product either way). The rule matters only when the sides are DIFFERENT.',
      conceptTag: 'markownikoff-rule',
    },
    {
      questionId: 'chem-hc-008',
      selectedOptionId: 'c',
      misconception:
        'While Markownikoff\'s rule CAN apply to alkynes too, the option says "alkyne **only**." This is incorrect because the rule **primarily and most commonly** applies to **unsymmetrical alkenes**. The rule is not limited to alkynes — it applies to any unsymmetrical substrate undergoing electrophilic addition of HX.',
      correctReasoning:
        'Markownikoff\'s rule applies to **electrophilic addition of HX to unsymmetrical alkenes** (and by extension, unsymmetrical alkynes). The most standard and NEET-relevant application is with alkenes like propene (CH₃CH=CH₂) + HBr → 2-bromopropane (major product).',
      tip: 'The rule applies to alkenes AND alkynes — but "only alkynes" is wrong. NEET questions almost always test it with unsymmetrical alkenes.',
      conceptTag: 'markownikoff-rule',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-hc-011 — C₄H₁₀ isomers count
    //  Correct: b (2 isomers)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-hc-011',
      selectedOptionId: 'a',
      misconception:
        'You thought C₄H₁₀ has only 1 structure — the straight chain **n-butane** (CH₃CH₂CH₂CH₃). But you forgot about **branching**. By taking one CH₃ group and attaching it to the middle carbon, you get **isobutane (2-methylpropane)**: (CH₃)₃CH. These are two distinct structural isomers.',
      correctReasoning:
        'C₄H₁₀ has exactly **2 structural isomers**: (1) **n-butane** — a straight chain of 4 carbons (CH₃CH₂CH₂CH₃), and (2) **isobutane (2-methylpropane)** — a 3-carbon chain with a methyl branch on C-2: (CH₃)₂CHCH₃. No other unique arrangements are possible with 4 carbons.',
      tip: 'Always check for branching possibilities. For C₄H₁₀: straight chain + one branched form = 2 isomers. Draw them out to be sure.',
      conceptTag: 'structural-isomerism',
    },
    {
      questionId: 'chem-hc-011',
      selectedOptionId: 'c',
      misconception:
        'You may have overcounted by thinking that different orientations or rotations of the same molecule are different isomers. For example, you might have counted CH₃CH₂CH₂CH₃ drawn horizontally and vertically as different — they are the **same molecule**. Or you may have thought moving the branch position creates a third isomer, but with only 4 carbons, the branch on C-2 of propane is the only possibility.',
      correctReasoning:
        'Systematic approach: with 4 carbons, you can have a **4-carbon chain** (n-butane) or a **3-carbon chain + 1 branch** (2-methylpropane). A 2-carbon chain + 2 branches is impossible without exceeding the hydrogen count. So exactly **2 isomers** exist.',
      tip: 'When counting isomers, start with the longest chain and systematically shorten it by one carbon (moving it to a branch). Check that each structure is truly unique.',
      conceptTag: 'structural-isomerism',
    },
    {
      questionId: 'chem-hc-011',
      selectedOptionId: 'd',
      misconception:
        'Four isomers is too many for C₄H₁₀. You may be confusing this with **C₅H₁₂, which has 3 isomers**, or **C₆H₁₄, which has 5 isomers**. With only 4 carbon atoms, the branching options are very limited. You can only have a straight chain (n-butane) or one branch (isobutane) — nothing more.',
      correctReasoning:
        'The number of alkane isomers grows with carbon number: C₁–C₃ have 1 isomer each, **C₄ has 2**, C₅ has 3, C₆ has 5, C₇ has 9. For C₄H₁₀, only n-butane and isobutane (2-methylpropane) are possible.',
      tip: 'Memorize the isomer counts for small alkanes: C₃ = 1, C₄ = 2, C₅ = 3. NEET loves asking C₄ and C₅ isomer counts.',
      conceptTag: 'structural-isomerism',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-hc-015 — Combustion of alkane products
    //  Correct: c (CO₂ + H₂O)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-hc-015',
      selectedOptionId: 'a',
      misconception:
        'CO + H₂ is the composition of **water gas** (or synthesis gas), which is produced by passing steam over hot coke: C + H₂O → CO + H₂. This is NOT the product of alkane combustion. **Complete combustion** of alkanes in excess oxygen produces CO₂ and H₂O, not carbon monoxide and hydrogen gas.',
      correctReasoning:
        'Complete combustion of any alkane: **CₙH₂ₙ₊₂ + (3n+1)/2 O₂ → nCO₂ + (n+1)H₂O**. For example, CH₄ + 2O₂ → CO₂ + 2H₂O. All carbon is oxidized to CO₂ and all hydrogen to H₂O when sufficient oxygen is available.',
      tip: 'Complete combustion always gives CO₂ + H₂O. CO appears only in INCOMPLETE combustion (limited oxygen supply).',
      conceptTag: 'combustion-reactions',
    },
    {
      questionId: 'chem-hc-015',
      selectedOptionId: 'b',
      misconception:
        'You got CO₂ right but paired it with H₂ instead of H₂O. In combustion, hydrogen in the alkane combines with oxygen to form **water (H₂O)**, not hydrogen gas (H₂). Free H₂ gas would mean hydrogen is NOT reacting with oxygen, which contradicts the entire combustion process.',
      correctReasoning:
        'During combustion, both C and H in the alkane are **oxidized**: C → CO₂ and H → H₂O. The oxygen is consumed in forming both products. The balanced equation for methane: CH₄ + 2O₂ → **CO₂ + 2H₂O**. Hydrogen gas (H₂) is never a product of combustion.',
      tip: 'In combustion, everything gets oxidized. Carbon → CO₂, Hydrogen → H₂O. Never H₂ (that would mean hydrogen escaped oxidation).',
      conceptTag: 'combustion-reactions',
    },
    {
      questionId: 'chem-hc-015',
      selectedOptionId: 'd',
      misconception:
        'C (soot/carbon) + H₂O represents **highly incomplete combustion** where there is barely enough oxygen. Soot (solid carbon) forms only when oxygen supply is severely limited. The question asks about standard combustion products, which assumes **sufficient oxygen**. Complete combustion fully oxidizes both C and H.',
      correctReasoning:
        'Standard combustion with adequate O₂: **CₙH₂ₙ₊₂ + O₂ → CO₂ + H₂O**. Incomplete combustion (limited O₂) can give CO + H₂O, or in extreme cases, C (soot) + H₂O. NEET questions asking for "products of combustion" almost always mean complete combustion.',
      tip: 'Soot (solid C) only forms in very oxygen-poor conditions. Standard/complete combustion = CO₂ + H₂O. This is the default answer unless the question specifies "incomplete."',
      conceptTag: 'combustion-reactions',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-hc-019 — Wurtz reaction product
    //  Correct: a (higher alkane)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-hc-019',
      selectedOptionId: 'b',
      misconception:
        'You may be confusing the **Wurtz reaction** with **dehydrohalogenation**. Dehydrohalogenation (using alcoholic KOH) removes HX from an alkyl halide to produce an **alkene**. The Wurtz reaction instead **couples two alkyl halides** using sodium metal in dry ether: R–X + 2Na + X–R → R–R + 2NaX. The product is an alkane, not an alkene.',
      correctReasoning:
        'In the Wurtz reaction, two molecules of alkyl halide react with sodium metal: **2R–X + 2Na → R–R + 2NaX**. The two R groups join to form a **higher alkane** with double the carbon count. Example: 2CH₃Br + 2Na → CH₃–CH₃ (ethane) + 2NaBr.',
      tip: 'Wurtz = 2 alkyl halides + Na → alkane (C–C bond formation). Dehydrohalogenation = alkyl halide + alc. KOH → alkene (C=C formation).',
      conceptTag: 'wurtz-reaction',
    },
    {
      questionId: 'chem-hc-019',
      selectedOptionId: 'c',
      misconception:
        'You confused the Wurtz reaction with **hydrolysis of alkyl halides**. Treating an alkyl halide with aqueous NaOH/KOH (hydrolysis) gives an **alcohol**: R–X + NaOH(aq) → R–OH + NaX. The Wurtz reaction uses **sodium metal in dry ether** (not aqueous NaOH), and the product is an alkane from C–C coupling.',
      correctReasoning:
        'Wurtz reaction: **2R–X + 2Na (dry ether) → R–R + 2NaX**. The Na metal removes X from both alkyl halides and joins the R groups. This is a **C–C bond forming** reaction that produces a higher alkane. No oxygen is involved, so no alcohol can form.',
      tip: 'To get an alcohol, you need water or OH⁻. Wurtz reaction uses dry ether (no water) + Na metal. Different reagent = different product.',
      conceptTag: 'wurtz-reaction',
    },
    {
      questionId: 'chem-hc-019',
      selectedOptionId: 'd',
      misconception:
        'Aldehydes are formed by **oxidation of primary alcohols** (using PCC, K₂Cr₂O₇, etc.) or by **Rosenmund reduction** of acid chlorides. The Wurtz reaction has nothing to do with oxidation or reduction of functional groups — it is purely a **coupling reaction** that joins two alkyl groups via sodium metal.',
      correctReasoning:
        'The Wurtz reaction: **2R–X + 2Na → R–R + 2NaX**. It creates a new C–C single bond between two alkyl groups, yielding a **higher alkane**. No carbonyl group (C=O) is formed, so aldehydes are impossible products of this reaction.',
      tip: 'Wurtz reaction = C–C coupling → alkane. It never introduces oxygen or functional groups. Think of it as "gluing" two carbon chains together.',
      conceptTag: 'wurtz-reaction',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-hc-023 — Most acidic hydrogen
    //  Correct: d (terminal alkyne C–H)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-hc-023',
      selectedOptionId: 'a',
      misconception:
        'Alkane C–H bonds are the **least acidic** among hydrocarbons. Carbon in an alkane is **sp³ hybridized** (25% s-character). Lower s-character means the bonding electrons are held farther from the nucleus, making it harder to stabilize the negative charge after losing H⁺. Alkane pKa ≈ 50, making them essentially non-acidic.',
      correctReasoning:
        'Acidity of hydrocarbons follows: **sp C–H (alkyne) > sp² C–H (alkene) > sp³ C–H (alkane)**. Terminal alkynes (like acetylene, HC≡CH) have **sp hybridized** carbon with 50% s-character, holding electrons closer to the nucleus and stabilizing the carbanion after H⁺ loss. pKa: alkyne ≈ 25, alkene ≈ 44, alkane ≈ 50.',
      tip: 'More s-character = more acidic. sp (50% s) > sp² (33% s) > sp³ (25% s). Terminal alkynes are the most acidic hydrocarbons.',
      conceptTag: 'acidity-hydrocarbons',
    },
    {
      questionId: 'chem-hc-023',
      selectedOptionId: 'b',
      misconception:
        'Alkene C–H bonds are more acidic than alkane C–H bonds, but **less acidic than alkyne C–H bonds**. Alkene carbon is **sp² hybridized** (33% s-character), which is intermediate between sp³ (25%) and sp (50%). The higher s-character in sp-hybridized terminal alkynes makes them the winners in acidity.',
      correctReasoning:
        'Acidity order: **terminal alkyne (sp, 50% s) > alkene (sp², 33% s) > alkane (sp³, 25% s)**. The key factor is **s-character of the hybrid orbital**: higher s-character means electrons are held closer to the nucleus, better stabilizing the conjugate base (carbanion) formed after H⁺ loss.',
      tip: 'Think of s-character as "electron gripping power." More s-character = holds electrons tighter = stabilizes negative charge better = more acidic.',
      conceptTag: 'acidity-hydrocarbons',
    },
    {
      questionId: 'chem-hc-023',
      selectedOptionId: 'c',
      misconception:
        'Benzene C–H bonds are attached to **sp² carbons** (33% s-character), same as alkenes. While benzene C–H is slightly more acidic than a typical alkene C–H due to ring stabilization effects, it is still **less acidic than terminal alkyne C–H** (sp, 50% s-character). Acetylene (pKa ≈ 25) beats benzene (pKa ≈ 43).',
      correctReasoning:
        'Acidity order of C–H bonds: **terminal alkyne (pKa ≈ 25) > benzene (pKa ≈ 43) ≈ alkene (pKa ≈ 44) > alkane (pKa ≈ 50)**. The sp hybridization in terminal alkynes provides the highest s-character (50%), making the resulting carbanion most stable after proton loss.',
      tip: 'Terminal alkynes are acidic enough to react with NaNH₂ and form sodium acetylide. No other hydrocarbon C–H can do this easily — that is how special their acidity is.',
      conceptTag: 'acidity-hydrocarbons',
    },
  ],
};
