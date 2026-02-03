import { SubjectConcepts } from '../../types';

export const chemistryConcepts: SubjectConcepts = {
  subjectId: 'chemistry',
  concepts: [
    // ── Chemical Bonding ──────────────────────────────────────────────
    {
      conceptTag: 'ionic-bonding',
      subjectId: 'chemistry',
      chapterId: 'chemistry-chemical-bonding',
      title: 'Ionic Bonding',
      explanation:
        'Ionic bonding occurs when one atom **transfers electrons** to another, creating oppositely charged ions that attract each other through **electrostatic forces**. This typically happens between a **metal** (low ionization energy) and a **non-metal** (high electron affinity). The metal loses electrons to form a **cation** (positive ion) while the non-metal gains electrons to form an **anion** (negative ion).\n\nThe classic example is **sodium chloride (NaCl)**. Sodium (Na) has one valence electron with a low ionization energy of 496 kJ/mol, making it easy to lose. Chlorine (Cl) has seven valence electrons and a high electron affinity of -349 kJ/mol, making it eager to gain one more electron. When Na transfers its electron to Cl, Na+ and Cl- ions form and arrange themselves into a **crystal lattice** — a regular three-dimensional arrangement that maximises attractive forces and minimises repulsive forces.\n\n**Lattice energy** is the energy released when gaseous ions come together to form one mole of an ionic solid. It is a direct measure of the strength of the ionic bond. Higher lattice energy means a more stable compound. Lattice energy increases with **higher charge** on the ions and **smaller ionic radii** (as described by Coulomb\'s law). For example, MgO has a much higher lattice energy than NaCl because Mg2+ and O2- carry double the charge.\n\nKey properties of ionic compounds include **high melting and boiling points** (due to strong electrostatic forces), **electrical conductivity** in molten state or aqueous solution (free ions carry charge), and **solubility in polar solvents** like water. They are generally **hard but brittle** — when layers shift, like charges align and repel, causing the crystal to shatter.',
      analogy:
        'Think of ionic bonding like sending money via UPI. You transfer money (electrons) from your account (metal atom) to a shopkeeper\'s account (non-metal atom). After the transfer, you have less (cation) and the shopkeeper has more (anion), but the transaction keeps you connected — just like electrostatic attraction holds the ions together in a crystal.',
      examRelevance:
        'Ionic bonding is a consistently tested topic in NEET. Questions frequently appear on lattice energy trends, Born-Haber cycle calculations, properties of ionic compounds, and comparing ionic character using Fajan\'s rules. Expect 1-2 questions every year from this concept.',
      commonMistakes: [
        'Assuming all metal-nonmetal bonds are purely ionic — many have significant covalent character as described by Fajan\'s rules (small cation + large anion = more covalent).',
        'Confusing lattice energy with bond energy — lattice energy applies to ionic solids forming from gaseous ions, not individual bond breaking.',
        'Forgetting that ionic compounds conduct electricity only when molten or dissolved, not in solid state.',
      ],
      quickRecap:
        'Ionic bonds form by electron transfer from metals to non-metals, creating cations and anions held by electrostatic attraction in a crystal lattice.\nLattice energy increases with higher ionic charge and smaller ionic radius; ionic compounds have high melting points and conduct only when molten or dissolved.',
    },
    {
      conceptTag: 'covalent-bonding',
      subjectId: 'chemistry',
      chapterId: 'chemistry-chemical-bonding',
      title: 'Covalent Bonding',
      explanation:
        'Covalent bonding occurs when two atoms **share electrons** to achieve a stable electronic configuration. Unlike ionic bonding, this typically happens between **two non-metals** with similar electronegativities. Each atom contributes one electron to form a **shared pair**, and the bond is the result of the mutual attraction of both nuclei for the shared electron density between them.\n\nCovalent bonds are classified based on the number of shared pairs: a **single bond** (one shared pair, e.g., H-H in H2), a **double bond** (two shared pairs, e.g., O=O in O2), and a **triple bond** (three shared pairs, e.g., N≡N in N2). As the number of shared pairs increases, **bond order** increases, **bond length decreases**, and **bond dissociation energy increases**. The triple bond in N2 (bond energy 945 kJ/mol) is one of the strongest covalent bonds known, which is why nitrogen gas is so unreactive.\n\nThe type of overlap determines the bond: **sigma (σ) bonds** form by **head-on overlap** of orbitals along the internuclear axis and allow free rotation. **Pi (π) bonds** form by **lateral (sideways) overlap** of p-orbitals above and below the internuclear axis and restrict rotation. A double bond consists of one σ + one π bond; a triple bond consists of one σ + two π bonds. Sigma bonds are **stronger** than pi bonds because of greater orbital overlap.\n\nCovalent compounds generally have **low melting and boiling points** (weak intermolecular forces), are **poor conductors** of electricity (no free ions), and are often **soluble in non-polar solvents**. However, giant covalent structures like **diamond** and **SiO2** have very high melting points due to an extended network of covalent bonds.',
      analogy:
        'Covalent bonding is like two friends sharing earphones on a metro ride — each person contributes one earbud, and both enjoy the music together. A single bond is sharing one earphone pair, a double bond is sharing earphones plus a phone charger, and a triple bond is sharing earphones, charger, and snacks. The more you share, the stronger the friendship (bond)!',
      examRelevance:
        'Covalent bonding is fundamental to NEET chemistry. Questions focus on sigma vs pi bond identification, bond order calculations, comparing bond lengths and energies, and identifying polar vs non-polar covalent bonds. This concept appears in both inorganic and organic chemistry sections.',
      commonMistakes: [
        'Forgetting that a double bond is NOT simply twice as strong as a single bond — the pi component is weaker than the sigma component.',
        'Confusing bond order with number of bonds: bond order = (bonding electrons - antibonding electrons)/2 in molecular orbital theory, not just counting shared pairs.',
        'Assuming all covalent compounds have low melting points — giant covalent structures like diamond are exceptions.',
      ],
      quickRecap:
        'Covalent bonds form by electron sharing between non-metals; single, double, and triple bonds involve 1, 2, and 3 shared pairs respectively.\nSigma bonds form by head-on overlap and are stronger; pi bonds form by lateral overlap and restrict rotation around the bond axis.',
    },
    {
      conceptTag: 'hydrogen-bonding',
      subjectId: 'chemistry',
      chapterId: 'chemistry-chemical-bonding',
      title: 'Hydrogen Bonding',
      explanation:
        'Hydrogen bonding is a special type of **intermolecular force** that occurs when hydrogen is bonded to a highly **electronegative atom** — specifically **fluorine (F), oxygen (O), or nitrogen (N)**. The large electronegativity difference creates a highly polar bond, leaving hydrogen with a significant partial positive charge (δ+) that attracts the **lone pair** of an electronegative atom on a neighbouring molecule.\n\nHydrogen bonds are **stronger than van der Waals forces** (about 10-40 kJ/mol) but **weaker than covalent or ionic bonds** (150-1000 kJ/mol). Despite being relatively weak individually, their cumulative effect dramatically influences physical properties. **Water (H2O)** is the textbook example: hydrogen bonding gives water its **anomalously high boiling point** (100°C compared to -60°C expected for a molecule of its size), **high surface tension**, **high specific heat capacity**, and the unusual property of **ice being less dense than liquid water** (ice floats because hydrogen bonds create an open hexagonal lattice).\n\nThere are two types: **intermolecular hydrogen bonding** (between different molecules, e.g., in water, HF, NH3) and **intramolecular hydrogen bonding** (within the same molecule, e.g., in ortho-nitrophenol). Intramolecular hydrogen bonding **decreases** boiling point compared to the para-isomer because it reduces intermolecular interactions.\n\nIn biological systems, hydrogen bonding is critical. The **double helix of DNA** is held together by hydrogen bonds between complementary base pairs — **adenine-thymine (2 H-bonds)** and **guanine-cytosine (3 H-bonds)**. Protein secondary structures like **alpha-helices and beta-sheets** are also stabilised by hydrogen bonds between peptide backbone groups.',
      analogy:
        'Hydrogen bonding is like the follow-back culture on Instagram. When someone with high influence (electronegative atom like O, N, F) follows you, the connection (H-bond) is meaningful and noticeable. One follow-back is modest, but thousands of such connections (cumulative H-bonds) make a huge difference — just like how hydrogen bonds collectively give water its extraordinary properties despite each bond being weak on its own.',
      examRelevance:
        'Hydrogen bonding is a NEET favourite. Expect questions on boiling point anomalies (H2O vs H2S), intramolecular vs intermolecular hydrogen bonding effects on boiling points of isomers (ortho vs para nitrophenol), and the role of H-bonds in DNA base pairing. Appears almost every year.',
      commonMistakes: [
        'Including Cl as an atom that forms hydrogen bonds — only F, O, and N are electronegative enough (Cl is too large and not electronegative enough).',
        'Confusing intramolecular and intermolecular hydrogen bonding effects: intramolecular H-bonding LOWERS boiling point because it reduces intermolecular attraction.',
        'Thinking hydrogen bonds are actual covalent bonds — they are electrostatic interactions, roughly 10 times weaker than covalent bonds.',
      ],
      quickRecap:
        'Hydrogen bonds form when H bonded to F, O, or N is attracted to a lone pair on a neighbouring electronegative atom; they explain water\'s anomalous properties.\nDNA base pairing (A-T: 2 H-bonds, G-C: 3 H-bonds) and protein folding rely heavily on hydrogen bonding in biological systems.',
    },
    {
      conceptTag: 'vsepr-theory',
      subjectId: 'chemistry',
      chapterId: 'chemistry-chemical-bonding',
      title: 'VSEPR Theory',
      explanation:
        '**Valence Shell Electron Pair Repulsion (VSEPR) theory** predicts the **geometry of molecules** based on the idea that electron pairs around a central atom arrange themselves to **minimise repulsion**. Both **bonding pairs (BP)** and **lone pairs (LP)** are considered, and the arrangement depends on the total number of electron pairs (called **steric number**).\n\nThe key principle is the order of repulsion: **LP-LP > LP-BP > BP-BP**. Lone pairs occupy more space than bonding pairs because they are held closer to the nucleus and spread out more. This greater repulsion causes **bond angle compression**. For example, methane (CH4) has 4 BP and 0 LP, giving a perfect **tetrahedral geometry** with bond angles of **109.5°**. Ammonia (NH3) has 3 BP and 1 LP — the lone pair compresses the bond angle to **107°**, giving a **trigonal pyramidal** shape. Water (H2O) has 2 BP and 2 LP — two lone pairs compress the angle further to **104.5°**, giving a **bent/V-shape**.\n\nCommon geometries by steric number: **2** = linear (180°, e.g., BeCl2), **3** = trigonal planar (120°, e.g., BF3), **4** = tetrahedral (109.5°, e.g., CH4), **5** = trigonal bipyramidal (90°/120°, e.g., PCl5), **6** = octahedral (90°, e.g., SF6). When lone pairs are present, the molecular geometry differs from the electron geometry. For steric number 5 with 1 LP, the shape is **see-saw** (SF4); with 2 LP, it is **T-shaped** (ClF3); with 3 LP, it is **linear** (XeF2).\n\nVSEPR theory is simple and remarkably accurate for predicting shapes of main group compounds but does not explain **why** bonds form — it is purely a geometric model.',
      analogy:
        'Imagine six people in a crowded Mumbai local train trying to maintain maximum personal space. Everyone pushes away from each other equally — that\'s like bonding pairs arranging symmetrically. Now imagine two of them are carrying huge backpacks (lone pairs) — they take up extra space and push others closer together, distorting the arrangement. That\'s exactly how lone pairs compress bond angles in VSEPR theory.',
      examRelevance:
        'VSEPR theory questions appear frequently in NEET, typically asking you to predict molecular shapes, bond angles, or identify the effect of lone pairs. Comparing shapes of molecules like CH4, NH3, and H2O is a classic question. Know shapes for steric numbers 2 through 6 with varying lone pairs.',
      commonMistakes: [
        'Confusing electron geometry with molecular geometry — electron geometry includes lone pairs, but molecular geometry describes only the arrangement of atoms.',
        'Forgetting that lone pairs compress bond angles: NH3 is 107° (not 109.5°) and H2O is 104.5° (not 109.5°) due to LP-BP repulsion.',
        'Assuming double bonds count as two electron pairs in VSEPR — a double bond is treated as a single electron domain (one region of electron density).',
      ],
      quickRecap:
        'VSEPR theory predicts molecular shapes by minimising electron pair repulsion; lone pairs repel more than bonding pairs (LP-LP > LP-BP > BP-BP).\nCommon shapes: linear (2), trigonal planar (3), tetrahedral (4), trigonal bipyramidal (5), octahedral (6) — lone pairs distort geometry and reduce bond angles.',
    },
    {
      conceptTag: 'hybridization',
      subjectId: 'chemistry',
      chapterId: 'chemistry-chemical-bonding',
      title: 'Hybridization',
      explanation:
        '**Hybridization** is the concept of mixing atomic orbitals of similar energy to form new **hybrid orbitals** of equal energy and identical shape, which then overlap with orbitals of other atoms to form bonds. This explains molecular geometries that pure atomic orbitals alone cannot account for.\n\nIn **sp3 hybridization**, one s-orbital mixes with three p-orbitals to produce four equivalent sp3 hybrid orbitals arranged in a **tetrahedral geometry** (bond angle 109.5°). Example: **methane (CH4)** — carbon\'s ground state (2s2 2p2) cannot explain four equivalent bonds, but sp3 hybridization produces four equivalent orbitals that perfectly overlap with hydrogen\'s 1s orbitals.\n\nIn **sp2 hybridization**, one s-orbital mixes with two p-orbitals, forming three sp2 hybrids in a **trigonal planar** arrangement (120°). The remaining unhybridized p-orbital forms a **pi bond** by lateral overlap. Example: **ethylene (C2H4)** — each carbon is sp2 hybridized, the C=C double bond consists of one σ bond (sp2-sp2 overlap) and one π bond (p-p lateral overlap).\n\nIn **sp hybridization**, one s-orbital mixes with one p-orbital, producing two sp hybrids in a **linear** arrangement (180°). Two unhybridized p-orbitals are available for pi bonding. Example: **acetylene (C2H2)** — the C≡C triple bond has one σ bond and two π bonds.\n\nA quick rule to determine hybridization: **steric number = number of sigma bonds + lone pairs** on the central atom. Steric number 4 → sp3, 3 → sp2, 2 → sp. For expanded octets: steric number 5 → sp3d, 6 → sp3d2. Lone pairs occupy hybrid orbitals: in NH3, nitrogen is sp3 hybridized (3 bonds + 1 lone pair = steric number 4), not sp2.',
      analogy:
        'Hybridization is like mixing different flavours at a Keventers shake counter. You take one vanilla scoop (s-orbital) and three chocolate scoops (p-orbitals), blend them together, and get four identical butterscotch shakes (sp3 hybrids). The original flavours are gone — the new shakes are identical in taste and size, just like hybrid orbitals are identical in energy and shape.',
      examRelevance:
        'Hybridization is tested in NEET almost every year. Questions ask you to identify hybridization of a central atom, predict geometry from hybridization, or determine hybridization from steric number. Know the hybridization of common molecules: CH4 (sp3), C2H4 (sp2), C2H2 (sp), BF3 (sp2), PCl5 (sp3d), SF6 (sp3d2).',
      commonMistakes: [
        'Forgetting to count lone pairs when determining hybridization — NH3 is sp3 (3 bonds + 1 LP = steric number 4), not sp2.',
        'Assuming hybridization changes bond strength — it changes geometry and bond angles, but bond strength depends on the type of overlap (sigma vs pi) and atomic size.',
        'Confusing the number of hybrid orbitals with the number of bonds: hybrid orbitals can hold lone pairs too, not just bonding electrons.',
      ],
      quickRecap:
        'Hybridization mixes atomic orbitals to form equivalent hybrid orbitals: sp3 (tetrahedral, 109.5°), sp2 (trigonal planar, 120°), sp (linear, 180°).\nDetermine hybridization using steric number (sigma bonds + lone pairs): 2→sp, 3→sp2, 4→sp3, 5→sp3d, 6→sp3d2.',
    },
    {
      conceptTag: 'metallic-bonding',
      subjectId: 'chemistry',
      chapterId: 'chemistry-chemical-bonding',
      title: 'Metallic Bonding',
      explanation:
        'Metallic bonding is the type of bonding found in **metals and alloys**, described by the **electron sea model** (or free electron model). In this model, metal atoms lose their valence electrons, which become **delocalised** and form a "sea" of mobile electrons that flows around a lattice of **positive metal ions (kernels)**. The electrostatic attraction between the positively charged metal kernels and the surrounding sea of delocalised electrons constitutes the metallic bond.\n\nThe strength of metallic bonding depends on the **number of valence electrons** contributed to the sea and the **size of the metal ion**. More valence electrons and smaller ionic radii result in stronger metallic bonds. This explains the trend: **Na (1 valence e-, weak) < Mg (2 valence e-, stronger) < Al (3 valence e-, strongest)**. Transition metals generally form very strong metallic bonds because d-electrons also participate in the electron sea, giving them **high melting points** (tungsten: 3422°C, the highest of all metals).\n\nMetallic bonding explains several characteristic properties of metals. **Electrical conductivity**: delocalised electrons move freely when a potential difference is applied. **Thermal conductivity**: mobile electrons transfer kinetic energy rapidly. **Malleability and ductility**: when layers of metal ions slide over each other, the electron sea reorganises to maintain bonding — unlike ionic crystals which shatter because like charges align. **Metallic lustre**: free electrons absorb and re-emit light across the visible spectrum.\n\nThe **band theory** is a more advanced explanation where atomic orbitals of many metal atoms merge into continuous **energy bands** — a filled **valence band** and an empty **conduction band**. In metals, these bands overlap, allowing easy electron flow. This model also explains why some materials are semiconductors or insulators.',
      analogy:
        'Think of a cricket stadium during an IPL match. The fans (positive metal ions) sit in fixed seats in a regular arrangement. The Mexican wave (delocalised electrons) flows freely through the entire crowd, not belonging to any single fan. This shared wave of energy holds the crowd\'s excitement (bonding) together and carries energy (conductivity) across the whole stadium effortlessly.',
      examRelevance:
        'Metallic bonding appears in NEET questions on comparing properties of metals, explaining malleability vs brittleness (metallic vs ionic), and trends in melting points across periods. Understanding the electron sea model is essential for answering questions on conductivity and alloy properties.',
      commonMistakes: [
        'Confusing metallic bonding with ionic bonding — in metallic bonds, electrons are shared collectively (delocalised), not transferred from one atom to another.',
        'Assuming all metals have equally strong metallic bonds — strength varies with number of valence electrons and ionic radius (Al > Mg > Na).',
        'Forgetting that metallic bonds explain malleability: layers slide without breaking bonds because the electron sea adjusts, unlike ionic lattices that fracture.',
      ],
      quickRecap:
        'Metallic bonding involves delocalised valence electrons forming an electron sea around positive metal ion kernels, held together by electrostatic attraction.\nThis explains metals\' conductivity, malleability, ductility, and lustre; bond strength increases with more valence electrons and smaller ionic radii.',
    },

    // ── Hydrocarbons ──────────────────────────────────────────────────
    {
      conceptTag: 'alkanes',
      subjectId: 'chemistry',
      chapterId: 'chemistry-hydrocarbons',
      title: 'Alkanes',
      explanation:
        'Alkanes are **saturated hydrocarbons** with the general formula **CnH2n+2**, containing only **carbon-carbon single bonds (C-C)**. Each carbon atom is **sp3 hybridized** with a tetrahedral geometry and bond angles of approximately **109.5°**. Alkanes are the simplest organic compounds and form the backbone of organic chemistry nomenclature.\n\n**IUPAC nomenclature** follows a systematic approach: identify the **longest continuous carbon chain** (parent chain), number it to give the lowest locants to substituents, name substituents as prefixes (methyl, ethyl, etc.), and use suffixes like -ane. For example, 2-methylbutane has a four-carbon parent chain with a methyl group at position 2. Common names exist for simple alkanes: methane (CH4), ethane (C2H6), propane (C3H8), and butane (C4H10).\n\nAlkanes are relatively **unreactive** due to the strength and non-polarity of C-C and C-H single bonds. Their major reactions include **combustion** (complete: produces CO2 + H2O; incomplete: produces CO or carbon soot), **halogenation** via **free radical substitution** (initiation → propagation → termination), and **pyrolysis/cracking** (thermal decomposition into smaller molecules). The free radical substitution mechanism is particularly important for NEET: UV light initiates homolytic fission of the halogen molecule (Cl2 → 2Cl·), then the chlorine radical abstracts a hydrogen to form HCl and an alkyl radical, which reacts with Cl2 to form the product and regenerate Cl·.\n\nPhysical properties follow trends: **boiling points increase** with molecular weight (more London dispersion forces) and **decrease with branching** (smaller surface area = weaker intermolecular forces). Alkanes are **non-polar**, insoluble in water, and less dense than water.',
      analogy:
        'Alkanes are like the basic dal-chawal of organic chemistry — simple, stable, and present everywhere. Just as dal-chawal doesn\'t react dramatically with anything on your plate (no spicy chemical reaction!), alkanes are relatively unreactive. But heat them up strongly (combustion), and they release a lot of energy — exactly like how your simple meal fuels you through a long study session.',
      examRelevance:
        'Alkanes are tested in NEET through IUPAC nomenclature questions, free radical substitution mechanism steps, and physical property trends (boiling point vs branching). Understanding the halogenation mechanism and Markovnikov\'s rule exceptions is essential. Expect 1-2 questions in the organic chemistry section.',
      commonMistakes: [
        'Choosing the wrong parent chain — always pick the LONGEST continuous chain, not necessarily the straight horizontal one in the structural formula.',
        'Confusing the order of reactivity in halogenation: 3° H > 2° H > 1° H (due to stability of the radical intermediate), so the major product is not always the simplest one.',
        'Forgetting that branching DECREASES boiling point: neopentane (bp 9.5°C) boils lower than n-pentane (bp 36°C) despite the same molecular formula.',
      ],
      quickRecap:
        'Alkanes (CnH2n+2) are saturated sp3 hydrocarbons with tetrahedral geometry; they undergo free radical substitution and combustion as key reactions.\nBoiling points increase with chain length but decrease with branching; IUPAC naming requires identifying the longest chain and numbering to give lowest locants.',
    },
    {
      conceptTag: 'alkenes',
      subjectId: 'chemistry',
      chapterId: 'chemistry-hydrocarbons',
      title: 'Alkenes',
      explanation:
        'Alkenes are **unsaturated hydrocarbons** with the general formula **CnH2n**, containing at least one **carbon-carbon double bond (C=C)**. Each doubly-bonded carbon is **sp2 hybridized** with a **trigonal planar** geometry and bond angles of approximately **120°**. The double bond consists of one **sigma bond** (head-on sp2-sp2 overlap) and one **pi bond** (lateral p-p overlap).\n\nThe **pi bond** makes alkenes significantly more reactive than alkanes. The electron-rich pi cloud above and below the plane is easily attacked by **electrophiles** (electron-seeking species). This makes **electrophilic addition** the characteristic reaction of alkenes. Key addition reactions include: **hydrogenation** (H2/Ni,Pd or Pt catalyst → alkane), **halogenation** (Br2/CCl4 → dihalide, also used as a test — decolourisation of bromine water), **hydrohalogenation** (HBr → haloalkane, follows **Markovnikov\'s rule**), and **hydration** (H2O/H+ → alcohol).\n\n**Markovnikov\'s rule** states that in the addition of HX to an unsymmetrical alkene, the **hydrogen adds to the carbon with more hydrogens** (less substituted carbon), and the **halide goes to the more substituted carbon**. The reason is carbocation stability: **3° carbocation > 2° > 1° > methyl**. The **anti-Markovnikov addition** (peroxide effect or Kharasch effect) occurs only with **HBr in the presence of peroxides** — the reaction proceeds via a free radical mechanism, placing Br on the less substituted carbon.\n\nAlkenes also exhibit **geometrical isomerism** (cis-trans or E-Z) because the pi bond **restricts rotation** around the double bond. Cis (Z) has similar groups on the same side; trans (E) has them on opposite sides.',
      analogy:
        'If alkanes are a locked single door (single bond — stable, hard to break into), alkenes are a door plus a glass window (double bond). The glass window (pi bond) is much easier to break, which is why electrophiles can "break in" easily through addition reactions. Markovnikov\'s rule is like Zomato always delivering to the address that\'s easier to find (more substituted carbon = more stable carbocation = preferred destination).',
      examRelevance:
        'Alkenes are extremely high-yield for NEET. Markovnikov vs anti-Markovnikov addition, mechanism of electrophilic addition, geometrical isomerism (cis/trans), and bromine water decolourisation tests are repeatedly asked. Know the conditions for each addition reaction and the peroxide effect exception with HBr.',
      commonMistakes: [
        'Applying anti-Markovnikov rule to HCl and HI — the peroxide (Kharasch) effect works ONLY with HBr, not HCl (too slow) or HI (breaks the chain).',
        'Forgetting that geometrical isomerism requires each doubly-bonded carbon to have two DIFFERENT groups — if one carbon has two identical substituents, no cis/trans isomers exist.',
        'Confusing addition and substitution — alkenes undergo addition reactions (breaking the pi bond), while alkanes and arenes undergo substitution.',
      ],
      quickRecap:
        'Alkenes (CnH2n) have a C=C double bond with sp2 carbons; their characteristic reaction is electrophilic addition (HX, X2, H2O, H2).\nMarkovnikov\'s rule places H on the less substituted carbon; anti-Markovnikov (peroxide effect) occurs only with HBr and peroxides via free radical mechanism.',
    },
    {
      conceptTag: 'alkynes',
      subjectId: 'chemistry',
      chapterId: 'chemistry-hydrocarbons',
      title: 'Alkynes',
      explanation:
        'Alkynes are **unsaturated hydrocarbons** with the general formula **CnH2n-2**, containing at least one **carbon-carbon triple bond (C≡C)**. Each triply-bonded carbon is **sp hybridized** with a **linear geometry** and a bond angle of **180°**. The triple bond consists of one **sigma bond** and two **pi bonds**, making alkynes even more electron-rich than alkenes.\n\nAlkynes are classified as **terminal** (triple bond at the end, e.g., HC≡CH acetylene, propyne CH3C≡CH) or **internal** (triple bond in the middle, e.g., 2-butyne CH3C≡CCH3). This distinction is important because terminal alkynes have a unique property: the **C-H bond on the sp carbon is acidic**. The sp carbon has **50% s-character** (compared to 33% for sp2 and 25% for sp3), meaning the electrons are held closer to the carbon, making it easier to release the hydrogen as H+. Therefore, acidity order: **sp C-H > sp2 C-H > sp3 C-H** (i.e., alkynes > alkenes > alkanes).\n\nDue to this acidity, terminal alkynes react with **strong bases and metals**: they form **sodium acetylides** (RC≡CNa) with NaNH2, and **metal acetylides** with ammoniacal AgNO3 (white precipitate of RC≡CAg) and ammoniacal Cu2Cl2 (red precipitate of RC≡CCu). These precipitation reactions serve as **tests to distinguish terminal from internal alkynes**.\n\nAlkynes undergo **addition reactions** similar to alkenes but can add **two equivalents** of reagent. With controlled addition of H2 using **Lindlar\'s catalyst** (Pd/BaSO4 + quinoline), alkynes are selectively reduced to **cis-alkenes**. With **Na in liquid NH3** (Birch reduction), they give **trans-alkenes**. This selective partial reduction is highly important for synthesis.',
      analogy:
        'If alkanes are a normal road, alkenes are a two-lane highway, and alkynes are a three-lane expressway (triple bond = three lanes of electron density). The extra lanes attract more traffic (electrophiles). Terminal alkynes are like toll plazas at the end of the expressway — they have a special entry point (acidic H) that lets specific vehicles (Na, Ag+, Cu+) through, something internal alkynes (no toll plaza) cannot do.',
      examRelevance:
        'NEET frequently asks about acidity of terminal alkynes (comparing C-H acidity based on hybridization), distinguishing tests using ammoniacal AgNO3/Cu2Cl2, and selective reduction (Lindlar\'s catalyst → cis; Na/liq NH3 → trans). These are very high-yield topics for both assertion-reason and MCQ formats.',
      commonMistakes: [
        'Forgetting that ONLY terminal alkynes give precipitates with ammoniacal AgNO3 and Cu2Cl2 — internal alkynes do not have the acidic hydrogen needed for this reaction.',
        'Confusing Lindlar\'s catalyst product (cis-alkene) with Birch reduction product (trans-alkene) — remember: Lindlar = cis (L and C both come early in alphabet), Na/NH3 = trans.',
        'Assuming alkynes are more reactive than alkenes in all electrophilic additions — actually, the triple bond is more electron-rich but the intermediate vinyl cation is less stable, making some additions slower.',
      ],
      quickRecap:
        'Alkynes (CnH2n-2) have a C≡C triple bond with sp hybridized linear carbons; terminal alkynes are acidic due to 50% s-character of the sp C-H bond.\nLindlar\'s catalyst gives cis-alkenes, Na/liq NH3 gives trans-alkenes; terminal alkynes form white (Ag) and red (Cu) precipitates as distinguishing tests.',
    },
    {
      conceptTag: 'isomerism',
      subjectId: 'chemistry',
      chapterId: 'chemistry-hydrocarbons',
      title: 'Isomerism',
      explanation:
        'Isomerism is the phenomenon where compounds have the **same molecular formula** but **different structural or spatial arrangements**, leading to different properties. Isomers are broadly classified into **structural (constitutional) isomers** and **stereoisomers**.\n\n**Structural isomers** differ in the connectivity of atoms. The main types are: (1) **Chain isomerism** — different carbon chain arrangements (e.g., n-butane vs isobutane, both C4H10), (2) **Position isomerism** — same functional group at different positions (e.g., 1-propanol vs 2-propanol), (3) **Functional group isomerism** — different functional groups with the same formula (e.g., ethanol C2H5OH vs dimethyl ether CH3OCH3), (4) **Metamerism** — different alkyl groups on either side of a functional group (e.g., diethyl ether vs methyl propyl ether, both C4H10O), and (5) **Tautomerism** — a dynamic equilibrium between two structural forms, typically **keto-enol tautomerism** (e.g., acetone ⇌ propen-2-ol).\n\n**Stereoisomers** have the same connectivity but differ in spatial arrangement. The two types are: (1) **Geometrical isomerism (cis-trans)** — arises due to **restricted rotation** around a double bond or ring. Requires each doubly-bonded carbon to have two different substituents. The **E-Z nomenclature** uses Cahn-Ingold-Prelog priority rules. (2) **Optical isomerism** — arises from the presence of a **chiral centre** (asymmetric carbon bonded to four different groups). Optical isomers are **non-superimposable mirror images (enantiomers)** that rotate plane-polarised light in equal but opposite directions. A **racemic mixture** is a 50:50 mix of enantiomers with zero net optical rotation.\n\nThe number of optical isomers = **2^n** (where n = number of chiral centres), reduced when the molecule has an internal plane of symmetry (giving **meso compounds**).',
      analogy:
        'Isomers are like rearranging the same LEGO bricks to build different structures. Chain isomers = rearranging bricks into a straight line vs an L-shape. Position isomers = putting the red brick at different spots. Functional group isomers = using the same bricks to build a car vs a house. Stereoisomers are like your left and right hands — made of the same parts (fingers), arranged the same way, but your left hand is a mirror image of your right and they don\'t overlap (non-superimposable).',
      examRelevance:
        'Isomerism is a NEET staple with questions on identifying types of isomerism, counting structural isomers, determining chirality, and calculating optical isomers (2^n). Keto-enol tautomerism, metamerism, and distinguishing geometrical from optical isomerism are frequently tested.',
      commonMistakes: [
        'Confusing metamerism with chain isomerism — metamerism specifically involves different alkyl groups on either side of a functional group (ether, amine, ketone), not different chain arrangements.',
        'Forgetting meso compounds when counting optical isomers — if a molecule has a plane of symmetry despite having chiral centres, it is optically inactive (meso) and total isomers < 2^n.',
        'Assuming every carbon with four bonds is a chiral centre — it must have four DIFFERENT groups attached to be a true stereogenic centre.',
      ],
      quickRecap:
        'Structural isomers differ in atom connectivity (chain, position, functional group, metamerism, tautomerism); stereoisomers differ in spatial arrangement.\nOptical isomers arise from chiral centres (4 different groups on carbon); total optical isomers = 2^n, reduced by meso compounds with internal symmetry planes.',
    },
    {
      conceptTag: 'aromatic-compounds',
      subjectId: 'chemistry',
      chapterId: 'chemistry-hydrocarbons',
      title: 'Aromatic Compounds',
      explanation:
        'Aromatic compounds are **cyclic, planar molecules** with **conjugated pi electron systems** that satisfy **Huckel\'s rule**: they contain **(4n + 2) pi electrons** where n is a non-negative integer (0, 1, 2, ...). **Benzene (C6H6)** is the classic aromatic compound with 6 pi electrons (n=1), a perfectly planar hexagonal ring, equal C-C bond lengths of **1.39 A** (between single 1.54 A and double 1.34 A), and extraordinary stability.\n\nBenzene\'s structure is best explained by **resonance**. It is a hybrid of two Kekule structures where double bonds alternate positions. The six pi electrons are **delocalised** across all six carbons in a continuous ring, forming a pi cloud above and below the molecular plane. This delocalisation gives benzene a **resonance energy of about 150 kJ/mol**, making it far more stable than a hypothetical cyclohexatriene with three isolated double bonds.\n\nBecause of this stability, benzene resists **addition reactions** (which would break aromaticity) and instead undergoes **electrophilic aromatic substitution (EAS)**. In EAS, an electrophile replaces one hydrogen while preserving the aromatic ring. Key EAS reactions include: **halogenation** (Cl2 or Br2 with Lewis acid catalyst like AlCl3/FeBr3), **nitration** (conc. HNO3 + conc. H2SO4, electrophile = NO2+), **sulphonation** (fuming H2SO4, electrophile = SO3), **Friedel-Crafts alkylation** (RCl + AlCl3), and **Friedel-Crafts acylation** (RCOCl + AlCl3).\n\nSubstituents on benzene are classified as **ortho-para directors** (activating groups like -OH, -NH2, -CH3 that donate electron density) or **meta directors** (deactivating groups like -NO2, -COOH, -CHO that withdraw electron density). Halogens are an exception: they are **deactivating but ortho-para directing**.',
      analogy:
        'Benzene\'s aromatic stability is like a perfectly balanced spinning top — the evenly distributed pi electrons keep it exceptionally stable, and it strongly resists anything that would knock it off balance (addition reactions). Electrophilic substitution is like swapping one decoration on the spinning top without stopping it — the ring stays intact and keeps spinning (aromaticity preserved).',
      examRelevance:
        'Aromatic compounds are very high-yield in NEET. Expect questions on Huckel\'s rule, electrophilic aromatic substitution mechanisms, directing effects of substituents (ortho-para vs meta), and comparing reactivity of substituted benzenes. Friedel-Crafts reactions and nitration are particularly common.',
      commonMistakes: [
        'Applying Huckel\'s rule to non-planar or non-cyclic systems — the molecule MUST be cyclic, planar, and fully conjugated for aromaticity, not just have (4n+2) pi electrons.',
        'Forgetting that halogens are the exception in directing effects — they are deactivating (electron-withdrawing by induction) but ortho-para directing (electron-donating by resonance to ring positions).',
        'Confusing Friedel-Crafts alkylation and acylation — alkylation suffers from polyalkylation and rearrangement problems; acylation does not (the acyl group deactivates the ring after one substitution).',
      ],
      quickRecap:
        'Aromatic compounds are cyclic, planar, conjugated systems with (4n+2) pi electrons (Huckel\'s rule); benzene has 6 delocalised pi electrons and high resonance stability.\nBenzene undergoes electrophilic aromatic substitution (not addition); substituents direct as ortho-para (activating, except halogens) or meta (deactivating).',
    },
    {
      conceptTag: 'combustion-reactions',
      subjectId: 'chemistry',
      chapterId: 'chemistry-hydrocarbons',
      title: 'Combustion Reactions',
      explanation:
        'Combustion is a **rapid exothermic reaction** between a substance (fuel) and **oxygen**, producing heat and light. For hydrocarbons, the products depend on the oxygen supply. **Complete combustion** occurs with **excess oxygen**, producing **carbon dioxide (CO2) and water (H2O)** as the only products. **Incomplete combustion** occurs with **limited oxygen**, producing **carbon monoxide (CO)** and/or **carbon (soot)** along with water.\n\nThe general equation for complete combustion of a hydrocarbon CxHy is: **CxHy + (x + y/4) O2 → x CO2 + (y/2) H2O**. For methane: CH4 + 2O2 → CO2 + 2H2O (ΔH = -890 kJ/mol). For incomplete combustion: 2CH4 + 3O2 → 2CO + 4H2O (limited O2) or CH4 + O2 → C + 2H2O (very limited O2).\n\nThe **enthalpy of combustion** (ΔcH°) is the heat released when one mole of a substance completely burns in oxygen under standard conditions. It is always **negative** (exothermic). Combustion enthalpies are used to: (1) Compare **fuel efficiency** — higher ΔcH° per gram means better fuel. (2) Calculate **enthalpy of formation** using Hess\'s law. (3) Determine **calorific values** of foods and fuels.\n\nKey trends in combustion of hydrocarbons: **heat of combustion increases** with increasing chain length (more C-H and C-C bonds to break). Among isomers, **branched alkanes have slightly lower heats of combustion** than their straight-chain counterparts. **Alkanes burn with a clean (non-luminous) flame**, while **alkenes and alkynes burn with a sooty (luminous) flame** due to higher carbon-to-hydrogen ratio leading to incomplete combustion even with adequate oxygen.\n\nIncomplete combustion is dangerous because **CO is a colourless, odourless, toxic gas** that binds to haemoglobin 200 times more strongly than oxygen, causing carbon monoxide poisoning.',
      analogy:
        'Combustion is like recharging your phone. Complete combustion with plenty of oxygen is like plugging into a proper charger — you get full energy (CO2 + H2O) efficiently. Incomplete combustion with limited oxygen is like using a cheap duplicate charger — it partially works but produces harmful byproducts (CO, soot), just like a faulty charger generates excess heat and can damage your phone. Always ensure good ventilation (excess O2) for clean burning!',
      examRelevance:
        'NEET asks combustion questions in thermodynamics (calculating enthalpy of combustion, applying Hess\'s law) and organic chemistry (sooty vs clean flame as a test for unsaturation). Balancing combustion equations and comparing calorific values are common MCQ themes. Questions on CO poisoning may appear in biology-chemistry overlap topics.',
      commonMistakes: [
        'Forgetting to balance oxygen atoms properly in combustion equations — fractional coefficients for O2 are common and acceptable (multiply through by 2 if whole numbers are needed).',
        'Confusing enthalpy of combustion (always negative/exothermic) with enthalpy of formation (can be positive or negative) — combustion releases energy by definition.',
        'Assuming sooty flames always indicate incomplete combustion due to low oxygen — aromatic and unsaturated hydrocarbons produce sooty flames even in sufficient oxygen because of their high C:H ratio.',
      ],
      quickRecap:
        'Complete combustion (excess O2) gives CO2 + H2O; incomplete combustion (limited O2) gives toxic CO and/or carbon soot alongside water.\nHeat of combustion increases with chain length; unsaturated hydrocarbons burn with sooty flames due to high C:H ratio; CO binds haemoglobin 200x stronger than O2.',
    },
  ],
};
