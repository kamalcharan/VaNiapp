import { ChapterExplanations } from '../../types';

export const zoologyHumanPhysiologyExplanations: ChapterExplanations = {
  chapterId: 'zoology-human-physiology',
  subjectId: 'zoology',
  entries: [
    // ── zoo-hp-001: Largest organ in human body (correct: b = skin) ──

    {
      questionId: 'zoo-hp-001',
      selectedOptionId: 'a',
      misconception:
        'You confused the largest *internal* organ with the largest organ overall. The liver is the largest internal organ, but the skin covers the entire body surface and outweighs it significantly.',
      correctReasoning:
        'The skin is the largest organ of the human body, weighing about 3.5-4 kg in adults and covering roughly 1.5-2 m² of surface area. The liver, while the largest *glandular* and largest *internal* organ (~1.5 kg), is much smaller than the skin.',
      tip: 'NEET loves the "largest" tag -- remember: largest organ = skin, largest gland = liver, largest endocrine gland = thyroid.',
      conceptTag: 'organ-systems',
    },
    {
      questionId: 'zoo-hp-001',
      selectedOptionId: 'c',
      misconception:
        'You may have thought the brain qualifies because of its importance, but "largest" refers to physical size and weight, not functional significance.',
      correctReasoning:
        'The brain weighs about 1.3-1.4 kg, which is far less than the skin (3.5-4 kg). The skin is the largest organ because it forms a continuous sheet covering the entire external surface of the body.',
      tip: 'Don\'t confuse "most important" with "largest." Size questions in NEET are always about physical dimensions or weight.',
      conceptTag: 'organ-systems',
    },
    {
      questionId: 'zoo-hp-001',
      selectedOptionId: 'd',
      misconception:
        'The heart is a vital organ but it is relatively small -- roughly the size of your fist. Students sometimes pick it because of its life-sustaining role.',
      correctReasoning:
        'The human heart weighs only about 250-350 g. The skin, at 3.5-4 kg and ~2 m² surface area, is many times larger. Skin performs protection, thermoregulation, sensation, and excretion -- it is a full organ, not just a covering.',
      tip: 'Heart = size of your closed fist. Skin = wraps your entire body. Quick mental picture settles this instantly.',
      conceptTag: 'organ-systems',
    },

    // ── zoo-hp-003: Oxygen carried by (correct: a = hemoglobin in RBC) ──

    {
      questionId: 'zoo-hp-003',
      selectedOptionId: 'b',
      misconception:
        'WBCs are part of blood but they fight infections (immunity). They do not carry oxygen. You likely mixed up cell types because both RBCs and WBCs are blood cells.',
      correctReasoning:
        'Oxygen is transported by hemoglobin, a red iron-containing pigment found inside RBCs. Each hemoglobin molecule can bind 4 O2 molecules, forming oxyhemoglobin. WBCs (leukocytes) are involved in immune defense, not gas transport.',
      tip: 'RBC = Red = carries Red hemoglobin = carries O2. WBC = White = War against pathogens. Colour-code your memory!',
      conceptTag: 'blood-components',
    },
    {
      questionId: 'zoo-hp-003',
      selectedOptionId: 'c',
      misconception:
        'Platelets (thrombocytes) are cell fragments involved in blood clotting, not oxygen transport. This is a common confusion because platelets are also found in blood.',
      correctReasoning:
        'Hemoglobin inside RBCs is the exclusive oxygen carrier in blood. Platelets are tiny cell fragments from megakaryocytes that help form clots at wound sites by aggregating and releasing clotting factors.',
      tip: 'Platelets = Plates that "plug" wounds. They clot, they don\'t carry gas. Stick to this mnemonic.',
      conceptTag: 'blood-components',
    },
    {
      questionId: 'zoo-hp-003',
      selectedOptionId: 'd',
      misconception:
        'Plasma does carry some dissolved CO2 and O2, but the vast majority (97%) of oxygen is carried by hemoglobin, not dissolved directly in plasma.',
      correctReasoning:
        'Only about 3% of oxygen dissolves directly in plasma. The remaining 97% binds to hemoglobin in RBCs as oxyhemoglobin (HbO2). Without hemoglobin, blood could not supply tissues with enough oxygen to survive.',
      tip: 'Plasma carries dissolved nutrients, hormones, and waste -- but for O2 transport, hemoglobin is the star player (97%).',
      conceptTag: 'blood-components',
    },

    // ── zoo-hp-006: Pacemaker of the heart (correct: c = SA node) ──

    {
      questionId: 'zoo-hp-006',
      selectedOptionId: 'a',
      misconception:
        'The AV node is part of the conduction system, but it is the *relay station* that delays the impulse so atria finish contracting before ventricles start. It is not the primary pacemaker.',
      correctReasoning:
        'The SA (sinoatrial) node, located in the right atrium, generates impulses at 70-75 beats/min and is called the pacemaker. The AV node receives the signal from the SA node and delays it by ~0.1 s before passing it to the Bundle of His.',
      tip: 'SA = Starter/Auto-starter of heartbeat. AV = Acts as a Valve/delay gate. The one that starts it is the pacemaker.',
      conceptTag: 'cardiac-cycle',
    },
    {
      questionId: 'zoo-hp-006',
      selectedOptionId: 'b',
      misconception:
        'The Bundle of His conducts impulses from the AV node to the ventricular septum. It is a conduction pathway, not the origin of the heartbeat.',
      correctReasoning:
        'The SA node initiates the cardiac impulse. The signal travels: SA node -> AV node -> Bundle of His -> bundle branches -> Purkinje fibers. The Bundle of His only relays the impulse downward into the ventricles.',
      tip: 'Think of the conduction system as a relay race: SA starts, AV delays, Bundle of His carries, Purkinje delivers.',
      conceptTag: 'cardiac-cycle',
    },
    {
      questionId: 'zoo-hp-006',
      selectedOptionId: 'd',
      misconception:
        'Purkinje fibers are the final part of the conduction system that spread the impulse across ventricular walls. They cause ventricular contraction but do not generate the original beat.',
      correctReasoning:
        'Purkinje fibers are specialized cardiac muscle fibers that distribute the electrical impulse rapidly through the ventricular myocardium. The impulse originates at the SA node, which has the highest intrinsic firing rate.',
      tip: 'Purkinje = the "last-mile delivery" of heartbeat signal. SA node = the "order origin." NEET always asks the origin.',
      conceptTag: 'cardiac-cycle',
    },

    // ── zoo-hp-009: Enzyme in saliva (correct: d = salivary amylase) ──

    {
      questionId: 'zoo-hp-009',
      selectedOptionId: 'a',
      misconception:
        'Pepsin is a protein-digesting enzyme found in gastric juice (stomach), not in saliva. Students often list digestive enzymes without matching them to the correct location.',
      correctReasoning:
        'Saliva contains salivary amylase (ptyalin), which breaks down starch into maltose in the mouth at an optimal pH of 6.8. Pepsin works in the stomach at pH 1.5-2.0 and digests proteins into peptides.',
      tip: 'Mouth = Amylase (starch). Stomach = Pepsin (protein). Match enzyme to organ -- a guaranteed NEET question.',
      conceptTag: 'digestive-enzymes',
    },
    {
      questionId: 'zoo-hp-009',
      selectedOptionId: 'b',
      misconception:
        'Trypsin is a pancreatic enzyme that acts in the small intestine, not the mouth. You may have confused it because both trypsin and amylase digest food, but they act at different sites.',
      correctReasoning:
        'Trypsin is secreted by the pancreas as inactive trypsinogen, which is activated by enterokinase in the duodenum. It digests proteins in an alkaline medium (pH ~8). Salivary amylase is the enzyme present in saliva.',
      tip: 'Trypsin = pancreaTic. The "T" connects them. Saliva = amylase. Lock these pairs before the exam.',
      conceptTag: 'digestive-enzymes',
    },
    {
      questionId: 'zoo-hp-009',
      selectedOptionId: 'c',
      misconception:
        'Lipase digests fats, and while a trace amount (lingual lipase) exists in saliva, the primary and exam-relevant salivary enzyme is always salivary amylase.',
      correctReasoning:
        'The dominant enzyme in saliva is salivary amylase (ptyalin), which initiates starch digestion. Pancreatic lipase is the major fat-digesting enzyme acting in the small intestine with the help of bile salts.',
      tip: 'If NEET says "enzyme in saliva" the answer is ALWAYS salivary amylase. Lingual lipase is too minor to be the answer.',
      conceptTag: 'digestive-enzymes',
    },

    // ── zoo-hp-012: Functional unit of kidney (correct: b = nephron) ──

    {
      questionId: 'zoo-hp-012',
      selectedOptionId: 'a',
      misconception:
        'Neuron sounds very similar to nephron, but a neuron is the functional unit of the *nervous system*. This is one of the most common mix-ups in biology exams due to similar spelling.',
      correctReasoning:
        'The nephron is the structural and functional unit of the kidney. Each kidney contains about 1 million nephrons. A nephron consists of Bowman\'s capsule, PCT, loop of Henle, DCT, and collecting duct, and performs filtration, reabsorption, and secretion.',
      tip: 'Nephron = Kidney (Nephro- means kidney in Greek). Neuron = Nerve. Spell them out and underline the difference.',
      conceptTag: 'nephron',
    },
    {
      questionId: 'zoo-hp-012',
      selectedOptionId: 'c',
      misconception:
        'An alveolus is the functional unit of the lungs (gas exchange), not the kidney. You may have confused organ functional units because they are often tested together.',
      correctReasoning:
        'The nephron is the functional unit of the kidney responsible for urine formation. Alveoli are tiny air sacs in the lungs where O2 and CO2 exchange occurs across a thin respiratory membrane.',
      tip: 'Make a table: Kidney=Nephron, Lung=Alveolus, Liver=Hepatic lobule, Nerve=Neuron. This table alone can fetch 2-3 marks.',
      conceptTag: 'nephron',
    },
    {
      questionId: 'zoo-hp-012',
      selectedOptionId: 'd',
      misconception:
        'Villi are finger-like projections in the small intestine that increase surface area for absorption. They are not the functional unit of the kidney.',
      correctReasoning:
        'Nephrons in the kidney filter blood and produce urine through three processes: glomerular filtration, tubular reabsorption, and tubular secretion. Villi and microvilli are structural features of the small intestinal lining for nutrient absorption.',
      tip: 'Villus = intestinal absorption. Nephron = kidney filtration. NEET pairs functional units with organs every year.',
      conceptTag: 'nephron',
    },

    // ── zoo-hp-016: Insulin secreted by (correct: a = beta cells of pancreas) ──

    {
      questionId: 'zoo-hp-016',
      selectedOptionId: 'b',
      misconception:
        'Alpha cells of the Islets of Langerhans secrete glucagon (raises blood sugar), not insulin. Students often swap alpha and beta cell functions.',
      correctReasoning:
        'Beta cells of the Islets of Langerhans in the pancreas secrete insulin, which lowers blood glucose by promoting glucose uptake into cells. Alpha cells secrete glucagon, which raises blood glucose by stimulating glycogenolysis in the liver.',
      tip: 'B for Beta, B for "Blood sugar down" (insulin). A for Alpha, A for "Amps up sugar" (glucagon). Alphabetical trick!',
      conceptTag: 'hormonal-regulation',
    },
    {
      questionId: 'zoo-hp-016',
      selectedOptionId: 'c',
      misconception:
        'The liver responds to insulin (stores glucose as glycogen), but it does not secrete insulin. You may have confused the target organ with the source organ.',
      correctReasoning:
        'Insulin is produced by beta cells in the pancreas. The liver is a target organ -- when insulin signals arrive, liver cells take up glucose and store it as glycogen. The liver itself secretes bile and various plasma proteins, not hormones like insulin.',
      tip: 'Pancreas = producer of insulin. Liver = responder/target. NEET often tests source vs. target -- always distinguish.',
      conceptTag: 'hormonal-regulation',
    },
    {
      questionId: 'zoo-hp-016',
      selectedOptionId: 'd',
      misconception:
        'The adrenal gland secretes adrenaline, cortisol, and aldosterone, not insulin. Adrenal hormones deal with stress and mineral balance, not blood sugar regulation via insulin.',
      correctReasoning:
        'Insulin is exclusively secreted by beta cells of the pancreatic Islets of Langerhans. The adrenal medulla secretes adrenaline/noradrenaline (fight-or-flight), and the adrenal cortex secretes cortisol (stress) and aldosterone (sodium balance).',
      tip: 'Adrenal = "Ad-renal" = sits on top of kidney = stress hormones. Pancreas = blood sugar hormones (insulin + glucagon).',
      conceptTag: 'hormonal-regulation',
    },

    // ── zoo-hp-019: Tidal volume (correct: c = air in normal breathing) ──

    {
      questionId: 'zoo-hp-019',
      selectedOptionId: 'a',
      misconception:
        'Maximum air after a forced inhalation describes Inspiratory Reserve Volume (IRV) or relates to Inspiratory Capacity. Tidal volume is the volume during normal, relaxed breathing.',
      correctReasoning:
        'Tidal volume (TV) is the amount of air inspired or expired during normal, quiet breathing -- approximately 500 mL in a healthy adult. IRV is the additional air that can be forcefully inhaled beyond a normal inspiration.',
      tip: 'Tidal = "Tide" = regular, rhythmic, calm. Think of ocean tides -- gentle and normal. That is tidal volume.',
      conceptTag: 'respiratory-volumes',
    },
    {
      questionId: 'zoo-hp-019',
      selectedOptionId: 'b',
      misconception:
        'Residual volume is the air that remains in the lungs even after the most forceful expiration (~1200 mL). It prevents the lungs from collapsing. It is not tidal volume.',
      correctReasoning:
        'Tidal volume (~500 mL) is the air exchanged in each normal breath. Residual volume (~1200 mL) is the air that can never be expelled and keeps alveoli partially inflated. These are two distinct respiratory measurements.',
      tip: 'Residual = "Remains" even after maximum effort. Tidal = normal, everyday breathing volume. Two very different values.',
      conceptTag: 'respiratory-volumes',
    },
    {
      questionId: 'zoo-hp-019',
      selectedOptionId: 'd',
      misconception:
        'Vital capacity is the maximum air that can be exhaled after a maximum inhalation (TV + IRV + ERV). It is a sum of multiple volumes, not a single normal breath.',
      correctReasoning:
        'Vital capacity (VC = TV + IRV + ERV) is about 3500-4500 mL. Tidal volume is just ~500 mL of air moved in one normal breath cycle. VC measures maximum breathing ability, while TV measures routine breathing.',
      tip: 'VC = total usable lung capacity. TV = one calm breath. NEET gives numerical values -- memorize TV=500, RV=1200, VC=3500-4500.',
      conceptTag: 'respiratory-volumes',
    },

    // ── zoo-hp-023: Synapse transmits via (correct: d = neurotransmitters) ──

    {
      questionId: 'zoo-hp-023',
      selectedOptionId: 'a',
      misconception:
        'Blood transports nutrients and hormones throughout the body, but the synaptic cleft between neurons is not connected to the bloodstream. Signal transmission across a synapse uses chemical messengers, not blood.',
      correctReasoning:
        'At a chemical synapse, the pre-synaptic neuron releases neurotransmitters (e.g., acetylcholine, dopamine) into the synaptic cleft. These bind to receptors on the post-synaptic membrane, generating a new impulse. Blood plays no direct role in synaptic transmission.',
      tip: 'Synapse = tiny gap between neurons filled with neurotransmitters, not blood. Keep neural and circulatory systems separate.',
      conceptTag: 'neural-transmission',
    },
    {
      questionId: 'zoo-hp-023',
      selectedOptionId: 'b',
      misconception:
        'Hormones are chemical messengers used in the endocrine system for long-distance, slow signaling through blood. Synaptic transmission is fast and uses neurotransmitters, not hormones.',
      correctReasoning:
        'Neurotransmitters act locally at the synapse and are rapidly broken down or reabsorbed. Hormones travel through the blood to distant targets and act over minutes to hours. At a synapse, neurotransmitters like acetylcholine transmit signals in milliseconds.',
      tip: 'Neural = neurotransmitters (fast, local). Endocrine = hormones (slow, distant). NEET tests this difference directly.',
      conceptTag: 'neural-transmission',
    },
    {
      questionId: 'zoo-hp-023',
      selectedOptionId: 'c',
      misconception:
        'While the nerve impulse travels as an electrical signal along the axon, at the synapse it must be converted to a chemical signal (neurotransmitters) to cross the gap. Pure electrical current cannot jump across the synaptic cleft.',
      correctReasoning:
        'The signal along a neuron is electrical (action potential), but at the synapse the signal is chemical. Neurotransmitters are released from synaptic vesicles, diffuse across the cleft, and bind to post-synaptic receptors to regenerate the electrical signal.',
      tip: 'Along the nerve = electrical. Across the synapse = chemical (neurotransmitters). This is the "electrical-chemical-electrical" rule.',
      conceptTag: 'neural-transmission',
    },
  ],
};
