import { ChapterExplanations } from '../../types';

export const botanyCellBiologyExplanations: ChapterExplanations = {
  chapterId: 'botany-cell-biology',
  subjectId: 'botany',
  entries: [
    // ── bot-cb-001: Powerhouse of the cell (correct: c = mitochondria) ──

    {
      questionId: 'bot-cb-001',
      selectedOptionId: 'a',
      misconception:
        'You confused the nucleus with the mitochondria. The nucleus is the control centre that stores DNA, but it does NOT produce energy. Students often mix these up because both are called "important" organelles.',
      correctReasoning:
        'Mitochondria are called the "powerhouse of the cell" because they carry out **oxidative phosphorylation** and the **Krebs cycle**, producing ATP. The nucleus stores genetic information and controls cell activities but has no role in ATP generation.',
      tip: 'Remember: Nucleus = brain (information), Mitochondria = battery (energy). NEET loves this classic question.',
      conceptTag: 'mitochondria',
    },
    {
      questionId: 'bot-cb-001',
      selectedOptionId: 'b',
      misconception:
        'You picked ribosomes, likely because you know they are essential for the cell. Ribosomes synthesise proteins, not energy. This is a common mix-up when students think "essential = energy."',
      correctReasoning:
        'Ribosomes are the sites of **protein synthesis** (translation), not energy production. Mitochondria generate ATP through cellular respiration. Ribosomes are found on rough ER or free in the cytoplasm.',
      tip: 'Ribosome = protein factory. Mitochondria = power plant. Two different jobs -- never swap them in MCQs.',
      conceptTag: 'mitochondria',
    },
    {
      questionId: 'bot-cb-001',
      selectedOptionId: 'd',
      misconception:
        'The Golgi body packages and modifies proteins, not produces energy. Students sometimes confuse Golgi with mitochondria because both are membrane-bound organelles with layered structures.',
      correctReasoning:
        'The Golgi apparatus (Golgi body) is the **packaging and shipping centre** of the cell -- it modifies, sorts and packages proteins and lipids. Energy (ATP) production happens exclusively in the mitochondria via the electron transport chain.',
      tip: 'Think: Golgi = courier service (packs & dispatches), Mitochondria = power station. NEET repeats this almost every year.',
      conceptTag: 'mitochondria',
    },

    // ── bot-cb-003: Cell wall made of (correct: a = cellulose) ──

    {
      questionId: 'bot-cb-003',
      selectedOptionId: 'b',
      misconception:
        'You picked chitin, which is the cell wall material of **fungi**, not plants. This is one of the most common NEET errors -- confusing plant and fungal cell walls because both are rigid outer layers.',
      correctReasoning:
        'Plant cell walls are made of **cellulose**, a polysaccharide of beta-glucose units. Chitin is structurally similar but is found in fungal cell walls and arthropod exoskeletons, never in plant cells.',
      tip: 'Plant = Cellulose, Fungi = Chitin, Bacteria = Peptidoglycan. Make a 3-row table and memorise it -- NEET tests this distinction frequently.',
      conceptTag: 'cell-wall',
    },
    {
      questionId: 'bot-cb-003',
      selectedOptionId: 'c',
      misconception:
        'Peptidoglycan (murein) is the cell wall material of bacteria, not plants. Students who have recently studied prokaryotes sometimes carry this over to plant biology questions.',
      correctReasoning:
        'Plant cells have walls made of **cellulose**. Peptidoglycan is unique to bacterial cell walls and is the target of antibiotics like penicillin. The two polymers are chemically very different.',
      tip: 'If you see "peptidoglycan" in a plant question, it is always a trap option. Peptidoglycan = bacteria only.',
      conceptTag: 'cell-wall',
    },
    {
      questionId: 'bot-cb-003',
      selectedOptionId: 'd',
      misconception:
        'Keratin is a structural protein found in animal hair, nails and skin -- it has nothing to do with plant cell walls. Students sometimes pick this because they associate "structural = strong = cell wall."',
      correctReasoning:
        'Keratin is an **animal structural protein** (hair, feathers, horns). Plant cell walls are made of **cellulose**, a carbohydrate polymer. Remember: cell wall = polysaccharide, keratin = protein.',
      tip: 'Keratin belongs to the animal kingdom chapter, not cell biology of plants. Eliminate it instantly whenever it appears in a plant question.',
      conceptTag: 'cell-wall',
    },

    // ── bot-cb-005: Prokaryotic cell lacks (correct: b = membrane-bound nucleus) ──

    {
      questionId: 'bot-cb-005',
      selectedOptionId: 'a',
      misconception:
        'You thought prokaryotes lack ribosomes, but they absolutely DO have ribosomes (70S type). The question asks what is absent, not what is present. Students often confuse "simpler cell = fewer parts" with "no ribosomes."',
      correctReasoning:
        'Prokaryotes have **70S ribosomes** (smaller than the 80S ribosomes of eukaryotes) and use them for protein synthesis. What they truly lack is a **membrane-bound nucleus** -- their DNA lies in a nucleoid region without a nuclear envelope.',
      tip: '70S in prokaryotes, 80S in eukaryotes. Both have ribosomes. The key missing thing is a nuclear membrane.',
      conceptTag: 'prokaryotic-vs-eukaryotic',
    },
    {
      questionId: 'bot-cb-005',
      selectedOptionId: 'c',
      misconception:
        'Prokaryotes definitely have DNA -- it is just not enclosed in a membrane-bound nucleus. Their circular DNA lies freely in the nucleoid region. Thinking "no nucleus = no DNA" is a dangerous misconception.',
      correctReasoning:
        'Prokaryotic cells contain a **single circular DNA molecule** in the nucleoid region, plus small circular plasmids. They lack a membrane-bound nucleus, meaning the DNA is not enclosed by a nuclear envelope, but DNA itself is absolutely present.',
      tip: 'No nucleus does NOT mean no DNA. Prokaryotes have DNA; it is just "naked" (not wrapped in a nuclear membrane).',
      conceptTag: 'prokaryotic-vs-eukaryotic',
    },
    {
      questionId: 'bot-cb-005',
      selectedOptionId: 'd',
      misconception:
        'You thought prokaryotes lack a cell membrane, but every living cell -- prokaryote or eukaryote -- has a plasma membrane. Without it, the cell could not maintain its internal environment.',
      correctReasoning:
        'All cells, including prokaryotes, are bounded by a **plasma membrane** made of a phospholipid bilayer. What prokaryotes lack is internal membrane-bound organelles, particularly a **true nucleus** with a nuclear envelope.',
      tip: 'Cell membrane is universal to ALL cells. The defining difference of prokaryotes is the absence of a membrane-bound nucleus.',
      conceptTag: 'prokaryotic-vs-eukaryotic',
    },

    // ── bot-cb-008: Function of rough ER (correct: d = protein synthesis) ──

    {
      questionId: 'bot-cb-008',
      selectedOptionId: 'a',
      misconception:
        'Lipid synthesis is the function of **smooth ER**, not rough ER. Students often confuse the two because both are part of the endoplasmic reticulum, but the presence of ribosomes on rough ER gives it a completely different role.',
      correctReasoning:
        'Rough ER has **ribosomes studded on its surface**, making it the site of protein synthesis and processing. Smooth ER lacks ribosomes and is responsible for lipid synthesis and steroid hormone production.',
      tip: 'Rough = Ribosomes = Protein. Smooth = no ribosomes = Lipids. The "R" in Rough connects to "R" in Ribosomes.',
      conceptTag: 'endoplasmic-reticulum',
    },
    {
      questionId: 'bot-cb-008',
      selectedOptionId: 'b',
      misconception:
        'Detoxification is a function of **smooth ER**, especially in liver cells (hepatocytes). You likely recalled that ER helps in detoxification but forgot that it is specifically the smooth type, not rough.',
      correctReasoning:
        'Rough ER synthesises proteins via its attached ribosomes. **Smooth ER** in liver cells detoxifies drugs and poisons. This distinction between rough and smooth ER functions is a NEET favourite.',
      tip: 'Detox = Smooth ER (liver). Proteins = Rough ER. If the question says "rough", eliminate detoxification immediately.',
      conceptTag: 'endoplasmic-reticulum',
    },
    {
      questionId: 'bot-cb-008',
      selectedOptionId: 'c',
      misconception:
        'Energy production is the function of mitochondria, not any form of ER. This is a cross-organelle confusion -- students sometimes randomly assign "energy" to whichever organelle sounds important.',
      correctReasoning:
        'The endoplasmic reticulum (rough or smooth) has NO role in energy production. **Mitochondria** produce ATP. Rough ER specifically synthesises proteins that are either secreted or inserted into membranes.',
      tip: 'Energy = mitochondria, always. ER never produces ATP. Eliminate "energy production" from any ER-related question.',
      conceptTag: 'endoplasmic-reticulum',
    },

    // ── bot-cb-012: Osmosis definition (correct: a = water movement through semipermeable membrane) ──

    {
      questionId: 'bot-cb-012',
      selectedOptionId: 'b',
      misconception:
        'Solute movement across a membrane is called **diffusion**, not osmosis. Osmosis specifically refers to the movement of the solvent (water). Students frequently mix up the direction -- osmosis is water moving, not solute moving.',
      correctReasoning:
        'Osmosis is the movement of **water (solvent)** from a region of lower solute concentration to higher solute concentration through a **semipermeable membrane**. Movement of solute particles is called diffusion.',
      tip: 'Osmosis = water moves. Diffusion = solute moves. This one-line distinction can save you 4 marks in NEET.',
      conceptTag: 'osmosis',
    },
    {
      questionId: 'bot-cb-012',
      selectedOptionId: 'c',
      misconception:
        'Gas exchange is simply diffusion of gases (O2, CO2) across surfaces like alveoli or stomata. It has nothing to do with osmosis, which is exclusively about water movement through a semipermeable membrane.',
      correctReasoning:
        'Osmosis involves **water molecules** moving through a selectively permeable membrane along a concentration gradient. Gas exchange occurs by **simple diffusion** of gases and does not require a semipermeable membrane in the same way.',
      tip: 'Gas exchange = diffusion. Water through membrane = osmosis. Do not club them together.',
      conceptTag: 'osmosis',
    },
    {
      questionId: 'bot-cb-012',
      selectedOptionId: 'd',
      misconception:
        'Active transport requires ATP energy and moves substances against the concentration gradient. Osmosis is a **passive process** that requires no energy. Confusing these two means you are mixing up passive and active transport fundamentals.',
      correctReasoning:
        'Osmosis is a **passive** process -- water moves down its own concentration gradient through a semipermeable membrane without energy input. Active transport uses ATP to move molecules against the gradient (e.g., sodium-potassium pump).',
      tip: 'Osmosis = passive, no ATP. Active transport = uses ATP, goes against gradient. NEET loves testing this difference.',
      conceptTag: 'osmosis',
    },

    // ── bot-cb-015: Mitosis produces (correct: c = 2 identical daughter cells) ──

    {
      questionId: 'bot-cb-015',
      selectedOptionId: 'a',
      misconception:
        'Four cells are produced in **meiosis**, not mitosis. This is the single most common mix-up in cell division questions. Mitosis = 2 cells, Meiosis = 4 cells.',
      correctReasoning:
        'Mitosis involves one round of division producing **2 genetically identical daughter cells** with the same chromosome number as the parent (2n to 2n). Meiosis involves two rounds of division producing 4 genetically different haploid cells.',
      tip: 'MI-tosis = 2 (think: "mi" sounds like "my two eyes"). MEI-osis = 4. Write this mnemonic in your notes.',
      conceptTag: 'mitosis',
    },
    {
      questionId: 'bot-cb-015',
      selectedOptionId: 'b',
      misconception:
        'Mitosis produces two IDENTICAL cells, not two different cells. If you picked this, you confused mitosis with meiosis, where crossing over creates genetic variation. Mitosis is a faithful copying process.',
      correctReasoning:
        'Mitosis produces **2 genetically identical** daughter cells. The DNA is replicated exactly, and sister chromatids separate equally. Genetic variation arises in meiosis due to crossing over and independent assortment, not in mitosis.',
      tip: 'Mitosis = photocopy (identical). Meiosis = remix (different). If they ask "identical", the answer is always mitosis.',
      conceptTag: 'mitosis',
    },
    {
      questionId: 'bot-cb-015',
      selectedOptionId: 'd',
      misconception:
        'One cell as a product makes no sense for cell "division" -- division by definition means producing more than one cell. This option is a trap for students who overthink or second-guess themselves.',
      correctReasoning:
        'Cell division always increases cell number. Mitosis starts with one parent cell and produces **2 daughter cells** that are genetically identical to the parent. The word "division" itself implies splitting into multiple units.',
      tip: 'Division = more cells, never fewer. If an option says "1 cell", eliminate it instantly -- it contradicts the meaning of division.',
      conceptTag: 'mitosis',
    },

    // ── bot-cb-019: Chloroplast pigment (correct: b = chlorophyll) ──

    {
      questionId: 'bot-cb-019',
      selectedOptionId: 'a',
      misconception:
        'Hemoglobin is the oxygen-carrying pigment in red blood cells (animal biology), not a plant pigment. Students who recently studied human physiology sometimes carry animal terms into botany questions.',
      correctReasoning:
        'The primary pigment in chloroplasts is **chlorophyll** (chlorophyll a and b), which absorbs light for photosynthesis. Hemoglobin is an iron-containing protein in RBCs that carries O2 and has no role in plant biology.',
      tip: 'Chlorophyll = green plant pigment. Hemoglobin = red blood pigment. Different kingdoms, different pigments.',
      conceptTag: 'chloroplast',
    },
    {
      questionId: 'bot-cb-019',
      selectedOptionId: 'c',
      misconception:
        'Melanin is the pigment responsible for skin, hair and eye colour in animals. It is not found in chloroplasts or any plant organelle. This is a cross-chapter trap that catches students who do not read options carefully.',
      correctReasoning:
        'Chloroplasts contain **chlorophyll** as the primary photosynthetic pigment. Melanin is produced by melanocytes in animal skin and provides UV protection. It plays zero role in photosynthesis.',
      tip: 'Melanin = animal skin colour. Chlorophyll = plant green colour. If you see melanin in a plant question, it is 100% wrong.',
      conceptTag: 'chloroplast',
    },
    {
      questionId: 'bot-cb-019',
      selectedOptionId: 'd',
      misconception:
        'Carotene is indeed present in chloroplasts, but it is an **accessory pigment**, not the primary one. The question asks for THE chloroplast pigment, which is chlorophyll. Picking "carotene only" ignores chlorophyll entirely.',
      correctReasoning:
        'The primary chloroplast pigment is **chlorophyll** (a and b). Carotenoids (carotene, xanthophyll) are accessory pigments that absorb wavelengths chlorophyll cannot and pass energy to the reaction centre. "Carotene only" is incomplete and incorrect.',
      tip: 'Primary = chlorophyll. Accessory = carotene, xanthophyll. When NEET says "the pigment", they mean chlorophyll unless specified otherwise.',
      conceptTag: 'chloroplast',
    },

    // ── bot-cb-023: Active transport requires (correct: d = ATP energy) ──

    {
      questionId: 'bot-cb-023',
      selectedOptionId: 'a',
      misconception:
        'Saying active transport needs "no energy" contradicts its very name -- the word "active" means energy is required. You likely confused active transport with passive transport (diffusion or osmosis).',
      correctReasoning:
        'Active transport moves molecules **against** the concentration gradient and requires **ATP energy**. Passive transport (diffusion, osmosis, facilitated diffusion) requires no energy and moves molecules along the gradient.',
      tip: 'Active = ATP. Passive = no ATP. The name tells you everything. NEET frequently tests this basic distinction.',
      conceptTag: 'active-transport',
    },
    {
      questionId: 'bot-cb-023',
      selectedOptionId: 'b',
      misconception:
        'Movement along a concentration gradient without energy input describes **diffusion** (passive transport). Active transport moves substances AGAINST the concentration gradient and therefore needs an energy source.',
      correctReasoning:
        'Diffusion relies on the concentration gradient and needs no energy. **Active transport** works against the gradient (low to high concentration) and requires ATP. Examples include the sodium-potassium pump and ion uptake by root hairs.',
      tip: 'Gradient alone = diffusion. Against gradient + ATP = active transport. Memorise this pair -- it appears in NEET every year.',
      conceptTag: 'active-transport',
    },
    {
      questionId: 'bot-cb-023',
      selectedOptionId: 'c',
      misconception:
        'Osmotic pressure drives water movement in osmosis, not active transport. These are fundamentally different processes. Students sometimes jumble up all membrane transport terms.',
      correctReasoning:
        'Active transport requires **ATP (adenosine triphosphate)** as its energy source to pump molecules against the concentration gradient. Osmotic pressure is relevant only to osmosis, where water moves passively through a semipermeable membrane.',
      tip: 'Osmotic pressure = osmosis. ATP = active transport. Keep your transport types in separate mental boxes.',
      conceptTag: 'active-transport',
    },
  ],
};
