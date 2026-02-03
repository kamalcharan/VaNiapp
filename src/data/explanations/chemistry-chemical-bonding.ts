import { ChapterExplanations } from '../../types';

export const chemistryChemicalBondingExplanations: ChapterExplanations = {
  chapterId: 'chemistry-chemical-bonding',
  subjectId: 'chemistry',
  entries: [
    // ═══════════════════════════════════════════════════════════
    //  chem-cb-001 — Compound formed by electron transfer
    //  Correct: a (NaCl)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-cb-001',
      selectedOptionId: 'b',
      misconception:
        'You likely thought that because Cl₂ contains chlorine, it must involve electron transfer. But Cl₂ is a **homonuclear diatomic molecule** — both atoms are identical, so there is zero electronegativity difference. They can only **share** electrons equally, forming a pure covalent bond.',
      correctReasoning:
        'Ionic bonds form when there is a **large electronegativity difference** (typically > 1.7) between a metal and a non-metal. Na (metal, EN = 0.93) transfers its valence electron to Cl (non-metal, EN = 3.16), forming Na⁺ and Cl⁻. The electrostatic attraction between these ions is the ionic bond in **NaCl**.',
      tip: 'If both atoms in a bond are the same element, it is ALWAYS a pure covalent bond — no electron transfer is possible.',
      conceptTag: 'ionic-bonding',
    },
    {
      questionId: 'chem-cb-001',
      selectedOptionId: 'c',
      misconception:
        'You may have confused **polar covalent bonds** with ionic bonds. HCl does have a partial charge separation (Hᵟ⁺–Clᵟ⁻), but the electronegativity difference (3.16 − 2.20 = 0.96) is not large enough for complete electron transfer. It is a **polar covalent** compound, not ionic.',
      correctReasoning:
        'Ionic bonds form when there is a **large electronegativity difference** (typically > 1.7) between a metal and a non-metal. Na (metal, EN = 0.93) transfers its valence electron to Cl (non-metal, EN = 3.16), forming Na⁺ and Cl⁻. NaCl has an EN difference of 2.23, which clearly falls in the ionic range.',
      tip: 'Polar covalent is NOT ionic. A partial charge (delta) is very different from a full charge (+ or −). Check the EN difference: > 1.7 usually means ionic.',
      conceptTag: 'ionic-bonding',
    },
    {
      questionId: 'chem-cb-001',
      selectedOptionId: 'd',
      misconception:
        'You may have thought that since CCl₄ has four Cl atoms, there must be electron transfer happening. However, CCl₄ is formed by **sharing** of electrons between carbon and chlorine. Carbon (EN = 2.55) and chlorine (EN = 3.16) have a moderate difference, making each C–Cl bond polar covalent, but the **symmetric tetrahedral shape** makes the molecule overall nonpolar.',
      correctReasoning:
        'Ionic bonds form when there is a **large electronegativity difference** (typically > 1.7) between a metal and a non-metal. In NaCl, Na (a metal) **completely transfers** its one valence electron to Cl (a non-metal). CCl₄ involves only non-metals sharing electrons.',
      tip: 'A compound of ONLY non-metals is almost always covalent. Ionic bonds need at least one metal atom (or a polyatomic ion like NH₄⁺).',
      conceptTag: 'ionic-bonding',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-cb-002 — Bond in O₂ molecule
    //  Correct: b (covalent bond)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-cb-002',
      selectedOptionId: 'a',
      misconception:
        'You confused ionic and covalent bonding. Ionic bonds form between a **metal and a non-metal** with a large EN difference. O₂ consists of two identical oxygen atoms — same element, same electronegativity — so there is no possibility of electron transfer. They must **share** electrons.',
      correctReasoning:
        'O₂ is a homonuclear diatomic molecule. Both oxygen atoms have EN = 3.44, so the difference is zero. They share two pairs of electrons, forming a **double covalent bond** (O=O). Each oxygen contributes 2 electrons to the shared pairs.',
      tip: 'Quick rule: same element bonding to itself = always covalent (H₂, N₂, O₂, Cl₂, etc.).',
      conceptTag: 'covalent-bonding',
    },
    {
      questionId: 'chem-cb-002',
      selectedOptionId: 'c',
      misconception:
        'Metallic bonding is a common distractor. **Metallic bonds** exist only in metals or alloys, where a "sea of delocalized electrons" holds positive metal ions together. Oxygen is a **non-metal** — it cannot form metallic bonds under normal conditions.',
      correctReasoning:
        'O₂ is formed by mutual sharing of two electron pairs between two identical non-metal atoms. This is a **covalent bond**. Metallic bonds require metal atoms arranged in a lattice with free-flowing electrons — completely different from discrete molecular bonding.',
      tip: 'Metallic bonding = metals only. If the question is about a non-metal molecule, metallic bond is always wrong.',
      conceptTag: 'covalent-bonding',
    },
    {
      questionId: 'chem-cb-002',
      selectedOptionId: 'd',
      misconception:
        'You confused an **intramolecular bond** (holds atoms within a molecule) with an **intermolecular force** (holds molecules together). A hydrogen bond is a weak intermolecular force between H bonded to F/O/N and a lone pair on another F/O/N. The bond **within** O₂ that holds the two O atoms together is a covalent bond.',
      correctReasoning:
        'The bond in O₂ is a **double covalent bond** (one sigma + one pi bond). Hydrogen bonds are intermolecular attractive forces — they act *between* different molecules (like between H₂O molecules), not within a single molecule like O₂.',
      tip: 'Hydrogen bond is NOT a real bond between atoms in a molecule — it is an intermolecular force. When asked "what bond holds atoms in a molecule," hydrogen bond is almost always wrong.',
      conceptTag: 'covalent-bonding',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-cb-003 — Coordinate (dative) bond example
    //  Correct: c (NH₄⁺)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-cb-003',
      selectedOptionId: 'a',
      misconception:
        'You may have confused ionic bonding with coordinate bonding. NaCl is formed by **complete transfer** of an electron from Na to Cl — this is an ionic bond. A coordinate bond requires one atom to **donate a lone pair** to another atom that has an empty orbital. There is no lone pair donation happening in NaCl formation.',
      correctReasoning:
        'In NH₄⁺, the nitrogen in NH₃ already has a **lone pair** after forming 3 covalent bonds with H. When H⁺ (which has an empty 1s orbital) approaches, N **donates** its lone pair to H⁺, forming a coordinate bond. This is a textbook example of **dative bonding**: one atom provides both electrons.',
      tip: 'Coordinate bond = lone pair donation. Always look for an atom with a lone pair donating to an atom with an empty orbital.',
      conceptTag: 'coordinate-bonding',
    },
    {
      questionId: 'chem-cb-003',
      selectedOptionId: 'b',
      misconception:
        'You likely thought that since oxygen in H₂O has lone pairs, it must be forming a coordinate bond. While O does have 2 lone pairs, those lone pairs are **not being donated** to the hydrogen atoms. Both O–H bonds in water are normal covalent bonds where each atom contributes one electron. Having lone pairs does not automatically mean coordinate bonding.',
      correctReasoning:
        'Coordinate bonding happens when one atom donates a **lone pair to an atom with an empty orbital**. In NH₄⁺, N donates its lone pair to H⁺ (empty orbital). In H₂O, oxygen\'s lone pairs are simply sitting on oxygen — they are not being shared with any other atom to form an additional bond.',
      tip: 'Having a lone pair is necessary but not sufficient for a coordinate bond. The lone pair must actually be DONATED to an electron-deficient species.',
      conceptTag: 'coordinate-bonding',
    },
    {
      questionId: 'chem-cb-003',
      selectedOptionId: 'd',
      misconception:
        'You may have thought CH₄ involves coordinate bonding because carbon forms 4 bonds. But in CH₄, each C–H bond is a **normal covalent bond** — carbon contributes one electron and hydrogen contributes one electron per bond. Carbon uses all 4 of its valence electrons in bonding and has **no lone pair** left to donate.',
      correctReasoning:
        'A coordinate bond needs a **donor atom** (with a lone pair) and an **acceptor atom** (with an empty orbital). In NH₃ → NH₄⁺, nitrogen has a lone pair and donates it to H⁺. In CH₄, carbon has no lone pairs — all its valence electrons are used in four C–H covalent bonds.',
      tip: 'Carbon in CH₄ has zero lone pairs. No lone pair = no coordinate bond possible from that atom.',
      conceptTag: 'coordinate-bonding',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-cb-004 — Strongest hydrogen bond
    //  Correct: d (HF)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-cb-004',
      selectedOptionId: 'a',
      misconception:
        'You probably thought Cl is electronegative enough for strong hydrogen bonding. While HCl does have some weak hydrogen bonding ability, **Cl is not electronegative enough** (EN = 3.16) compared to F (EN = 3.98). Hydrogen bonds are significant only when H is bonded to the most electronegative atoms: **F, O, or N**. Cl barely qualifies and forms very weak H-bonds.',
      correctReasoning:
        'Hydrogen bond strength depends on the **electronegativity and small size** of the atom bonded to H. Fluorine is the **most electronegative element** (EN = 3.98) and is very small, creating a very strong dipole in H–F. This makes HF form the strongest hydrogen bonds among all hydrogen halides.',
      tip: 'For NEET, remember: H-bond strength follows F > O > N. Cl and other halogens form negligible H-bonds.',
      conceptTag: 'hydrogen-bonding',
    },
    {
      questionId: 'chem-cb-004',
      selectedOptionId: 'b',
      misconception:
        'You may have confused **bond strength** with **molecular size**. HBr has a larger, more polarizable Br atom, but that does not help hydrogen bonding. Hydrogen bonds depend on **electronegativity**, not polarizability. Br (EN = 2.96) is much less electronegative than F (EN = 3.98), so HBr forms extremely weak hydrogen bonds.',
      correctReasoning:
        'Hydrogen bond strength increases with the **electronegativity** of the atom bonded to H and decreases with its **size**. Fluorine has the highest EN and smallest size among halogens, making the H–F bond highly polar and HF hydrogen bonds the strongest.',
      tip: 'Bigger atom does NOT mean stronger H-bond. Smaller and more electronegative = stronger H-bond. That is why HF > HCl > HBr > HI.',
      conceptTag: 'hydrogen-bonding',
    },
    {
      questionId: 'chem-cb-004',
      selectedOptionId: 'c',
      misconception:
        'You may have thought that iodine, being the largest halogen, creates more electron density and therefore a stronger H-bond. This is backwards. HI has the **weakest** hydrogen bonding among all hydrogen halides because iodine is the **least electronegative** (EN = 2.66) and largest halogen. Large atomic size disperses the charge, weakening the dipole.',
      correctReasoning:
        'Hydrogen bond strength depends on **high electronegativity and small size**. The trend for hydrogen halides is: HF >> HCl > HBr > HI. Fluorine (EN = 3.98, smallest halogen) creates the strongest H–F dipole, making HF hydrogen bonds the strongest.',
      tip: 'Think of H-bond strength as inversely related to halogen size: smaller halogen = stronger H-bond. HF wins every time.',
      conceptTag: 'hydrogen-bonding',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-cb-009 — sp³ hybridization shape
    //  Correct: b (tetrahedral)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-cb-009',
      selectedOptionId: 'a',
      misconception:
        'You confused **sp hybridization** (which gives a linear shape) with **sp³ hybridization**. Linear geometry results from 2 hybrid orbitals arranged at 180°. sp³ hybridization involves mixing of **one s + three p orbitals**, producing 4 equivalent sp³ hybrid orbitals that point toward the corners of a tetrahedron.',
      correctReasoning:
        'sp³ hybridization mixes **1s + 3p = 4 hybrid orbitals**. To minimize repulsion, these 4 orbitals arrange themselves as far apart as possible, pointing to the four corners of a **tetrahedron** with bond angles of **109.5°**. Example: CH₄, NH₃ (with one lone pair), H₂O (with two lone pairs).',
      tip: 'Number of hybrid orbitals tells you the shape: sp = 2 (linear, 180°), sp² = 3 (trigonal planar, 120°), sp³ = 4 (tetrahedral, 109.5°).',
      conceptTag: 'hybridization',
    },
    {
      questionId: 'chem-cb-009',
      selectedOptionId: 'c',
      misconception:
        'You mixed up **sp² and sp³** hybridization. Trigonal planar geometry (120° bond angles) results from **sp² hybridization**, where 1s + 2p orbitals mix to form 3 hybrid orbitals in a flat plane. sp³ has **one extra p orbital** mixed in, giving 4 hybrid orbitals and a three-dimensional tetrahedral shape.',
      correctReasoning:
        'sp³ = 1s + 3p = **4 hybrid orbitals** arranged tetrahedrally at 109.5°. sp² = 1s + 2p = 3 hybrid orbitals arranged in a trigonal plane at 120°. Always count the number of orbitals mixed: if all three p orbitals participate, the result is sp³ (tetrahedral).',
      tip: 'sp² = flat triangle (like BF₃). sp³ = 3D pyramid-like shape (like CH₄). The extra p orbital pushes the geometry out of the plane.',
      conceptTag: 'hybridization',
    },
    {
      questionId: 'chem-cb-009',
      selectedOptionId: 'd',
      misconception:
        'You may have jumped to **octahedral**, which sounds like a complex 3D shape and seems "advanced." Octahedral geometry requires **sp³d² hybridization** — mixing 6 orbitals (1s + 3p + 2d). That needs d-orbitals, which are only available in elements from Period 3 onwards. sp³ has only **4 hybrid orbitals**, which is not enough for 6 directions.',
      correctReasoning:
        'Match the number of hybrid orbitals to geometry: sp (2) = linear, sp² (3) = trigonal planar, **sp³ (4) = tetrahedral**, sp³d (5) = trigonal bipyramidal, sp³d² (6) = octahedral. sp³ has exactly 4 orbitals, so the shape is tetrahedral.',
      tip: 'Octahedral needs 6 orbitals — that is sp³d². sp³ only has 4 orbitals = tetrahedral. Count the superscripts: sp³ → 1+3 = 4.',
      conceptTag: 'hybridization',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-cb-013 — Highest lattice energy
    //  Correct: a (MgO)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-cb-013',
      selectedOptionId: 'b',
      misconception:
        'You likely picked NaCl because it is the most commonly discussed ionic compound. But "most common" does not mean "highest lattice energy." Lattice energy depends on **charge and size** of ions. MgO has Mg²⁺ and O²⁻ (charges of +2 and −2), while NaCl has Na⁺ and Cl⁻ (charges of +1 and −1). Higher charges mean **much stronger** electrostatic attraction.',
      correctReasoning:
        'Lattice energy is proportional to **(q⁺ × q⁻) / (r⁺ + r⁻)** (Born-Lande equation simplified). MgO: charges = +2, −2, product = 4. NaCl: charges = +1, −1, product = 1. Even before considering size, MgO has **4 times** the charge product of NaCl. Additionally, Mg²⁺ and O²⁻ are smaller ions than Na⁺ and Cl⁻, further increasing lattice energy.',
      tip: 'For lattice energy comparisons, always check CHARGE first (it matters more), then size. Higher charge and smaller size = higher lattice energy.',
      conceptTag: 'lattice-energy',
    },
    {
      questionId: 'chem-cb-013',
      selectedOptionId: 'c',
      misconception:
        'You may have thought larger ions like K⁺ and Br⁻ somehow trap more energy. This is exactly backwards. Lattice energy **decreases** with increasing ionic size because the ions are farther apart, weakening the electrostatic attraction. KBr has charges of only +1/−1 AND large ionic radii — double disadvantage compared to MgO.',
      correctReasoning:
        'Lattice energy ∝ (q⁺ × q⁻) / (r⁺ + r⁻). For MgO: charge product = 2 × 2 = 4, and both Mg²⁺ (72 pm) and O²⁻ (140 pm) are small. For KBr: charge product = 1 × 1 = 1, and K⁺ (138 pm) and Br⁻ (196 pm) are large. MgO wins on both charge and size.',
      tip: 'Larger ions = weaker lattice. K⁺ and Br⁻ are some of the biggest common ions. Always pick the compound with the smallest, most highly charged ions.',
      conceptTag: 'lattice-energy',
    },
    {
      questionId: 'chem-cb-013',
      selectedOptionId: 'd',
      misconception:
        'LiF is a strong contender — it has the **smallest** alkali metal cation (Li⁺) and smallest halide anion (F⁻). But its charges are only +1 and −1. MgO has Mg²⁺ and O²⁻ with charges of +2 and −2. The **charge product** for MgO (4) is four times that of LiF (1), and this dominates the lattice energy calculation despite LiF having slightly smaller individual ions.',
      correctReasoning:
        'Lattice energy ∝ (q⁺ × q⁻) / (r⁺ + r⁻). LiF: 1 × 1 / (76 + 133) = 1/209. MgO: 2 × 2 / (72 + 140) = 4/212. The charge effect (4× stronger) far outweighs the tiny difference in ionic sizes. MgO lattice energy ≈ 3850 kJ/mol vs LiF ≈ 1037 kJ/mol.',
      tip: 'When comparing +1/−1 ions vs +2/−2 ions, the doubly-charged compound almost always has higher lattice energy — charge effect dominates size.',
      conceptTag: 'lattice-energy',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-cb-017 — VSEPR theory: BF₃ shape
    //  Correct: c (trigonal planar)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-cb-017',
      selectedOptionId: 'a',
      misconception:
        'You may have thought that since boron forms 3 bonds + has "space" for a 4th, BF₃ should be tetrahedral. But VSEPR counts only **bonding pairs and lone pairs** around the central atom. Boron in BF₃ has only **3 bonding pairs and 0 lone pairs** — it is electron deficient. Without a 4th electron pair, there is no reason for tetrahedral geometry.',
      correctReasoning:
        'VSEPR theory predicts shape based on **electron pair geometry**. BF₃: B has 3 valence electrons, forms 3 bonds with F, and has **zero lone pairs**. 3 bonding pairs arrange themselves at **120°** in a plane to minimize repulsion. This gives a **trigonal planar** shape.',
      tip: 'Tetrahedral needs 4 electron pairs around the central atom. BF₃ has only 3. Count the pairs, not the bonds you think "should" be there.',
      conceptTag: 'vsepr-theory',
    },
    {
      questionId: 'chem-cb-017',
      selectedOptionId: 'b',
      misconception:
        'Linear geometry occurs when there are only **2 electron pairs** (bonding or lone) around the central atom, like in BeCl₂ or CO₂. BF₃ has **3 bonding pairs**, which is one more than linear requires. With 3 pairs, the geometry expands from a line to a triangle.',
      correctReasoning:
        'By VSEPR: 2 pairs → linear (180°), **3 pairs → trigonal planar (120°)**, 4 pairs → tetrahedral (109.5°). BF₃ has B at the center with 3 bonding pairs and no lone pairs, so 3 electron regions → trigonal planar.',
      tip: 'Linear = only 2 electron groups (like CO₂, BeCl₂). The moment you have 3 electron groups, it becomes trigonal planar at minimum.',
      conceptTag: 'vsepr-theory',
    },
    {
      questionId: 'chem-cb-017',
      selectedOptionId: 'd',
      misconception:
        'You likely confused BF₃ with **NH₃**. Both have 3 bonds, but NH₃ also has **1 lone pair** on nitrogen, making it 4 electron pairs total (tetrahedral electron geometry) but **trigonal pyramidal molecular shape**. BF₃ has **no lone pairs** on boron, so it stays flat — trigonal planar, not pyramidal.',
      correctReasoning:
        'Pyramidal shape occurs when there are **3 bonding pairs + 1 lone pair** (like NH₃). BF₃ has 3 bonding pairs + **0 lone pairs**. Without the lone pair pushing bonds downward, the molecule stays perfectly flat and symmetrical — trigonal planar.',
      tip: 'Pyramidal = 3 bonds + 1 lone pair (NH₃). Trigonal planar = 3 bonds + 0 lone pairs (BF₃). The lone pair makes all the difference.',
      conceptTag: 'vsepr-theory',
    },

    // ═══════════════════════════════════════════════════════════
    //  chem-cb-021 — Polar vs nonpolar
    //  Correct: d (CO₂ is nonpolar)
    // ═══════════════════════════════════════════════════════════
    {
      questionId: 'chem-cb-021',
      selectedOptionId: 'a',
      misconception:
        'You thought H₂O is nonpolar, but it is actually one of the **most polar** molecules. H₂O has a **bent shape** (bond angle ≈ 104.5°) due to 2 lone pairs on oxygen. The two O–H bond dipoles do NOT cancel because they are not in a straight line. The net dipole moment of water is **1.85 D** — strongly polar.',
      correctReasoning:
        'CO₂ is nonpolar despite having two polar C=O bonds. Why? Because CO₂ is **linear** (180°), and the two equal C=O dipoles point in exactly opposite directions, **perfectly canceling** each other. Net dipole = 0. Contrast with H₂O, which is bent, so its dipoles do not cancel.',
      tip: 'Molecular polarity depends on SHAPE + BOND POLARITY. Symmetric shapes (linear CO₂, tetrahedral CCl₄) cancel dipoles. Bent/pyramidal shapes do NOT cancel.',
      conceptTag: 'molecular-polarity',
    },
    {
      questionId: 'chem-cb-021',
      selectedOptionId: 'b',
      misconception:
        'You thought NH₃ is nonpolar, but NH₃ is **polar**. Nitrogen has **1 lone pair** that creates an asymmetric electron distribution. The 3 N–H bond dipoles all point generally in the same direction (away from the lone pair), and they do NOT cancel out. NH₃ has a dipole moment of **1.47 D**.',
      correctReasoning:
        'CO₂ is nonpolar because its **linear geometry** (O=C=O at 180°) causes the two equal bond dipoles to cancel perfectly. NH₃ is trigonal pyramidal with a lone pair — the asymmetry means bond dipoles add up rather than cancel. Always check the 3D shape before deciding polarity.',
      tip: 'Lone pairs on the central atom almost always make a molecule polar (they create asymmetry). NH₃, H₂O — both have lone pairs, both are polar.',
      conceptTag: 'molecular-polarity',
    },
    {
      questionId: 'chem-cb-021',
      selectedOptionId: 'c',
      misconception:
        'You may have confused SO₂ with CO₂ because both contain double bonds to oxygen. But SO₂ is **bent** (bond angle ≈ 119°) due to a lone pair on sulfur, while CO₂ is **linear** (180°) with no lone pairs on carbon. The bent shape in SO₂ means the two S=O dipoles do NOT cancel, giving SO₂ a net dipole moment of **1.63 D**.',
      correctReasoning:
        'CO₂: linear, 2 equal C=O dipoles cancel → **nonpolar** (dipole moment = 0). SO₂: bent, 2 S=O dipoles do NOT cancel → polar (dipole moment = 1.63 D). The key difference is the **lone pair on sulfur** in SO₂ that bends the molecule.',
      tip: 'CO₂ and SO₂ look similar in formula but have DIFFERENT shapes. CO₂ = linear (no lone pair on C). SO₂ = bent (lone pair on S). Shape decides polarity.',
      conceptTag: 'molecular-polarity',
    },
  ],
};
