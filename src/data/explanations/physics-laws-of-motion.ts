import { ChapterExplanations } from '../../types';

export const physicsLawsOfMotionExplanations: ChapterExplanations = {
  chapterId: 'physics-laws-of-motion',
  subjectId: 'physics',
  entries: [
    // phy-lom-001: Newton's first law is about — correct: b (inertia)
    {
      questionId: 'phy-lom-001',
      selectedOptionId: 'a',
      misconception:
        'Confusing Newton\'s first law with the second law, thinking the first law is primarily about force.',
      correctReasoning:
        'Newton\'s first law is the law of inertia. It states that a body continues in its state of rest or uniform motion in a straight line unless acted upon by an external unbalanced force. The concept of force is central to the second law (F = ma), not the first.',
      tip: 'Remember: 1st law = inertia (tendency to resist change), 2nd law = force and acceleration. NEET often tests whether you can distinguish between the three laws.',
      conceptTag: 'newtons-laws',
    },
    {
      questionId: 'phy-lom-001',
      selectedOptionId: 'c',
      misconception:
        'Thinking Newton\'s first law defines acceleration, when acceleration is actually described by the second law.',
      correctReasoning:
        'Newton\'s first law deals with inertia — the property of a body to resist changes in its state of motion. Acceleration is the result of a net external force as described by F = ma in the second law. The first law describes what happens when no net force acts.',
      tip: 'Trick to recall: First law tells you what happens when there is NO force. Second law tells you what happens when there IS a force. NEET loves this distinction.',
      conceptTag: 'newtons-laws',
    },
    {
      questionId: 'phy-lom-001',
      selectedOptionId: 'd',
      misconception:
        'Associating Newton\'s first law with momentum, likely mixing it up with the concept of conservation of momentum.',
      correctReasoning:
        'While inertia and momentum are related (a body with more momentum is harder to stop), Newton\'s first law specifically defines the concept of inertia — not momentum. Momentum (p = mv) is more directly linked to the second law, since F = dp/dt.',
      tip: 'Inertia is a qualitative property (resistance to change), while momentum is a quantitative measure (mass times velocity). Keep them separate in your mind for MCQs.',
      conceptTag: 'newtons-laws',
    },

    // phy-lom-004: Unit of force — correct: a (Newton)
    {
      questionId: 'phy-lom-004',
      selectedOptionId: 'b',
      misconception:
        'Confusing the unit of force with the unit of energy. Students often mix up Newton and Joule because both involve kg and m.',
      correctReasoning:
        'The SI unit of force is Newton (N), defined as kg·m/s². Joule (J) is the unit of energy or work, defined as kg·m²/s² or equivalently N·m. Force causes acceleration, while energy is the capacity to do work — they are fundamentally different quantities.',
      tip: 'Quick check: Force = mass × acceleration → kg × m/s² = Newton. Energy = force × distance → N × m = Joule. In NEET, always verify units by dimensional analysis.',
      conceptTag: 'units-and-dimensions',
    },
    {
      questionId: 'phy-lom-004',
      selectedOptionId: 'c',
      misconception:
        'Selecting Watt as the unit of force, confusing force with power.',
      correctReasoning:
        'Watt is the SI unit of power, not force. Power is the rate of doing work (P = W/t), measured in J/s or kg·m²/s³. Force is measured in Newton (kg·m/s²). These are different physical quantities with different dimensions.',
      tip: 'Remember the chain: Force (N) → Work (J = N·m) → Power (W = J/s). Each builds on the previous. NEET unit-based elimination can save time.',
      conceptTag: 'units-and-dimensions',
    },
    {
      questionId: 'phy-lom-004',
      selectedOptionId: 'd',
      misconception:
        'Confusing force with pressure. Pascal is the unit of pressure (force per unit area), not force itself.',
      correctReasoning:
        'Pascal (Pa) is the SI unit of pressure, which equals force divided by area (Pa = N/m²). Force itself is measured in Newton. Pressure and force are related but distinct — pressure tells you how force is distributed over an area.',
      tip: 'Pressure = Force/Area. So Pascal = Newton/m². If the question asks for force, the answer must be Newton. NEET frequently tests unit identification in early questions.',
      conceptTag: 'units-and-dimensions',
    },

    // phy-lom-007: Action-reaction forces act on — correct: d (different bodies)
    {
      questionId: 'phy-lom-007',
      selectedOptionId: 'a',
      misconception:
        'Believing action and reaction forces act on the same body. This is the most common Newton\'s third law error among students.',
      correctReasoning:
        'Newton\'s third law states that action and reaction forces are equal in magnitude, opposite in direction, and act on two DIFFERENT bodies. If they acted on the same body, they would cancel out and no motion would ever be possible. For example, when you push a wall, you push the wall (action on wall) and the wall pushes you back (reaction on you).',
      tip: 'Golden rule for NEET: Action-reaction pairs NEVER cancel because they act on different bodies. Forces cancel only when two forces act on the SAME body.',
      conceptTag: 'newtons-laws',
    },
    {
      questionId: 'phy-lom-007',
      selectedOptionId: 'b',
      misconception:
        'Thinking action and reaction forces act in the same direction, misunderstanding the "opposite" part of Newton\'s third law.',
      correctReasoning:
        'Action and reaction forces are always equal in magnitude but opposite in direction. If you push a table forward (action), the table pushes you backward (reaction). They never act in the same direction. This opposite nature is fundamental to the third law.',
      tip: 'Keyword in Newton\'s third law: "equal and OPPOSITE." If you see same direction as an option in NEET, eliminate it immediately.',
      conceptTag: 'newtons-laws',
    },
    {
      questionId: 'phy-lom-007',
      selectedOptionId: 'c',
      misconception:
        'Thinking that action-reaction forces involve only one body, misunderstanding that interactions always require two bodies.',
      correctReasoning:
        'Every force is an interaction between two bodies. Newton\'s third law requires exactly two bodies — one experiences the action force and the other experiences the reaction force. A single body cannot exert a force on itself. When a ball hits the ground, the ball pushes the ground and the ground pushes the ball.',
      tip: 'Always identify BOTH bodies in a Newton\'s third law question. If you can name only one body, you have not identified the pair correctly. This helps in NEET problem-solving.',
      conceptTag: 'newtons-laws',
    },

    // phy-lom-010: Friction always — correct: c (opposes relative motion)
    {
      questionId: 'phy-lom-010',
      selectedOptionId: 'a',
      misconception:
        'Thinking friction speeds up objects. Students sometimes confuse the role of static friction in walking or driving with friction accelerating objects.',
      correctReasoning:
        'Friction always opposes the relative motion (or tendency of relative motion) between two surfaces in contact. While static friction enables walking by preventing slipping, it does so by opposing the backward slide of your foot — it does not actively speed you up. The net effect may be forward motion, but friction\'s role is always to oppose relative sliding.',
      tip: 'NEET trick: Friction opposes RELATIVE motion, not necessarily the direction of movement. A car moves forward, but friction on its tyres acts forward only to oppose the backward slide of the tyre.',
      conceptTag: 'friction',
    },
    {
      questionId: 'phy-lom-010',
      selectedOptionId: 'b',
      misconception:
        'Confusing friction with the normal force. Students think friction acts perpendicular to the surface (upward on a horizontal surface).',
      correctReasoning:
        'Friction acts parallel to the contact surface, opposing relative motion or its tendency. The force that acts perpendicular (upward on a flat surface) is the normal reaction force, not friction. On a horizontal table, friction is horizontal while normal force is vertical.',
      tip: 'Remember: Normal force = perpendicular to surface, Friction = parallel to surface. Drawing a proper free body diagram helps you score in NEET mechanics problems.',
      conceptTag: 'friction',
    },
    {
      questionId: 'phy-lom-010',
      selectedOptionId: 'd',
      misconception:
        'Believing friction is always constant regardless of conditions. Students may not distinguish between static and kinetic friction or the dependence on normal force.',
      correctReasoning:
        'Friction is not constant — it depends on the normal force and the coefficient of friction (f = μN). Static friction varies from zero up to a maximum value (μₛN), adjusting to match the applied force. Kinetic friction is roughly constant for a given pair of surfaces, but changes if the normal force changes.',
      tip: 'Key for NEET: Static friction is variable (0 to μₛN), kinetic friction is approximately constant (μₖN). Questions often test whether you know static friction adjusts itself.',
      conceptTag: 'friction',
    },

    // phy-lom-013: Free body diagram shows — correct: b (all forces on one body)
    {
      questionId: 'phy-lom-013',
      selectedOptionId: 'a',
      misconception:
        'Confusing a free body diagram with a trajectory or path diagram. Students think FBD shows the motion path of the object.',
      correctReasoning:
        'A free body diagram (FBD) isolates a single body and shows ALL the forces acting on it — gravity, normal force, friction, tension, applied force, etc. It does not show the path of motion or trajectory. The purpose of an FBD is to apply Newton\'s second law by identifying all forces.',
      tip: 'In NEET, if a question asks you to draw or interpret an FBD, focus only on forces (arrows with labels). Ignore motion paths. This clarity helps in solving equilibrium and dynamics problems quickly.',
      conceptTag: 'free-body-diagrams',
    },
    {
      questionId: 'phy-lom-013',
      selectedOptionId: 'c',
      misconception:
        'Thinking a free body diagram shows velocity vectors instead of force vectors.',
      correctReasoning:
        'An FBD exclusively shows forces acting on the chosen body, not velocity or displacement vectors. Velocity describes how fast and in what direction the body moves, which is a kinematic quantity. Forces are dynamic quantities that cause changes in motion. They serve different purposes in problem-solving.',
      tip: 'Force vectors cause motion to change; velocity vectors describe existing motion. NEET problems on FBDs always ask about forces — weight (mg), normal (N), friction (f), tension (T).',
      conceptTag: 'free-body-diagrams',
    },
    {
      questionId: 'phy-lom-013',
      selectedOptionId: 'd',
      misconception:
        'Confusing a free body diagram with an energy diagram or potential energy curve.',
      correctReasoning:
        'A free body diagram shows forces on a body, while an energy diagram plots potential energy as a function of position. They are completely different tools. FBDs are used to apply Newton\'s laws, whereas energy diagrams are used in work-energy analysis.',
      tip: 'FBD = forces (Newton\'s laws), Energy diagram = PE vs position (conservation of energy). Know which tool to use for which type of NEET problem.',
      conceptTag: 'free-body-diagrams',
    },

    // phy-lom-016: Momentum = — correct: a (mass × velocity)
    {
      questionId: 'phy-lom-016',
      selectedOptionId: 'b',
      misconception:
        'Confusing momentum (p = mv) with force (F = ma). Students mix up velocity and acceleration in the formula.',
      correctReasoning:
        'Momentum is defined as p = mv (mass times velocity), while force is F = ma (mass times acceleration). Momentum measures the quantity of motion a body possesses, whereas force measures the rate of change of momentum. They have different dimensions — momentum is kg·m/s, force is kg·m/s².',
      tip: 'Easy memory trick: Momentum has "v" for velocity (p = mv), Force has "a" for acceleration (F = ma). NEET often places these as adjacent options to confuse you.',
      conceptTag: 'momentum',
    },
    {
      questionId: 'phy-lom-016',
      selectedOptionId: 'c',
      misconception:
        'Selecting force × time, which is actually impulse (J = F·Δt), not momentum itself.',
      correctReasoning:
        'Force multiplied by time gives impulse, not momentum. However, by the impulse-momentum theorem, impulse equals the CHANGE in momentum (F·Δt = Δp). Momentum itself is simply mass times velocity (p = mv). The distinction is between momentum (a state quantity) and impulse (a process quantity).',
      tip: 'Impulse (F × t) = change in momentum (Δp), but momentum itself = m × v. NEET questions test whether you know the difference between a quantity and its change.',
      conceptTag: 'momentum',
    },
    {
      questionId: 'phy-lom-016',
      selectedOptionId: 'd',
      misconception:
        'Confusing the momentum formula with the kinetic energy formula. Mass × speed² resembles ½mv² (kinetic energy).',
      correctReasoning:
        'Momentum is p = mv (mass times velocity, a vector), while kinetic energy is KE = ½mv² (half of mass times velocity squared, a scalar). They are related but different quantities. Momentum has direction and is measured in kg·m/s; kinetic energy has no direction and is measured in Joules.',
      tip: 'Momentum = mv (linear in v, vector), KE = ½mv² (quadratic in v, scalar). In NEET, check if the question asks for a vector or scalar quantity to pick the right formula.',
      conceptTag: 'momentum',
    },

    // phy-lom-019: Apparent weight in lift accelerating up — correct: d (increases)
    {
      questionId: 'phy-lom-019',
      selectedOptionId: 'a',
      misconception:
        'Confusing upward acceleration with downward acceleration. When a lift accelerates downward, apparent weight decreases — not when it accelerates upward.',
      correctReasoning:
        'When a lift accelerates upward, the floor must push you harder to give you the upward acceleration in addition to supporting your weight. So apparent weight = m(g + a), which is greater than mg. Apparent weight decreases only when the lift accelerates downward, where it becomes m(g − a).',
      tip: 'Lift going UP with acceleration a: apparent weight = m(g + a). Lift going DOWN with acceleration a: apparent weight = m(g − a). Write these two formulas on your rough sheet in NEET.',
      conceptTag: 'apparent-weight',
    },
    {
      questionId: 'phy-lom-019',
      selectedOptionId: 'b',
      misconception:
        'Thinking that weight never changes regardless of the lift\'s motion. Students confuse actual gravitational weight (mg) with apparent weight.',
      correctReasoning:
        'Your actual weight (gravitational force mg) stays constant, but your apparent weight (the reading on a weighing scale, which equals the normal force) changes with acceleration. In a lift accelerating upward, the normal force exceeds mg, so the scale reads more. This is why you feel heavier.',
      tip: 'Actual weight (mg) is constant near Earth\'s surface. Apparent weight (normal force N) changes with acceleration. NEET always asks about apparent weight in lift problems.',
      conceptTag: 'apparent-weight',
    },
    {
      questionId: 'phy-lom-019',
      selectedOptionId: 'c',
      misconception:
        'Thinking apparent weight becomes zero when the lift accelerates upward. Zero apparent weight occurs only in free fall (a = g downward), not during upward acceleration.',
      correctReasoning:
        'Apparent weight becomes zero only when the lift is in free fall (cable snaps, acceleration = g downward), giving weightlessness. When the lift accelerates upward, apparent weight actually increases to m(g + a). The condition for zero apparent weight is g − a = 0, i.e., a = g downward.',
      tip: 'Weightlessness (N = 0) occurs ONLY in free fall (a = g downward). NEET loves asking: "When does a person feel weightless in a lift?" Answer: only when the lift falls freely.',
      conceptTag: 'apparent-weight',
    },

    // phy-lom-022: Impulse equals — correct: c (change in momentum)
    {
      questionId: 'phy-lom-022',
      selectedOptionId: 'a',
      misconception:
        'Thinking impulse is the same as force. Students forget that impulse involves force applied over a duration of time.',
      correctReasoning:
        'Impulse is not just force — it is force multiplied by the time interval over which it acts (J = F·Δt). By Newton\'s second law, this equals the change in momentum (Δp). A large force for a very short time can produce the same impulse as a small force for a longer time.',
      tip: 'Impulse = F × Δt = Δp. In NEET, cricket bat and ball questions test this: the bat applies force over a short time to change the ball\'s momentum.',
      conceptTag: 'impulse',
    },
    {
      questionId: 'phy-lom-022',
      selectedOptionId: 'b',
      misconception:
        'Confusing impulse with acceleration. Acceleration is the rate of change of velocity, not related to impulse directly.',
      correctReasoning:
        'Impulse is defined as the change in momentum (Δp = mΔv) or equivalently force times time (F·Δt). Acceleration is the rate of change of velocity (a = Δv/Δt). While both involve velocity changes, impulse accounts for mass and time duration, making it a different physical concept from acceleration.',
      tip: 'Acceleration = Δv/Δt (rate of velocity change). Impulse = m·Δv = F·Δt (total momentum change). NEET questions on impulse often involve collisions — think momentum, not acceleration.',
      conceptTag: 'impulse',
    },
    {
      questionId: 'phy-lom-022',
      selectedOptionId: 'd',
      misconception:
        'Confusing impulse with kinetic energy. Students mix up the impulse-momentum theorem with the work-energy theorem.',
      correctReasoning:
        'Impulse equals the change in momentum (Δp), while kinetic energy is ½mv². The work-energy theorem relates work (force × displacement) to change in kinetic energy, whereas the impulse-momentum theorem relates impulse (force × time) to change in momentum. They use different quantities.',
      tip: 'Force × time = impulse = Δ(momentum). Force × displacement = work = Δ(kinetic energy). In NEET, identify whether the question gives time or displacement to decide which theorem to use.',
      conceptTag: 'impulse',
    },
  ],
};
