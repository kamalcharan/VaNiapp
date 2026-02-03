import { ChapterExplanations } from '../../types';

export const physicsThermodynamicsExplanations: ChapterExplanations = {
  chapterId: 'physics-thermodynamics',
  subjectId: 'physics',
  entries: [
    // phy-thd-001: Zeroth law defines — correct: a (thermal equilibrium / temperature)
    {
      questionId: 'phy-thd-001',
      selectedOptionId: 'b',
      misconception:
        'Confusing the zeroth law with the second law. Students often associate "zeroth" with entropy because entropy feels like a fundamental concept.',
      correctReasoning:
        'The zeroth law of thermodynamics defines thermal equilibrium and provides the basis for temperature measurement. It states that if body A is in thermal equilibrium with body C, and body B is also in equilibrium with body C, then A and B are in equilibrium with each other. Entropy is governed by the second law, not the zeroth.',
      tip: 'Remember the order: Zeroth = temperature, First = energy conservation, Second = entropy, Third = absolute zero. NEET expects you to match each law to its core concept.',
      conceptTag: 'laws-of-thermodynamics',
    },
    {
      questionId: 'phy-thd-001',
      selectedOptionId: 'c',
      misconception:
        'Mixing up the zeroth law with the first law. Energy conservation is the first law of thermodynamics, not the zeroth.',
      correctReasoning:
        'The zeroth law establishes the concept of temperature and thermal equilibrium. Energy conservation (ΔU = Q − W) is the first law of thermodynamics. The zeroth law was named "zeroth" because it was formulated after the first and second laws but is logically more fundamental — it defines temperature itself.',
      tip: 'The zeroth law is about TEMPERATURE, the first law is about ENERGY. If a NEET question asks "which law defines temperature?", the answer is always the zeroth law.',
      conceptTag: 'laws-of-thermodynamics',
    },
    {
      questionId: 'phy-thd-001',
      selectedOptionId: 'd',
      misconception:
        'Thinking the zeroth law describes the direction of heat flow. The natural direction of heat flow (hot to cold) is described by the second law.',
      correctReasoning:
        'The zeroth law defines when heat will NOT flow — that is, when two bodies are at the same temperature (thermal equilibrium). The fact that heat flows from hot to cold is a consequence of the second law of thermodynamics. The zeroth law only tells us about the equivalence of temperatures.',
      tip: 'Zeroth law = "when does heat stop flowing?" (thermal equilibrium). Second law = "which direction does heat flow?" (hot to cold). This distinction appears regularly in NEET.',
      conceptTag: 'laws-of-thermodynamics',
    },

    // phy-thd-004: Internal energy depends on — correct: b (temperature of gas)
    {
      questionId: 'phy-thd-004',
      selectedOptionId: 'a',
      misconception:
        'Thinking internal energy depends only on pressure. While pressure is a state variable, internal energy of an ideal gas is a function of temperature alone.',
      correctReasoning:
        'For an ideal gas, internal energy depends ONLY on temperature (U = nCᵥT). Pressure and volume can change, but if temperature remains the same, internal energy stays constant. This is a direct consequence of the kinetic theory — internal energy is the total kinetic energy of gas molecules, which depends only on temperature.',
      tip: 'Key NEET fact: For an ideal gas, internal energy is a function of temperature ONLY. In an isothermal process, even though P and V change, ΔU = 0 because T is constant.',
      conceptTag: 'internal-energy',
    },
    {
      questionId: 'phy-thd-004',
      selectedOptionId: 'c',
      misconception:
        'Believing internal energy depends only on volume. Students may confuse the role of volume in work (W = PΔV) with its role in internal energy.',
      correctReasoning:
        'Volume affects the work done by or on the gas (W = PΔV), but internal energy of an ideal gas depends solely on temperature. You can change the volume without changing internal energy (isothermal process) or change internal energy without changing volume (isochoric heating). These are independent concepts.',
      tip: 'Volume relates to WORK done (W = PΔV), not to internal energy directly. For NEET: ΔU = nCᵥΔT — notice only temperature appears, not volume.',
      conceptTag: 'internal-energy',
    },
    {
      questionId: 'phy-thd-004',
      selectedOptionId: 'd',
      misconception:
        'Thinking the shape or size of the container affects internal energy. Students may imagine that gas behaves differently in differently shaped containers.',
      correctReasoning:
        'Internal energy of an ideal gas depends only on temperature, not on the container\'s shape, size, or material. Gas molecules move randomly and their total kinetic energy is determined by temperature alone. Whether the container is a sphere, a cylinder, or any other shape makes no difference to the energy of the gas.',
      tip: 'Internal energy is a STATE function — it depends on the state of the gas (temperature), not on the container. NEET uses tricky options like "container shape" to test conceptual clarity.',
      conceptTag: 'internal-energy',
    },

    // phy-thd-007: Isothermal process means — correct: c (constant temperature)
    {
      questionId: 'phy-thd-007',
      selectedOptionId: 'a',
      misconception:
        'Confusing isothermal with isobaric. "Iso" means constant, but the root word matters — "thermal" means temperature, "baric" means pressure.',
      correctReasoning:
        'Isothermal means constant temperature (iso = same, thermal = temperature). An isobaric process is one at constant pressure. In an isothermal process of an ideal gas, PV = constant (Boyle\'s law applies), internal energy stays unchanged, and all heat absorbed equals work done.',
      tip: 'NEET vocabulary: Iso-THERMAL = constant Temperature, Iso-BARIC = constant Pressure (think "barometer"), Iso-CHORIC = constant Volume. The suffix tells you what is constant.',
      conceptTag: 'thermodynamic-processes',
    },
    {
      questionId: 'phy-thd-007',
      selectedOptionId: 'b',
      misconception:
        'Confusing isothermal with isochoric. Students mix up "constant temperature" with "constant volume" because both start with "iso."',
      correctReasoning:
        'Isothermal means constant temperature, while isochoric (or isometric) means constant volume. In an isochoric process, no work is done (W = 0 since ΔV = 0) and all heat goes into changing internal energy. In an isothermal process, volume can change but temperature stays fixed.',
      tip: 'Isochoric = constant Volume (think "chore" — the volume is stuck doing no work). Isothermal = constant Temperature. For NEET, memorise: isochoric → W = 0, isothermal → ΔU = 0.',
      conceptTag: 'thermodynamic-processes',
    },
    {
      questionId: 'phy-thd-007',
      selectedOptionId: 'd',
      misconception:
        'Confusing isothermal with adiabatic. "No heat exchange" describes an adiabatic process (Q = 0), not isothermal.',
      correctReasoning:
        'In an isothermal process, heat exchange DOES occur to maintain constant temperature. For example, slow compression in a conducting container is nearly isothermal — heat escapes to keep temperature constant. An adiabatic process is the one with no heat exchange (Q = 0), where temperature changes as a result.',
      tip: 'Isothermal: temperature constant, heat exchange happens (Q ≠ 0). Adiabatic: no heat exchange (Q = 0), temperature changes. NEET frequently asks you to distinguish these two.',
      conceptTag: 'thermodynamic-processes',
    },

    // phy-thd-010: Entropy of universe — correct: d (always increases)
    {
      questionId: 'phy-thd-010',
      selectedOptionId: 'a',
      misconception:
        'Thinking entropy of the universe stays constant. This would be true only for an idealized reversible process, which never truly occurs in nature.',
      correctReasoning:
        'The second law of thermodynamics states that the total entropy of the universe always increases for any real (irreversible) process. Entropy stays constant only in a perfectly reversible process, which is an idealization. In reality, all natural processes are irreversible, so the entropy of the universe continuously increases.',
      tip: 'For NEET: ΔS(universe) > 0 for irreversible (real) processes, ΔS(universe) = 0 for reversible (ideal) processes. Since all real processes are irreversible, entropy always increases.',
      conceptTag: 'entropy',
    },
    {
      questionId: 'phy-thd-010',
      selectedOptionId: 'b',
      misconception:
        'Thinking entropy can decrease for the universe as a whole. Students confuse local entropy decrease (like a refrigerator cooling things) with total universe entropy.',
      correctReasoning:
        'While the entropy of a particular system can decrease (e.g., water freezing into ice), the entropy of the surroundings increases by an even greater amount. The NET entropy of the universe (system + surroundings) always increases. A refrigerator lowers entropy inside but increases it more in the surroundings via heat released.',
      tip: 'Entropy of a system CAN decrease, but entropy of the UNIVERSE never decreases. NEET may give options like "entropy of a system always increases" — that is wrong. It is the universe\'s entropy that always increases.',
      conceptTag: 'entropy',
    },
    {
      questionId: 'phy-thd-010',
      selectedOptionId: 'c',
      misconception:
        'Believing the total entropy of the universe is zero. Students may confuse this with the idea of entropy being zero at absolute zero (third law).',
      correctReasoning:
        'The entropy of the universe is not zero — it is a large positive quantity that keeps increasing. The third law states that entropy of a perfect crystal at absolute zero is zero, but this applies to a specific substance at 0 K, not to the entire universe. The universe has been accumulating entropy since the Big Bang.',
      tip: 'Third law: entropy of a perfect crystal = 0 at T = 0 K. Second law: entropy of the universe keeps increasing. Do not mix these two laws in NEET.',
      conceptTag: 'entropy',
    },

    // phy-thd-013: Carnot engine efficiency depends on — correct: a (temperatures of reservoirs)
    {
      questionId: 'phy-thd-013',
      selectedOptionId: 'b',
      misconception:
        'Thinking the working substance (type of gas) affects Carnot engine efficiency. Students assume different gases would give different efficiencies.',
      correctReasoning:
        'Carnot engine efficiency depends ONLY on the temperatures of the hot and cold reservoirs: η = 1 − (T_cold/T_hot). It is completely independent of the working substance. Whether you use helium, nitrogen, or any other ideal gas, the maximum possible efficiency remains the same for given reservoir temperatures.',
      tip: 'Carnot efficiency formula: η = 1 − Tc/Th (temperatures in Kelvin). No gas properties appear — it is universal. NEET loves asking what Carnot efficiency does NOT depend on.',
      conceptTag: 'heat-engines',
    },
    {
      questionId: 'phy-thd-013',
      selectedOptionId: 'c',
      misconception:
        'Thinking a bigger engine would be more efficient. Students apply everyday intuition that larger machines perform better.',
      correctReasoning:
        'The size of the engine has no effect on Carnot efficiency. The Carnot cycle is a theoretical limit based on thermodynamic principles, and the efficiency formula η = 1 − Tc/Th contains only temperatures. A small Carnot engine and a large one operating between the same temperatures have identical maximum efficiency.',
      tip: 'Carnot efficiency is a theoretical UPPER LIMIT determined by temperatures alone. Physical size, engine design, or materials do not appear in the formula. This is a common NEET conceptual trap.',
      conceptTag: 'heat-engines',
    },
    {
      questionId: 'phy-thd-013',
      selectedOptionId: 'd',
      misconception:
        'Confusing a Carnot engine (theoretical heat engine) with a real combustion engine that runs on fuel. Students bring in everyday ideas about fuel quality.',
      correctReasoning:
        'A Carnot engine is an idealized theoretical engine that operates on the Carnot cycle between two temperature reservoirs. It does not use "fuel" in the conventional sense — it absorbs heat from a hot reservoir and rejects heat to a cold reservoir. Its efficiency depends only on reservoir temperatures, not on any fuel type.',
      tip: 'The Carnot engine is a theoretical concept, not a real engine with fuel. For NEET, focus on η = 1 − Tc/Th and remember T must be in Kelvin, not Celsius.',
      conceptTag: 'heat-engines',
    },

    // phy-thd-016: Specific heat of water is high, which means — correct: b (water heats slowly)
    {
      questionId: 'phy-thd-016',
      selectedOptionId: 'a',
      misconception:
        'Thinking high specific heat means water boils quickly. Students confuse the rate of temperature rise with reaching boiling point faster.',
      correctReasoning:
        'High specific heat means water requires MORE heat energy to raise its temperature by 1°C compared to other substances. This means water heats up SLOWLY, not quickly. It takes 4200 J to raise 1 kg of water by 1°C, compared to about 900 J for aluminium. Water\'s high specific heat is why it takes long to boil a large pot of water.',
      tip: 'High specific heat = slow to heat, slow to cool. This is why coastal cities have moderate climates (water regulates temperature). NEET links specific heat to daily life examples.',
      conceptTag: 'specific-heat',
    },
    {
      questionId: 'phy-thd-016',
      selectedOptionId: 'c',
      misconception:
        'Confusing specific heat capacity with thermal conductivity. Students think "more heat" means the material is better at conducting heat.',
      correctReasoning:
        'Specific heat capacity measures how much heat a substance can STORE per unit mass per degree rise in temperature. Thermal conductivity measures how quickly heat PASSES THROUGH a material. Water has high specific heat but is actually a poor conductor of heat. These are completely different thermal properties.',
      tip: 'Specific heat = heat storage ability. Thermal conductivity = heat transfer ability. Water has high specific heat but LOW conductivity. NEET tests whether you can differentiate these properties.',
      conceptTag: 'specific-heat',
    },
    {
      questionId: 'phy-thd-016',
      selectedOptionId: 'd',
      misconception:
        'Connecting specific heat to density, thinking high specific heat implies low density. These are unrelated physical properties.',
      correctReasoning:
        'Specific heat capacity and density are independent properties. Water has both a high specific heat (4200 J/kg·K) and a relatively high density (1000 kg/m³). There is no direct relationship between how much heat a substance absorbs per degree and how tightly its molecules are packed. Mercury, for example, has high density but low specific heat.',
      tip: 'Specific heat is about thermal energy absorption, density is about mass per volume — they are unrelated. In NEET, eliminate options that connect unrelated physical properties.',
      conceptTag: 'specific-heat',
    },

    // phy-thd-019: In adiabatic process — correct: c (no heat exchange)
    {
      questionId: 'phy-thd-019',
      selectedOptionId: 'a',
      misconception:
        'Confusing adiabatic with isothermal. Students think "adiabatic" means temperature stays constant, when that is actually the definition of isothermal.',
      correctReasoning:
        'In an adiabatic process, there is no heat exchange (Q = 0) between the system and surroundings. Temperature DOES change — it increases during adiabatic compression and decreases during adiabatic expansion. An isothermal process is the one where temperature remains constant, which requires heat exchange with surroundings.',
      tip: 'Adiabatic: Q = 0 (no heat exchange, temperature changes). Isothermal: ΔT = 0 (constant temperature, heat exchange occurs). These are opposites in a sense — NEET tests this regularly.',
      conceptTag: 'thermodynamic-processes',
    },
    {
      questionId: 'phy-thd-019',
      selectedOptionId: 'b',
      misconception:
        'Confusing adiabatic with isobaric. Students mix up the names of different thermodynamic processes.',
      correctReasoning:
        'An adiabatic process has no heat exchange (Q = 0), while an isobaric process occurs at constant pressure. In an adiabatic process, pressure, volume, and temperature all change. In an isobaric process, pressure remains fixed while heat can freely enter or leave the system.',
      tip: 'Learn the prefixes: "adiabatic" comes from Greek meaning "not passing through" (no heat passes). "Isobaric" means equal pressure. NEET expects you to identify each process from its definition.',
      conceptTag: 'thermodynamic-processes',
    },
    {
      questionId: 'phy-thd-019',
      selectedOptionId: 'd',
      misconception:
        'Confusing adiabatic with isochoric. Students think no heat exchange is the same as no volume change.',
      correctReasoning:
        'An adiabatic process means Q = 0 (no heat exchange), but volume CAN and does change. An isochoric process means constant volume (ΔV = 0, so W = 0), but heat CAN be exchanged. For example, rapid compression of gas in a piston is nearly adiabatic — volume decreases but no heat escapes because the process is too fast.',
      tip: 'Adiabatic: Q = 0 (fast processes like sound waves). Isochoric: ΔV = 0 (heating gas in a rigid container). NEET tip: a "sudden" or "rapid" process is typically adiabatic.',
      conceptTag: 'thermodynamic-processes',
    },

    // phy-thd-022: First law of thermodynamics is — correct: d (energy conservation)
    {
      questionId: 'phy-thd-022',
      selectedOptionId: 'a',
      misconception:
        'Confusing the first law with the second law. Students associate "entropy" with the first law when entropy is actually governed by the second law.',
      correctReasoning:
        'The first law of thermodynamics is the law of conservation of energy: ΔU = Q − W (the change in internal energy equals heat added minus work done). The entropy law is the second law, which states that entropy of an isolated system never decreases. The first law tells you energy is conserved; the second law tells you the direction of processes.',
      tip: 'First law = energy conservation (ΔU = Q − W). Second law = entropy increases. For NEET: the first law says "energy cannot be created or destroyed," the second law says "heat flows from hot to cold naturally."',
      conceptTag: 'laws-of-thermodynamics',
    },
    {
      questionId: 'phy-thd-022',
      selectedOptionId: 'b',
      misconception:
        'Confusing the first law with the third law. The third law deals with absolute zero, not the first law.',
      correctReasoning:
        'The first law states that energy is conserved (ΔU = Q − W). The third law states that the entropy of a perfect crystalline substance is zero at absolute zero temperature (0 K). These address completely different aspects of thermodynamics — the first law is about energy bookkeeping, the third law is about the unattainability of absolute zero.',
      tip: 'Third law = absolute zero (T = 0 K, S = 0 for perfect crystal). First law = energy conservation. NEET tip: if a question mentions "absolute zero," think third law, not first.',
      conceptTag: 'laws-of-thermodynamics',
    },
    {
      questionId: 'phy-thd-022',
      selectedOptionId: 'c',
      misconception:
        'Thinking the first law describes the direction of heat flow (hot to cold). The direction of heat flow is a consequence of the second law.',
      correctReasoning:
        'The first law of thermodynamics (ΔU = Q − W) tells us that energy is conserved but says nothing about the direction of processes. The second law determines the natural direction — heat flows spontaneously from hot to cold, not the reverse. The first law would be satisfied even if heat flowed from cold to hot, but the second law forbids this.',
      tip: 'First law says "how much" energy (conservation). Second law says "which way" energy flows (direction). NEET often asks: "Which law determines the direction of a process?" Answer: second law.',
      conceptTag: 'laws-of-thermodynamics',
    },
  ],
};
