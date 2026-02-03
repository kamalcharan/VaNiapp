import { SubjectConcepts } from '../../types';

export const botanyConcepts: SubjectConcepts = {
  subjectId: 'botany',
  concepts: [
    // ── Cell Biology (6 concepts) ──────────────────────────────────────
    {
      conceptTag: 'cell-membrane',
      subjectId: 'botany',
      chapterId: 'botany-cell-biology',
      title: 'Cell Membrane — Fluid Mosaic Model',
      explanation:
        'The **cell membrane** (plasma membrane) is a **selectively permeable** barrier that surrounds every living cell. Its structure is best described by the **Fluid Mosaic Model** proposed by **Singer and Nicolson (1972)**.\n\n' +
        'The membrane is composed of a **phospholipid bilayer** — two layers of phospholipid molecules arranged with their **hydrophilic heads** facing outward (toward water) and **hydrophobic tails** facing inward (away from water). This arrangement makes the membrane **amphipathic**.\n\n' +
        'Embedded within this bilayer are **integral proteins** (transmembrane proteins that span the entire membrane) and **peripheral proteins** (attached to the surface). **Cholesterol** molecules are interspersed among the phospholipids in animal cells, providing **membrane fluidity** and stability.\n\n' +
        'The membrane is called "fluid" because the lipid and protein molecules can **move laterally** within the layer, and "mosaic" because of the **pattern of scattered proteins** resembling mosaic tiles.\n\n' +
        'Key functions include **selective permeability** (controlling what enters and exits), **cell signaling** through receptor proteins, **cell recognition** via glycoproteins, and maintaining **cellular homeostasis**. Transport across the membrane can be **passive** (diffusion, osmosis, facilitated diffusion — no ATP needed) or **active** (against concentration gradient — requires ATP).\n\n' +
        'For NEET, remember that the cell membrane is **not visible** under a light microscope but is visible under an **electron microscope**. The membrane is **quasi-fluid** in nature, allowing lateral movement of proteins within the overall bilayer.',
      analogy:
        'Think of the cell membrane like a cricket stadium security gate. The boundary wall (phospholipid bilayer) keeps random people out, the security guards (transport proteins) check tickets and let only valid spectators in, and the VIP entrance (channel proteins) allows specific people through quickly. Just like the crowd keeps shifting around inside the stadium, the proteins keep moving laterally — that is the "fluid" part.',
      examRelevance:
        'Very high frequency in NEET. Questions commonly appear on the Fluid Mosaic Model, types of transport across the membrane, and the chemical composition of the bilayer. Expect 1-2 questions every year from this topic.',
      commonMistakes: [
        'Confusing integral proteins (span the membrane) with peripheral proteins (only on the surface) — NEET loves testing this distinction.',
        'Forgetting that the Fluid Mosaic Model was proposed by Singer and Nicolson, not Robertson (who proposed the unit membrane model).',
        'Assuming the cell membrane is rigid — it is quasi-fluid, allowing lateral but not flip-flop movement easily.',
      ],
      quickRecap:
        'The cell membrane is a selectively permeable phospholipid bilayer described by the Fluid Mosaic Model (Singer & Nicolson, 1972).\nIt contains integral and peripheral proteins, allows lateral movement of components, and controls transport via passive and active mechanisms.',
    },
    {
      conceptTag: 'mitochondria',
      subjectId: 'botany',
      chapterId: 'botany-cell-biology',
      title: 'Mitochondria — The Powerhouse of the Cell',
      explanation:
        '**Mitochondria** are **double-membrane-bound** organelles found in nearly all eukaryotic cells. They are rightly called the **"powerhouse of the cell"** because they are the primary site of **aerobic respiration** and **ATP synthesis**.\n\n' +
        'The **outer membrane** is smooth and porous, allowing small molecules to pass through. The **inner membrane** is highly folded into structures called **cristae**, which increase the surface area for the **electron transport chain (ETC)** and **oxidative phosphorylation**. The space between the two membranes is the **inter-membrane space**.\n\n' +
        'The interior of the mitochondrion is filled with a gel-like substance called the **matrix**, which contains enzymes for the **Krebs cycle (TCA cycle)**, along with **mitochondrial DNA (mtDNA)**, **70S ribosomes**, and RNA. This makes mitochondria **semi-autonomous** organelles capable of self-replication.\n\n' +
        'The complete breakdown of one molecule of glucose through glycolysis, the Krebs cycle, and the ETC yields approximately **36-38 ATP molecules**. The **F0-F1 particles** (ATP synthase complexes) located on the cristae are directly responsible for ATP generation through **chemiosmosis**.\n\n' +
        'Mitochondria are believed to have originated from **aerobic bacteria** through **endosymbiosis**, as supported by the presence of their own circular DNA and 70S ribosomes. For NEET, note that mitochondria are absent in **mature RBCs** of mammals and in **prokaryotes**.',
      analogy:
        'Imagine your phone battery charging — the charger (food molecules) plugs into the power brick (mitochondria), which converts electrical energy into stored battery power (ATP). The folds inside the charger brick (cristae) increase efficiency, just like how a phone with fast-charging tech has a more complex internal design to produce energy faster.',
      examRelevance:
        'Extremely high-yield for NEET. Questions on the structure of mitochondria (cristae, matrix), ATP yield, semi-autonomous nature, and the presence of 70S ribosomes appear almost every year. Also tested in the context of cellular respiration.',
      commonMistakes: [
        'Writing that mitochondria have 80S ribosomes — they have 70S ribosomes (like bacteria), supporting the endosymbiotic theory.',
        'Confusing cristae (inner membrane folds of mitochondria) with thylakoids (internal membranes of chloroplasts).',
        'Forgetting that mitochondria are absent in mature mammalian RBCs — a frequently tested NEET fact.',
      ],
      quickRecap:
        'Mitochondria are double-membrane-bound, semi-autonomous organelles with cristae (inner folds) and a matrix containing circular DNA and 70S ribosomes.\nThey produce 36-38 ATP per glucose molecule via the Krebs cycle and ETC, and are absent in mature mammalian RBCs.',
    },
    {
      conceptTag: 'cell-division',
      subjectId: 'botany',
      chapterId: 'botany-cell-biology',
      title: 'Cell Division — Mitosis vs Meiosis',
      explanation:
        '**Cell division** is the process by which a parent cell divides to form daughter cells. There are two main types: **mitosis** and **meiosis**.\n\n' +
        '**Mitosis** is **equational division** — one parent cell produces **two genetically identical daughter cells** with the **same chromosome number** (2n to 2n). It occurs in **somatic cells** and is responsible for **growth, repair, and regeneration**. Mitosis has four stages: **Prophase** (chromatin condenses into chromosomes, spindle forms), **Metaphase** (chromosomes align at the equatorial plate), **Anaphase** (sister chromatids separate and move to poles), and **Telophase** (nuclear envelope reforms, chromosomes decondense). This is followed by **cytokinesis**.\n\n' +
        '**Meiosis** is **reductional division** — one parent cell produces **four genetically different daughter cells** with **half the chromosome number** (2n to n). It occurs in **reproductive cells** (germ cells) and consists of two sequential divisions: **Meiosis I** (homologous chromosomes separate) and **Meiosis II** (sister chromatids separate, similar to mitosis).\n\n' +
        'The key event of Meiosis I is **crossing over** during **Prophase I** (specifically **Pachytene** stage), which leads to **genetic recombination** and variation. Prophase I is the longest phase and is subdivided into **Leptotene, Zygotene, Pachytene, Diplotene, and Diakinesis**.\n\n' +
        'For NEET, always remember: mitosis maintains chromosome number (important for growth), while meiosis halves it (essential for sexual reproduction and maintaining species chromosome number across generations).',
      analogy:
        'Mitosis is like photocopying your notes — you get an exact duplicate. Meiosis is like two friends splitting a shared notebook and then each photocopying their half — you end up with four sets, each slightly different. Crossing over is like swapping a few pages between notebooks before copying, which is why siblings from the same parents look different.',
      examRelevance:
        'Top-priority NEET topic. Expect 2-3 questions every year covering stages of mitosis and meiosis, differences between the two, significance of crossing over, and sub-stages of Prophase I. Also appears in assertion-reason format.',
      commonMistakes: [
        'Confusing the stages of Prophase I — the correct order is Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis (remember: Lazy Zebras Play During Dawn).',
        'Saying meiosis produces "two" daughter cells — it produces four haploid cells.',
        'Forgetting that crossing over occurs in Pachytene, not Zygotene (Zygotene is when synapsis/pairing occurs).',
      ],
      quickRecap:
        'Mitosis is equational division (2n to 2n, two identical cells) for growth; meiosis is reductional division (2n to n, four different cells) for reproduction.\nCrossing over during Pachytene of Prophase I in meiosis creates genetic variation; Prophase I substages are Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis.',
    },
    {
      conceptTag: 'endoplasmic-reticulum',
      subjectId: 'botany',
      chapterId: 'botany-cell-biology',
      title: 'Endoplasmic Reticulum — Rough vs Smooth ER',
      explanation:
        'The **Endoplasmic Reticulum (ER)** is a vast network of **membrane-bound tubules and cisternae** that extends from the **nuclear membrane** throughout the cytoplasm. It is the **largest membrane-bound organelle** in most eukaryotic cells and exists in two forms.\n\n' +
        '**Rough Endoplasmic Reticulum (RER)** has **ribosomes (80S)** studded on its cytoplasmic surface, giving it a "rough" appearance under an electron microscope. Its primary function is **protein synthesis and transport**. Proteins synthesized on RER ribosomes enter the ER lumen, where they undergo **folding and modification** (like glycosylation) before being packaged into **transport vesicles** and sent to the **Golgi apparatus**. RER is abundant in cells that actively secrete proteins, such as **pancreatic cells** and **plasma cells (B lymphocytes)**.\n\n' +
        '**Smooth Endoplasmic Reticulum (SER)** lacks ribosomes on its surface. It is involved in **lipid synthesis** (phospholipids, cholesterol, steroid hormones), **detoxification** of drugs and poisons (especially in liver cells called **hepatocytes**), and **calcium storage** (important in muscle cells as **sarcoplasmic reticulum**).\n\n' +
        'The ER also plays a crucial role in **membrane biogenesis** — it manufactures new membrane components (phospholipids) that are then distributed to other organelles. The ER lumen provides a separate compartment for **quality control** of newly synthesized proteins.\n\n' +
        'For NEET, note that the ER is connected to the **outer nuclear membrane** at one end and extends into the cytoplasm, forming a continuous channel system called the **endomembrane system** along with the Golgi, lysosomes, and vacuoles.',
      analogy:
        'Think of the ER as Amazon\'s warehouse and delivery network inside the cell. The RER is like the packaging section where products (proteins) are assembled, labeled, and boxed by workers (ribosomes). The SER is like the chemical processing unit that handles oil-based products (lipids) and disposes of hazardous waste (detoxification). Both sections connect to the main office (nucleus) and ship goods via delivery trucks (vesicles) to the sorting center (Golgi).',
      examRelevance:
        'Regularly tested in NEET. Questions focus on differences between RER and SER, functions of each type, the concept of endomembrane system, and which cells have abundant RER or SER. Often combined with Golgi apparatus questions.',
      commonMistakes: [
        'Saying SER has ribosomes — only RER has ribosomes attached to its surface.',
        'Forgetting that the sarcoplasmic reticulum in muscle cells is a specialized form of SER that stores calcium ions.',
        'Not recognizing that the ER is part of the endomembrane system but mitochondria and chloroplasts are NOT part of it.',
      ],
      quickRecap:
        'RER has 80S ribosomes for protein synthesis and transport; SER lacks ribosomes and handles lipid synthesis, detoxification, and calcium storage.\nThe ER is the largest membrane-bound organelle, forms part of the endomembrane system, and is continuous with the outer nuclear membrane.',
    },
    {
      conceptTag: 'nucleus',
      subjectId: 'botany',
      chapterId: 'botany-cell-biology',
      title: 'Nucleus — The Control Centre of the Cell',
      explanation:
        'The **nucleus** is the **double-membrane-bound** organelle that serves as the **control centre** of the eukaryotic cell. It houses the cell\'s **genetic material (DNA)** and directs all cellular activities including growth, metabolism, and reproduction.\n\n' +
        'The **nuclear envelope** consists of **two parallel membranes** — the outer membrane is continuous with the RER and may bear ribosomes, while the inner membrane is smooth. The envelope is perforated by **nuclear pores** that regulate the transport of molecules (mRNA, proteins, ribosomes) between the nucleus and cytoplasm. The space between the two membranes is called the **perinuclear space**.\n\n' +
        'Inside the nucleus, DNA is organized with **histone proteins** into a complex called **chromatin**. During cell division, chromatin condenses into visible **chromosomes**. The DNA in the nucleus carries the **genes** — the hereditary units that encode instructions for all protein synthesis.\n\n' +
        'The **nucleolus** is a dense, non-membrane-bound structure within the nucleus. It is the site of **ribosomal RNA (rRNA) synthesis** and **ribosome assembly**. Cells with high protein synthesis demands (like secretory cells) often have a **prominent nucleolus**. A nucleus may contain more than one nucleolus.\n\n' +
        'The semi-fluid ground substance of the nucleus is called the **nucleoplasm** (or karyoplasm), which contains nucleotides, enzymes (like DNA polymerase and RNA polymerase), and minerals.\n\n' +
        'For NEET, remember that mature **sieve tube elements** in plants and mature **RBCs** in mammals are examples of cells that **lack a nucleus** but remain functional.',
      analogy:
        'The nucleus is like the principal\'s office in your school. The principal (DNA) stores all the rules and plans. The office walls (nuclear envelope) have a door with a guard (nuclear pores) who checks what goes in and out. The notice board inside (nucleolus) is where new announcements (rRNA) are drafted before being sent to classrooms (ribosomes) across the school (cytoplasm).',
      examRelevance:
        'High-yield NEET topic. Questions appear on the structure of the nuclear envelope, nuclear pores, nucleolus function, chromatin vs chromosome, and examples of enucleated cells. Also tested in context of DNA packaging and gene expression.',
      commonMistakes: [
        'Saying the nucleolus is membrane-bound — it is NOT surrounded by any membrane.',
        'Confusing chromatin (diffuse, interphase) with chromosomes (condensed, dividing phase) — they are the same material in different states.',
        'Forgetting that the outer nuclear membrane is continuous with the RER and may have ribosomes on it.',
      ],
      quickRecap:
        'The nucleus is a double-membrane-bound organelle containing DNA (as chromatin/chromosomes), a nucleolus (site of rRNA synthesis), and nucleoplasm.\nNuclear pores regulate molecular traffic; mature sieve tubes and mammalian RBCs are notable examples of functional enucleated cells.',
    },
    {
      conceptTag: 'chloroplast',
      subjectId: 'botany',
      chapterId: 'botany-cell-biology',
      title: 'Chloroplast — The Site of Photosynthesis',
      explanation:
        '**Chloroplasts** are **double-membrane-bound**, lens-shaped organelles found in the **mesophyll cells** of green plant leaves and other photosynthetic tissues. They are the site of **photosynthesis** — the process that converts **light energy** into **chemical energy** (glucose).\n\n' +
        'The **outer membrane** is permeable to small molecules, while the **inner membrane** is more selective. Inside the inner membrane lies the **stroma**, a gel-like matrix containing enzymes for the **Calvin cycle (dark reaction/light-independent reaction)**, along with **circular DNA**, **70S ribosomes**, and starch granules. Like mitochondria, chloroplasts are **semi-autonomous** organelles.\n\n' +
        'Within the stroma, there is a system of **thylakoids** — flattened, membrane-bound sacs. Thylakoids stacked together form **grana** (singular: granum), and the thylakoids connecting different grana are called **stroma lamellae** (or intergranal thylakoids). The **thylakoid membrane** contains the photosynthetic pigments: **chlorophyll a** (primary pigment), **chlorophyll b**, **carotenoids**, and **xanthophylls**. These pigments are organized into **Photosystem I (PS I, P700)** and **Photosystem II (PS II, P680)**.\n\n' +
        'The **light reactions** occur on the **thylakoid membrane** (production of ATP and NADPH via photophosphorylation), while the **dark reactions (Calvin cycle)** occur in the **stroma** (CO2 fixation into glucose using the enzyme **RuBisCO**).\n\n' +
        'For NEET, remember that chloroplasts originated from **cyanobacteria** via endosymbiosis, and the number of chloroplasts per cell varies (mesophyll cells may have 20-40 chloroplasts).',
      analogy:
        'A chloroplast is like a solar panel system on your rooftop. The solar panels themselves (thylakoid membranes with pigments) capture sunlight and convert it to electricity (ATP and NADPH). This electricity then powers a mini food-processing unit downstairs (stroma) where raw ingredients (CO2 and water) are turned into ready-to-eat food packets (glucose). The stacked panels (grana) maximize the surface area to capture more sunlight — just like stacking multiple panels on a roof.',
      examRelevance:
        'Extremely important for NEET. Expect questions on the structure of chloroplasts, location of light vs dark reactions, PS I vs PS II, pigments, and the semi-autonomous nature. Frequently combined with photosynthesis questions for 3-4 marks.',
      commonMistakes: [
        'Confusing where light and dark reactions occur — light reactions happen on thylakoid membranes, dark reactions in the stroma.',
        'Mixing up PS I (P700) and PS II (P680) — PS II has a lower number but was discovered second; PS II comes first in the Z-scheme.',
        'Forgetting that chloroplasts have 70S ribosomes and circular DNA, making them semi-autonomous (not 80S ribosomes).',
      ],
      quickRecap:
        'Chloroplasts are double-membrane, semi-autonomous organelles with thylakoids (stacked into grana) for light reactions and stroma for the Calvin cycle.\nThey contain chlorophyll a/b, carotenoids, 70S ribosomes, circular DNA, and house both PS I (P700) and PS II (P680) on thylakoid membranes.',
    },

    // ── Plant Anatomy (6 concepts) ─────────────────────────────────────
    {
      conceptTag: 'xylem',
      subjectId: 'botany',
      chapterId: 'botany-plant-anatomy',
      title: 'Xylem — Water Transport System',
      explanation:
        '**Xylem** is a complex, **permanent tissue** responsible for the **unidirectional transport of water and dissolved minerals** from roots to aerial parts of the plant. It is one of the two main **vascular tissues** (the other being phloem).\n\n' +
        'Xylem consists of four types of cells: **tracheids**, **vessels (tracheae)**, **xylem parenchyma**, and **xylem fibres**. **Tracheids** are elongated, spindle-shaped cells with **tapered ends** and **pits** (not open perforations). They are found in **all vascular plants** and are the only water-conducting elements in most **gymnosperms** and **pteridophytes**. **Vessels** are wider, shorter, tubular cells with **open perforations** at their end walls, forming continuous tubes. They are found mainly in **angiosperms** and are more efficient at water conduction than tracheids.\n\n' +
        'Both tracheids and vessels are **dead cells** with **lignified secondary walls**, which provide mechanical strength. **Xylem parenchyma** is the only **living** component of xylem, involved in storage of starch and fats and in lateral conduction of water. **Xylem fibres** provide additional mechanical support.\n\n' +
        'Water moves upward through xylem primarily by **transpiration pull** (the cohesion-tension theory proposed by **Dixon and Joly**). As water evaporates from leaves (transpiration), a negative pressure (tension) is created that pulls water upward. **Cohesion** (water-water attraction) and **adhesion** (water-wall attraction) maintain the continuous water column.\n\n' +
        'For NEET, note that **primary xylem** is of two types: **protoxylem** (first formed, narrower) and **metaxylem** (later formed, wider).',
      analogy:
        'Xylem is like the water pipeline system in a tall building. The main pipes (vessels) are wide, hollow, and connected end to end — water rushes through them fast, like how municipal water pipelines deliver water to each floor. The smaller backup pipes (tracheids) are narrower with filters (pits) at connections, slowing flow but still functional. The pump that drives water up? That is transpiration pull — like the suction created when you drink from a straw.',
      examRelevance:
        'Very high-yield NEET topic. Questions on tracheids vs vessels, living vs dead components, transpiration pull (cohesion-tension theory), protoxylem vs metaxylem, and lignification appear frequently. Expect 1-2 direct questions.',
      commonMistakes: [
        'Saying all xylem cells are dead — xylem parenchyma is the living component of xylem.',
        'Confusing tracheids (tapered, pits, all vascular plants) with vessels (open perforations, mainly angiosperms).',
        'Forgetting that gymnosperm wood mainly has tracheids and lacks true vessels (except in some like Ephedra and Gnetum).',
      ],
      quickRecap:
        'Xylem transports water unidirectionally upward via dead tracheids and vessels (xylem parenchyma is living); vessels are wider with open perforations, mainly in angiosperms.\nWater ascent is driven by transpiration pull (cohesion-tension theory by Dixon and Joly), aided by cohesion and adhesion forces.',
    },
    {
      conceptTag: 'phloem',
      subjectId: 'botany',
      chapterId: 'botany-plant-anatomy',
      title: 'Phloem — Food Transport System',
      explanation:
        '**Phloem** is a complex, **permanent tissue** responsible for the **bidirectional transport of organic food** (mainly **sucrose**) from the site of synthesis (source — usually leaves) to the site of utilization or storage (sink — roots, fruits, growing tips). This process is called **translocation**.\n\n' +
        'Phloem consists of four types of cells: **sieve tube elements**, **companion cells**, **phloem parenchyma**, and **phloem fibres (bast fibres)**. **Sieve tube elements** are elongated, living cells that lack a **nucleus** and have **sieve plates** (perforated end walls) that allow cytoplasmic connections between adjacent cells. Despite lacking a nucleus, sieve tubes remain alive and functional, relying on **companion cells** for metabolic support.\n\n' +
        '**Companion cells** are **nucleated**, metabolically active cells connected to sieve tubes through **plasmodesmata**. They provide the ATP and proteins needed for phloem loading and unloading. **Phloem parenchyma** stores food (starch, fats) and assists in lateral transport. **Phloem fibres** (bast fibres like jute and hemp) provide mechanical strength and are **dead** sclerenchyma cells.\n\n' +
        'The mechanism of food transport in phloem is explained by the **Pressure Flow (Mass Flow) Hypothesis** proposed by **Ernst Munch**. According to this, sugars are actively loaded into sieve tubes at the source (creating high osmotic pressure), and water follows by osmosis, generating a positive **turgor pressure** that pushes the solution toward the sink where sugars are unloaded.\n\n' +
        'For NEET, remember that phloem fibres are the only **dead** component of phloem, while in xylem, parenchyma is the only **living** component.',
      analogy:
        'Phloem works like Zomato\'s food delivery network. The kitchen (leaf/source) prepares food (sucrose) and loads it into delivery bags (sieve tubes). The delivery partner\'s phone (companion cell) manages the navigation, order updates, and communication. The food travels through connected roads (sieve plates) to reach your home (sink/root). Unlike a one-way highway (xylem), Zomato riders can go both ways — delivering food from any restaurant to any location.',
      examRelevance:
        'High-frequency NEET topic. Questions on sieve tubes vs companion cells, phloem transport mechanism (Munch hypothesis), living vs dead components, and comparison with xylem are very common. The difference table between xylem and phloem is a NEET favourite.',
      commonMistakes: [
        'Saying sieve tube elements have a nucleus — they are enucleated (lack nucleus) but are still living cells.',
        'Confusing unidirectional transport in xylem with bidirectional transport in phloem.',
        'Forgetting that phloem fibres (bast fibres) are the only dead component of phloem — students often assume all phloem cells are living.',
      ],
      quickRecap:
        'Phloem translocates food bidirectionally via living sieve tubes (enucleated) supported by companion cells; phloem fibres are the only dead component.\nTransport follows the Pressure Flow Hypothesis (Munch) — sugars are loaded at the source creating turgor pressure that pushes sap toward the sink.',
    },
    {
      conceptTag: 'meristematic-tissue',
      subjectId: 'botany',
      chapterId: 'botany-plant-anatomy',
      title: 'Meristematic Tissue — Growth Regions',
      explanation:
        '**Meristematic tissues** are groups of **actively dividing, undifferentiated cells** found in specific regions of the plant body called **meristems**. These tissues are responsible for **plant growth** — both in length and girth.\n\n' +
        'Meristematic cells have distinct features: they are **small and isodiametric** (roughly equal dimensions), have **thin cellulosic walls**, a **dense cytoplasm** with a **large prominent nucleus**, and lack **vacuoles** (or have very small ones). They do not have **intercellular spaces** and are **compactly arranged**.\n\n' +
        'Based on position, meristems are classified into three types:\n\n' +
        '1. **Apical meristems** — Located at the **tips of roots and shoots**. They are responsible for **primary growth** (increase in length). The root apical meristem is protected by the **root cap**, and the shoot apical meristem produces leaves and flowers.\n\n' +
        '2. **Lateral meristems** — Located on the **sides** (parallel to the longitudinal axis). Examples include **vascular cambium** and **cork cambium**. They are responsible for **secondary growth** (increase in girth/diameter), found mainly in **dicots and gymnosperms**.\n\n' +
        '3. **Intercalary meristems** — Located at the **base of internodes** or leaf bases, particularly in **grasses** and **monocots**. They allow rapid **regrowth** after grazing or mowing. Intercalary meristems are actually detached portions of the apical meristem.\n\n' +
        'Based on origin, meristems can be **promeristem** (embryonic), **primary meristem** (from promeristem, forms primary tissues), or **secondary meristem** (from dedifferentiation of permanent tissues, like cambium).',
      analogy:
        'Meristematic tissue is like a construction crew that never stops building. The apical meristem is the crew working at the top floor (tips) adding new stories (length). The lateral meristem is a separate crew reinforcing the walls from the sides to make the building wider (girth). The intercalary meristem is like an emergency repair crew stationed between floors (internodes) — if a floor gets damaged (grass gets cut), they quickly rebuild it.',
      examRelevance:
        'Regularly tested in NEET. Questions focus on characteristics of meristematic cells, types based on position, the difference between primary and secondary meristems, and which meristems are responsible for primary vs secondary growth.',
      commonMistakes: [
        'Saying meristematic cells have large vacuoles — they have NO vacuoles or very small ones; large vacuoles are a feature of mature/permanent cells.',
        'Confusing intercalary meristems with lateral meristems — intercalary are between nodes (in grasses), lateral are on the sides (cambium).',
        'Assuming monocots undergo secondary growth — they generally lack lateral meristems (vascular cambium), so secondary growth is rare in monocots.',
      ],
      quickRecap:
        'Meristematic tissues are actively dividing, undifferentiated cells with thin walls, dense cytoplasm, no vacuoles; classified as apical (length), lateral (girth), and intercalary (regrowth).\nApical meristems drive primary growth; lateral meristems (cambium) drive secondary growth mainly in dicots and gymnosperms.',
    },
    {
      conceptTag: 'stomata',
      subjectId: 'botany',
      chapterId: 'botany-plant-anatomy',
      title: 'Stomata — Gas Exchange and Transpiration',
      explanation:
        '**Stomata** (singular: stoma) are tiny **pore-like openings** found primarily on the **epidermis of leaves** (and sometimes on young stems). They are the primary structures for **gas exchange** (CO2 intake for photosynthesis, O2 release) and **transpiration** (regulated water vapour loss).\n\n' +
        'Each stoma consists of a **pore** flanked by two specialized, **bean-shaped (kidney-shaped)** cells called **guard cells**. Guard cells are the only **epidermal cells that contain chloroplasts**, enabling them to photosynthesize. In **grasses and monocots**, guard cells are **dumbbell-shaped** instead of bean-shaped, and are accompanied by **subsidiary cells**.\n\n' +
        'The mechanism of stomatal opening and closing depends on the **turgor pressure** of guard cells. When guard cells **absorb water** (become turgid), their **thin outer walls** stretch more than the **thick inner walls**, causing the pore to **open**. When guard cells **lose water** (become flaccid), they straighten and the pore **closes**.\n\n' +
        'The **K+ ion theory** (by Levitt) is the most accepted mechanism: in the presence of light, **K+ ions** are actively pumped into guard cells, lowering their **water potential**, causing **osmotic uptake of water**, leading to turgidity and stomatal opening. In darkness, K+ ions move out, and stomata close.\n\n' +
        'Most plants have **more stomata on the lower epidermis** (hypostomatic) to reduce water loss. **Floating aquatic plants** (like water lily/Nelumbo) have stomata only on the **upper surface** (epistomatic). Stomata typically remain **open during the day and closed at night**, except in **CAM plants** (succulents like cacti) where stomata open at night to conserve water.',
      analogy:
        'Stomata work like automatic sliding doors in a metro station. When rush hour hits (sunlight), the sensors (K+ ions) trigger the doors (guard cells) to open, letting passengers (CO2, O2, water vapour) flow through. When the station closes at night (darkness), the doors shut to conserve energy and security. In desert metro stations (CAM plants), the doors operate on a reverse schedule — opening at night when it is cooler.',
      examRelevance:
        'Very high-yield for NEET. Questions on guard cell structure, mechanism of opening/closing (K+ ion theory), stomatal distribution, and exceptions like CAM plants appear very frequently. Also tested in transpiration and photosynthesis contexts.',
      commonMistakes: [
        'Saying all epidermal cells have chloroplasts — only guard cells among epidermal cells contain chloroplasts.',
        'Forgetting that CAM plants open stomata at night (not day) — this is a frequently tested exception.',
        'Confusing the thick inner wall with the outer wall of guard cells — the inner wall (facing the pore) is thick, the outer wall is thin.',
      ],
      quickRecap:
        'Stomata are epidermal pores flanked by chloroplast-containing guard cells (bean-shaped in dicots, dumbbell-shaped in monocots) that regulate gas exchange and transpiration.\nOpening is driven by K+ ion influx causing turgidity; stomata are usually open in day and closed at night, except in CAM plants which reverse this pattern.',
    },
    {
      conceptTag: 'root-structure',
      subjectId: 'botany',
      chapterId: 'botany-plant-anatomy',
      title: 'Root Structure — Internal Anatomy',
      explanation:
        'The internal structure of a **dicot root** (as seen in a transverse section) reveals several distinct regions arranged from outside to inside: **epiblema (epidermis)**, **cortex**, **endodermis**, **pericycle**, **vascular bundles**, and **pith**.\n\n' +
        'The outermost layer is the **epiblema** (also called rhizodermis), a single layer of thin-walled cells. Some cells extend outward to form **root hairs** — unicellular extensions that vastly increase the **surface area for water and mineral absorption**. Root hairs are short-lived and are continuously replaced.\n\n' +
        'Below the epiblema lies the **cortex**, a multilayered zone of **parenchymatous cells** with prominent **intercellular spaces**. It stores food and allows the inward movement of water through the **apoplast and symplast pathways**.\n\n' +
        'The innermost layer of the cortex is the **endodermis**, a single layer of barrel-shaped cells. Endodermal cells possess the **Casparian strip** (or Casparian band) — a band of **suberin** (waxy, hydrophobic substance) deposited on the **radial and tangential walls**. The Casparian strip is crucial as it **blocks the apoplastic pathway**, forcing water and dissolved minerals to pass through the symplast (cell cytoplasm), thereby acting as a **checkpoint** for selective mineral uptake. Some endodermal cells opposite the protoxylem lack suberization and are called **passage cells** (or transfusion cells).\n\n' +
        'Inside the endodermis is the **pericycle**, which gives rise to **lateral roots** (making lateral root origin **endogenous**). The vascular bundles in roots are **radial** — xylem and phloem alternate on separate radii. The centre may have **pith** (small in dicots, large in monocots).\n\n' +
        'The **root cap** protects the **root apical meristem** at the very tip of the root.',
      analogy:
        'A root in cross-section is like the layers of security at an IPL cricket stadium. The outer gate (epiblema with root hairs) is where tickets (water) first enter. The wide corridor inside (cortex) is the general walkway. Then comes the strict security check (endodermis with Casparian strip) — everyone must pass through the scanner (symplast), no sneaking through side doors (apoplast blocked). The VIP enclosure manager (pericycle) can open new entry points (lateral roots). Inside, the plumbing (xylem) and food stalls (phloem) alternate around the central lounge (pith).',
      examRelevance:
        'High-frequency NEET topic. Questions on the Casparian strip, passage cells, radial vascular bundles, endogenous origin of lateral roots from pericycle, and differences between dicot and monocot root anatomy are asked regularly.',
      commonMistakes: [
        'Confusing the Casparian strip location — it is on the radial and tangential walls of endodermal cells, not on all walls.',
        'Saying lateral roots arise from cortex — they arise from the pericycle (endogenous origin).',
        'Forgetting passage cells — these are unsuberized endodermal cells opposite protoxylem that allow water passage.',
      ],
      quickRecap:
        'Root anatomy from outside: epiblema (root hairs) > cortex > endodermis (Casparian strip of suberin blocks apoplast) > pericycle (origin of lateral roots) > radial vascular bundles.\nThe Casparian strip forces selective symplastic transport; passage cells opposite protoxylem remain unsuberized; root cap protects the apical meristem.',
    },
    {
      conceptTag: 'secondary-growth',
      subjectId: 'botany',
      chapterId: 'botany-plant-anatomy',
      title: 'Secondary Growth — Increase in Girth',
      explanation:
        '**Secondary growth** is the increase in **girth (diameter)** of stems and roots, primarily in **dicots and gymnosperms**. It is driven by two **lateral meristems**: the **vascular cambium** and the **cork cambium (phellogen)**.\n\n' +
        'The **vascular cambium** is a **cylindrical meristematic layer** located between the **primary xylem and primary phloem**. It is formed by the joining of **intrafascicular cambium** (within vascular bundles) and **interfascicular cambium** (between bundles, from medullary ray cells). The vascular cambium divides to produce **secondary xylem** (wood) toward the **inside** and **secondary phloem** toward the **outside**. More secondary xylem is produced than secondary phloem.\n\n' +
        'The **cork cambium (phellogen)** arises from the outer cortical or epidermal cells through **dedifferentiation**. It produces **cork (phellem)** toward the outside and **secondary cortex (phelloderm)** toward the inside. Cork cells are dead, compactly arranged, and impregnated with **suberin**, making them impervious to water — forming a protective barrier. Together, phellem + phellogen + phelloderm form the **periderm**. The **bark** includes all tissues outside the vascular cambium — secondary phloem + periderm.\n\n' +
        '**Annual rings** (growth rings) are visible in the secondary xylem because of differences between **spring wood** (early wood — wider vessels, lighter, formed in favourable season) and **autumn wood** (late wood — narrower vessels, darker, formed in less favourable season). One ring of spring wood + one ring of autumn wood = **one year of growth**. Counting annual rings reveals the **age of a tree** (a technique called **dendrochronology**).\n\n' +
        '**Lenticels** are small openings in the bark that allow **gas exchange** in woody stems, replacing the function of stomata.',
      analogy:
        'Secondary growth is like a tree adding layers to itself the way you add covers to your phone. The vascular cambium is like a factory sandwiched between the old inner case (primary xylem) and outer case (primary phloem), continuously printing new inner layers (secondary xylem/wood) and thin outer layers (secondary phloem). The cork cambium is like adding a new rugged back cover (bark) on top for protection. Each year a new layer is added — you can count them (annual rings) like counting how many screen guards you have gone through to know the phone\'s age.',
      examRelevance:
        'Very important for NEET. Questions on the origin and products of vascular cambium and cork cambium, formation of annual rings (spring vs autumn wood), bark composition, lenticels, and why monocots lack secondary growth are commonly asked.',
      commonMistakes: [
        'Confusing spring wood (early wood — wider, lighter) with autumn wood (late wood — narrower, darker) — spring wood has wider vessels because more water is available.',
        'Saying bark is just cork — bark includes everything outside the vascular cambium (secondary phloem + periderm).',
        'Assuming all plants undergo secondary growth — monocots generally lack vascular cambium and therefore do not undergo typical secondary growth.',
      ],
      quickRecap:
        'Secondary growth is driven by vascular cambium (produces secondary xylem inward, secondary phloem outward) and cork cambium (produces cork outward, secondary cortex inward).\nAnnual rings form from alternating spring wood (wide vessels) and autumn wood (narrow vessels); bark = all tissues outside vascular cambium; lenticels enable gas exchange.',
    },
  ],
};
