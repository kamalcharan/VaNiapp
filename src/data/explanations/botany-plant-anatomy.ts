import { ChapterExplanations } from '../../types';

export const botanyPlantAnatomyExplanations: ChapterExplanations = {
  chapterId: 'botany-plant-anatomy',
  subjectId: 'botany',
  entries: [
    // ── bot-pa-001: Xylem function (correct: a = water transport) ──

    {
      questionId: 'bot-pa-001',
      selectedOptionId: 'b',
      misconception:
        'You confused xylem with phloem. Food (sucrose) transport is the job of **phloem**, not xylem. This is the most frequently swapped pair in plant anatomy -- students mix them up because both are vascular tissues sitting side by side.',
      correctReasoning:
        'Xylem transports **water and dissolved minerals** upward from roots to leaves. It consists of tracheids and vessel elements with lignified walls. Phloem transports organic food (sucrose) from leaves to other parts (translocation).',
      tip: 'Xylem = water UP. Phloem = food DOWN/around. Write "X = water" on your hand before the exam if you have to.',
      conceptTag: 'xylem',
    },
    {
      questionId: 'bot-pa-001',
      selectedOptionId: 'c',
      misconception:
        'Gas exchange occurs through **stomata** on leaf surfaces, not through xylem. Xylem is a conducting tissue deep inside the plant, not an exchange surface.',
      correctReasoning:
        'Xylem is a vascular tissue that conducts **water and minerals** from roots to aerial parts via transpiration pull. Gas exchange (O2 and CO2) happens through stomata in leaves and lenticels in stems.',
      tip: 'Gas exchange = stomata. Water transport = xylem. They are in different tissue systems entirely.',
      conceptTag: 'xylem',
    },
    {
      questionId: 'bot-pa-001',
      selectedOptionId: 'd',
      misconception:
        'Photosynthesis takes place in **chloroplasts** within mesophyll cells, not in xylem. Xylem cells are actually dead at maturity and contain no organelles. Picking photosynthesis shows a confusion between transport and metabolic functions.',
      correctReasoning:
        'Xylem conducts **water and minerals** upward. Mature xylem vessels are dead, hollow tubes -- they cannot perform photosynthesis. Photosynthesis occurs in living mesophyll cells containing chloroplasts.',
      tip: 'Xylem cells are dead at maturity -- dead cells cannot photosynthesise. This fact alone eliminates the option.',
      conceptTag: 'xylem',
    },

    // ── bot-pa-003: Phloem transports (correct: c = organic food/sucrose) ──

    {
      questionId: 'bot-pa-003',
      selectedOptionId: 'a',
      misconception:
        'Water transport is the function of **xylem**, not phloem. Students often swap the two vascular tissues. Remember: phloem carries the food the plant makes, xylem carries the water the plant absorbs.',
      correctReasoning:
        'Phloem transports **organic food (mainly sucrose)** from source (leaves) to sink (roots, fruits, growing parts) through a process called translocation. Water and minerals are transported by xylem.',
      tip: 'Phloem = Food (both start with "Ph/F" sound). Xylem = water ("X" marks the water spot). Use this phonetic trick.',
      conceptTag: 'phloem',
    },
    {
      questionId: 'bot-pa-003',
      selectedOptionId: 'b',
      misconception:
        'Mineral transport is also handled by **xylem** (dissolved in water), not phloem. While phloem can redistribute some minerals, the primary upward transport of minerals from soil is through xylem sap.',
      correctReasoning:
        'Phloem transports **organic solutes (sucrose, amino acids)** produced by the plant. Minerals absorbed from the soil are carried upward in the **xylem** along with water. Phloem\'s main cargo is food, not raw minerals.',
      tip: 'Minerals come from the soil and travel UP in xylem. Food is made in leaves and travels DOWN/around in phloem.',
      conceptTag: 'phloem',
    },
    {
      questionId: 'bot-pa-003',
      selectedOptionId: 'd',
      misconception:
        'Oxygen is a gas, not a dissolved solute transported in phloem. Gas transport in plants happens through **intercellular spaces and stomata** by diffusion. Phloem sap does not carry O2 as cargo.',
      correctReasoning:
        'Phloem specifically transports **organic food (mainly sucrose)** via sieve tubes. Oxygen moves through the plant by simple diffusion through air spaces in leaves, stems, and roots (via lenticels).',
      tip: 'Phloem = food courier. Gases diffuse on their own -- they do not need a dedicated tissue to carry them.',
      conceptTag: 'phloem',
    },

    // ── bot-pa-006: Guard cells control (correct: b = stomatal opening) ──

    {
      questionId: 'bot-pa-006',
      selectedOptionId: 'a',
      misconception:
        'Root absorption is performed by **root hair cells**, not guard cells. Guard cells are found exclusively on the epidermis of leaves (and some stems). They are nowhere near roots.',
      correctReasoning:
        'Guard cells are specialised **kidney-shaped (dicots) or dumbbell-shaped (monocots)** epidermal cells that surround each stoma. They regulate the **opening and closing of stomata** by changing their turgor pressure. Root absorption is done by root hairs.',
      tip: 'Guard cells = leaf surface = stomata control. Root hairs = underground = water absorption. Different locations, different jobs.',
      conceptTag: 'stomata',
    },
    {
      questionId: 'bot-pa-006',
      selectedOptionId: 'c',
      misconception:
        'Cell division is controlled by **meristematic tissues** and growth regulators, not guard cells. Guard cells are fully differentiated epidermal cells and do not undergo active division themselves.',
      correctReasoning:
        'Guard cells control **stomatal aperture** by becoming turgid (stoma opens) or flaccid (stoma closes). Cell division occurs in meristematic regions like root tips and shoot apices, controlled by hormones such as auxin and cytokinin.',
      tip: 'Guard cells open/close stomata. Meristems divide. Do not assign division roles to differentiated cells.',
      conceptTag: 'stomata',
    },
    {
      questionId: 'bot-pa-006',
      selectedOptionId: 'd',
      misconception:
        'Guard cells do not directly control the transpiration rate -- they control **stomatal opening**, and transpiration is a consequence. This is a subtle but important distinction that NEET tests. Environmental factors like humidity and wind also affect transpiration rate.',
      correctReasoning:
        'Guard cells regulate the **opening and closing of stomata**. While this indirectly affects transpiration, the transpiration rate itself depends on multiple factors (humidity, temperature, wind, light). The direct function of guard cells is stomatal aperture control.',
      tip: 'The question asks what guard cells CONTROL -- that is stomatal opening. Transpiration is an indirect effect, not their direct function.',
      conceptTag: 'stomata',
    },

    // ── bot-pa-009: Meristematic tissue characteristic (correct: d = actively dividing) ──

    {
      questionId: 'bot-pa-009',
      selectedOptionId: 'a',
      misconception:
        'Meristematic cells are very much **alive** and metabolically active -- they are the most actively dividing cells in the plant. Dead cells are found in sclerenchyma and mature xylem, not meristems.',
      correctReasoning:
        'Meristematic tissue consists of **actively dividing, undifferentiated cells** with dense cytoplasm, thin cell walls, and prominent nuclei. Dead cells like tracheids and sclerenchyma fibres belong to permanent tissues.',
      tip: 'Meristem = growth zone = alive and dividing. Dead cells = permanent tissue (xylem, sclerenchyma). They are opposites.',
      conceptTag: 'meristematic-tissue',
    },
    {
      questionId: 'bot-pa-009',
      selectedOptionId: 'b',
      misconception:
        'Fully differentiated cells have stopped dividing and belong to **permanent tissues**, not meristems. Meristematic cells are specifically undifferentiated -- that is what allows them to keep dividing and forming new cells.',
      correctReasoning:
        'Meristematic cells are **undifferentiated and retain the ability to divide**. Once they differentiate (become specialised), they form permanent tissues and usually lose the capacity to divide. "Fully differentiated" is the opposite of meristematic.',
      tip: 'Meristematic = undifferentiated + dividing. Permanent = differentiated + non-dividing. These are antonyms in plant anatomy.',
      conceptTag: 'meristematic-tissue',
    },
    {
      questionId: 'bot-pa-009',
      selectedOptionId: 'c',
      misconception:
        'Food storage is the function of **parenchyma** (a permanent tissue), not meristematic tissue. Meristematic cells are too busy dividing to store food. They have dense cytoplasm and little to no vacuoles.',
      correctReasoning:
        'Meristematic tissue is characterised by **active cell division**, dense cytoplasm, thin cellulose walls, and small or absent vacuoles. Storage parenchyma (in roots, stems, fruits) stores starch and other food reserves.',
      tip: 'Storage = parenchyma. Division = meristem. Meristematic cells have tiny vacuoles because they are packed with cytoplasm for division.',
      conceptTag: 'meristematic-tissue',
    },

    // ── bot-pa-012: Secondary growth occurs in (correct: a = dicot stems) ──

    {
      questionId: 'bot-pa-012',
      selectedOptionId: 'b',
      misconception:
        'Monocot stems generally do **NOT** show secondary growth because they lack a vascular cambium between xylem and phloem. Their vascular bundles are "closed" (no cambium). Some exceptions exist (like Dracaena), but the standard NEET answer is dicots.',
      correctReasoning:
        'Secondary growth occurs in **dicot stems and roots** due to the presence of **vascular cambium** (between xylem and phloem) and **cork cambium** (in the cortex). Monocots have closed vascular bundles and typically show no secondary growth.',
      tip: 'Dicot = open bundles = cambium present = secondary growth. Monocot = closed bundles = no cambium = no secondary growth. This is a golden rule.',
      conceptTag: 'secondary-growth',
    },
    {
      questionId: 'bot-pa-012',
      selectedOptionId: 'c',
      misconception:
        'Not ALL roots show secondary growth -- only **dicot roots** do. Monocot roots, like monocot stems, lack vascular cambium and do not undergo secondary growth. The blanket statement "all roots" is incorrect.',
      correctReasoning:
        'Secondary growth occurs in **dicot stems and dicot roots** that possess vascular cambium. Monocot roots typically lack cambium and do not show secondary growth. The correct answer specifies dicot stems as the primary site.',
      tip: 'Always check: is it dicot or monocot? Secondary growth is a dicot specialty. "All roots" is a trap option.',
      conceptTag: 'secondary-growth',
    },
    {
      questionId: 'bot-pa-012',
      selectedOptionId: 'd',
      misconception:
        'Leaves do NOT undergo secondary growth. Leaves are determinate organs -- they grow to a fixed size and stop. There is no cambium activity in leaves. Secondary growth occurs in stems and roots only.',
      correctReasoning:
        'Secondary growth is the increase in girth of stems and roots due to **vascular cambium and cork cambium** activity. Leaves lack these lateral meristems and grow only by primary growth (cell division at the tip and margins).',
      tip: 'Secondary growth = increase in thickness of stems/roots. Leaves do not thicken over time -- eliminate this option immediately.',
      conceptTag: 'secondary-growth',
    },

    // ── bot-pa-015: Collenchyma provides (correct: c = flexibility/support to growing parts) ──

    {
      questionId: 'bot-pa-015',
      selectedOptionId: 'a',
      misconception:
        'Rigidity is provided by **sclerenchyma** (with lignified walls), not collenchyma. Collenchyma has pectin-thickened walls that are flexible, not rigid. Confusing collenchyma and sclerenchyma is a classic NEET mistake.',
      correctReasoning:
        'Collenchyma has **unevenly thickened walls (pectin and cellulose)** that provide **flexibility and mechanical support** to growing organs like young stems and leaf stalks. Sclerenchyma has lignified walls providing rigidity to mature parts.',
      tip: 'Collenchyma = flexible (living, pectin). Sclerenchyma = rigid (dead, lignin). "Collenchyma" sounds softer -- think flexibility.',
      conceptTag: 'collenchyma',
    },
    {
      questionId: 'bot-pa-015',
      selectedOptionId: 'b',
      misconception:
        'Food storage is the job of **parenchyma**, which has thin walls and large vacuoles for storing starch, water, and other materials. Collenchyma is a mechanical tissue, not a storage tissue.',
      correctReasoning:
        'Collenchyma provides **flexibility and support** to growing plant parts. It has thickened corners and is found in petioles and young stems. Storage of food is the domain of parenchyma cells in organs like potato tubers and carrot roots.',
      tip: 'Parenchyma = storage. Collenchyma = flexible support. Sclerenchyma = rigid support. Memorise this trio for NEET.',
      conceptTag: 'collenchyma',
    },
    {
      questionId: 'bot-pa-015',
      selectedOptionId: 'd',
      misconception:
        'Water conduction is the function of **xylem**, a vascular tissue, not collenchyma. Collenchyma is a simple mechanical tissue found in the cortex region and does not transport water.',
      correctReasoning:
        'Collenchyma is a **simple permanent tissue** that provides flexible mechanical support. Water conduction is performed by **xylem** (a complex permanent tissue with vessels and tracheids). These are entirely different tissue categories.',
      tip: 'Conducting tissue = xylem/phloem. Mechanical tissue = collenchyma/sclerenchyma. Do not mix tissue categories.',
      conceptTag: 'collenchyma',
    },

    // ── bot-pa-019: Vascular bundle type in monocot stem (correct: b = closed/scattered) ──

    {
      questionId: 'bot-pa-019',
      selectedOptionId: 'a',
      misconception:
        'Open vascular bundles arranged in a ring is the pattern of **dicot stems**, not monocot stems. "Open" means cambium is present between xylem and phloem, which is a dicot feature. Monocots have closed (cambium-less) bundles.',
      correctReasoning:
        'Monocot stems have **closed vascular bundles** (no cambium) that are **scattered** throughout the ground tissue. Dicot stems have open bundles (cambium present) arranged in a **ring**. This is a fundamental dicot vs monocot distinction.',
      tip: 'Monocot = closed + scattered. Dicot = open + ring. NEET asks this in some form almost every year.',
      conceptTag: 'vascular-bundles',
    },
    {
      questionId: 'bot-pa-019',
      selectedOptionId: 'c',
      misconception:
        'Radial arrangement of vascular bundles is found in **roots** (both monocot and dicot), not in stems. In radial arrangement, xylem and phloem alternate on different radii. Stems have conjoint bundles, not radial.',
      correctReasoning:
        'Monocot stems have **conjoint, closed, and scattered** vascular bundles. Radial vascular bundles (where xylem and phloem are on separate radii) are characteristic of **roots**. The question specifically asks about monocot stems.',
      tip: 'Radial = roots. Conjoint = stems. Read whether the question says "stem" or "root" -- it changes the answer completely.',
      conceptTag: 'vascular-bundles',
    },
    {
      questionId: 'bot-pa-019',
      selectedOptionId: 'd',
      misconception:
        'Bicollateral vascular bundles (phloem on both sides of xylem) are found in the **Cucurbitaceae** family (pumpkin, cucumber), not in typical monocot stems. This is a very specific bundle type tested in NEET.',
      correctReasoning:
        'Monocot stems have **conjoint, closed, collateral** bundles scattered through ground tissue. Bicollateral bundles have phloem on both inner and outer sides of xylem and are specific to Cucurbitaceae family members.',
      tip: 'Bicollateral = Cucurbitaceae only. If the question says "monocot stem", the answer is closed and scattered, never bicollateral.',
      conceptTag: 'vascular-bundles',
    },

    // ── bot-pa-023: Cork cambium produces (correct: d = bark/periderm) ──

    {
      questionId: 'bot-pa-023',
      selectedOptionId: 'a',
      misconception:
        'Xylem (secondary xylem/wood) is produced by the **vascular cambium**, not cork cambium. Cork cambium (phellogen) is a lateral meristem found in the outer cortex and has nothing to do with wood formation.',
      correctReasoning:
        'Cork cambium (phellogen) produces **cork (phellem)** on the outside and **secondary cortex (phelloderm)** on the inside. Together these form the **periderm (bark)**. Xylem and phloem are produced by vascular cambium.',
      tip: 'Vascular cambium = wood (xylem) + inner bark (phloem). Cork cambium = outer bark (periderm). Two different cambia, two different products.',
      conceptTag: 'cork-cambium',
    },
    {
      questionId: 'bot-pa-023',
      selectedOptionId: 'b',
      misconception:
        'Phloem (secondary phloem) is produced by the **vascular cambium**, not cork cambium. Cork cambium sits outside the vascular cambium region and only produces cork and secondary cortex.',
      correctReasoning:
        'Secondary phloem is formed by the **vascular cambium** on its outer side. Cork cambium (phellogen) forms the **periderm** -- cork cells externally and phelloderm internally. These two lateral meristems have distinct products.',
      tip: 'Cork cambium produces cork. Vascular cambium produces wood and phloem. Never swap their products in NEET.',
      conceptTag: 'cork-cambium',
    },
    {
      questionId: 'bot-pa-023',
      selectedOptionId: 'c',
      misconception:
        'Pith is the central ground tissue present from primary growth -- it is NOT produced by cork cambium. Pith is made of parenchyma and is formed during the development of the primary plant body.',
      correctReasoning:
        'Cork cambium (phellogen) produces **bark/periderm** (cork externally, phelloderm internally). Pith is the central parenchymatous tissue formed during primary growth and is not related to any cambium activity.',
      tip: 'Pith = central, primary tissue. Bark = peripheral, secondary tissue from cork cambium. They are at opposite ends of the stem.',
      conceptTag: 'cork-cambium',
    },
  ],
};
