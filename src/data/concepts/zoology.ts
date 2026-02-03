import { SubjectConcepts } from '../../types';

export const zoologyConcepts: SubjectConcepts = {
  subjectId: 'zoology',
  concepts: [
    // ══════════════════════════════════════════════════════════════
    //  HUMAN PHYSIOLOGY CONCEPTS (6)
    // ══════════════════════════════════════════════════════════════

    {
      conceptTag: 'blood-components',
      subjectId: 'zoology',
      chapterId: 'zoology-human-physiology',
      title: 'Blood Components: RBC, WBC, Platelets & Plasma',
      explanation:
        'Blood is a **connective tissue** composed of a liquid matrix called **plasma** (~55%) and **formed elements** (~45%). ' +
        '**Red Blood Cells (RBCs / Erythrocytes)** are biconcave, enucleated discs packed with **hemoglobin** -- an iron-containing protein that binds O2 to form oxyhemoglobin. Humans have about 5 million RBCs per cubic mm of blood. ' +
        '**White Blood Cells (WBCs / Leukocytes)** are nucleated cells responsible for immunity. They include **granulocytes** (neutrophils, eosinophils, basophils) and **agranulocytes** (lymphocytes, monocytes). Normal WBC count is 6,000-8,000 per cubic mm. ' +
        '**Platelets (Thrombocytes)** are tiny cell fragments from megakaryocytes that initiate **blood clotting** by aggregating at wound sites and releasing thromboplastin. Normal count: 1.5-3.5 lakh per cubic mm. ' +
        '**Plasma** is the straw-coloured fluid containing water (90-92%), **plasma proteins** (albumin, globulin, fibrinogen), nutrients, hormones, gases, and waste products. Serum is plasma minus clotting factors.',
      analogy:
        'Think of blood as a **Zomato delivery system**. Plasma is the road network (liquid highway). RBCs are the delivery riders carrying O2 parcels to every cell. WBCs are the security guards who fight off unwanted intruders (pathogens). Platelets are the road-repair crew that quickly patches up any damage (clots wounds). Just like Zomato needs all of these working together, your body needs every blood component doing its job.',
      examRelevance:
        'Blood components are tested almost every year in NEET. Questions on RBC count, hemoglobin function, WBC types, and platelet role appear frequently. Expect 1-2 direct questions from this topic.',
      commonMistakes: [
        'Confusing RBC and WBC functions -- RBCs carry O2, WBCs fight infection. They do NOT swap roles.',
        'Forgetting that mature human RBCs are enucleated (no nucleus), while WBCs have a nucleus.',
        'Mixing up plasma (has fibrinogen) and serum (plasma without clotting factors).',
      ],
      quickRecap:
        'Blood = Plasma (55%) + Formed elements (45%: RBCs, WBCs, Platelets).\nRBC = O2 carrier, WBC = immunity, Platelets = clotting, Plasma = liquid transport medium.',
    },

    {
      conceptTag: 'cardiac-cycle',
      subjectId: 'zoology',
      chapterId: 'zoology-human-physiology',
      title: 'Cardiac Cycle: Heart Chambers, Pacemaker & Blood Flow',
      explanation:
        'The **cardiac cycle** is one complete heartbeat lasting about **0.8 seconds** at 72 beats/min. It has three phases: ' +
        '(1) **Atrial systole** (0.1 s) -- both atria contract, pushing blood into ventricles through AV valves. ' +
        '(2) **Ventricular systole** (0.3 s) -- ventricles contract, AV valves close (producing the first heart sound "lub"), and blood is pushed into the pulmonary artery and aorta through semilunar valves. ' +
        '(3) **Joint diastole** (0.4 s) -- both atria and ventricles relax, semilunar valves close (second sound "dub"), and blood fills the heart from veins. ' +
        'The **SA node** (sinoatrial node) in the right atrium acts as the **pacemaker**, generating impulses at 70-75/min. The conduction pathway is: SA node -> inter-atrial/inter-nodal pathways -> **AV node** (delays 0.1 s) -> **Bundle of His** -> **bundle branches** -> **Purkinje fibers** -> ventricular muscle. ' +
        '**Cardiac output** = Stroke volume (70 mL) x Heart rate (72/min) = ~5 L/min.',
      analogy:
        'Your heart is like a **Delhi Metro system**. The SA node is the central control room that sends the "departure signal" at regular intervals. The AV node is the junction station that creates a brief delay so the first set of trains (atrial blood) clears before the next set (ventricular blood) moves. The Bundle of His and Purkinje fibers are the tracks that carry the signal to every station (muscle cell). Just like the metro runs on a fixed timetable, your heart beats rhythmically thanks to this conduction system.',
      examRelevance:
        'The cardiac cycle, heart sounds, and conduction system are NEET favourites. SA node as pacemaker is asked repeatedly. Numerical questions on cardiac output also appear.',
      commonMistakes: [
        'Calling the AV node the pacemaker -- the SA node is the pacemaker because it has the highest intrinsic firing rate.',
        'Confusing "lub" (AV valves closing during ventricular systole) with "dub" (semilunar valves closing during diastole).',
        'Forgetting that joint diastole (0.4 s) is the longest phase, not ventricular systole.',
      ],
      quickRecap:
        'Cardiac cycle = 0.8 s (atrial systole 0.1 s + ventricular systole 0.3 s + joint diastole 0.4 s).\nSA node = pacemaker; conduction: SA -> AV -> Bundle of His -> Purkinje fibers; CO = 5 L/min.',
    },

    {
      conceptTag: 'digestive-enzymes',
      subjectId: 'zoology',
      chapterId: 'zoology-human-physiology',
      title: 'Digestive Enzymes: Location, Substrate & Product',
      explanation:
        'Digestion involves breaking down complex food molecules using specific enzymes at specific sites: ' +
        '**Mouth**: **Salivary amylase** (ptyalin) converts starch -> maltose at pH 6.8. ' +
        '**Stomach**: **Pepsin** (activated from pepsinogen by HCl) converts proteins -> peptides at pH 1.5-2.0. **Gastric lipase** acts on fats (minor role). ' +
        '**Small intestine (Duodenum)**: Pancreatic juice contains **trypsin** (protein -> peptides), **pancreatic amylase** (starch -> maltose), **pancreatic lipase** (fats -> fatty acids + glycerol), and **nucleases** (nucleic acids -> nucleotides). **Bile salts** from the liver emulsify fats (not an enzyme). ' +
        '**Intestinal juice (succus entericus)**: Contains **maltase** (maltose -> glucose), **sucrase** (sucrose -> glucose + fructose), **lactase** (lactose -> glucose + galactose), **peptidases** (peptides -> amino acids), **lipase**, and **nucleotidases**. ' +
        'Key activations: Trypsinogen -> trypsin by **enterokinase**. Pepsinogen -> pepsin by **HCl**. Chymotrypsinogen -> chymotrypsin by **trypsin**.',
      analogy:
        'Think of digestion as an **Amazon warehouse assembly line**. Each station (organ) has specialized workers (enzymes) that open specific types of packages (food molecules). The mouth worker (amylase) only opens starch boxes. The stomach worker (pepsin) handles protein packages in an acidic environment. The small intestine is the main sorting center with the most workers. Just like you cannot use the wrong tool to open a package, each enzyme only works on its specific substrate.',
      examRelevance:
        'Enzyme-substrate-product-location mapping is one of the most tested areas in NEET zoology. Expect direct questions on which enzyme acts where and on what. Activation of zymogens (pepsinogen, trypsinogen) is also frequently asked.',
      commonMistakes: [
        'Saying pepsin is in saliva or trypsin is in the stomach -- match enzymes to their correct organs.',
        'Forgetting that bile salts emulsify fats but are NOT enzymes -- they lack catalytic activity.',
        'Confusing enterokinase (activates trypsinogen) with enterogastrone or other terms.',
      ],
      quickRecap:
        'Mouth = amylase (starch), Stomach = pepsin (protein), Pancreas = trypsin + lipase + amylase, Intestine = maltase/sucrase/peptidases.\nKey activations: HCl activates pepsinogen; enterokinase activates trypsinogen.',
    },

    {
      conceptTag: 'nephron',
      subjectId: 'zoology',
      chapterId: 'zoology-human-physiology',
      title: 'Nephron: Structure, Filtration & Reabsorption',
      explanation:
        'The **nephron** is the structural and functional unit of the kidney. Each kidney has about **1 million nephrons**. ' +
        'Structure: **Bowman\'s capsule** (cup-shaped, surrounds glomerulus) -> **Proximal Convoluted Tubule (PCT)** -> **Loop of Henle** (descending and ascending limbs) -> **Distal Convoluted Tubule (DCT)** -> **Collecting duct**. ' +
        'Urine formation involves three processes: ' +
        '(1) **Glomerular filtration**: Blood is filtered at the glomerulus under high pressure. About **125 mL/min (180 L/day)** of filtrate is produced (GFR). The filtrate contains water, glucose, amino acids, urea, ions -- but NO blood cells or large proteins. ' +
        '(2) **Tubular reabsorption**: ~99% of filtrate is reabsorbed. PCT reabsorbs glucose, amino acids, Na+, and water (obligatory). Loop of Henle creates the concentration gradient (countercurrent mechanism). DCT reabsorbs Na+ under aldosterone control. ' +
        '(3) **Tubular secretion**: H+, K+, and some drugs are actively secreted into the tubular fluid from peritubular capillaries. ' +
        'Final urine: ~1.5 L/day, containing urea, uric acid, creatinine, ions, and water. **Cortical nephrons** (85%) have short loops; **juxtamedullary nephrons** (15%) have long loops extending deep into the medulla.',
      analogy:
        'A nephron works like a **water purifier with multiple stages**. The glomerulus is the first filter that separates big particles (blood cells, proteins) from the water (filtrate). The PCT is the "useful stuff recovery" unit that grabs back glucose, amino acids, and salts -- like picking out the good parts before throwing away the rest. The Loop of Henle is the concentration system (like an RO membrane). The DCT fine-tunes what stays and goes. The collecting duct is the final output pipe delivering filtered "waste water" (urine).',
      examRelevance:
        'Nephron structure and urine formation are tested every year. GFR value (125 mL/min), countercurrent mechanism, and role of hormones (ADH, aldosterone) on DCT/collecting duct are high-yield topics.',
      commonMistakes: [
        'Confusing nephron (kidney unit) with neuron (nerve cell) due to similar spelling.',
        'Forgetting that GFR = 125 mL/min = 180 L/day, but only 1.5 L becomes urine (99% reabsorbed).',
        'Mixing up cortical nephrons (short loop, 85%) and juxtamedullary nephrons (long loop, 15%).',
      ],
      quickRecap:
        'Nephron: Bowman\'s capsule -> PCT -> Loop of Henle -> DCT -> Collecting duct. GFR = 125 mL/min.\nThree steps: Filtration (glomerulus) -> Reabsorption (99% in tubules) -> Secretion (H+, K+). Final urine = ~1.5 L/day.',
    },

    {
      conceptTag: 'hormonal-regulation',
      subjectId: 'zoology',
      chapterId: 'zoology-human-physiology',
      title: 'Hormonal Regulation: Endocrine Glands & Feedback Loops',
      explanation:
        'The **endocrine system** consists of ductless glands that secrete **hormones** directly into the blood. Key glands and hormones: ' +
        '**Hypothalamus**: The master coordinator -- releases releasing hormones (RH) and inhibiting hormones (IH) that control the pituitary. ' +
        '**Pituitary (master gland)**: Anterior lobe secretes **GH** (growth), **TSH** (thyroid-stimulating), **ACTH** (adrenal cortex-stimulating), **FSH/LH** (gonadotropins), **Prolactin** (milk production). Posterior lobe stores and releases **ADH** (water reabsorption) and **Oxytocin** (uterine contraction, milk ejection). ' +
        '**Thyroid**: Secretes **T3 and T4** (regulate BMR) and **Calcitonin** (lowers blood Ca2+). Requires iodine. ' +
        '**Parathyroid**: Secretes **PTH** (raises blood Ca2+ by stimulating bone resorption). ' +
        '**Adrenal cortex**: **Cortisol** (stress), **Aldosterone** (Na+ retention). **Adrenal medulla**: **Adrenaline** (fight-or-flight). ' +
        '**Pancreas (Islets of Langerhans)**: **Beta cells** -> insulin (lowers blood glucose). **Alpha cells** -> glucagon (raises blood glucose). ' +
        '**Feedback regulation**: Most hormones work via **negative feedback** -- e.g., high T3/T4 inhibits TSH release from the pituitary, which reduces further T3/T4 production. This maintains homeostasis.',
      analogy:
        'The endocrine system is like **Instagram\'s algorithm and notification system**. The hypothalamus is the algorithm deciding what signals to send. The pituitary is the main notification center that broadcasts messages (hormones) to all your target organs (followers). Each organ responds to its specific hormone like each user responds to their notifications. Negative feedback is like muting notifications when you have too many -- when hormone levels are high enough, the body "mutes" further production.',
      examRelevance:
        'Endocrine glands and their hormones appear in NEET every year -- at least 2-3 questions. Hormone disorders (diabetes, goitre, dwarfism, acromegaly) are also commonly tested. Feedback mechanisms are high-yield.',
      commonMistakes: [
        'Confusing beta cells (insulin, lowers sugar) with alpha cells (glucagon, raises sugar) of the pancreas.',
        'Saying the pituitary is the "master gland" but forgetting that the hypothalamus controls the pituitary -- hypothalamus is the true boss.',
        'Mixing up calcitonin (thyroid, lowers Ca2+) and PTH (parathyroid, raises Ca2+) -- they have opposite effects.',
      ],
      quickRecap:
        'Hypothalamus controls pituitary (master gland), which controls thyroid, adrenal, gonads. Pancreas: beta=insulin (lowers sugar), alpha=glucagon (raises sugar).\nMost regulation uses negative feedback: high hormone level -> stops further release. Key disorders: diabetes, goitre, dwarfism.',
    },

    {
      conceptTag: 'respiratory-volumes',
      subjectId: 'zoology',
      chapterId: 'zoology-human-physiology',
      title: 'Respiratory Volumes: Tidal, Residual & Vital Capacity',
      explanation:
        'Lung volumes and capacities measured by **spirometry**: ' +
        '**Tidal Volume (TV)**: Volume of air inspired/expired during normal breathing = ~**500 mL**. ' +
        '**Inspiratory Reserve Volume (IRV)**: Additional air that can be forcefully inhaled after normal inspiration = ~**2500-3000 mL**. ' +
        '**Expiratory Reserve Volume (ERV)**: Additional air that can be forcefully exhaled after normal expiration = ~**1000-1100 mL**. ' +
        '**Residual Volume (RV)**: Air remaining in lungs even after maximum forced expiration = ~**1100-1200 mL**. This prevents lung collapse. ' +
        'Lung **capacities** are combinations of volumes: ' +
        '**Inspiratory Capacity (IC)** = TV + IRV = ~3500 mL. ' +
        '**Expiratory Capacity (EC)** = TV + ERV = ~1500 mL. ' +
        '**Vital Capacity (VC)** = TV + IRV + ERV = ~**3500-4500 mL** (maximum air that can be breathed out after maximum inhalation). ' +
        '**Total Lung Capacity (TLC)** = VC + RV = ~**5000-6000 mL**. ' +
        '**Functional Residual Capacity (FRC)** = ERV + RV = ~2200-2400 mL.',
      analogy:
        'Think of your lungs as a **water bottle**. Tidal volume is the small sip you normally take (500 mL). IRV is the extra water you could drink if you gulped hard. ERV is the water you could squeeze out by pressing the bottle. Residual volume is the water stuck at the bottom that you can never pour out -- it keeps the bottle (lungs) from going completely flat. Vital capacity is the maximum water you could drink in one go minus that stuck water.',
      examRelevance:
        'NEET regularly asks for definitions and numerical values of lung volumes. Questions often test the difference between TV, VC, and RV. Capacity formulas (VC = TV + IRV + ERV) are directly asked.',
      commonMistakes: [
        'Confusing tidal volume (normal breathing, ~500 mL) with vital capacity (maximum breathing, ~3500-4500 mL).',
        'Forgetting residual volume (~1200 mL) -- this air NEVER leaves the lungs and prevents alveolar collapse.',
        'Not knowing the formulas: VC = TV + IRV + ERV, TLC = VC + RV. These are directly tested.',
      ],
      quickRecap:
        'TV=500 mL (normal breath), RV=1200 mL (never leaves lungs), VC=TV+IRV+ERV=3500-4500 mL, TLC=VC+RV=5000-6000 mL.\nTidal = calm breathing, Residual = trapped air, Vital Capacity = max usable volume. Memorize the numbers!',
    },

    // ══════════════════════════════════════════════════════════════
    //  GENETICS CONCEPTS (6)
    // ══════════════════════════════════════════════════════════════

    {
      conceptTag: 'dna-structure',
      subjectId: 'zoology',
      chapterId: 'zoology-genetics',
      title: 'DNA Structure: Double Helix, Base Pairing & Nucleotides',
      explanation:
        '**DNA (Deoxyribonucleic Acid)** is the hereditary material in most organisms. Its structure was elucidated by **Watson and Crick (1953)** based on X-ray data from **Rosalind Franklin**. ' +
        'DNA is a **double helix** -- two antiparallel polynucleotide chains coiled around each other. Each **nucleotide** has three components: (1) a phosphate group, (2) a **deoxyribose sugar** (5-carbon), and (3) a **nitrogenous base**. ' +
        'The four bases are: **Purines** -- Adenine (A) and Guanine (G) (double-ring). **Pyrimidines** -- Thymine (T) and Cytosine (C) (single-ring). ' +
        '**Chargaff\'s rules**: A pairs with T (2 hydrogen bonds), G pairs with C (3 hydrogen bonds). So A=T and G=C in quantity. ' +
        'The two strands run **antiparallel** (one 5\'->3\', other 3\'->5\'). The backbone is sugar-phosphate, and bases project inward. The helix has a pitch of **3.4 nm** (10 base pairs per turn), with each base pair separated by **0.34 nm**. The diameter of the helix is **2 nm (20 angstroms)**.',
      analogy:
        'DNA is like a **twisted ladder** (or a spiral staircase). The two side rails are the sugar-phosphate backbones. The rungs of the ladder are base pairs -- A always holds hands with T (weak grip, 2 H-bonds), and G always holds hands with C (strong grip, 3 H-bonds). Just like the two rails of a ladder run in opposite directions when you twist it, the two DNA strands are antiparallel. If you know one side of the ladder, you automatically know the other -- that is complementary base pairing.',
      examRelevance:
        'DNA structure, Chargaff\'s rules, Watson-Crick model dimensions (3.4 nm pitch, 0.34 nm per bp, 2 nm diameter), and base pairing are tested every single year in NEET. These are must-memorize facts.',
      commonMistakes: [
        'Saying A pairs with G or T pairs with C -- always remember: purine pairs with pyrimidine (A-T, G-C).',
        'Confusing the number of hydrogen bonds: A=T has 2 H-bonds, G=C has 3 H-bonds (more G-C = more stable DNA).',
        'Forgetting that DNA strands are antiparallel -- one runs 5\'->3\' and the other 3\'->5\'.',
      ],
      quickRecap:
        'DNA = double helix by Watson & Crick. Base pairing: A=T (2 H-bonds), G=C (3 H-bonds). Antiparallel strands.\nPitch = 3.4 nm, 10 bp/turn, 0.34 nm between bases, diameter = 2 nm. Nucleotide = phosphate + deoxyribose + base.',
    },

    {
      conceptTag: 'law-of-segregation',
      subjectId: 'zoology',
      chapterId: 'zoology-genetics',
      title: 'Mendel\'s Law of Segregation: Allele Separation in Gametes',
      explanation:
        '**Mendel\'s First Law (Law of Segregation)** states: "During gamete formation, the two alleles of a gene **segregate** (separate) from each other so that each gamete receives only **one allele**." ' +
        'Example: In a pea plant with genotype **Tt** (tall), during meiosis, the T and t alleles separate. The plant produces two types of gametes: **T** and **t**, in equal proportion. ' +
        'When two heterozygotes cross (**Tt x Tt**), the F2 generation shows: **Genotype ratio** = 1 TT : 2 Tt : 1 tt. **Phenotype ratio** = 3 Tall : 1 Short. ' +
        'This law is based on the behavior of **homologous chromosomes** during **Anaphase I of meiosis**, when homologous pairs separate and move to opposite poles, carrying one allele each. ' +
        'The law applies to all **sexually reproducing organisms** and is also called the **Law of Purity of Gametes** because each gamete is "pure" -- it carries only one allele of each gene, not a blend.',
      analogy:
        'Imagine you have a **pair of cricket gloves** -- one red (T) and one blue (t). When you need to give one glove to each of two friends (gametes), each friend gets exactly one glove. One gets red, the other gets blue. Neither friend gets both or a "mixed purple" glove. That is segregation -- alleles separate cleanly, no blending. When two friends with one glove each meet (fertilization), the combination determines the result.',
      examRelevance:
        'Law of segregation is directly tested in NEET with ratio-based questions (phenotype vs genotype). Understanding this law is essential for solving any genetics problem. It appears in MCQ and assertion-reasoning formats.',
      commonMistakes: [
        'Confusing genotype ratio (1:2:1) with phenotype ratio (3:1) in a monohybrid cross.',
        'Thinking alleles "blend" in heterozygotes -- they don\'t. The recessive allele is present but masked by the dominant one.',
        'Forgetting that segregation occurs during meiosis (Anaphase I), not mitosis.',
      ],
      quickRecap:
        'Law of Segregation: Two alleles of a gene separate during gamete formation; each gamete gets only one allele.\nTt x Tt -> Genotype 1:2:1, Phenotype 3:1. Occurs during Anaphase I of meiosis. Also called Law of Purity of Gametes.',
    },

    {
      conceptTag: 'monohybrid-cross',
      subjectId: 'zoology',
      chapterId: 'zoology-genetics',
      title: 'Monohybrid Cross: Punnett Square & Ratios',
      explanation:
        'A **monohybrid cross** involves parents differing in **one character** (one gene). Mendel crossed pure tall (TT) x pure short (tt) pea plants. ' +
        '**F1 generation**: All Tt (tall) -- dominant phenotype expressed. ' +
        '**F2 generation** (F1 x F1 = Tt x Tt): Using a **Punnett square**: ' +
        '|  | T | t |\n|--|---|---|\n| T | TT | Tt |\n| t | Tt | tt |\n\n' +
        '**Genotype ratio**: 1 TT : 2 Tt : 1 tt = **1:2:1** (3 distinct genotypes). ' +
        '**Phenotype ratio**: 3 Tall (TT + Tt) : 1 Short (tt) = **3:1** (2 phenotypes). ' +
        '**Test cross**: To determine if a tall plant is TT or Tt, cross it with homozygous recessive (tt). If all offspring are tall -> parent was TT. If offspring are 1 tall : 1 short -> parent was Tt. ' +
        '**Back cross**: Crossing F1 with either parent. If crossed with recessive parent, it is also a test cross.',
      analogy:
        'A Punnett square is like a **WhatsApp group with 4 possible message combos**. If two people (parents) each send either a capital T or small t message, the four possible conversations (offspring) are: TT, Tt, Tt, tt. Three out of four chats show the "dominant" trait (at least one capital T), while only one is purely lowercase. That is your 3:1 phenotype ratio -- it is just combinatorics, like predicting all possible message pairs.',
      examRelevance:
        'Monohybrid cross ratios (3:1 phenotype, 1:2:1 genotype) are directly asked in NEET every year. Test cross identification is a favourite question type. Punnett square skills are essential for all genetics problems.',
      commonMistakes: [
        'Writing 3:1 when the question asks for genotype ratio (correct: 1:2:1) and vice versa.',
        'Confusing test cross (Tt x tt -> 1:1) with monohybrid cross (Tt x Tt -> 3:1).',
        'Forgetting that the 3:1 ratio only appears when BOTH parents are heterozygous (Tt x Tt).',
      ],
      quickRecap:
        'Monohybrid cross (Tt x Tt): Genotype ratio = 1:2:1, Phenotype ratio = 3:1. Use Punnett square for all crosses.\nTest cross = unknown x homozygous recessive (tt). If 1:1 offspring -> parent is Tt. If all dominant -> parent is TT.',
    },

    {
      conceptTag: 'codominance',
      subjectId: 'zoology',
      chapterId: 'zoology-genetics',
      title: 'Codominance: Both Alleles Expressed & Blood Groups',
      explanation:
        '**Codominance** is a pattern of inheritance where **both alleles of a gene are fully and independently expressed** in the heterozygote. Neither is dominant or recessive. ' +
        'The classic NCERT example is the **ABO blood group** system. The gene I (isoagglutinin) has three alleles: **I^A, I^B, and i**. ' +
        '- **I^A I^A** or **I^A i** -> Blood group **A** (A antigen on RBCs). ' +
        '- **I^B I^B** or **I^B i** -> Blood group **B** (B antigen on RBCs). ' +
        '- **I^A I^B** -> Blood group **AB** (BOTH A and B antigens on RBCs) -- this is **codominance**. ' +
        '- **ii** -> Blood group **O** (no antigen on RBCs). ' +
        'In the I^A I^B genotype, both alleles produce their respective antigens independently. There is no blending or suppression. ' +
        'ABO blood group is also an example of **multiple allelism** (3 alleles for one gene in the population). I^A and I^B are codominant to each other but both are **dominant over i**.',
      analogy:
        'Codominance is like **playing two songs simultaneously on two speakers** -- you hear both clearly, neither overpowers the other. In blood group AB, the A-antigen speaker and B-antigen speaker are both playing at full volume. Compare this with dominance, where one speaker (dominant allele) drowns out the other (recessive allele) completely.',
      examRelevance:
        'ABO blood group as an example of codominance and multiple allelism is a guaranteed NEET topic. Questions on genotype-phenotype mapping, blood group inheritance, and distinguishing codominance from incomplete dominance are common.',
      commonMistakes: [
        'Confusing codominance (both alleles fully expressed, e.g., AB blood group) with incomplete dominance (blended intermediate phenotype).',
        'Forgetting that ABO is also an example of multiple allelism (3 alleles: I^A, I^B, i).',
        'Saying O blood group has "O antigen" -- it has NO antigen. The genotype is ii (homozygous recessive).',
      ],
      quickRecap:
        'Codominance = both alleles fully expressed (AB blood group: I^A I^B has both A and B antigens). No blending.\nABO = codominance (I^A, I^B) + multiple allelism (3 alleles). I^A and I^B are dominant over i. Blood group O = ii = no antigen.',
    },

    {
      conceptTag: 'mutation',
      subjectId: 'zoology',
      chapterId: 'zoology-genetics',
      title: 'Mutation: Types, Causes & Significance in Evolution',
      explanation:
        'A **mutation** is a sudden, heritable change in the DNA sequence of an organism. The term was coined by **Hugo de Vries** based on his work on *Oenothera lamarckiana* (evening primrose). ' +
        '**Types of mutations**: ' +
        '(1) **Point mutations (gene mutations)**: Changes in a single base pair. Subtypes: ' +
        '- **Substitution**: One base replaced by another. Can be *transition* (purine<->purine) or *transversion* (purine<->pyrimidine). ' +
        '- **Insertion**: Extra base(s) added. ' +
        '- **Deletion**: Base(s) removed. ' +
        '- Insertions and deletions cause **frameshift mutations** -- shifting the reading frame of all downstream codons. ' +
        '(2) **Chromosomal mutations**: Changes in chromosome number (aneuploidy, polyploidy) or structure (deletion, duplication, inversion, translocation). ' +
        '**Causes**: Spontaneous errors during DNA replication, or induced by **mutagens** -- UV radiation, X-rays (physical), nitrous acid, colchicine (chemical), or retroviruses (biological). ' +
        '**Significance**: Mutations are the **raw material for evolution**. Most are harmful or neutral, but rare beneficial mutations provide a selective advantage and drive adaptation through natural selection.',
      analogy:
        'A mutation is like a **typo in a recipe**. If a biryani recipe says "add 1 tsp salt" and a typo changes it to "add 1 tsp sugar," the biryani is ruined (harmful mutation). If the typo says "add 1 tsp salt" -> "add 1.5 tsp salt," it might taste slightly different but still okay (neutral mutation). Rarely, the typo might accidentally create a better recipe (beneficial mutation). Over generations, the best recipes survive -- that is natural selection acting on mutations.',
      examRelevance:
        'Mutation types (point, chromosomal, frameshift) are tested in NEET. Hugo de Vries\' mutation theory, mutagens, and the role of mutations in evolution are high-yield topics. Sickle cell anemia as an example of point mutation is frequently asked.',
      commonMistakes: [
        'Confusing mutation (permanent DNA change) with recombination (shuffling existing alleles during crossing over).',
        'Thinking all mutations are harmful -- neutral and even beneficial mutations exist and drive evolution.',
        'Forgetting that frameshift mutations are caused by insertions/deletions, not substitutions.',
      ],
      quickRecap:
        'Mutation = sudden heritable DNA change (coined by Hugo de Vries). Types: point (substitution, insertion, deletion) and chromosomal.\nMutagens: UV, X-rays, chemicals. Mutations are raw material for evolution; most are harmful, few are beneficial.',
    },

    {
      conceptTag: 'sex-determination',
      subjectId: 'zoology',
      chapterId: 'zoology-genetics',
      title: 'Sex Determination: XX-XY System & Sex-Linked Inheritance',
      explanation:
        'In humans, sex is determined by **sex chromosomes**. Humans have 22 pairs of **autosomes** and 1 pair of **sex chromosomes** (total = 23 pairs = 46 chromosomes). ' +
        '**Female**: **XX** (homogametic -- all eggs carry X). **Male**: **XY** (heterogametic -- sperm carry either X or Y). ' +
        'The **Y chromosome** carries the **SRY gene** (Sex-determining Region Y), which triggers male development. The father\'s sperm determines the sex of the child: X-sperm + egg = XX (girl), Y-sperm + egg = XY (boy). Probability of boy or girl = 50% each. ' +
        '**Other systems**: Birds, butterflies use **ZZ-ZW** (male = ZZ, female = ZW -- female is heterogametic). Some insects (grasshoppers) use **XX-XO** (female = XX, male = XO -- no Y chromosome). ' +
        '**Sex-linked inheritance**: Genes on the X chromosome show X-linked inheritance. Examples: **Haemophilia** and **colour blindness** are X-linked recessive traits. Males (XY) are more affected because they have only one X -- a single recessive allele on X is expressed. Females need two copies (X^a X^a) to show the trait; carriers (X^A X^a) are unaffected but can pass it to sons.',
      analogy:
        'Sex determination is like a **coin toss by the father**. The mother always contributes an X (like always calling "heads"). The father flips the coin -- X-sperm is "heads" (girl = XX), Y-sperm is "tails" (boy = XY). The outcome is 50-50, just like a fair coin. For sex-linked diseases, think of the X chromosome as a **cricket bat** -- girls get two bats (backup if one is defective), but boys get only one bat and no backup. If that one bat is faulty, the boy shows the disease.',
      examRelevance:
        'XX-XY system, SRY gene, sex-linked diseases (haemophilia, colour blindness), and pedigree analysis are NEET staples. Cross-questions comparing human (XX-XY) vs bird (ZZ-ZW) sex determination appear regularly.',
      commonMistakes: [
        'Saying the mother determines the sex of the baby -- it is the father\'s sperm (X or Y) that determines sex.',
        'Confusing XX-XY (humans) with ZZ-ZW (birds) -- in birds, the female is heterogametic (ZW), opposite to humans.',
        'Forgetting that X-linked recessive diseases affect males more because they have only one X chromosome (no backup allele).',
      ],
      quickRecap:
        'Humans: XX = female, XY = male. Father\'s sperm determines sex. SRY gene on Y triggers male development.\nSex-linked (X-linked recessive): Haemophilia, colour blindness affect males more (one X, no backup). Birds use ZZ-ZW system.',
    },
  ],
};
