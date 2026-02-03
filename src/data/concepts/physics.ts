import { SubjectConcepts } from '../../types';

export const physicsConcepts: SubjectConcepts = {
  subjectId: 'physics',
  concepts: [
    // ==================== LAWS OF MOTION ====================
    {
      conceptTag: 'newtons-first-law',
      subjectId: 'physics',
      chapterId: 'physics-laws-of-motion',
      title: "Newton's First Law of Motion (Law of Inertia)",
      explanation:
        "**Newton's First Law** states that a body remains in its state of **rest** or **uniform motion in a straight line** unless acted upon by an **external unbalanced force**. This property of a body to resist any change in its state of motion is called **inertia**.\n\n" +
        "There are three types of inertia:\n\n" +
        "- **Inertia of rest**: A body at rest tends to stay at rest. When a bus suddenly starts, passengers jerk backward because their lower body moves with the bus while the upper body resists the change due to inertia of rest.\n" +
        "- **Inertia of motion**: A body in motion tends to keep moving. When a bus suddenly brakes, passengers lurch forward because their body wants to continue moving.\n" +
        "- **Inertia of direction**: A body resists change in its direction of motion. Mud flying off a rotating wheel travels tangentially because it tends to continue in a straight line.\n\n" +
        "The **mass** of a body is the quantitative measure of its inertia — a heavier object has greater inertia and is harder to accelerate or decelerate. This is why pushing a loaded truck is much harder than pushing an empty cart.\n\n" +
        "For NEET, remember that the first law also defines the concept of an **inertial reference frame** — a frame in which an isolated body (no net force) moves with constant velocity. Newton's laws hold true only in inertial frames. A frame accelerating relative to an inertial frame is a **non-inertial frame**, where pseudo forces must be introduced.",
      analogy:
        "Imagine you are standing in a Delhi Metro train holding your phone. When the train suddenly brakes, your phone flies forward out of your hand. The phone was already moving with the train and its inertia made it want to keep moving even after the train slowed down. That is Newton's First Law — objects keep doing what they are doing unless a force stops them.",
      examRelevance:
        "Appears frequently in NEET as conceptual MCQs. Questions often test understanding of inertia types, distinguishing real forces from pseudo forces, and identifying inertial vs non-inertial frames. Expect 1-2 questions per year directly or indirectly.",
      commonMistakes: [
        "Thinking that a body at rest has no forces on it — it may have balanced forces (net force = 0), not necessarily zero individual forces.",
        "Confusing inertia with momentum — inertia depends only on mass, while momentum depends on both mass and velocity.",
        "Believing that force is needed to maintain uniform velocity — no net force is needed for constant velocity motion.",
      ],
      quickRecap:
        "A body stays at rest or in uniform motion unless an unbalanced external force acts on it.\nMass is the measure of inertia — more mass means more resistance to change in motion.",
    },
    {
      conceptTag: 'newtons-second-law',
      subjectId: 'physics',
      chapterId: 'physics-laws-of-motion',
      title: "Newton's Second Law of Motion",
      explanation:
        "**Newton's Second Law** states that the **rate of change of linear momentum** of a body is directly proportional to the applied **external force** and takes place in the **direction of the force**. Mathematically, **F = dp/dt**. For a body of constant mass, this simplifies to the famous equation **F = ma**, where **F** is the net external force, **m** is the mass, and **a** is the acceleration produced.\n\n" +
        "Key points for NEET:\n\n" +
        "- **F = ma** is a vector equation. The acceleration is always in the direction of the **net force**, not any individual force.\n" +
        "- The SI unit of force is the **Newton (N)**, where 1 N = 1 kg·m/s². The CGS unit is the **dyne**, where 1 N = 10⁵ dyne.\n" +
        "- If multiple forces act on a body, you must find the **vector sum** (resultant) of all forces first, then apply F = ma.\n" +
        "- For a system of bodies, the net **external** force equals the total mass times the acceleration of the centre of mass: **F_ext = M·a_cm**.\n\n" +
        "The second law also gives us the concept of **impulse**: when a force acts for a short time **Δt**, the impulse **J = F·Δt = Δp** (change in momentum). This is why a cricketer draws hands back while catching a ball — increasing the time of impact reduces the average force.\n\n" +
        "Newton's Second Law is the most computationally tested law in NEET. Problems involve connected bodies (pulleys, strings), inclined planes, and lift/elevator scenarios.",
      analogy:
        "Think about hitting a cricket ball. When Virat Kohli wants the ball to go to the boundary with high acceleration, he applies a huge force with his bat. A gentle tap (small force) gives small acceleration, and a powerful drive (large force) gives large acceleration. And a heavier tennis ball would accelerate less than a lighter cricket ball for the same force — that is F = ma in action.",
      examRelevance:
        "The most frequently tested law in NEET Physics. Numerical problems on pulley systems, inclined planes, lifts, and connected bodies appear every year. Expect 2-4 questions directly based on F=ma and related applications.",
      commonMistakes: [
        "Using F = ma with individual forces instead of the NET force — always find the resultant first.",
        "Forgetting that F = ma applies only in inertial reference frames — in non-inertial frames, pseudo forces must be added.",
        "Ignoring the vector nature of the equation — acceleration direction must match net force direction, not any single force.",
      ],
      quickRecap:
        "Net external force equals mass times acceleration: F_net = ma (for constant mass systems).\nImpulse equals change in momentum: J = FΔt = Δp, which explains why extending impact time reduces force.",
    },
    {
      conceptTag: 'newtons-third-law',
      subjectId: 'physics',
      chapterId: 'physics-laws-of-motion',
      title: "Newton's Third Law of Motion (Action-Reaction)",
      explanation:
        "**Newton's Third Law** states that for every **action**, there is an **equal and opposite reaction**. If body A exerts a force **F_AB** on body B, then body B simultaneously exerts a force **F_BA = −F_AB** on body A. These forces are equal in magnitude, opposite in direction, and act on **different bodies**.\n\n" +
        "Critical points for NEET:\n\n" +
        "- **Action-reaction pairs always act on different bodies.** They never cancel each other because they do not act on the same object. A book on a table pushes the table down (action) and the table pushes the book up (reaction) — these act on different objects.\n" +
        "- The **normal reaction** from a surface is NOT the reaction to gravity. The weight of a book (Earth pulls book) has its reaction pair as the book pulling Earth upward. The normal force is a separate contact force.\n" +
        "- Action and reaction are **simultaneous** — they come into existence and vanish at the same instant.\n" +
        "- The third law holds true even for **non-contact forces** like gravitational, electric, and magnetic forces.\n\n" +
        "Common NEET applications include: why a gun recoils when a bullet is fired, how a rocket propels itself in space (exhaust gases push rocket forward), why walking is possible (your foot pushes Earth backward, Earth pushes you forward), and how swimmers push water backward to move forward.\n\n" +
        "Remember: if two bodies interact, the forces they exert on each other are **internal forces** of the system. Internal forces cannot change the momentum of the system — only external forces can.",
      analogy:
        "When you send money through UPI, the amount that leaves your account is exactly the amount that enters the receiver's account — equal and opposite. Similarly, when you push a wall, the wall pushes you back with the same force. You feel the force on your hands, and the wall feels the force from your hands. Two different bodies, same magnitude, opposite directions.",
      examRelevance:
        "Tested conceptually every year in NEET. Common traps involve confusing normal force with reaction to weight, or claiming action-reaction pairs cancel. Gun recoil and rocket propulsion numericals are exam favorites.",
      commonMistakes: [
        "Believing that the normal force on a book from a table is the reaction to the book's weight — the true reaction to weight is the book pulling Earth upward.",
        "Thinking action-reaction forces cancel out — they act on different bodies so they cannot cancel.",
        "Assuming that the stronger person in a tug-of-war pulls harder — both sides exert equal forces on each other; the winner has better friction with the ground.",
      ],
      quickRecap:
        "Every force has an equal and opposite reaction force, but they act on DIFFERENT bodies.\nAction-reaction pairs are simultaneous, equal in magnitude, and never cancel each other.",
    },
    {
      conceptTag: 'friction',
      subjectId: 'physics',
      chapterId: 'physics-laws-of-motion',
      title: 'Friction: Static, Kinetic, and Applications',
      explanation:
        "**Friction** is the force that opposes the **relative motion** (or tendency of relative motion) between two surfaces in contact. It arises due to the **irregularities** (microscopic interlocking) of surfaces and electromagnetic interactions between surface molecules.\n\n" +
        "Types of friction:\n\n" +
        "- **Static friction (f_s)**: Acts when there is no relative motion but a tendency to move. It is **self-adjusting** — it matches the applied force up to a maximum value. The **maximum static friction** is given by **f_s(max) = μ_s × N**, where **μ_s** is the coefficient of static friction and **N** is the normal reaction.\n" +
        "- **Kinetic friction (f_k)**: Acts when the body is already sliding. It is given by **f_k = μ_k × N**, where **μ_k** is the coefficient of kinetic friction. **μ_k < μ_s** always, which is why it takes more force to start moving an object than to keep it moving.\n" +
        "- **Rolling friction**: Much smaller than sliding friction, which is why wheels and ball bearings are used in machines.\n\n" +
        "Important NEET facts:\n\n" +
        "- Friction is **independent of the area of contact** (for dry surfaces) and depends only on the nature of surfaces and normal force.\n" +
        "- The **angle of friction** (λ) is defined as tan λ = μ_s, and the **angle of repose** (θ) on an inclined plane equals the angle of friction.\n" +
        "- Friction is essential for **walking**, **driving**, and **braking**. Without friction, you could not walk or hold objects.",
      analogy:
        "Think about why your phone does not slide off a slightly tilted textbook — static friction holds it. But tilt the book more and the phone starts sliding — kinetic friction takes over but it is weaker. This is why once your phone starts sliding, it accelerates. It is like ordering on Zomato: static friction is the effort to place the order (harder to start), and kinetic friction is the delivery moving through traffic (easier to keep going).",
      examRelevance:
        "Friction problems appear in NEET every year — inclined plane problems, block-on-block systems, and minimum force to move an object. Angle of repose and friction on banked roads are high-frequency topics. Expect 1-3 questions.",
      commonMistakes: [
        "Using f = μN for static friction in all cases — static friction is self-adjusting and equals the applied force until it reaches f_s(max) = μ_s × N.",
        "Assuming friction always opposes motion — friction opposes RELATIVE motion or its tendency, and can actually be the driving force (e.g., friction makes walking possible).",
        "Forgetting that kinetic friction is constant regardless of speed (for moderate speeds), while static friction varies up to its maximum.",
      ],
      quickRecap:
        "Static friction is self-adjusting up to μ_s × N; kinetic friction is constant at μ_k × N, and μ_k < μ_s always.\nFriction depends on surface nature and normal force, NOT on contact area.",
    },
    {
      conceptTag: 'free-body-diagram',
      subjectId: 'physics',
      chapterId: 'physics-laws-of-motion',
      title: 'Free Body Diagrams and Force Resolution',
      explanation:
        "A **Free Body Diagram (FBD)** is a simplified diagram that shows a single body isolated from its surroundings with **all the forces** acting on it represented as vectors. Drawing correct FBDs is the most essential skill for solving mechanics problems in NEET.\n\n" +
        "Steps to draw an FBD:\n\n" +
        "1. **Isolate** the body of interest — mentally separate it from all other objects.\n" +
        "2. Draw the body as a point or simple shape.\n" +
        "3. Identify and draw **all forces** acting ON the body: **weight (mg)** downward, **normal reaction (N)** perpendicular to the contact surface, **tension (T)** along the string away from the body, **friction (f)** along the surface opposing relative motion, and any applied external force.\n" +
        "4. Choose a convenient **coordinate system**. For inclined planes, choose axes parallel and perpendicular to the incline.\n" +
        "5. **Resolve forces** into components along your chosen axes.\n" +
        "6. Apply **Newton's Second Law** along each axis: ΣF_x = ma_x and ΣF_y = ma_y.\n\n" +
        "For an inclined plane of angle θ, the weight **mg** resolves into **mg sin θ** along the incline (driving component) and **mg cos θ** perpendicular to the incline (balanced by normal reaction). This resolution is tested repeatedly in NEET.\n\n" +
        "For **connected body problems** (Atwood machine, blocks on pulleys), draw separate FBDs for each body, apply Newton's second law to each, and solve the simultaneous equations. The string constraint gives the relationship between accelerations of different bodies.",
      analogy:
        "Drawing an FBD is like making a list of all expenses in your UPI transaction history for one account. You isolate that one account and list every force (transaction) acting on it — income in, spending out, EMIs, etc. Only after listing ALL forces can you calculate the net balance (net force). Skip one force and your whole calculation goes wrong.",
      examRelevance:
        "FBD is not a standalone topic but is the fundamental tool for solving almost ALL mechanics problems in NEET. Inclined plane, pulley, lift, and connected body problems (3-5 questions per year) all require correct FBDs. Mastering this skill is non-negotiable.",
      commonMistakes: [
        "Including forces that the body exerts ON other objects — an FBD must only show forces acting ON the body, not forces the body exerts on others.",
        "Forgetting to include all forces (especially weight or friction) — every contact provides a normal force and possibly friction, and gravity always acts.",
        "Choosing an inconvenient coordinate system — on inclined planes, always align axes parallel and perpendicular to the surface for simplicity.",
      ],
      quickRecap:
        "Isolate the body, draw ALL forces on it, choose smart axes, resolve components, then apply F=ma along each axis.\nFor inclined planes: mg sin θ acts along the incline, mg cos θ is balanced by the normal reaction.",
    },
    {
      conceptTag: 'momentum',
      subjectId: 'physics',
      chapterId: 'physics-laws-of-motion',
      title: 'Linear Momentum, Impulse, and Conservation',
      explanation:
        "**Linear momentum** is defined as **p = mv**, where **m** is the mass and **v** is the velocity of the body. It is a **vector quantity** with the same direction as velocity. The SI unit is **kg·m/s**.\n\n" +
        "**Impulse** is the product of force and the time for which it acts: **J = F × Δt**. By Newton's second law, impulse equals the **change in momentum**: **J = Δp = p_final − p_initial**. The impulse-momentum theorem is crucial for problems involving collisions and sudden impacts.\n\n" +
        "The **Law of Conservation of Linear Momentum** states: if the **net external force** on a system is zero, the **total momentum of the system remains constant**. Mathematically: if F_ext = 0, then **p_initial = p_final** or **m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂**.\n\n" +
        "Applications in NEET:\n\n" +
        "- **Recoil of a gun**: Total initial momentum = 0. After firing: m_bullet × v_bullet + m_gun × v_gun = 0, so the gun recoils backward.\n" +
        "- **Collision problems**: In **elastic collisions**, both momentum and kinetic energy are conserved. In **perfectly inelastic collisions**, bodies stick together and only momentum is conserved (KE decreases).\n" +
        "- **Rocket propulsion**: The exhaust gases carry momentum backward, giving the rocket forward momentum.\n\n" +
        "The **coefficient of restitution (e)** measures the elasticity of collision: e = (relative velocity of separation)/(relative velocity of approach). For perfectly elastic collision e = 1, for perfectly inelastic e = 0.",
      analogy:
        "Momentum is like the impact of a fast bowler's delivery in cricket. A 156 km/h delivery from Jasprit Bumrah has enormous momentum even though the ball is light — because velocity is very high. A slow full toss has less momentum. Now, when the batsman hits the ball, the impulse (force × time of contact) changes the ball's momentum. The longer the bat stays in contact (follow-through), the greater the impulse and the farther the ball goes.",
      examRelevance:
        "Conservation of momentum is tested every year in NEET — gun recoil, collisions (elastic and inelastic), and rocket problems. Impulse-momentum theorem questions involving catching a ball or a bullet hitting a block are common. Expect 2-3 questions.",
      commonMistakes: [
        "Applying conservation of momentum when an external force acts — conservation only works when net external force is zero.",
        "Confusing elastic and inelastic collisions — in elastic collisions BOTH momentum and KE are conserved, in inelastic only momentum is conserved.",
        "Treating momentum as a scalar — momentum is a vector, so direction matters in all calculations, especially in 2D collision problems.",
      ],
      quickRecap:
        "Momentum p = mv is conserved when net external force is zero: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂.\nImpulse J = FΔt = Δp explains why increasing impact time reduces force (catching a ball by drawing hands back).",
    },

    // ==================== THERMODYNAMICS ====================
    {
      conceptTag: 'zeroth-law',
      subjectId: 'physics',
      chapterId: 'physics-thermodynamics',
      title: 'Zeroth Law of Thermodynamics',
      explanation:
        "The **Zeroth Law of Thermodynamics** states: if two systems **A** and **B** are each in **thermal equilibrium** with a third system **C**, then A and B are also in thermal equilibrium with each other. This seemingly simple statement is the foundation of the concept of **temperature**.\n\n" +
        "**Thermal equilibrium** means that when two bodies are brought into thermal contact, there is **no net heat flow** between them. They are at the same temperature. The Zeroth Law establishes that temperature is a **well-defined, transitive property** — if T_A = T_C and T_B = T_C, then T_A = T_B.\n\n" +
        "Why is it called the \"Zeroth\" Law? It was formulated **after** the first and second laws but was recognized as being more fundamental — it logically comes before them. Without the Zeroth Law, the very concept of temperature measurement would have no theoretical basis.\n\n" +
        "The Zeroth Law is the principle behind **thermometers**. When you place a mercury thermometer in your mouth, you wait until the mercury (system C) reaches thermal equilibrium with your body (system A). Then the thermometer reading tells you your body temperature. Any other body at the same temperature as the thermometer would also be in thermal equilibrium with you.\n\n" +
        "For NEET, understand that this law defines the concept of temperature as a state variable and provides the basis for comparing temperatures of different bodies through a common reference.",
      analogy:
        "Think of it like Instagram mutual followers. If you (A) and your friend (B) both follow the same meme page (C) and agree its content is 'just right' temperature-wise, then you and your friend have the same taste (temperature). The meme page is like a thermometer — a common reference that lets you compare whether two people (systems) are at the same 'level' without directly comparing them.",
      examRelevance:
        "Directly tested as conceptual one-liner MCQs in NEET. Usually appears as 'which law defines temperature' or 'which law is the basis of thermometry.' Low frequency (once every 2-3 years) but easy marks when it appears.",
      commonMistakes: [
        "Confusing the Zeroth Law with the Second Law — the Zeroth Law is about thermal equilibrium and temperature definition, NOT about heat flow direction.",
        "Thinking the Zeroth Law was discovered first — it was actually formulated after the other laws but is more fundamental, hence the name 'zeroth'.",
      ],
      quickRecap:
        "If A is in thermal equilibrium with C, and B is in thermal equilibrium with C, then A and B are in thermal equilibrium.\nThis law defines temperature as a measurable quantity and is the theoretical basis for thermometers.",
    },
    {
      conceptTag: 'first-law',
      subjectId: 'physics',
      chapterId: 'physics-thermodynamics',
      title: 'First Law of Thermodynamics',
      explanation:
        "The **First Law of Thermodynamics** is the law of **conservation of energy** applied to thermal systems. It states: the heat supplied to a system (**dQ**) equals the increase in internal energy (**dU**) plus the work done **by** the system (**dW**). Mathematically: **dQ = dU + dW**.\n\n" +
        "Sign convention (NEET standard):\n\n" +
        "- **dQ > 0**: Heat is **added** to the system.\n" +
        "- **dQ < 0**: Heat is **removed** from the system.\n" +
        "- **dW > 0**: Work is done **by** the system (expansion).\n" +
        "- **dW < 0**: Work is done **on** the system (compression).\n" +
        "- **dU > 0**: Internal energy **increases** (temperature rises for ideal gas).\n\n" +
        "For an **ideal gas**, internal energy depends **only on temperature**: U = nC_vT. So for an **isothermal process** (constant T), dU = 0, and all heat goes into work: dQ = dW.\n\n" +
        "For an **adiabatic process** (no heat exchange), dQ = 0, so dU = −dW. Work done by the gas comes at the expense of internal energy, causing cooling.\n\n" +
        "For an **isochoric process** (constant volume), dW = 0, so dQ = dU. All heat supplied increases internal energy.\n\n" +
        "For an **isobaric process** (constant pressure), dW = PΔV = nRΔT, and dQ = nC_pΔT.\n\n" +
        "The first law tells us energy cannot be created or destroyed — it can only change form. A **perpetual motion machine of the first kind** (which creates energy from nothing) is impossible.",
      analogy:
        "Think of your bank account as the system. Your salary coming in is heat added (dQ). Your savings balance is internal energy (dU). Your spending is work done by the system (dW). The First Law says: Salary = Savings increase + Spending (dQ = dU + dW). You cannot spend more than you earn plus your existing savings — energy is conserved, just like money in a closed account.",
      examRelevance:
        "One of the most important NEET topics. Direct numerical problems on applying dQ = dU + dW to various processes appear every year. Questions on sign conventions, work done in different processes, and identifying process types are high frequency. Expect 2-3 questions.",
      commonMistakes: [
        "Confusing sign conventions — some textbooks use dQ = dU − dW (work done ON the system). NCERT uses dQ = dU + dW (work done BY the system). Stick to NCERT for NEET.",
        "Assuming dU = 0 for any process other than isothermal — for an ideal gas, dU = 0 only when temperature does not change.",
        "Forgetting that internal energy is a STATE function (depends only on state, not path) while heat and work are PATH functions.",
      ],
      quickRecap:
        "First Law: dQ = dU + dW — heat added equals internal energy increase plus work done by the system.\nInternal energy is a state function (path-independent); heat and work are path functions (process-dependent).",
    },
    {
      conceptTag: 'second-law',
      subjectId: 'physics',
      chapterId: 'physics-thermodynamics',
      title: 'Second Law of Thermodynamics',
      explanation:
        "The **Second Law of Thermodynamics** has two classic statements:\n\n" +
        "- **Kelvin-Planck Statement**: It is impossible to construct a heat engine that converts **all** the heat absorbed from a source into work in a **cyclic process**. Some heat must always be rejected to a sink. This means 100% efficiency is impossible for any heat engine.\n" +
        "- **Clausius Statement**: It is impossible for heat to flow spontaneously from a **colder body to a hotter body** without external work being done. This is why refrigerators need electricity to operate.\n\n" +
        "Both statements are equivalent — violating one automatically violates the other.\n\n" +
        "The second law introduces **entropy (S)**, a measure of **disorder** or randomness of a system. In any spontaneous (irreversible) process, the **total entropy of the universe always increases**: **ΔS_universe ≥ 0**. For reversible processes, ΔS_universe = 0.\n\n" +
        "The **Carnot engine** is a theoretical engine with the maximum possible efficiency operating between two temperatures: **η_Carnot = 1 − T_cold/T_hot** (temperatures in Kelvin). No real engine can exceed Carnot efficiency. To improve efficiency, either increase T_hot or decrease T_cold.\n\n" +
        "A **perpetual motion machine of the second kind** (which converts heat completely into work in a cycle) is impossible according to this law.\n\n" +
        "For NEET, focus on Carnot efficiency calculations, understanding why 100% efficiency is impossible, and the direction of natural heat flow.",
      analogy:
        "Think about a cricket match — once the ball hits the boundary and scatters dust particles, that dust never spontaneously gathers back into a neat pile. That is entropy increasing. Similarly, when you share a photo on Instagram, it spreads to many accounts (disorder increases). Getting everyone to delete it and return to the original state (reversing entropy) would require enormous effort (external work). Nature always moves toward more disorder.",
      examRelevance:
        "Tested every year in NEET. Carnot efficiency numericals, identifying correct/incorrect statements of the second law, and entropy conceptual questions are common. Refrigerator COP (coefficient of performance) problems also appear. Expect 1-2 questions.",
      commonMistakes: [
        "Using Celsius instead of Kelvin in Carnot efficiency formula — ALWAYS convert to Kelvin: η = 1 − T_cold(K)/T_hot(K).",
        "Thinking the second law says heat can NEVER flow from cold to hot — it CAN, but only with external work (that is how refrigerators and ACs work).",
        "Believing entropy of a system always increases — the entropy of a SYSTEM can decrease (like in a refrigerator), but the entropy of the UNIVERSE always increases.",
      ],
      quickRecap:
        "No heat engine can be 100% efficient; some heat must always be rejected. Carnot efficiency: η = 1 − T_cold/T_hot (in Kelvin).\nEntropy of the universe always increases in spontaneous processes — nature moves toward greater disorder.",
    },
    {
      conceptTag: 'specific-heat',
      subjectId: 'physics',
      chapterId: 'physics-thermodynamics',
      title: 'Specific Heat, Calorimetry, and Phase Changes',
      explanation:
        "**Specific heat capacity (c)** is the amount of heat required to raise the temperature of **1 kg** of a substance by **1°C (or 1 K)**. The heat equation is: **Q = mcΔT**, where Q is heat, m is mass, and ΔT is the temperature change.\n\n" +
        "For gases, there are two specific heats:\n\n" +
        "- **C_p** (at constant pressure): Heat needed per mole per degree at constant pressure.\n" +
        "- **C_v** (at constant volume): Heat needed per mole per degree at constant volume.\n" +
        "- **C_p − C_v = R** (Mayer's relation), where R = 8.314 J/mol·K.\n" +
        "- **γ = C_p/C_v** is the heat capacity ratio. For monoatomic gas, γ = 5/3; diatomic, γ = 7/5; triatomic, γ = 4/3.\n\n" +
        "**Calorimetry** is based on the principle: **heat lost by hot body = heat gained by cold body** (in an isolated system). This is used to find unknown specific heats or final equilibrium temperatures.\n\n" +
        "During **phase changes** (melting, boiling), temperature remains **constant** even though heat is being supplied. The heat goes into breaking intermolecular bonds:\n\n" +
        "- **Latent heat of fusion (L_f)**: Heat per kg to convert solid to liquid at melting point. Q = mL_f.\n" +
        "- **Latent heat of vaporization (L_v)**: Heat per kg to convert liquid to gas at boiling point. Q = mL_v.\n" +
        "- For water: L_f = 3.34 × 10⁵ J/kg, L_v = 22.6 × 10⁵ J/kg.\n\n" +
        "NEET questions often involve mixed calorimetry — combining Q = mcΔT and Q = mL calculations when ice is added to water.",
      analogy:
        "Imagine charging your phone. Specific heat is like how fast different phones heat up — a phone with high specific heat (large battery, good cooling) takes more energy to heat up by 1°C. Phase change is like when your phone hits 100% — you keep it plugged in (adding energy) but the percentage does not go above 100. The energy goes into 'maintaining' the state, not into visible change, just like latent heat during boiling.",
      examRelevance:
        "Very high frequency in NEET. Calorimetry numericals (mixing hot and cold substances), latent heat problems (ice melting in water), and C_p vs C_v concepts appear every year. γ values for different gases are commonly tested. Expect 2-3 questions.",
      commonMistakes: [
        "Forgetting latent heat during phase changes — students often apply Q = mcΔT continuously without accounting for the constant-temperature phase transition requiring Q = mL.",
        "Confusing C_p and C_v — C_p > C_v always because at constant pressure, extra energy goes into expansion work. Use Mayer's relation: C_p − C_v = R.",
        "Using wrong γ values — monoatomic (He, Ne, Ar): γ = 5/3; diatomic (N₂, O₂, H₂): γ = 7/5. Memorize these for NEET.",
      ],
      quickRecap:
        "Q = mcΔT for temperature change; Q = mL for phase change at constant temperature. C_p − C_v = R (Mayer's relation).\nIn calorimetry, heat lost = heat gained; during phase changes, temperature stays constant while bonds break.",
    },
    {
      conceptTag: 'heat-transfer',
      subjectId: 'physics',
      chapterId: 'physics-thermodynamics',
      title: 'Heat Transfer: Conduction, Convection, and Radiation',
      explanation:
        "Heat can be transferred by three mechanisms:\n\n" +
        "**Conduction** is heat transfer through a material **without bulk movement** of the material. It occurs due to molecular vibrations and free electron movement. The rate of heat flow is given by **Fourier's Law**: **dQ/dt = −KA(dT/dx)**, where **K** is the thermal conductivity, **A** is the cross-sectional area, and **dT/dx** is the temperature gradient. For a uniform rod: **Q/t = KA(T₁ − T₂)/L**, where L is the length. **Metals** are good conductors (high K) and **wood, air, wool** are insulators (low K).\n\n" +
        "**Convection** is heat transfer through **bulk movement of fluid** (liquid or gas). It can be **natural** (driven by density differences due to temperature — hot air rises) or **forced** (driven by fans, pumps). Land and sea breezes are natural convection phenomena.\n\n" +
        "**Radiation** is heat transfer through **electromagnetic waves** (infrared). It requires **no medium** and works even in vacuum. Key laws:\n\n" +
        "- **Stefan-Boltzmann Law**: Power radiated **P = σAT⁴**, where σ = 5.67 × 10⁻⁸ W/m²K⁴.\n" +
        "- **Wien's Displacement Law**: λ_max × T = b (constant = 2.9 × 10⁻³ m·K). Hotter bodies emit shorter wavelengths.\n" +
        "- **Newton's Law of Cooling**: Rate of cooling is proportional to the temperature difference with surroundings: **dT/dt = −k(T − T₀)**. Valid for small temperature differences.\n\n" +
        "For NEET, series and parallel combinations of thermal conductors and Newton's law of cooling problems are frequently tested.",
      analogy:
        "Think of three ways gossip spreads in school. Conduction is like whispering to the person next to you — it passes person to person without anyone moving. Convection is like one student physically walking to another group and sharing the news — the 'carrier' moves. Radiation is like posting it on Instagram — everyone gets it instantly without any physical contact or movement needed, even people far away.",
      examRelevance:
        "Newton's Law of Cooling numericals and thermal conductivity problems (series/parallel rods) appear every 1-2 years. Stefan-Boltzmann and Wien's law are also tested. This is a reliable 1-2 question topic in NEET.",
      commonMistakes: [
        "Using Celsius in Stefan-Boltzmann Law — temperature MUST be in Kelvin since P = σAT⁴ involves T to the fourth power.",
        "Confusing thermal conductivity (K) with electrical conductivity — though metals are good at both, the values and units are completely different.",
        "Applying Newton's Law of Cooling for large temperature differences — it is only valid when the temperature difference between the body and surroundings is small.",
      ],
      quickRecap:
        "Conduction: Q/t = KA(T₁−T₂)/L through solids. Convection: bulk fluid movement. Radiation: P = σAT⁴, no medium needed.\nNewton's Law of Cooling: dT/dt ∝ (T−T₀), valid only for small temperature differences with surroundings.",
    },
    {
      conceptTag: 'thermodynamic-processes',
      subjectId: 'physics',
      chapterId: 'physics-thermodynamics',
      title: 'Thermodynamic Processes: Isothermal, Adiabatic, Isobaric, Isochoric',
      explanation:
        "A **thermodynamic process** is a change in the state of a system from one equilibrium state to another. The four key processes for NEET:\n\n" +
        "**Isothermal Process** (constant temperature, ΔT = 0):\n" +
        "- Internal energy change: **dU = 0** (for ideal gas).\n" +
        "- First law gives: **dQ = dW**. All heat goes into work.\n" +
        "- Equation of state: **PV = constant** (Boyle's Law).\n" +
        "- Work done: **W = nRT ln(V₂/V₁)**.\n" +
        "- Requires the process to be **very slow** (quasi-static) with the system in contact with a heat reservoir.\n\n" +
        "**Adiabatic Process** (no heat exchange, dQ = 0):\n" +
        "- First law gives: **dU = −dW**. Work comes from internal energy.\n" +
        "- Equation of state: **PV^γ = constant**, also **TV^(γ−1) = constant**.\n" +
        "- Work done: **W = (P₁V₁ − P₂V₂)/(γ − 1) = nR(T₁ − T₂)/(γ − 1)**.\n" +
        "- The process must be **fast** or the system must be perfectly **insulated**.\n" +
        "- Adiabatic curve is **steeper** than isothermal on a PV diagram.\n\n" +
        "**Isobaric Process** (constant pressure, ΔP = 0):\n" +
        "- Work done: **W = PΔV = nRΔT**.\n" +
        "- Heat added: **Q = nC_pΔT**.\n\n" +
        "**Isochoric Process** (constant volume, ΔV = 0):\n" +
        "- Work done: **W = 0** (no volume change).\n" +
        "- Heat added: **Q = nC_vΔT = dU**.\n\n" +
        "On a **PV diagram**, the area under the curve gives the **work done**. For a cyclic process, the net work equals the area enclosed by the cycle.",
      analogy:
        "Think of cooking on different settings. Isothermal is like slow cooking in a pressure cooker with the valve open — temperature stays constant as steam escapes (heat converted to work). Adiabatic is like quickly pumping a bicycle tire — no time for heat exchange, so the pump gets hot (internal energy increases from work done on the gas). Isobaric is cooking in an open vessel — pressure stays at atmospheric. Isochoric is heating food in a sealed, rigid container — volume cannot change.",
      examRelevance:
        "This is the highest-yield thermodynamics topic for NEET. PV diagram analysis, work done calculations, and comparing slopes of isothermal vs adiabatic curves are tested every year. Expect 2-4 questions combining process identification with First Law application.",
      commonMistakes: [
        "Confusing isothermal (PV = const) with adiabatic (PV^γ = const) — the adiabatic curve is always steeper on a PV diagram because γ > 1.",
        "Forgetting that work done in an isochoric process is zero — students sometimes use W = PΔV but ΔV = 0 means W = 0 regardless of pressure change.",
        "Using the wrong formula for adiabatic work — W = nR(T₁−T₂)/(γ−1), not nR(T₂−T₁)/(γ−1). Getting the sign wrong changes whether the gas does work or has work done on it.",
      ],
      quickRecap:
        "Isothermal: PV = const, W = nRT ln(V₂/V₁). Adiabatic: PV^γ = const, W = nR(T₁−T₂)/(γ−1). Both are key curves on PV diagrams.\nIsobaric: W = PΔV at constant pressure. Isochoric: W = 0 at constant volume. Area under PV curve = work done.",
    },
  ],
};
