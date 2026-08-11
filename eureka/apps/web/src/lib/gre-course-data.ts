/**
 * Physics GRE (GRE Physics Subject Test) course content.
 *
 * 50 chapters across the nine ETS content areas. Written for this course:
 * no ETS question, passage or explanation is reproduced, and no released
 * test item appears here. Worked examples are constructed to make a method
 * visible, and every number in them is one you can check.
 *
 * This file replaced the GRE General Test course (Verbal, Quantitative,
 * Analytical Writing). None of that content carried over. A general-test
 * lesson relabelled as a physics lesson would be a lie about what a
 * learner is reading, so the old material was deleted rather than
 * repurposed; it is in git history if it is ever wanted back.
 *
 * Conventions used throughout, because the exam does:
 *   - SI units unless a problem says otherwise
 *   - g = 9.8 m/s^2 near Earth's surface
 *   - hbar for the reduced Planck constant, k_B for Boltzmann's constant
 *   - vectors are named in bold in prose and by component in equations
 */

import type { TopicLesson } from '@/lib/cissp-course-data';
// TopicLesson = { topicId, title, domainWeight, overview, sections[], keyTakeaways? }
// LessonSection = { id, title, content, examTip?, importantNote?, quiz? }

export const GRE_COURSE: Record<string, TopicLesson> = {

  // ═══════════════════════════════════════════════════════════
  // CLASSICAL MECHANICS — 20% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_cm_kinematics: {
    topicId: 'pgre_cm_kinematics',
    title: 'Kinematics',
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Kinematics describes motion without asking what causes it. On this test it is rarely the whole question, but it is the first line of many of them, so the constant-acceleration relations and the projectile decomposition have to be automatic rather than derived under time pressure.`,
    sections: [
      {
        id: 'cm-kin-1-constant-a',
        title: '1. Motion With Constant Acceleration',
        content: `## The four relations

For constant acceleration \`a\` along a line, with initial position \`x0\` and initial velocity \`v0\`:

- \`v = v0 + a t\`
- \`x = x0 + v0 t + (1/2) a t^2\`
- \`v^2 = v0^2 + 2 a (x - x0)\`
- \`x = x0 + (1/2)(v0 + v) t\`

The third relation is the one to reach for whenever the problem gives you distances and speeds but never mentions time, and the fourth whenever it gives you the two speeds and the time but not the acceleration. Choosing the relation that skips the unknown you were never given is most of the speed advantage on this section.

## Reading a graph

On a position-time graph the slope is velocity; on a velocity-time graph the slope is acceleration and **the area under the curve is displacement**. That area statement is worth more than it looks: a velocity-time graph made of straight segments turns a multi-stage problem into two triangles and a rectangle, which you can add in your head.

## Worked example

A particle starts from rest and accelerates uniformly to 20 m/s over 40 m. What is the acceleration?

No time is given, so use the third relation: \`20^2 = 0 + 2a(40)\`, giving \`400 = 80a\` and \`a = 5 m/s^2\`.

Now: how long did it take? Once \`a\` is known the first relation gives \`t = v/a = 20/5 = 4 s\`. Notice that the average velocity is 10 m/s and 40 m / 10 m/s = 4 s agrees — a two-second consistency check that catches sign and factor-of-two errors.`,
        examTip: `Write down which of x, v0, v, a, t you have and which you want, then pick the relation missing the one you neither have nor want. It is faster than solving a system and it removes the temptation to find time as an intermediate step you never needed.`,
      },
      {
        id: 'cm-kin-2-projectile',
        title: '2. Projectile Motion',
        content: `## Decompose and never re-couple

With gravity the only force, the horizontal and vertical motions are independent: \`a_x = 0\` and \`a_y = -g\`. So \`x(t) = v0 cos(theta) t\` and \`y(t) = v0 sin(theta) t - (1/2) g t^2\`. Time is the only quantity the two share, which is why almost every projectile problem is solved by finding \`t\` in one direction and substituting into the other.

## Results worth carrying

For launch and landing at the same height, with launch speed \`v0\` at angle \`theta\`:

- time of flight \`T = 2 v0 sin(theta) / g\`
- maximum height \`H = v0^2 sin^2(theta) / (2g)\`
- range \`R = v0^2 sin(2 theta) / g\`

The range formula makes two facts obvious that are otherwise easy to forget: range is maximised at 45 degrees, and complementary angles give the same range, because \`sin(2 theta)\` is symmetric about 90 degrees. A 30-degree and a 60-degree launch at the same speed land in the same place — but the 60-degree one spends longer in the air and goes higher.

## Worked example

A ball is thrown at 20 m/s at 30 degrees above the horizontal from ground level. Where does it land?

\`R = (20^2)(sin 60)/9.8 = 400(0.866)/9.8 = 35.3 m\`.

Its maximum height: \`H = (400)(0.25)/(19.6) = 5.1 m\`. Check the flight time: \`T = 2(20)(0.5)/9.8 = 2.04 s\`, and \`x = 20 cos(30)(2.04) = 17.3 x 2.04 = 35.3 m\`. Consistent.`,
        importantNote: `At the top of the trajectory the vertical velocity is zero but the acceleration is still -g, and the speed is not zero — it is the horizontal component v0 cos(theta). A choice claiming zero acceleration or zero speed at the apex is there to catch exactly this.`,
      },
      {
        id: 'cm-kin-3-circular-relative',
        title: '3. Circular and Relative Motion',
        content: `## Uniform circular motion

Moving in a circle of radius \`r\` at constant speed \`v\`, the acceleration points at the centre and has magnitude \`a_c = v^2 / r = omega^2 r\`, where \`omega = v/r\` is the angular speed. The speed is constant; the velocity is not, because its direction changes — that change is the whole acceleration.

If the speed also changes, the acceleration has a tangential component \`a_t = dv/dt\` as well, and the total is the vector sum: \`a = sqrt(a_c^2 + a_t^2)\`.

## Relative velocity

In one frame moving at velocity \`u\` relative to another, velocities add as vectors: \`v_AC = v_AB + v_BC\`. This is the non-relativistic limit; at speeds where \`v/c\` matters you need the relativistic addition rule instead, which is covered under special relativity.

## Worked example

A car rounds a curve of radius 50 m at 15 m/s. What centripetal acceleration does it need, and what coefficient of static friction is the minimum that supplies it on level road?

\`a_c = 15^2/50 = 4.5 m/s^2\`. Friction must supply \`m a_c\`, and its maximum is \`mu_s m g\`, so \`mu_s >= a_c/g = 4.5/9.8 = 0.46\`. The mass cancels — a fact the exam likes to test by giving you a mass you do not need.`,
        examTip: `When a problem hands you a quantity that cancels (a mass in a friction or free-fall problem, a length in a ratio), that is often the signal that the intended solution is a one-line ratio rather than a full calculation.`,
      },
    ],
    keyTakeaways: [
      'Pick the constant-acceleration relation that omits the variable you were neither given nor asked for.',
      'Horizontal and vertical projectile motions share only the time.',
      'Range is maximal at 45 degrees, and complementary launch angles give equal ranges.',
      'At the apex of a trajectory the vertical velocity vanishes but the acceleration does not.',
      'Centripetal acceleration is v^2/r; the mass usually cancels in the friction condition.',
    ],
  },

  pgre_cm_newton: {
    topicId: 'pgre_cm_newton',
    title: "Newton's Laws & Dynamics",
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Dynamics on this test is mostly bookkeeping done correctly and fast: draw the forces, choose axes that kill the most components, write one equation per body per axis. The physics is rarely hard; the errors are almost always a missing force or a sign.`,
    sections: [
      {
        id: 'cm-newt-1-laws',
        title: '1. The Three Laws and the Free-Body Diagram',
        content: `## The laws, stated usefully

1. A body with no net force keeps constant velocity. "At rest" is not special.
2. \`F_net = m a\`, or more generally \`F_net = dp/dt\`, which is the form you need when mass changes.
3. Forces come in pairs acting on **different** bodies. The pair partner of the normal force on a block from a table is the block's push on the table, not the block's weight.

## Drawing the diagram

One body at a time. Include only forces acting **on** that body: gravity, normal, friction, tension, applied, spring. Do not draw \`m a\` — it is the result, not a force. Do not draw centrifugal force in an inertial frame.

Choose axes along the acceleration when you can. On an incline of angle \`theta\`, tilting the axes turns the weight into \`mg sin(theta)\` down-slope and \`mg cos(theta)\` into the surface, and the normal force stays on one axis instead of two.

## Worked example

A 2 kg block on a frictionless 30-degree incline is connected over a massless pulley to a hanging 3 kg block. Find the acceleration.

Down-slope for the first block and downward for the second are the same direction of motion, so take that as positive. For the hanging block: \`3g - T = 3a\`. For the incline block: \`T - 2g sin(30) = 2a\`. Adding eliminates \`T\`: \`3g - 2g(0.5) = 5a\`, so \`2g = 5a\` and \`a = 2(9.8)/5 = 3.9 m/s^2\`.

Sanity check: the hanging weight (29.4 N) exceeds the down-slope component (9.8 N), so the system accelerates in the direction assumed. Had the answer come out negative, the assumption was simply backwards, not wrong.`,
        importantNote: `The normal force equals mg only on level ground with no vertical acceleration and no other vertical force. In an accelerating lift, on an incline, or with an applied force that has a vertical component, it does not — and that is where most normal-force questions live.`,
      },
      {
        id: 'cm-newt-2-friction',
        title: '2. Friction, Tension and Constraints',
        content: `## Two frictions

- **Static**: \`f_s <= mu_s N\`. It is whatever it needs to be, up to that maximum. Writing \`f_s = mu_s N\` when the body is not on the verge of slipping is the single most common friction error.
- **Kinetic**: \`f_k = mu_k N\`, opposing the relative sliding, and it is a fixed value once sliding starts. Usually \`mu_k < mu_s\`, which is why a pushed object lurches once it breaks free.

## Tension and ideal strings

A massless string over a frictionless massless pulley has the same tension throughout. Give the pulley mass and that fails: the torque required to angularly accelerate it makes the tensions on the two sides differ, and you now need the rotational equation as well.

## Constraints

Bodies connected by an inextensible string share the magnitude of acceleration. A block on a moving wedge does not — its acceleration relative to the ground is the vector sum of its acceleration relative to the wedge and the wedge's own. Constraint relations are where a problem stops being routine.

## Worked example

What minimum \`mu_s\` keeps a block from sliding down an incline at angle \`theta\`?

On the verge: \`mg sin(theta) = mu_s mg cos(theta)\`, so \`mu_s = tan(theta)\`. The mass cancels and the answer is the tangent of the angle of repose — a result worth memorising, because it converts an experimentally measured angle straight into a coefficient.`,
        examTip: `If a body is stated to be in equilibrium or "on the point of slipping", static friction is at its maximum and the equality holds. Otherwise treat static friction as an unknown and solve for it — then check it does not exceed mu_s N.`,
      },
      {
        id: 'cm-newt-3-drag-variable',
        title: '3. Drag and Variable Forces',
        content: `## Linear drag

With \`F = -bv\`, Newton's second law gives \`m dv/dt = mg - bv\` for a falling body. The terminal velocity is where the acceleration vanishes: \`v_t = mg/b\`. Solving the equation gives

\`v(t) = v_t (1 - e^(-t/tau))\`, with \`tau = m/b\`.

The approach to terminal velocity is exponential, so it is never actually reached, and the time constant is mass over drag coefficient. Quadratic drag \`F = -c v^2\` gives \`v_t = sqrt(mg/c)\` and a hyperbolic-tangent approach; you rarely need to integrate it, but you should recognise the terminal-velocity scaling.

## Position-dependent force

When \`F\` depends on position rather than time, use the chain-rule trick

\`a = dv/dt = (dv/dx)(dx/dt) = v dv/dx\`

which converts the equation of motion into something you can integrate over position — and which is exactly the step that produces the work-energy theorem.

## Worked example

A body falls with linear drag and reaches half its terminal velocity. At what fraction of \`t\` has that happened, in units of \`tau\`?

\`0.5 = 1 - e^(-t/tau)\`, so \`e^(-t/tau) = 0.5\` and \`t = tau ln 2 = 0.69 tau\`.`,
      },
    ],
    keyTakeaways: [
      'One free-body diagram per body; never draw ma as a force.',
      'Static friction is an inequality until the body is on the verge of slipping.',
      'The normal force equals mg only in the level, non-accelerating, no-other-vertical-force case.',
      'A massless string over a massless frictionless pulley has uniform tension; give the pulley mass and it does not.',
      'Terminal velocity is mg/b for linear drag and sqrt(mg/c) for quadratic.',
    ],
  },

  pgre_cm_energy: {
    topicId: 'pgre_cm_energy',
    title: 'Work, Energy & Conservation Laws',
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Energy methods answer in one line what force methods answer in five, whenever the question asks about speeds and positions rather than times. The skill being tested is recognising which situation you are in — and knowing exactly when mechanical energy is not conserved.`,
    sections: [
      {
        id: 'cm-en-1-work-theorem',
        title: '1. Work and the Work-Energy Theorem',
        content: `## Definition

\`W = integral F . dr\`, the line integral of force along the path. For a constant force over a straight displacement this reduces to \`W = F d cos(theta)\`, with \`theta\` the angle between force and displacement. A force perpendicular to the motion does no work — which is why the normal force and the magnetic force never appear in an energy balance, and why circular motion at constant speed needs no work input.

## The theorem

\`W_net = Delta KE = (1/2) m v^2 - (1/2) m v0^2\`.

This is not a separate law; it is Newton's second law integrated over position. It holds whether or not the forces are conservative, which makes it the right tool when friction is present.

## Worked example

A 5 kg box is pushed 4 m across a floor by a 30 N horizontal force against a friction force of 10 N. Starting from rest, what is its final speed?

Net force is 20 N, so \`W_net = 80 J\`, giving \`(1/2)(5)v^2 = 80\`, \`v^2 = 32\`, \`v = 5.7 m/s\`.`,
      },
      {
        id: 'cm-en-2-conservative',
        title: '2. Conservative Forces and Potential Energy',
        content: `## What makes a force conservative

A force is conservative when the work it does around any closed path is zero — equivalently, when the work depends only on the endpoints, equivalently when \`curl F = 0\`. Gravity and the spring force qualify; friction and drag do not, which is why you cannot define a potential energy for them.

For a conservative force, \`F = -dU/dx\` in one dimension and \`F = -grad U\` in three. The minus sign says force points downhill on the potential energy curve.

Standard potentials:
- near-Earth gravity: \`U = mgh\`
- universal gravitation: \`U = -G M m / r\`
- ideal spring: \`U = (1/2) k x^2\`

## Reading a potential energy curve

This is a favourite question type. Given \`U(x)\` and a total energy \`E\`:

- The motion is confined to regions where \`U(x) <= E\`; the points where \`U = E\` are turning points.
- Minima of \`U\` are points of stable equilibrium, maxima are unstable, flat regions are neutral.
- Kinetic energy at any point is \`E - U(x)\`, so the particle moves fastest where \`U\` is deepest.
- Near a minimum, \`U\` is approximately parabolic, so small oscillations are simple harmonic with \`omega = sqrt(U''(x0)/m)\`.

That last point connects this section to oscillations and is asked often enough to be worth memorising as a formula rather than re-derived.

## Worked example

A particle in \`U(x) = a x^4 - b x^2\` has equilibria where \`dU/dx = 4a x^3 - 2b x = 0\`, i.e. \`x = 0\` and \`x = ±sqrt(b/2a)\`. The second derivative is \`12 a x^2 - 2b\`, which is \`-2b < 0\` at the origin (unstable) and \`+4b > 0\` at the outer roots (stable). A double-well.`,
        importantNote: `Mechanical energy is conserved only when the non-conservative work is zero. With friction present, use W_friction = -f d and write KE_i + U_i + W_nc = KE_f + U_f. Applying conservation of mechanical energy in the presence of friction is the most common energy mistake on the test.`,
      },
      {
        id: 'cm-en-3-power',
        title: '3. Power and Energy in Practice',
        content: `## Power

\`P = dW/dt = F . v\`. The second form is the useful one: a car engine delivering constant power \`P\` at speed \`v\` exerts force \`P/v\`, which is why acceleration falls off at high speed even at full throttle.

Average power is total work over total time; instantaneous power is the dot product above. The exam distinguishes them.

## Choosing your method

- Asked for speed after a distance, with no time mentioned: **energy**.
- Asked for anything involving time explicitly: **forces and kinematics**, or impulse.
- Asked about a collision: **momentum first**, energy only if the collision is stated elastic.
- Asked about a fixed axis rotation: **energy including (1/2) I omega^2**.

## Worked example

A 1000 kg car climbs a 5-degree slope at a constant 20 m/s against a 400 N resistive force. What power does the engine deliver?

At constant speed the driving force balances gravity's component plus resistance: \`F = mg sin(5) + 400 = 1000(9.8)(0.0872) + 400 = 854 + 400 = 1254 N\`. So \`P = Fv = 1254(20) = 25.1 kW\`, about 34 horsepower.`,
        examTip: `A question that gives you a height and asks for a speed, or a speed and asks for a height, is an energy question no matter how it is dressed up. Reach for conservation before you reach for kinematics.`,
      },
    ],
    keyTakeaways: [
      'The work-energy theorem holds for all forces; conservation of mechanical energy holds only without non-conservative work.',
      'A conservative force is minus the gradient of its potential energy.',
      'Minima of U are stable equilibria; small oscillations there have omega = sqrt(U\'\'/m).',
      'Kinetic energy at a point on a U(x) curve is E - U(x); turning points are where they meet.',
      'P = F.v explains why constant-power vehicles accelerate less at high speed.',
    ],
  },

  pgre_cm_momentum: {
    topicId: 'pgre_cm_momentum',
    title: 'Momentum, Collisions & Systems of Particles',
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Momentum is conserved whenever the net external force vanishes, which is far more often than energy is conserved. Collision questions on this test are usually decided by knowing which conservation law you are allowed to write down.`,
    sections: [
      {
        id: 'cm-mom-1-impulse',
        title: '1. Momentum and Impulse',
        content: `## Definitions

\`p = m v\`, and Newton's second law in its general form is \`F_net = dp/dt\`. Integrating over time gives the impulse-momentum theorem:

\`J = integral F dt = Delta p\`.

The impulse is the area under a force-time curve. This is how you handle short, large, badly-known forces — a bat on a ball, a foot on a floor — where you know the momentum change but never the instantaneous force.

## Conservation

For a system with no net external force, total momentum is constant. During a collision, internal forces are enormous and external forces (gravity, friction) act for a negligible time, so momentum is conserved **through the collision** even when it would not be conserved over a longer interval. That approximation is what licenses every collision calculation on this exam.

Momentum is a vector: it is conserved component by component. A two-dimensional collision gives you two equations, not one.

## Worked example

A 0.15 kg ball arrives at 40 m/s and leaves at 50 m/s in the opposite direction after 2 ms of contact. Find the average force.

\`Delta p = 0.15(50) - 0.15(-40) = 7.5 + 6 = 13.5 kg m/s\`. So \`F_avg = 13.5 / 0.002 = 6750 N\`, roughly 4600 times the ball's weight — which is why contact forces dominate gravity during a collision.`,
      },
      {
        id: 'cm-mom-2-collisions',
        title: '2. Collisions',
        content: `## The classification

- **Elastic**: momentum and kinetic energy both conserved.
- **Inelastic**: momentum conserved, kinetic energy is not.
- **Perfectly inelastic**: the bodies stick together, and the kinetic energy lost is the maximum consistent with momentum conservation.

Momentum is conserved in all three. Only the elastic case lets you also write a kinetic-energy equation.

## One-dimensional elastic collision

For masses \`m1, m2\` with initial velocities \`u1, u2\`, the algebra collapses to a useful relative-velocity statement: **the relative velocity reverses**, \`u1 - u2 = -(v1 - v2)\`. Combined with momentum conservation this gives

\`v1 = ((m1 - m2)u1 + 2 m2 u2)/(m1 + m2)\`

and the same with 1 and 2 swapped. Three limits worth knowing cold:

- Equal masses, target at rest: the velocities exchange. The incoming body stops dead.
- Very heavy projectile on a light target: the projectile barely slows, the target leaves at \`2u1\`.
- Very light projectile on a heavy target: the projectile bounces straight back at nearly \`u1\`.

## Perfectly inelastic

\`v = (m1 u1 + m2 u2)/(m1 + m2)\`, and the energy lost is \`(1/2) mu (u1 - u2)^2\` where \`mu = m1 m2/(m1 + m2)\` is the reduced mass. Note the energy loss depends only on the **relative** velocity, so it is the same in every inertial frame — as it must be.

## Worked example

A 2 kg block at 6 m/s strikes a stationary 4 kg block and they stick. Final speed and energy lost?

\`v = 2(6)/6 = 2 m/s\`. Initial KE is \`36 J\`, final is \`(1/2)(6)(4) = 12 J\`, so 24 J is lost — two thirds of it. Check with the reduced-mass formula: \`mu = 8/6 = 1.33\`, and \`(1/2)(1.33)(36) = 24 J\`. Agrees.`,
        examTip: `If a question says "the bodies stick together" or "the bullet embeds", it is perfectly inelastic: use momentum only. If it says "elastic" or "the bodies separate with no energy loss", you get a second equation. If it says neither, you cannot assume energy is conserved.`,
      },
      {
        id: 'cm-mom-3-com-rockets',
        title: '3. Centre of Mass and Variable Mass',
        content: `## Centre of mass

\`R = (sum m_i r_i)/(sum m_i)\`, and for a continuous body \`R = (1/M) integral r dm\`. The centre of mass moves as though all the mass were there and all external forces acted there:

\`M A_cm = F_ext\`.

So an exploding shell's centre of mass continues on its parabola regardless of how the fragments fly — a standard question, and the answer is always "the same place the unexploded shell would have landed", provided no fragment has landed yet.

## Working in the centre-of-mass frame

In the frame where total momentum is zero, an elastic collision simply reverses every velocity. Transforming into that frame, reversing, and transforming back is often faster than solving the quadratic in the lab frame.

## Variable mass

Use \`F = dp/dt\` in full, not \`ma\`. For a rocket ejecting mass at exhaust speed \`v_e\` relative to itself, the result is the Tsiolkovsky equation:

\`Delta v = v_e ln(m_i / m_f)\`

in free space. The logarithm is the reason staging exists: a fixed exhaust speed buys you velocity only logarithmically in the mass ratio.

## Worked example

A rocket with exhaust speed 3 km/s burns from 10 tonnes to 2 tonnes. Its velocity change is \`3 ln(5) = 3(1.61) = 4.8 km/s\`.`,
      },
    ],
    keyTakeaways: [
      'Momentum is conserved through any collision; kinetic energy only if the collision is elastic.',
      'In a 1-D elastic collision the relative velocity reverses.',
      'Equal masses in an elastic collision exchange velocities.',
      'The centre of mass of a system accelerates only under external forces, whatever the internal ones do.',
      'For variable mass use F = dp/dt; the rocket equation is logarithmic in mass ratio.',
    ],
  },

  pgre_cm_rotation: {
    topicId: 'pgre_cm_rotation',
    title: 'Rigid-Body Rotation & Angular Momentum',
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Rotation is translation with every symbol replaced by its angular counterpart, plus one genuinely new idea: the moment of inertia depends on the axis. Most errors here are using the wrong I, or forgetting that rolling couples rotation to translation.`,
    sections: [
      {
        id: 'cm-rot-1-inertia',
        title: '1. Moment of Inertia',
        content: `## Definition and the standard bodies

\`I = sum m_i r_i^2\`, or \`I = integral r^2 dm\`, where \`r\` is the distance from the **axis**, not from the centre. Memorise these about the symmetry axis through the centre of mass:

| Body | I |
|---|---|
| Point mass at radius R | \`M R^2\` |
| Thin hoop, axis through centre | \`M R^2\` |
| Solid disc or cylinder | \`(1/2) M R^2\` |
| Solid sphere | \`(2/5) M R^2\` |
| Thin spherical shell | \`(2/3) M R^2\` |
| Rod about its centre | \`(1/12) M L^2\` |
| Rod about its end | \`(1/3) M L^2\` |

The pattern: mass concentrated further out gives a larger coefficient. If you forget one, you can usually bracket it — a solid sphere must be less than a shell, and both less than a hoop.

## Parallel-axis theorem

\`I = I_cm + M d^2\` for an axis parallel to one through the centre of mass at distance \`d\`. This is how the rod's end value follows from its centre value: \`(1/12)ML^2 + M(L/2)^2 = (1/12 + 1/4)ML^2 = (1/3)ML^2\`.

## Worked example

Four 2 kg masses sit at the corners of a square of side 1 m. What is I about an axis through the centre, perpendicular to the square?

Each mass is at \`r = sqrt(2)/2 = 0.707 m\`, so \`I = 4(2)(0.5) = 4 kg m^2\`.`,
        examTip: `The parallel-axis theorem only works from the centre-of-mass axis. Going between two arbitrary parallel axes requires stepping through the centre of mass, not subtracting one d^2 from another.`,
      },
      {
        id: 'cm-rot-2-dynamics',
        title: '2. Torque, Angular Momentum and Rolling',
        content: `## The angular equations

- \`tau = r x F\`, magnitude \`r F sin(theta)\`
- \`tau_net = I alpha\` about a fixed axis
- \`L = I omega\` about a fixed axis, and \`L = r x p\` for a particle
- \`tau_net = dL/dt\`
- rotational kinetic energy \`= (1/2) I omega^2\`
- work \`= integral tau d(theta)\`, power \`= tau omega\`

Angular momentum is conserved when the net external torque is zero. That is the skater-pulling-in-arms question: \`I\` falls, so \`omega\` rises, and because \`KE = L^2/2I\` with \`L\` fixed, the kinetic energy **rises** — supplied by the work the skater does pulling inward. Candidates who assume energy is conserved get this backwards.

## Rolling without slipping

The constraint is \`v_cm = omega R\` and \`a_cm = alpha R\`. Total kinetic energy splits:

\`KE = (1/2) M v_cm^2 + (1/2) I_cm omega^2 = (1/2) M v^2 (1 + I_cm/MR^2)\`.

So for a body rolling from rest down a height \`h\`:

\`v = sqrt(2gh / (1 + I_cm/MR^2))\`.

The bracket depends only on the **shape**, not on mass or radius. A solid sphere (2/5) beats a disc (1/2) beats a hoop (1). Every uniform sphere reaches the bottom together regardless of size or density — a classic question whose answer surprises people.

## Worked example

A solid disc rolls from rest down a 2 m height. \`v = sqrt(2(9.8)(2)/1.5) = sqrt(26.1) = 5.1 m/s\`, against \`sqrt(2gh) = 6.3 m/s\` for a frictionless slide. A third of the energy went into rotation.`,
        importantNote: `Static friction is what makes rolling without slipping possible, but it does no work: the contact point is instantaneously at rest, so there is no sliding for it to dissipate. Energy is still conserved in ideal rolling.`,
      },
      {
        id: 'cm-rot-3-precession',
        title: '3. Gyroscopes and Precession',
        content: `## Why a spinning top does not fall

For a rapidly spinning gyroscope, gravity exerts a torque \`tau = M g r\` perpendicular to the spin angular momentum \`L\`. Since \`dL/dt = tau\` and the torque is perpendicular to \`L\`, it changes \`L\`'s direction rather than its magnitude — the axis sweeps around instead of toppling.

The precession rate follows from \`tau = L Omega_p\` for perpendicular torque:

\`Omega_p = M g r / (I omega)\`.

Faster spin means slower precession, which matches the observation that a slowing top precesses ever faster before it falls.

## The vector habit

The right-hand rule matters here and the exam knows it. Curl the fingers of the right hand in the sense of rotation; the thumb gives \`omega\` and \`L\`. Torque \`r x F\` follows the same rule. Most precession errors are direction errors, not magnitude errors.

## Worked example

A gyroscope with \`I = 0.02 kg m^2\` spins at 200 rad/s, supported 0.05 m from its pivot, with mass 0.5 kg. Then \`Omega_p = (0.5)(9.8)(0.05)/(0.02 x 200) = 0.245/4 = 0.061 rad/s\` — one revolution roughly every 100 seconds.`,
      },
    ],
    keyTakeaways: [
      'I depends on the axis; the parallel-axis theorem runs only from the centre-of-mass axis.',
      'With L fixed, reducing I raises both omega and the kinetic energy — work was done.',
      'Rolling speed at the bottom of a ramp depends only on shape through I/MR^2.',
      'Static friction enables rolling without slipping and dissipates nothing.',
      'Precession rate is Mgr/(I omega): the faster the spin, the slower the precession.',
    ],
  },

  pgre_cm_oscillations: {
    topicId: 'pgre_cm_oscillations',
    title: 'Oscillations',
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Simple harmonic motion appears far beyond springs: any system near a potential minimum oscillates harmonically for small enough displacements, which is why this material resurfaces in molecular vibrations, LC circuits and quantum mechanics.`,
    sections: [
      {
        id: 'cm-osc-1-shm',
        title: '1. Simple Harmonic Motion',
        content: `## The equation and its solution

Any restoring force proportional to displacement, \`F = -kx\`, gives \`d^2x/dt^2 = -(k/m) x\`, whose solution is

\`x(t) = A cos(omega t + phi)\`, with \`omega = sqrt(k/m)\`.

The period \`T = 2 pi sqrt(m/k)\` is **independent of amplitude**. That is the defining feature of harmonic motion and it fails as soon as the restoring force stops being linear.

Velocity and acceleration follow by differentiation: \`v_max = A omega\`, \`a_max = A omega^2\`. Energy shuttles between kinetic and potential with total \`E = (1/2) k A^2\`, constant.

## The standard oscillators

| System | omega |
|---|---|
| Mass on spring | \`sqrt(k/m)\` |
| Simple pendulum (small angle) | \`sqrt(g/L)\` |
| Physical pendulum | \`sqrt(mgd/I)\` |
| Torsional pendulum | \`sqrt(kappa/I)\` |
| LC circuit | \`sqrt(1/LC)\` |

The pendulum result requires \`sin(theta) ≈ theta\`, so it is a small-angle result; a large-amplitude pendulum has a longer period, and its period does depend on amplitude.

## Any potential minimum

Expand \`U(x)\` about a minimum at \`x0\`: \`U ≈ U(x0) + (1/2) U''(x0)(x-x0)^2\`. Comparing with \`(1/2)kx^2\` identifies \`k = U''(x0)\`, so

\`omega = sqrt(U''(x0)/m)\`.

This is the single most reusable result in the section.

## Worked example

A particle of mass \`m\` in \`U(x) = U0(x/a)^4 - 2U0(x/a)^2\` — the double well from earlier. At the stable minimum \`x0 = a\`, \`U'' = 8U0/a^2\`, so \`omega = sqrt(8U0/(m a^2))\`.`,
        examTip: `Given any potential and asked for the small-oscillation frequency, differentiate twice, evaluate at the equilibrium, divide by m, take the square root. It is a 30-second question dressed as a hard one.`,
      },
      {
        id: 'cm-osc-2-damped',
        title: '2. Damped Oscillation',
        content: `## The three regimes

With linear damping the equation is \`m x'' + b x' + k x = 0\`. Writing \`gamma = b/2m\` and \`omega_0 = sqrt(k/m)\`:

- **Underdamped** (\`gamma < omega_0\`): \`x = A e^(-gamma t) cos(omega_d t + phi)\` with \`omega_d = sqrt(omega_0^2 - gamma^2)\`. Oscillates inside a decaying envelope, and the damped frequency is slightly **lower** than the natural one.
- **Critically damped** (\`gamma = omega_0\`): returns to equilibrium in the shortest time without overshooting. This is what you design a door closer or a galvanometer for.
- **Overdamped** (\`gamma > omega_0\`): two decaying exponentials, no oscillation, and slower to settle than critical damping.

## Quality factor

\`Q = omega_0 / (2 gamma)\`, roughly the number of radians of oscillation before the energy falls by \`e\`. Energy decays as \`e^(-2 gamma t)\` — twice the amplitude rate, because energy goes as amplitude squared. A high-Q system is a lightly damped one.

## Worked example

An oscillator's amplitude falls to half in 10 complete cycles at 2 Hz. Then \`e^(-gamma t) = 0.5\` at \`t = 5 s\`, so \`gamma = ln2/5 = 0.139 s^-1\`. With \`omega_0 ≈ 2 pi (2) = 12.6 rad/s\`, \`Q = 12.6/0.277 = 45\`.`,
      },
      {
        id: 'cm-osc-3-driven',
        title: '3. Driven Oscillation and Resonance',
        content: `## Steady state

Drive the oscillator with \`F0 cos(omega t)\` and after transients die the system moves at the **driving** frequency, not its own, with amplitude

\`A(omega) = (F0/m) / sqrt((omega_0^2 - omega^2)^2 + (2 gamma omega)^2)\`.

The amplitude peaks near \`omega_0\` — precisely at \`sqrt(omega_0^2 - 2 gamma^2)\`, slightly below it — and the peak is taller and narrower the smaller the damping. The full width at half maximum in power is approximately \`2 gamma\`, so \`Q ≈ omega_0/Delta omega\`: the sharpness of the resonance is the quality factor.

## Phase

The response lags the drive by a phase that runs from 0 well below resonance, through exactly \`pi/2\` **at** \`omega_0\`, to \`pi\` well above. The quarter-cycle lag at resonance is the reason energy transfer is maximal there: the driving force is then in phase with the velocity.

## Worked example

Why does a lightly damped bridge or wineglass fail at one specific frequency? Because \`A\` scales as \`1/gamma\` at resonance: halving the damping doubles the response. Nothing about the drive changed; only the denominator did.`,
        importantNote: `In steady state a driven oscillator moves at the driving frequency. The natural frequency governs where the response is large and where the phase flips, not the frequency of the motion itself.`,
      },
    ],
    keyTakeaways: [
      'SHM period is amplitude-independent; that fails as soon as the restoring force is nonlinear.',
      'Small oscillations about any potential minimum have omega = sqrt(U\'\'(x0)/m).',
      'Damped frequency is below the natural one; critical damping settles fastest without overshoot.',
      'Energy decays at twice the amplitude rate, so Q = omega_0/2gamma measures both.',
      'A driven oscillator moves at the drive frequency and lags it by pi/2 exactly at resonance.',
    ],
  },

  pgre_cm_gravitation: {
    topicId: 'pgre_cm_gravitation',
    title: 'Gravitation & Central Forces',
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Central-force motion is where conservation laws pay off most: angular momentum conservation reduces a three-dimensional problem to a one-dimensional one in the radial coordinate, and the effective potential then answers most questions by inspection.`,
    sections: [
      {
        id: 'cm-grav-1-newton',
        title: '1. Newtonian Gravity',
        content: `## The law and its potential

\`F = -G M m / r^2\` directed inward, with potential energy \`U = -G M m / r\` taking zero at infinity. The negative sign matters: a bound orbit has \`E < 0\`, a parabolic escape trajectory \`E = 0\`, and a hyperbolic flyby \`E > 0\`. That classification answers a lot of questions on its own.

## The shell theorems

For a spherically symmetric body:
- Outside, it attracts as though all its mass were at the centre.
- Inside a uniform **shell**, the field is exactly zero.

So inside a uniform solid sphere only the mass at smaller radius contributes, giving \`g(r) = G M r / R^3\` — linear in \`r\`. A particle dropped down a tunnel through a uniform Earth therefore experiences a restoring force proportional to displacement and executes simple harmonic motion, with period \`2 pi sqrt(R^3/GM)\`, the same as a surface-skimming orbit. About 84 minutes for Earth.

## Escape velocity

Set \`E = 0\`: \`(1/2)mv^2 = GMm/R\`, so \`v_esc = sqrt(2GM/R) = sqrt(2) v_orbit\`. Escape speed is independent of the escaping mass and of the launch direction (ignoring the atmosphere and rotation).

## Worked example

Earth: \`GM = 3.99e14\`, \`R = 6.37e6 m\`. \`v_orbit = sqrt(3.99e14/6.37e6) = 7.9 km/s\`; \`v_esc = 11.2 km/s\`.`,
      },
      {
        id: 'cm-grav-2-kepler',
        title: "2. Kepler's Laws and Orbits",
        content: `## The three laws

1. Orbits are ellipses with the central body at one focus.
2. The line to the central body sweeps equal areas in equal times — this is just angular momentum conservation, since \`dA/dt = L/2m\`.
3. \`T^2 = (4 pi^2 / GM) a^3\`, where \`a\` is the **semi-major axis**, not the radius.

The third law is the one most often needed numerically, and the trap is using the perihelion distance or the average of the extremes in the wrong way. For an ellipse, \`a = (r_min + r_max)/2\`, which happens to be the arithmetic mean — that one is safe.

## Energy of an orbit

For any bound orbit, \`E = -GMm/(2a)\`, depending on the semi-major axis alone. So all orbits with the same \`a\` have the same energy and the same period, whatever their eccentricity. The vis-viva equation follows:

\`v^2 = GM(2/r - 1/a)\`,

which gives the speed anywhere on any orbit and is worth memorising outright.

## The virial theorem

For an inverse-square force, time-averaged, \`<KE> = -(1/2)<U>\` and \`E = -<KE>\`. A circular orbit satisfies this exactly at every instant: \`KE = GMm/2r\` and \`U = -GMm/r\`. This shows up in astrophysics questions about cluster masses.

## Worked example

A satellite in a circular orbit is given a small forward boost. Its energy rises, so \`a\` rises, so its **period lengthens and its average speed falls**. Speeding up a satellite slows it down — the standard counterintuitive result, and it follows directly from \`E = -GMm/2a\`.`,
        examTip: `Kepler's third law with a in astronomical units and T in years around the Sun makes the constant equal to 1: T^2 = a^3. Many questions are designed for that shortcut.`,
      },
      {
        id: 'cm-grav-3-effective',
        title: '3. The Effective Potential',
        content: `## Reducing the problem

For any central force, angular momentum \`L = m r^2 (d theta/dt)\` is conserved. Substituting it into the energy gives

\`E = (1/2) m (dr/dt)^2 + L^2/(2 m r^2) + U(r)\`,

which is a one-dimensional problem in \`r\` with the **effective potential**

\`U_eff(r) = U(r) + L^2/(2 m r^2)\`.

The added term is the centrifugal barrier: it is positive, blows up at small \`r\`, and keeps a particle with nonzero angular momentum from reaching the origin.

## Reading it

For gravity, \`U_eff = -GMm/r + L^2/2mr^2\` has a single minimum. Then:

- \`E\` equal to the minimum: a **circular** orbit at that radius.
- Minimum \`< E < 0\`: an **elliptical** orbit between two turning points.
- \`E = 0\`: **parabolic**, just barely unbound.
- \`E > 0\`: **hyperbolic**, unbound with speed left over at infinity.

Every orbit classification question is answered by placing \`E\` on this diagram.

## Stability of circular orbits

A circular orbit exists wherever \`U_eff\` is stationary and is stable where that stationary point is a minimum. For a power-law force \`F ∝ r^n\`, circular orbits are stable for \`n > -3\`. Inverse-square (\`n = -2\`) is comfortably stable; an inverse-cube force is marginal, which is why the solar system is not.

## Worked example

Show a circular orbit satisfies the effective potential minimum. \`dU_eff/dr = GMm/r^2 - L^2/mr^3 = 0\` gives \`L^2 = GMm^2 r\`, i.e. \`L = m sqrt(GMr)\` — exactly \`m v r\` with \`v = sqrt(GM/r)\`, the circular orbital speed.`,
      },
    ],
    keyTakeaways: [
      'Bound orbits have E < 0; E = 0 is parabolic escape and E > 0 is hyperbolic.',
      'Inside a uniform sphere g is linear in r, so a tunnel through it gives SHM.',
      "Kepler's third law uses the semi-major axis; orbital energy is -GMm/2a.",
      'Vis-viva, v^2 = GM(2/r - 1/a), gives the speed anywhere on any orbit.',
      'The centrifugal barrier in U_eff classifies every orbit by where E sits on the curve.',
    ],
  },

  pgre_cm_lagrangian: {
    topicId: 'pgre_cm_lagrangian',
    title: 'Lagrangian & Hamiltonian Mechanics',
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Analytical mechanics earns its place on this test because it turns constraint-heavy problems into a mechanical procedure. You will rarely be asked to solve the resulting equations; you will often be asked to write them, or to spot a conserved quantity from the Lagrangian's symmetry.`,
    sections: [
      {
        id: 'cm-lag-1-euler',
        title: '1. The Lagrangian and the Euler-Lagrange Equation',
        content: `## The recipe

1. Choose generalised coordinates \`q_i\` — as many as the system has degrees of freedom, chosen so that the constraints are already built in.
2. Write \`T\` and \`V\` in those coordinates.
3. Form \`L = T - V\`.
4. Apply, for each coordinate,

   \`d/dt (dL/d(q_i dot)) - dL/dq_i = 0\`.

Constraint forces never appear. That is the whole reason to use it: a bead on a wire, a pendulum on a cart, a rolling body — problems where finding the normal or tension force is the hard part become problems where you never need it.

## Worked example: the simple pendulum

One coordinate, \`theta\`. \`T = (1/2) m L^2 (theta dot)^2\`, \`V = -mgL cos(theta)\`, so \`L = (1/2)mL^2 (theta dot)^2 + mgL cos(theta)\`.

\`dL/d(theta dot) = m L^2 (theta dot)\`, so the time derivative is \`m L^2 (theta double dot)\`. And \`dL/d theta = -mgL sin(theta)\`. The equation is

\`m L^2 (theta double dot) + mgL sin(theta) = 0\`, i.e. \`theta'' = -(g/L) sin(theta)\`,

which for small angles is SHM at \`sqrt(g/L)\` as expected. Note that the tension never appeared.

## Worked example: Atwood machine

Coordinate \`x\`, the descent of \`m1\`. \`T = (1/2)(m1+m2)(x dot)^2\`, \`V = -m1 g x + m2 g x\`. Then \`(m1+m2) x'' = (m1 - m2) g\`, giving \`a = (m1-m2)g/(m1+m2)\` in one line, with no tension and no pulley.`,
        examTip: `Count degrees of freedom before anything else: total coordinates minus independent constraints. Getting that count wrong is the only way to get the whole problem wrong; everything after it is mechanical.`,
      },
      {
        id: 'cm-lag-2-conservation',
        title: '2. Cyclic Coordinates and Conservation',
        content: `## Symmetry gives conservation

If a coordinate \`q\` does not appear in \`L\` (only its derivative does), it is **cyclic** and its conjugate momentum

\`p = dL/d(q dot)\`

is conserved. This is Noether's theorem in its most usable form:

- \`L\` independent of \`x\` → linear momentum conserved (translational symmetry)
- \`L\` independent of \`theta\` → angular momentum conserved (rotational symmetry)
- \`L\` independent of \`t\` → the energy function conserved (time-translation symmetry)

Spotting a cyclic coordinate is often the entire question. In a central-force Lagrangian written in polar coordinates, \`theta\` is cyclic, so \`p_theta = m r^2 (theta dot) = L\` is constant — that is where the angular momentum conservation used in the orbit section comes from.

## The energy function

\`h = sum (q_i dot)(dL/d(q_i dot)) - L\`. When the kinetic energy is a quadratic form in the velocities and the constraints do not depend on time, \`h = T + V = E\`. Both conditions matter: a bead on a wire being rotated at forced constant angular velocity has a time-dependent constraint, and its \`h\` is conserved but is **not** the energy.

## Worked example

A particle in a central potential: \`L = (1/2)m(r'^2 + r^2 theta'^2) - U(r)\`. Since \`theta\` is absent, \`p_theta = m r^2 theta'\` is conserved. The \`r\` equation is \`m r'' = m r theta'^2 - dU/dr = p_theta^2/(m r^3) - dU/dr\`, which is exactly the effective-potential equation from the gravitation chapter.`,
        importantNote: `Conservation of the energy function h and conservation of the total energy E are different statements that coincide only under the two conditions above. Questions about rotating frames or moving constraints exploit the gap.`,
      },
      {
        id: 'cm-lag-3-hamiltonian',
        title: '3. The Hamiltonian',
        content: `## Legendre transform

Define the conjugate momenta \`p_i = dL/d(q_i dot)\`, then

\`H(q, p, t) = sum p_i (q_i dot) - L\`,

**expressed in terms of q and p, not velocities**. That re-expression is the step people skip and the reason their answer is wrong.

Hamilton's equations replace one second-order equation per coordinate with two first-order ones:

\`q_i dot = dH/dp_i\` and \`p_i dot = -dH/dq_i\`.

## When H is the energy

When the coordinates do not depend on time explicitly and \`V\` is velocity-independent, \`H = T + V\`. And \`dH/dt = -dL/dt\`, so if \`L\` has no explicit time dependence, \`H\` is conserved.

## Worked example

Mass on a spring. \`L = (1/2)m x'^2 - (1/2)k x^2\`, so \`p = m x'\` and \`x' = p/m\`. Then

\`H = p(p/m) - [(1/2)(p^2/m) - (1/2)kx^2] = p^2/(2m) + (1/2)k x^2\`,

the energy, as expected. Hamilton's equations return \`x' = p/m\` and \`p' = -kx\`, which combine to \`m x'' = -kx\`.

## Why it matters beyond this test

The Hamiltonian is the object that gets promoted to an operator in quantum mechanics, and \`H = p^2/2m + V\` is the direct ancestor of the Schrodinger equation you will meet in that section. Recognising the same expression in both places is worth more than either alone.`,
      },
    ],
    keyTakeaways: [
      'The Lagrangian procedure eliminates constraint forces you never wanted to compute.',
      'A coordinate absent from L has a conserved conjugate momentum.',
      'H = T + V only when the constraints are time-independent and V is velocity-independent.',
      'Hamilton\'s equations trade one second-order equation for two first-order ones.',
      'H must be written in q and p; leaving velocities in it is the standard error.',
    ],
  },

  pgre_cm_noninertial: {
    topicId: 'pgre_cm_noninertial',
    title: 'Non-Inertial Frames',
    domainWeight: 'Classical Mechanics · 20% of the exam',
    overview: `Rotating-frame questions are usually recognisable on sight and answerable from the two fictitious-force formulas. The skill is deciding which frame makes the problem easy, and then being consistent about it.`,
    sections: [
      {
        id: 'cm-noni-1-linear',
        title: '1. Linearly Accelerating Frames',
        content: `## The pseudo-force

In a frame accelerating at \`A\`, Newton's second law holds if you add a fictitious force \`-mA\` to every body. A pendulum in a car accelerating forward at \`A\` hangs backwards at angle \`theta = arctan(A/g)\` from vertical, because the effective gravity is the vector sum of \`g\` downward and \`A\` backwards, with magnitude \`sqrt(g^2 + A^2)\`.

The equivalence principle lives here: locally, no experiment distinguishes a uniform acceleration from a uniform gravitational field.

## Worked example

An accelerometer in a lift reads 11.8 N for a 1 kg mass. The lift is accelerating upward at \`a = 11.8/1 - 9.8 = 2 m/s^2\`. If it read 7.8 N the lift would be accelerating downward at 2 m/s^2 — and a reading of zero means free fall, not the absence of gravity.`,
      },
      {
        id: 'cm-noni-2-rotating',
        title: '2. Rotating Frames: Centrifugal and Coriolis',
        content: `## The two terms

In a frame rotating at constant \`omega\`, the apparent equation of motion is

\`m a' = F_real - m omega x (omega x r) - 2 m (omega x v')\`

where primes denote quantities measured in the rotating frame. The two extra terms are:

- **Centrifugal**: \`-m omega x (omega x r)\`, magnitude \`m omega^2 r_perp\`, directed outward from the rotation axis. It depends on position only.
- **Coriolis**: \`-2 m omega x v'\`, magnitude \`2 m omega v'\` when they are perpendicular. It depends on velocity only, is perpendicular to that velocity, and therefore does no work.

## What Coriolis does on Earth

With \`omega\` up out of the North Pole, a body moving horizontally in the northern hemisphere is deflected to its **right**; in the southern hemisphere, to its left. That sets the rotation sense of cyclones. It also makes a freely falling body land slightly east of the plumb line, because it starts with more eastward speed than the ground below it.

Earth's \`omega = 2 pi / 86164 s = 7.29e-5 rad/s\`, so Coriolis accelerations are tiny — \`2 omega v\` is only \`1.5e-3 m/s^2\` even at 10 m/s. It matters over long distances and long times, not in the lab.

## Worked example

At the equator, the centrifugal term reduces apparent gravity by \`omega^2 R = (7.29e-5)^2 (6.37e6) = 0.034 m/s^2\` — about 0.35%, which is a real and measurable part of why \`g\` varies with latitude.`,
        examTip: `Coriolis does no work because it is always perpendicular to the velocity, exactly like the magnetic force. Any answer claiming it changes a body's speed in the rotating frame is wrong on that ground alone.`,
      },
    ],
    keyTakeaways: [
      'A linearly accelerating frame needs one pseudo-force, -mA, and gives an effective gravity.',
      'Centrifugal force depends on position; Coriolis depends on velocity.',
      'Coriolis is perpendicular to the velocity and therefore does no work.',
      'Northern-hemisphere horizontal motion deflects right; southern deflects left.',
      "Earth's rotation reduces apparent g at the equator by about 0.34%.",
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ELECTROMAGNETISM — 18% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_em_electrostatics: {
    topicId: 'pgre_em_electrostatics',
    title: 'Electrostatics',
    domainWeight: 'Electromagnetism · 18% of the exam',
    overview: `Almost every electrostatics question on this test is decided by whether you can spot a symmetry. With one, Gauss's law gives the field in a line; without one, you are facing an integral you probably do not have time for — which is itself a signal that you have missed the symmetry.`,
    sections: [
      {
        id: 'em-es-1-coulomb',
        title: "1. Coulomb's Law and the Electric Field",
        content: `## The force and the field

\`F = (1/4 pi epsilon_0) q1 q2 / r^2\`, with \`1/4 pi epsilon_0 = 8.99e9 N m^2/C^2\`. The field is the force per unit test charge, \`E = F/q\`, so a point charge produces \`E = kq/r^2\` pointing away from a positive charge.

Fields superpose linearly. For discrete charges, add vectors; for a continuous distribution, \`E = k integral (dq / r^2) r_hat\`, and the practical skill is exploiting symmetry to kill components before integrating rather than after.

## Standard results worth knowing without derivation

| Source | Field |
|---|---|
| Point charge | \`kq/r^2\` |
| Infinite line, charge density lambda | \`lambda/(2 pi epsilon_0 r)\`, radial |
| Infinite plane, surface density sigma | \`sigma/(2 epsilon_0)\`, uniform, both sides |
| Two opposite planes (capacitor) | \`sigma/epsilon_0\` between, zero outside |
| Ring of charge, on axis at z | \`kQz/(z^2+R^2)^(3/2)\` |
| Dipole, far field on axis | \`2kp/r^3\` |
| Dipole, far field on bisector | \`kp/r^3\` |

The radial dependences are the memorable part: point \`1/r^2\`, line \`1/r\`, plane constant, dipole \`1/r^3\`. One power of \`r\` is traded away for each dimension the source is extended along.

## Worked example

Two charges \`+q\` and \`-q\` sit a distance \`d\` apart. On the perpendicular bisector at distance \`y >> d\`, the components along the axis cancel and the transverse ones add, giving \`E ≈ kqd/y^3 = kp/y^3\`, matching the table. The \`1/r^3\` falloff is the signature of a neutral object with separated charge.`,
        examTip: `A dipole's field falls as 1/r^3 and its potential as 1/r^2 — one power faster than a point charge in each case. Recognising a 1/r^3 field as "dipole" answers several questions by inspection.`,
      },
      {
        id: 'em-es-2-gauss',
        title: "2. Gauss's Law",
        content: `## Statement

\`surface integral of E . dA = Q_enclosed / epsilon_0\`.

Always true. Useful only when symmetry lets you pull \`E\` out of the integral — which needs \`E\` constant in magnitude and either parallel or perpendicular to the surface everywhere. In practice that means three cases: **spherical**, **cylindrical**, and **planar**.

## The three constructions

- **Sphere** for point charges, uniformly charged spheres and shells. Take a concentric spherical surface: \`E(4 pi r^2) = Q_enc/epsilon_0\`.
- **Cylinder** for infinite lines and cylinders. Take a coaxial cylinder of length \`L\`: the ends contribute nothing because \`E\` is parallel to them.
- **Pillbox** for planes. Take a box straddling the sheet: only the two faces contribute.

## The uniformly charged solid sphere

Outside: all the charge is enclosed, so \`E = kQ/r^2\` — the same as a point charge, which is the electrostatic shell theorem.

Inside at radius \`r\`: only the fraction \`(r/R)^3\` of the charge is enclosed, so \`E = kQr/R^3\`, linear in \`r\`, rising from zero at the centre to \`kQ/R^2\` at the surface. Exactly the same functional form as gravity inside a uniform planet, because both are inverse-square.

## Conductors

In electrostatic equilibrium, the field inside a conductor is zero — otherwise charges would still be moving. Consequences that get tested directly:

- All excess charge sits on the **surface**.
- The field just outside a conductor is \`sigma/epsilon_0\` and is perpendicular to the surface.
- A cavity inside a conductor with no charge in it has zero field — the Faraday cage.
- Put charge \`q\` inside a cavity and the cavity wall carries \`-q\`, the outer surface \`+q\`.

## Worked example

A neutral conducting shell (inner radius \`a\`, outer \`b\`) has \`+Q\` at its centre. Fields: for \`r < a\`, \`kQ/r^2\`; for \`a < r < b\`, exactly zero; for \`r > b\`, \`kQ/r^2\` again. The induced charges are \`-Q\` on the inner surface and \`+Q\` on the outer.`,
        importantNote: `Gauss's law says the flux depends only on the enclosed charge. It does not say the field does. A charge sitting outside your Gaussian surface contributes zero net flux but contributes plenty of field at every point on it.`,
      },
    ],
    keyTakeaways: [
      'Field falloff encodes the source geometry: 1/r^2 point, 1/r line, constant plane, 1/r^3 dipole.',
      "Gauss's law is always true but only useful under spherical, cylindrical or planar symmetry.",
      'Inside a uniformly charged sphere the field is linear in r; outside it is that of a point charge.',
      'A conductor in equilibrium has zero internal field and all excess charge on its surface.',
      'Enclosed charge fixes the flux, not the field: outside charges still contribute field.',
    ],
  },

  pgre_em_potential: {
    topicId: 'pgre_em_potential',
    title: 'Electric Potential & Conductors',
    domainWeight: 'Electromagnetism · 18% of the exam',
    overview: `Potential is a scalar, which makes it far easier to superpose than the field. Many problems are fastest solved by adding potentials and then differentiating, rather than adding field vectors directly.`,
    sections: [
      {
        id: 'em-pot-1-potential',
        title: '1. Potential and Potential Energy',
        content: `## Definitions

\`V(r) = -integral from infinity to r of E . dl\`, and conversely \`E = -grad V\`. For a point charge, \`V = kq/r\` with zero at infinity. Potential energy of a charge in that potential is \`U = qV\`, and for a pair of point charges \`U = k q1 q2 / r\`.

Superposition for potential is scalar addition — no components, no angles. That is the reason to work with \`V\` whenever you can and take the gradient at the end.

## Equipotentials

Surfaces of constant \`V\` are everywhere perpendicular to \`E\`, and no work is done moving a charge along one. A conductor in equilibrium is an equipotential volume, so its surface is an equipotential and the field meets it at right angles.

Field lines point from high to low potential, and the field is strongest where equipotentials crowd together.

## Worked example

Three charges \`+q\` sit at the corners of an equilateral triangle of side \`a\`. What is the potential at the centre?

The centre is at distance \`a/sqrt(3)\` from each, so \`V = 3 kq sqrt(3)/a = 5.196 kq/a\`. No vectors needed. The **field** there, by symmetry, is zero — which shows that \`V\` and \`E\` are genuinely independent pieces of information: a point can have large potential and no field, or zero potential and a large field.`,
        examTip: `V = 0 does not imply E = 0, and E = 0 does not imply V = 0. Midway between two equal opposite charges V is zero but E is maximal; at the centre of three equal charges E is zero but V is not.`,
      },
      {
        id: 'em-pot-2-capacitance',
        title: '2. Capacitance and Energy',
        content: `## Capacitance

\`C = Q/V\`, a property of geometry alone. The standard three:

- Parallel plate: \`C = epsilon_0 A / d\`
- Spherical (inner \`a\`, outer \`b\`): \`C = 4 pi epsilon_0 ab/(b-a)\`
- Cylindrical, per length: \`C/L = 2 pi epsilon_0 / ln(b/a)\`

Combination rules are the reverse of resistors: **parallel adds** (\`C = C1 + C2\`), **series adds reciprocals**. Parallel plates share the voltage; series capacitors share the charge.

## Stored energy

\`U = (1/2) Q V = (1/2) C V^2 = Q^2/(2C)\`.

Which form to use depends on what is held fixed, and this is a classic exam distinction:

- **Battery connected** — \`V\` fixed. Inserting a dielectric raises \`C\`, so \`Q\` and \`U = (1/2)CV^2\` both rise. The battery supplies the extra.
- **Battery disconnected** — \`Q\` fixed. Inserting a dielectric raises \`C\`, so \`V = Q/C\` and \`U = Q^2/2C\` both fall. The dielectric is pulled in, and the energy went into that work.

Getting these two backwards is one of the most reliably tested traps in the section.

## Energy density

\`u = (1/2) epsilon_0 E^2\` per unit volume. Integrating this over all space gives the same total as the capacitor formula — energy can be thought of as living in the field rather than on the plates, and in radiation problems it has to be.

## Worked example

A 10 μF capacitor charged to 100 V stores \`(1/2)(10e-6)(10^4) = 0.05 J\` and holds \`Q = 1e-3 C\`. Disconnect the battery and insert a dielectric with \`kappa = 2\`: \`C\` doubles to 20 μF, \`V\` halves to 50 V, and the stored energy halves to 0.025 J.`,
        importantNote: `Whether a quantity rises or falls when a dielectric is inserted depends entirely on whether the battery stayed connected. Read the question for that detail before computing anything.`,
      },
    ],
    keyTakeaways: [
      'Potential superposes as a scalar; get V first and differentiate for E.',
      'Equipotentials are perpendicular to field lines and a conductor is one.',
      'Capacitors combine oppositely to resistors: parallel adds, series adds reciprocals.',
      'Battery connected fixes V; disconnected fixes Q — the dielectric result reverses between them.',
      'Field energy density is (1/2) epsilon_0 E^2.',
    ],
  },

  pgre_em_dielectrics: {
    topicId: 'pgre_em_dielectrics',
    title: 'Dielectrics & Boundary-Value Problems',
    domainWeight: 'Electromagnetism · 18% of the exam',
    overview: `Materials respond to fields by polarising, and boundaries impose conditions that pin down the solution. Both topics reward pattern recognition: the method of images in particular turns a hard problem into a trivial one whenever a grounded plane or sphere appears.`,
    sections: [
      {
        id: 'em-diel-1-polarization',
        title: '1. Polarisation and the Displacement Field',
        content: `## What a dielectric does

An applied field separates charge within each molecule, producing a polarisation \`P\` (dipole moment per unit volume). The resulting **bound** charges are

\`sigma_b = P . n\` on surfaces, \`rho_b = -div P\` in the volume.

The bound charge produces its own field opposing the applied one, so the net field inside a linear dielectric is reduced by the factor \`kappa\` (the relative permittivity): \`E = E_0 / kappa\`.

## The D field

Define \`D = epsilon_0 E + P\`. Then Gauss's law becomes

\`surface integral of D . dA = Q_free\`,

with only the **free** charge on the right. That is the whole point of \`D\`: it lets you ignore bound charge you do not know. For a linear isotropic medium \`D = epsilon E\` with \`epsilon = kappa epsilon_0\`.

## Boundary conditions

At an interface between two media:
- The **tangential** component of \`E\` is continuous.
- The **normal** component of \`D\` jumps by the free surface charge; with none, it is continuous.

For magnetostatics the analogues are tangential \`H\` and normal \`B\`. Four conditions, and knowing which component of which field is continuous is worth more on this test than any derivation.

## Worked example

A parallel-plate capacitor is half-filled with a slab of \`kappa = 3\` lying parallel to the plates. The two halves are in **series** (same \`D\`, different \`E\`), so \`1/C = 1/C1 + 1/C2\`. With each half of thickness \`d/2\`: \`C1 = 2 epsilon_0 A/d\`, \`C2 = 6 epsilon_0 A/d\`, giving \`C = 1.5 epsilon_0 A/d\`. Had the slab filled half the **area** instead, the halves would be in parallel and the answer would be \`2 epsilon_0 A/d\`.`,
        examTip: `A dielectric slab parallel to the plates makes a series combination; one covering part of the plate area makes a parallel combination. Sketch the geometry before choosing the rule.`,
      },
      {
        id: 'em-diel-2-images',
        title: '2. The Method of Images and Laplace Solutions',
        content: `## Uniqueness

The solution of Laplace's equation \`div grad V = 0\` in a region is unique once \`V\` (or its normal derivative) is fixed on the boundary. That licenses the trick: **any** configuration reproducing the correct boundary conditions gives the correct field in the region of interest, however unphysical it looks elsewhere.

## Grounded plane

A charge \`q\` at height \`d\` above an infinite grounded plane. Replace the plane by an image charge \`-q\` at depth \`d\`. The plane's \`V = 0\` condition is then satisfied by symmetry. Consequences:

- The force on the real charge is attractive, \`kq^2/(2d)^2 = kq^2/4d^2\`.
- The induced surface charge integrates to exactly \`-q\`.
- The energy is \`-kq^2/4d\` — **half** the naive two-charge value, because the image is not a real charge and moving \`q\` does not move it independently. That factor of two is asked about specifically.

## Grounded sphere

For a charge \`q\` at distance \`a\` from the centre of a grounded sphere of radius \`R < a\`, the image is \`q' = -qR/a\` placed at \`R^2/a\` from the centre, on the line joining them. Worth memorising because it is not guessable.

## Separation of variables

In spherical symmetry with azimuthal symmetry, the general solution is

\`V(r, theta) = sum (A_l r^l + B_l r^-(l+1)) P_l(cos theta)\`.

For a conducting sphere in a uniform external field \`E_0\`, only \`l = 1\` survives and

\`V = -E_0 r cos(theta) + (E_0 R^3/r^2) cos(theta)\`,

the second term being an induced dipole of moment \`p = 4 pi epsilon_0 E_0 R^3\`. That result appears in scattering and in polarisability questions.`,
        importantNote: `The image charge is a computational fiction valid only in the region containing the real charge. Asking for the field "inside" the conductor using the image configuration gives nonsense — inside, the field is zero.`,
      },
    ],
    keyTakeaways: [
      'D accounts only for free charge, which is why it is the useful field in matter.',
      'Tangential E and normal D are the continuous components at a boundary.',
      'Uniqueness licenses the method of images; the image is fictitious outside the region.',
      'The image-charge energy carries a factor of one half relative to two real charges.',
      'A conducting sphere in a uniform field acquires an induced dipole of 4 pi epsilon_0 E_0 R^3.',
    ],
  },

  pgre_em_magnetostatics: {
    topicId: 'pgre_em_magnetostatics',
    title: 'Magnetostatics',
    domainWeight: 'Electromagnetism · 18% of the exam',
    overview: `Magnetostatics mirrors electrostatics with one structural difference that drives everything: there are no magnetic monopoles, so field lines close on themselves and the divergence of B is identically zero.`,
    sections: [
      {
        id: 'em-ms-1-sources',
        title: "1. Biot-Savart and Ampere's Law",
        content: `## The two tools

**Biot-Savart** is the general one: \`dB = (mu_0/4 pi) I dl x r_hat / r^2\`. Use it when there is no symmetry.

**Ampere's law**, \`line integral of B . dl = mu_0 I_enclosed\`, is the fast one, and like Gauss's law it is only useful under symmetry: infinite wires, solenoids, toroids.

## Standard fields

| Source | B |
|---|---|
| Infinite straight wire | \`mu_0 I/(2 pi r)\`, circling the wire |
| Centre of a circular loop, radius R | \`mu_0 I/(2R)\` |
| On the axis of a loop at z | \`mu_0 I R^2/(2(R^2+z^2)^(3/2))\` |
| Inside a long solenoid | \`mu_0 n I\`, uniform, axial |
| Inside a toroid | \`mu_0 N I/(2 pi r)\` |

Note that the solenoid's interior field does not depend on the radius or on where you are inside it, and that the field outside an ideal solenoid is zero.

## Direction

Right-hand rule: thumb along the current, fingers curl in the direction of \`B\`. For a loop, curl the fingers along the current and the thumb gives the field direction through the loop — which is also the direction of the magnetic moment \`m = I A\`.

## Worked example

Two parallel wires 10 cm apart each carry 5 A in the same direction. The field of one at the other is \`B = (4 pi e-7)(5)/(2 pi (0.1)) = 1.0e-5 T\`, and the force per length is \`F/L = BI = 5.0e-5 N/m\`, **attractive**. Parallel currents attract; antiparallel repel — the opposite of the charge rule, and worth fixing in memory as an exception.`,
        examTip: `The force between parallel currents is the historical definition of the ampere. If a question asks for a sign or direction here, work it from F = I L x B rather than from an analogy with electrostatics, which points the wrong way.`,
      },
      {
        id: 'em-ms-2-forces',
        title: '2. Magnetic Force, Dipoles and the Vector Potential',
        content: `## Force on charges and currents

\`F = q v x B\`, and on a current-carrying wire \`F = I L x B\`. Because the force is perpendicular to the velocity, **the magnetic force does no work**: it changes direction, never speed. That statement resolves a surprising number of multiple-choice questions on its own.

A charge moving perpendicular to a uniform \`B\` moves in a circle of radius

\`r = mv/(qB)\`

at the cyclotron frequency \`omega_c = qB/m\`, which is **independent of speed** — the basis of the cyclotron, and it fails only at relativistic speeds where \`m\` must be replaced by \`gamma m\`.

## Magnetic dipoles

A current loop has moment \`m = I A\` (direction by the right-hand rule). In a uniform field it feels no net force but a torque \`tau = m x B\`, with energy \`U = -m . B\`. So it tends to align with the field, and it takes work to flip it — the ingredient behind paramagnetism and, later, NMR.

In a **non-uniform** field there is a net force \`F = grad(m . B)\`, which is what deflects the beam in a Stern-Gerlach apparatus.

## The vector potential

Since \`div B = 0\` always, \`B\` can be written as \`B = curl A\`. \`A\` is not unique: adding the gradient of any scalar leaves \`B\` unchanged, which is gauge freedom. In the Coulomb gauge (\`div A = 0\`), \`A\` satisfies a Poisson equation with the current as source, exactly parallel to \`V\` and charge.

## Worked example

A proton (\`m = 1.67e-27 kg\`, \`q = 1.6e-19 C\`) moves at \`1e6 m/s\` perpendicular to a 0.5 T field. \`r = (1.67e-27)(1e6)/((1.6e-19)(0.5)) = 0.021 m\`, about 2 cm. Its cyclotron frequency is \`qB/m = 4.8e7 rad/s\`, or 7.6 MHz, whatever its speed.`,
        importantNote: `There are no magnetic monopoles, so div B = 0 everywhere and magnetic field lines never begin or end. Any answer implying a magnetic charge or a non-closing field line is wrong on that basis.`,
      },
    ],
    keyTakeaways: [
      "Ampere's law needs symmetry; Biot-Savart always works but costs an integral.",
      'Parallel currents attract — the opposite sense to like charges.',
      'The magnetic force does no work: it turns velocities, never speeds them up.',
      'Cyclotron frequency qB/m is independent of speed until relativity intervenes.',
      'A dipole feels torque in a uniform field and net force only in a gradient.',
    ],
  },

  pgre_em_induction: {
    topicId: 'pgre_em_induction',
    title: 'Faraday Induction & Inductance',
    domainWeight: 'Electromagnetism · 18% of the exam',
    overview: `Faraday's law is the one place where the electric and magnetic fields stop being separate subjects. Most induction questions are about signs, and Lenz's law settles every one of them if you apply it consistently.`,
    sections: [
      {
        id: 'em-ind-1-faraday',
        title: "1. Faraday's Law and Lenz's Law",
        content: `## The law

\`EMF = -d(Phi_B)/dt\`, with \`Phi_B = integral B . dA\`. For \`N\` turns, multiply by \`N\`.

The flux can change three ways, and a question usually varies exactly one: \`B\` changes, the area changes, or the orientation changes (\`Phi = BA cos(theta)\`, so a rotating loop gives \`EMF = N B A omega sin(omega t)\` — the alternating-current generator).

## Lenz's law

The minus sign: the induced current opposes the **change** in flux. Not the flux — the change. A loop with increasing downward flux drives a current whose own field points upward inside the loop, and the right-hand rule then fixes the current sense.

Lenz's law is energy conservation in disguise. If the induced current reinforced the change, the system would accelerate itself indefinitely. It also explains magnetic braking: a conductor moving through a field has eddy currents induced that oppose the motion, dissipating kinetic energy as heat.

## Motional EMF

A rod of length \`L\` sliding at speed \`v\` perpendicular to \`B\` develops \`EMF = BLv\`. If it closes a circuit of resistance \`R\`, the current is \`BLv/R\`, the retarding force is \`B^2L^2v/R\`, and the power dissipated \`B^2L^2v^2/R\` exactly equals the mechanical power you supply. That energy audit is a favourite question.

## Worked example

A 0.2 m rod slides at 3 m/s on rails in a 0.5 T perpendicular field, circuit resistance 2 ohms. \`EMF = 0.5(0.2)(3) = 0.3 V\`, \`I = 0.15 A\`, force opposing motion \`= BIL = 0.5(0.15)(0.2) = 0.015 N\`, and \`P = Fv = 0.045 W = I^2R = (0.0225)(2)\`. Consistent.`,
        examTip: `Decide the direction of the induced current by asking what field the loop must create inside itself to oppose the change, then apply the right-hand rule. Trying to reason directly from force directions is slower and error-prone.`,
      },
      {
        id: 'em-ind-2-inductance',
        title: '2. Inductance and Magnetic Energy',
        content: `## Self and mutual inductance

\`Phi = L I\` defines self-inductance, and the back-EMF is \`EMF = -L dI/dt\`. For a long solenoid,

\`L = mu_0 n^2 A l = mu_0 N^2 A / l\`.

Mutual inductance \`M\` relates flux in one circuit to current in another, and is symmetric: \`M12 = M21\`, which is not obvious and is occasionally the whole question.

## Stored energy

\`U = (1/2) L I^2\`, with energy density \`u = B^2/(2 mu_0)\` — the magnetic mirror of \`(1/2) epsilon_0 E^2\`. In an electromagnetic wave the two densities are equal, which is where the \`E = cB\` relation comes from.

## Transients

An \`RL\` circuit switched on has \`I(t) = (V/R)(1 - e^(-t/tau))\` with \`tau = L/R\`. Switched off, the current decays as \`e^(-t/tau)\`. The physical content: **an inductor resists changes in current**, so at \`t = 0\` it behaves as an open circuit and at \`t = infinity\` as a plain wire. A capacitor is the mirror image — a short circuit initially, an open circuit finally.

That pair of limits answers most transient multiple-choice questions without solving anything.

## Worked example

A 0.5 H inductor and 100 ohm resistor across 12 V. \`tau = 0.005 s\`, final current 0.12 A, and the stored energy at steady state is \`(1/2)(0.5)(0.0144) = 3.6 mJ\`. Immediately after closing the switch the current is zero and the full 12 V sits across the inductor.`,
        importantNote: `At t = 0 an inductor is an open circuit and a capacitor is a short; at t = infinity an inductor is a wire and a capacitor is an open circuit. Sketching those two limiting circuits usually eliminates three of five answer choices.`,
      },
    ],
    keyTakeaways: [
      "Faraday's EMF is minus the rate of change of flux; Lenz's sign is energy conservation.",
      'Flux changes through B, area, or orientation — identify which before computing.',
      'Motional EMF BLv makes the mechanical power supplied equal the electrical power dissipated.',
      'Magnetic energy density is B^2/2mu_0, mirroring the electric case.',
      'Inductors oppose current change: open at t=0, wire at steady state. Capacitors are the reverse.',
    ],
  },

  pgre_em_circuits: {
    topicId: 'pgre_em_circuits',
    title: 'Circuits',
    domainWeight: 'Electromagnetism · 18% of the exam',
    overview: `Circuit questions are fast marks if you know the limiting behaviours and the impedance triangle. They are slow marks if you insist on solving differential equations, which the exam almost never requires.`,
    sections: [
      {
        id: 'em-cir-1-dc',
        title: '1. DC Circuits and Transients',
        content: `## Kirchhoff and combinations

Current in equals current out at a node; voltages around a loop sum to zero. Resistors add in series and add reciprocals in parallel — the opposite of capacitors.

A useful check: a parallel combination is always **smaller** than the smallest member, and a series combination always larger than the largest. That eliminates wrong answers instantly.

## Power

\`P = IV = I^2 R = V^2/R\`. Which form to use depends on what is fixed. In series the same current flows, so the **largest** resistor dissipates most; in parallel the same voltage applies, so the **smallest** dissipates most. That reversal is directly tested.

## Maximum power transfer

A source with internal resistance \`r\` delivers maximum power to a load when \`R_load = r\`, and the efficiency at that point is only 50%. Maximum power and maximum efficiency are different design goals — the exam likes that distinction.

## RC transients

Charging: \`Q(t) = CV(1 - e^(-t/RC))\`. Discharging: \`Q(t) = Q0 e^(-t/RC)\`. The time constant \`tau = RC\` is the time to reach \`1 - 1/e = 63%\` of the final value, and \`5 tau\` is conventionally "settled".

## Worked example

A 10 μF capacitor discharges through 100 kΩ. \`tau = 1 s\`. After 2 s the charge is \`e^-2 = 13.5%\` of its initial value. The current at any moment is \`-dQ/dt = (Q0/tau) e^(-t/tau)\`, so it decays with the same time constant.`,
      },
      {
        id: 'em-cir-2-ac',
        title: '2. AC Steady State and Resonance',
        content: `## Impedance

For sinusoidal drive at angular frequency \`omega\`:

- Resistor: \`Z_R = R\`, voltage in phase with current
- Inductor: \`Z_L = j omega L\`, voltage **leads** current by 90 degrees
- Capacitor: \`Z_C = 1/(j omega C)\`, voltage **lags** current by 90 degrees

The mnemonic ELI the ICE man: in an inductor (L) the EMF leads I; in a capacitor (C) the I leads E.

For a series RLC, \`|Z| = sqrt(R^2 + (X_L - X_C)^2)\` with \`X_L = omega L\` and \`X_C = 1/omega C\`, and the phase angle is \`phi = arctan((X_L - X_C)/R)\`.

## Resonance

At \`omega_0 = 1/sqrt(LC)\` the reactances cancel: the impedance is purely \`R\` and minimal, the current is maximal, and the phase is zero. The quality factor \`Q = omega_0 L/R = (1/R)sqrt(L/C)\` sets the sharpness, with bandwidth \`Delta omega = R/L = omega_0/Q\`.

This is mathematically the same driven-oscillator problem as the mechanical one: \`L\` plays mass, \`R\` plays damping, \`1/C\` plays spring constant. Recognising that saves learning it twice.

## Power in AC

\`P_avg = V_rms I_rms cos(phi)\`, with \`cos(phi)\` the power factor. Only the resistor dissipates; reactive elements store and return energy each cycle. For a sinusoid, \`V_rms = V_peak/sqrt(2)\`.

## Worked example

A series circuit with \`R = 10\`, \`L = 0.1 H\`, \`C = 10 μF\`. \`omega_0 = 1/sqrt(1e-6) = 1000 rad/s\` (159 Hz). \`Q = (1000)(0.1)/10 = 10\`, so the bandwidth is 100 rad/s. At resonance a 10 V rms source drives 1 A rms and dissipates 10 W, with the inductor and capacitor each carrying 100 V rms — ten times the source voltage. Voltage magnification by \`Q\` at resonance is real and is a favourite question.`,
        examTip: `At resonance the reactive voltages are Q times the source voltage and cancel each other. A choice offering a component voltage larger than the supply is not automatically wrong in a resonant circuit.`,
      },
    ],
    keyTakeaways: [
      'Parallel resistance is smaller than the smallest member; series is larger than the largest.',
      'In series the biggest resistor dissipates most; in parallel the smallest does.',
      'Maximum power transfer occurs at matched resistance and is only 50% efficient.',
      'Series RLC resonates at 1/sqrt(LC) with purely resistive, minimal impedance.',
      'Reactive elements store energy but dissipate none; only cos(phi) of VI is real power.',
    ],
  },

  pgre_em_maxwell: {
    topicId: 'pgre_em_maxwell',
    title: "Maxwell's Equations & Electromagnetic Waves",
    domainWeight: 'Electromagnetism · 18% of the exam',
    overview: `Four equations that contain everything above, plus one term Maxwell added which turned electromagnetism into optics. If you can state them and know what the displacement-current term does, most of this section is accessible.`,
    sections: [
      {
        id: 'em-max-1-equations',
        title: '1. The Four Equations',
        content: `## In vacuum, differential form

| Equation | Content |
|---|---|
| \`div E = rho/epsilon_0\` | Gauss: charge sources the electric field |
| \`div B = 0\` | No magnetic monopoles |
| \`curl E = -dB/dt\` | Faraday: changing B makes circulating E |
| \`curl B = mu_0 J + mu_0 epsilon_0 dE/dt\` | Ampere-Maxwell |

The final term, \`mu_0 epsilon_0 dE/dt\`, is the **displacement current**. Maxwell added it for consistency — without it, charge conservation and Ampere's law contradict each other whenever current is not continuous, as between capacitor plates. Its physical consequence is enormous: a changing electric field creates a magnetic field, which combined with Faraday's law allows the two to sustain each other and propagate.

## The wave equation

Take the curl of the Faraday equation in a source-free region and substitute Ampere-Maxwell:

\`div grad E = mu_0 epsilon_0 d^2E/dt^2\`,

a wave equation with speed \`c = 1/sqrt(mu_0 epsilon_0)\`. Putting in the measured constants gives \`3.00e8 m/s\` — the identification of light as an electromagnetic wave, made from two electrostatic and magnetostatic constants with no optics in sight.

## In matter

Replace \`epsilon_0\` by \`epsilon\` and \`mu_0\` by \`mu\`, and the speed becomes \`v = 1/sqrt(mu epsilon) = c/n\` with refractive index \`n = sqrt(kappa kappa_m)\`, essentially \`sqrt(kappa)\` for non-magnetic materials.

## Worked example

Why is the displacement current needed between capacitor plates? Take an Amperian loop around the wire and stretch its surface to pass between the plates. No conduction current crosses it, yet the loop integral of \`B\` is nonzero. The changing \`E\` between the plates supplies exactly the missing term, and the two surfaces agree.`,
        importantNote: `Displacement current is not a flow of charge. It is a term proportional to dE/dt that sources a magnetic field exactly as a real current would. Answers describing it as charge crossing the gap are wrong.`,
      },
      {
        id: 'em-max-2-waves',
        title: '2. Plane Waves, Polarisation and Energy',
        content: `## Structure of a plane wave

For a wave travelling along \`k\`:

- \`E\`, \`B\` and \`k\` are mutually perpendicular, in that right-handed order.
- They oscillate **in phase**.
- \`E = cB\` in magnitude, so \`B\` is smaller by a factor of \`3e8\` — which is why the electric force on a charge in a light wave dominates the magnetic one.
- Electromagnetic waves are transverse.

## Energy and momentum

The Poynting vector \`S = (1/mu_0) E x B\` gives energy flux (W/m^2) and points along propagation. Its time average for a sinusoidal wave is the **intensity**

\`I = (1/2) epsilon_0 c E_0^2 = E_0 B_0/(2 mu_0)\`.

The wave carries momentum too, giving radiation pressure \`P = I/c\` for a fully absorbing surface and \`2I/c\` for a perfect reflector — the factor of two because reflection reverses the momentum rather than absorbing it. That doubling is asked about directly.

## Polarisation

The direction of \`E\` defines the polarisation. Linear, circular and elliptical arise from the relative amplitude and phase of two perpendicular components: equal amplitudes with a 90-degree phase difference give circular polarisation.

Through an ideal polariser, unpolarised light loses exactly half its intensity; already-polarised light follows **Malus's law**, \`I = I_0 cos^2(theta)\`.

## Worked example

Sunlight at Earth delivers about 1360 W/m^2. The peak electric field follows from \`I = (1/2) epsilon_0 c E_0^2\`: \`E_0 = sqrt(2(1360)/((8.85e-12)(3e8))) = sqrt(2720/2.65e-3) = 1013 V/m\`. The magnetic amplitude is \`E_0/c = 3.4 μT\`. Radiation pressure on a black surface is \`1360/3e8 = 4.5e-6 Pa\` — tiny, but it is what drives solar sails.`,
        examTip: `Unpolarised light through one polariser always halves in intensity, whatever the polariser angle. Malus's law applies only from the second polariser onward.`,
      },
    ],
    keyTakeaways: [
      "Displacement current is Maxwell's addition and is what lets fields propagate.",
      'c = 1/sqrt(mu_0 epsilon_0) identifies light as an electromagnetic wave.',
      'E, B and k are mutually perpendicular and in phase, with E = cB.',
      'Intensity is the time-averaged Poynting vector; radiation pressure is I/c absorbing, 2I/c reflecting.',
      'An ideal polariser halves unpolarised light; Malus applies to already-polarised light.',
    ],
  },

  pgre_em_radiation: {
    topicId: 'pgre_em_radiation',
    title: 'Radiation & Moving Charges',
    domainWeight: 'Electromagnetism · 18% of the exam',
    overview: `Accelerating charges radiate. The Larmor formula and the sin-squared angular pattern account for most questions here, and both are worth memorising outright because deriving them is not a reasonable use of exam time.`,
    sections: [
      {
        id: 'em-rad-1-larmor',
        title: '1. Larmor Radiation',
        content: `## The formula

A non-relativistic charge with acceleration \`a\` radiates total power

\`P = (mu_0 q^2 a^2)/(6 pi c) = (2/3)(k q^2 a^2 / c^3)\`.

The essentials: proportional to \`q^2\`, proportional to \`a^2\`, and **zero for a charge in uniform motion**. A charge moving at constant velocity does not radiate, however fast it moves — a point some multiple-choice options are built to test.

## Angular distribution

The radiated power per solid angle goes as \`sin^2(theta)\`, where \`theta\` is measured from the acceleration direction. So:

- Maximum radiation **perpendicular** to the acceleration.
- **Zero** radiation along the acceleration direction.

An oscillating dipole antenna therefore radiates nothing off its ends and most strongly broadside — which is why a vertical broadcast antenna covers the horizon and not the sky directly above.

## The dipole and the frequency dependence

For an oscillating dipole \`p = p_0 cos(omega t)\`, the time-averaged radiated power is

\`P = (mu_0 p_0^2 omega^4)/(12 pi c)\`.

The \`omega^4\` is the important part. Scattering off small particles inherits it (Rayleigh scattering, \`sigma ∝ 1/lambda^4\`), so blue light scatters roughly \`(700/400)^4 ≈ 9\` times more strongly than red. That is why the sky is blue and sunsets are red, and it is a standard qualitative question.

## Worked example

An electron in a classical hydrogen orbit at the Bohr radius would radiate away its energy in about \`1e-11\` seconds. The classical atom is unstable — which is precisely the failure that forced quantisation, connecting this section straight to atomic physics.`,
        examTip: `Three facts answer most radiation questions: uniform velocity does not radiate, the pattern is sin^2 from the acceleration axis, and dipole power goes as omega^4.`,
      },
      {
        id: 'em-rad-2-relativistic',
        title: '2. Fields of Moving Charges and Relativistic Effects',
        content: `## Uniform motion

A charge moving at constant velocity carries its field with it, but the field is no longer isotropic: it is compressed along the direction of motion and enhanced transversely, by factors of \`gamma\`. At \`v -> c\` the field approaches a transverse pancake — the picture behind the equivalent-photon method.

## Relativistic Larmor

Generalising to relativistic speeds, the radiated power becomes

\`P = (mu_0 q^2 gamma^6 / 6 pi c)(a_parallel^2 + gamma^-2 a_perp^2)\`

in one common form. What matters for this exam is the consequence: at high \`gamma\`, radiation is far more efficient for **transverse** acceleration than longitudinal. That is why circular accelerators lose so much energy to synchrotron radiation while linear accelerators do not, and it is the reason the LHC accelerates protons rather than electrons.

## Beaming

At relativistic speeds the \`sin^2\` pattern is swept forward into a narrow cone of half-angle roughly \`1/gamma\` about the velocity. Synchrotron light is therefore emitted in a searchlight beam tangential to the orbit.

## Worked example

Why do electron storage rings need enormous RF power? Synchrotron loss per turn scales as \`gamma^4/R\`. Since \`gamma = E/mc^2\` and the electron mass is 1836 times smaller than the proton's, an electron at the same energy has \`gamma\` larger by 1836, and the radiated power larger by \`1836^4 ≈ 1.1e13\`. That single ratio explains the entire design difference between electron and proton machines.`,
      },
    ],
    keyTakeaways: [
      'A uniformly moving charge does not radiate; only acceleration does.',
      'Larmor power goes as q^2 a^2; the pattern is sin^2 from the acceleration axis, zero along it.',
      'Dipole radiation and Rayleigh scattering carry the omega^4 dependence that makes the sky blue.',
      'Relativistic radiation strongly favours transverse acceleration, hence synchrotron losses.',
      'Relativistic emission is beamed into a cone of half-angle about 1/gamma.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // QUANTUM MECHANICS — 12% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_qm_foundations: {
    topicId: 'pgre_qm_foundations',
    title: 'Wave Functions & the Schrodinger Equation',
    domainWeight: 'Quantum Mechanics · 12% of the exam',
    overview: `Quantum mechanics on this test rewards knowing what the formalism guarantees rather than solving new problems from scratch. Normalisation, orthogonality, and what a stationary state actually is between them answer a good share of the questions.`,
    sections: [
      {
        id: 'qm-fnd-1-postulates',
        title: '1. The Wave Function and What It Means',
        content: `## Born rule

\`|psi(x,t)|^2 dx\` is the probability of finding the particle in \`dx\`. That forces normalisation:

\`integral |psi|^2 dx = 1\`,

which in turn forces \`psi\` to be square-integrable, and hence to vanish at infinity. A great many "which of these is a valid wave function" questions are answered by checking that it is single-valued, continuous, and normalisable.

Expectation values are \`<A> = integral psi* A_hat psi dx\`. Position and momentum operators in the position basis:

\`x_hat = x\`, \`p_hat = -i hbar d/dx\`.

## Continuity conditions

\`psi\` is continuous everywhere. \`dpsi/dx\` is continuous too, **except** where the potential has an infinite jump. So at the wall of an infinite square well the derivative may jump, and at a delta-function potential it jumps by a definite amount — that jump condition is exactly how the delta-well bound state is found.

## The equations

Time-dependent: \`i hbar dpsi/dt = H psi\`, with \`H = -(hbar^2/2m) d^2/dx^2 + V\`.

Separating variables for time-independent \`V\` gives \`psi(x,t) = psi(x) e^(-iEt/hbar)\` where \`H psi = E psi\`. These are the **stationary states**: the probability density \`|psi|^2\` is time-independent even though the wave function is not, because the phase factor has unit modulus.

## Worked example

Normalise \`psi = A e^(-|x|/a)\`. \`integral |psi|^2 dx = A^2 integral e^(-2|x|/a) dx = A^2 (a) = 1\`, using \`2 x (a/2)\` for the two halves. So \`A = 1/sqrt(a)\`.`,
        importantNote: `A superposition of two stationary states is NOT stationary: the relative phase e^(-i(E1-E2)t/hbar) survives in |psi|^2 and produces oscillation at the Bohr frequency (E1-E2)/hbar. That beat frequency is what a transition radiates.`,
      },
      {
        id: 'qm-fnd-2-probability',
        title: '2. Probability Current and Orthogonality',
        content: `## Current

From the Schrodinger equation, \`d|psi|^2/dt + dj/dx = 0\` with

\`j = (hbar/m) Im(psi* dpsi/dx)\`.

Probability is locally conserved. For a plane wave \`A e^(ikx)\`, \`j = (hbar k/m)|A|^2 = v|A|^2\` — density times velocity, exactly as a classical flux. That is how transmission and reflection coefficients are defined in barrier problems: as ratios of currents, not of amplitudes.

## Orthogonality

Eigenfunctions of a Hermitian operator with different eigenvalues are orthogonal, and the eigenvalues are real. Both follow from Hermiticity alone, which is why every observable must be represented by a Hermitian operator.

Any state can be expanded in a complete orthonormal set, \`psi = sum c_n phi_n\` with \`c_n = integral phi_n* psi\`. Then \`|c_n|^2\` is the probability of measuring \`E_n\`, and \`sum |c_n|^2 = 1\`. Measurement collapses the state onto the measured eigenfunction.

## Worked example

A particle in an infinite well is prepared in \`psi = (1/sqrt(2))(phi_1 + phi_2)\`. Measuring the energy gives \`E_1\` or \`E_2\` with equal probability 1/2, and the expectation is \`(E_1+E_2)/2\`. The probability density oscillates at \`(E_2-E_1)/hbar\` — the particle sloshes from side to side, which a single stationary state never does.`,
      },
    ],
    keyTakeaways: [
      'A valid wave function is single-valued, continuous and normalisable.',
      "psi' is continuous except where V is infinite; that exception is the delta-well trick.",
      'Stationary states have time-independent |psi|^2; superpositions of them do not.',
      'Hermitian operators have real eigenvalues and orthogonal eigenfunctions.',
      '|c_n|^2 is the probability of measuring E_n, and the c_n come from an overlap integral.',
    ],
  },

  pgre_qm_wells: {
    topicId: 'pgre_qm_wells',
    title: 'One-Dimensional Potentials',
    domainWeight: 'Quantum Mechanics · 12% of the exam',
    overview: `The square well, the step and the barrier are the standard set, and their results are asked for directly often enough that memorising the spectra beats re-deriving them. Tunnelling in particular has an exponential you should be able to write down.`,
    sections: [
      {
        id: 'qm-well-1-infinite',
        title: '1. The Infinite Square Well',
        content: `## Results

For a well of width \`L\` with walls at 0 and \`L\`:

\`psi_n(x) = sqrt(2/L) sin(n pi x/L)\`, \`E_n = n^2 pi^2 hbar^2/(2 m L^2)\`, \`n = 1, 2, 3, ...\`

Three things to notice, all of them testable:

- The energies go as \`n^2\`, so the levels spread out as you go up.
- The ground state energy is **not zero**. Confinement costs energy — this is the uncertainty principle made concrete, since localising to \`Delta x ≈ L\` forces \`Delta p >= hbar/2L\`.
- \`psi_n\` has \`n-1\` interior nodes. Counting nodes identifies a state from a sketch, which is a common question format.

Halving the width quadruples every energy. Doubling the mass halves them.

## The finite well

Finitely many bound states, always at least one in one dimension. The wave function leaks exponentially into the classically forbidden region as \`e^(-kappa x)\` with \`kappa = sqrt(2m(V0-E))/hbar\`. Because the wave function extends further than the well, the effective width is larger and every level sits **below** the corresponding infinite-well level.

## Worked example

An electron in a 0.5 nm well. \`E_1 = pi^2 (1.055e-34)^2 / (2 (9.11e-31)(0.5e-9)^2)\`. Working in electronvolts, the convenient form is \`E_n = 0.376 n^2 / (L in nm)^2\` eV for an electron, giving \`E_1 = 0.376/0.25 = 1.5 eV\`. The first excited state is at 6.0 eV, and the transition would emit a 4.5 eV photon — in the ultraviolet.`,
        examTip: `For an electron, E_n ≈ 0.376 n^2 / L^2 eV with L in nanometres. Carrying that one number turns several well problems into arithmetic.`,
      },
      {
        id: 'qm-well-2-barriers',
        title: '2. Steps, Barriers and Tunnelling',
        content: `## The step

For \`E > V0\`, part of the wave transmits and part reflects — reflection at a potential step is a purely wave phenomenon with no classical analogue, and it happens even for a step **down**. For \`E < V0\`, everything reflects eventually, but the wave function penetrates a distance of order \`1/kappa\` into the barrier.

## Tunnelling

For a rectangular barrier of height \`V0\` and width \`a\` with \`E < V0\`, the transmission for a thick barrier is approximately

\`T ≈ 16 (E/V0)(1 - E/V0) e^(-2 kappa a)\`, with \`kappa = sqrt(2m(V0-E))/hbar\`.

The exponential dominates everything. Two consequences worth internalising:

- \`T\` falls off exponentially with **width** and with \`sqrt(mass)\`. A proton tunnels vastly less than an electron at the same energy.
- Doubling the barrier width squares the small transmission probability.

For a general barrier shape, the WKB result is \`T ≈ exp(-2 integral kappa dx)\` across the classically forbidden region.

## Where it shows up

Alpha decay (Gamow), the scanning tunnelling microscope (whose atomic resolution comes precisely from the exponential sensitivity to gap width), field emission, and nuclear fusion in stars.

## Worked example

An electron with 1 eV meets a 2 eV barrier 0.5 nm wide. \`kappa = sqrt(2(9.11e-31)(1.6e-19))/1.055e-34 = 5.1e9 m^-1\`. Then \`2 kappa a = 2(5.1e9)(0.5e-9) = 5.1\`, so the exponential factor is \`e^-5.1 = 6e-3\`, and with the prefactor \`16(0.5)(0.5) = 4\`, \`T ≈ 0.024\`. About one electron in forty gets through.`,
        importantNote: `Tunnelling probability depends on the barrier's width and height and on the particle's mass — never on how many times the particle "tries". Answers phrased in terms of attempt frequency are describing the decay rate, not the transmission probability.`,
      },
    ],
    keyTakeaways: [
      'Infinite-well energies go as n^2/L^2 and psi_n has n-1 interior nodes.',
      'Ground-state energy is nonzero: confinement costs energy.',
      'Finite-well levels sit below infinite-well levels because the wave function leaks out.',
      'Tunnelling is exponential in barrier width and in sqrt(mass).',
      'Reflection happens at any potential step, including a step down.',
    ],
  },

  pgre_qm_oscillator: {
    topicId: 'pgre_qm_oscillator',
    title: 'The Harmonic Oscillator',
    domainWeight: 'Quantum Mechanics · 12% of the exam',
    overview: `The quantum oscillator is the most reused solved problem in physics, because every potential minimum looks like one. Its spectrum and its zero-point energy are worth knowing cold.`,
    sections: [
      {
        id: 'qm-osc-1-spectrum',
        title: '1. Spectrum and Ladder Operators',
        content: `## Results

\`E_n = (n + 1/2) hbar omega\`, \`n = 0, 1, 2, ...\` with \`omega = sqrt(k/m)\`.

The levels are **equally spaced** — unlike the square well, whose gaps grow — and the ground state sits at \`hbar omega/2\` above the potential minimum. That zero-point energy is not a convention; it shows up as residual vibration in solids at absolute zero and in the Casimir effect.

The ground state wave function is a Gaussian, \`psi_0 ∝ e^(-m omega x^2/2 hbar)\`, and the excited states are that Gaussian times Hermite polynomials, so \`psi_n\` has \`n\` nodes.

## Ladder operators

Define \`a = sqrt(m omega/2 hbar)(x + i p/(m omega))\` and its adjoint \`a†\`. Then

\`H = hbar omega (a† a + 1/2)\`, \`a psi_n = sqrt(n) psi_(n-1)\`, \`a† psi_n = sqrt(n+1) psi_(n+1)\`,

with \`[a, a†] = 1\`. The whole spectrum follows from \`a psi_0 = 0\` plus repeated raising, without ever solving a differential equation. This algebra reappears verbatim for photons and phonons, where \`a†\` creates a quantum of the field.

## Useful expectation values

By the virial theorem for a quadratic potential, \`<T> = <V> = E_n/2\`. So \`<x^2> = (n + 1/2) hbar/(m omega)\` and \`<p^2> = (n + 1/2) m hbar omega\`. Both \`<x>\` and \`<p>\` are zero in any stationary state.

## Worked example

The uncertainty product in state \`n\` is \`Delta x Delta p = sqrt(<x^2><p^2>) = (n + 1/2) hbar\`. The ground state gives exactly \`hbar/2\` — the oscillator ground state saturates the uncertainty bound, which is what makes it a minimum-uncertainty state.`,
        examTip: `Equally spaced levels are the signature of a harmonic oscillator; levels going as n^2 mean a square well; levels going as -1/n^2 mean a Coulomb potential. Reading the spacing pattern identifies the system.`,
      },
    ],
    keyTakeaways: [
      'E_n = (n + 1/2) hbar omega: equally spaced, with nonzero zero-point energy.',
      'psi_n has n nodes and psi_0 is a Gaussian.',
      'Ladder operators give the whole spectrum algebraically; the same algebra describes photons.',
      'For the oscillator, <T> = <V> = E/2 by the virial theorem.',
      'The ground state saturates the uncertainty relation at exactly hbar/2.',
    ],
  },

  pgre_qm_formalism: {
    topicId: 'pgre_qm_formalism',
    title: 'Operators, Measurement & Uncertainty',
    domainWeight: 'Quantum Mechanics · 12% of the exam',
    overview: `Commutators decide which quantities can be known together, how observables evolve, and which degeneracies exist. This is the most leveraged section in quantum mechanics for exam purposes: a few commutation relations answer many questions.`,
    sections: [
      {
        id: 'qm-form-1-commutators',
        title: '1. Commutators and Compatibility',
        content: `## The core relations

\`[x, p] = i hbar\`. From it everything else follows, including \`[x, p^2] = 2 i hbar p\` and the ladder algebra of the oscillator.

For angular momentum: \`[L_x, L_y] = i hbar L_z\` and cyclic, while \`[L^2, L_i] = 0\`. That is why you can know \`L^2\` and one component simultaneously but never two components — the origin of the \`(l, m)\` labelling.

## Compatibility

Two observables are simultaneously measurable exactly when their operators commute, in which case they share a complete set of eigenfunctions. Non-commuting observables obey the generalised uncertainty relation

\`Delta A Delta B >= (1/2)|<[A,B]>|\`,

which for position and momentum gives \`Delta x Delta p >= hbar/2\`.

## Time evolution

\`d<A>/dt = (i/hbar)<[H, A]> + <dA/dt>\`. So **any observable that commutes with H and has no explicit time dependence is conserved**. Energy always is (H commutes with itself). Momentum is conserved iff \`H\` is translation-invariant, angular momentum iff it is rotation-invariant — exactly the classical symmetry-conservation link, now as a commutator statement.

## Worked example

Is \`[H, p] = 0\` for a free particle? \`H = p^2/2m\` commutes with \`p\`, so yes: momentum is conserved and momentum eigenstates are stationary. Add any \`V(x)\` and \`[H, p] = [V, p] = i hbar dV/dx\`, nonzero unless \`V\` is constant. Momentum conservation fails precisely when there is a force.`,
        importantNote: `The energy-time relation Delta E Delta t >= hbar/2 is not of the same kind as Delta x Delta p: time is a parameter, not an operator. It means a state that lives for time tau has an energy spread of order hbar/tau — which is why short-lived particles have wide resonance widths.`,
      },
      {
        id: 'qm-form-2-measurement',
        title: '2. Measurement and Expectation',
        content: `## What a measurement does

Measuring observable \`A\` yields one of its eigenvalues \`a_n\`, with probability \`|<phi_n|psi>|^2\`, and leaves the system in \`phi_n\`. An immediate repeat measurement gives the same answer. Measuring a **non-commuting** observable in between destroys that certainty — the sequential Stern-Gerlach experiment is the canonical demonstration.

## Expectation and spread

\`<A> = <psi|A|psi>\` is the mean over many identically prepared systems, not a prediction for one. The spread is \`Delta A = sqrt(<A^2> - <A>^2)\`, and \`Delta A = 0\` exactly when \`psi\` is an eigenstate of \`A\`.

## Degeneracy

Several independent eigenfunctions sharing an eigenvalue. Degeneracy always traces to a symmetry: the hydrogen \`l\`-degeneracy comes from the special \`1/r\` form, the \`m\`-degeneracy from rotational invariance. Break the symmetry with an external field and the degeneracy splits — which is the Zeeman and Stark effects.

## Worked example

A spin-1/2 particle measured along \`z\` gives up. Measured along \`x\` it gives \`±hbar/2\` with probability 1/2 each. Measure along \`z\` again and the original certainty is gone — 50/50 again. \`[S_x, S_z] != 0\`, and this is what that inequality means operationally.`,
      },
    ],
    keyTakeaways: [
      '[x,p] = i hbar and [L^2, L_i] = 0 while the components do not commute among themselves.',
      'Commuting observables are simultaneously measurable and share eigenfunctions.',
      'An observable commuting with H and lacking explicit time dependence is conserved.',
      'Delta E Delta t is a lifetime-linewidth statement, not an operator uncertainty relation.',
      'Degeneracy comes from symmetry; breaking the symmetry splits the levels.',
    ],
  },

  pgre_qm_angular: {
    topicId: 'pgre_qm_angular',
    title: 'Angular Momentum & Spin',
    domainWeight: 'Quantum Mechanics · 12% of the exam',
    overview: `Angular momentum is the most algebraic part of the syllabus and the most predictable in what it asks: eigenvalues, allowed m values, addition rules, and the Pauli matrices.`,
    sections: [
      {
        id: 'qm-ang-1-orbital',
        title: '1. Orbital Angular Momentum',
        content: `## Eigenvalues

\`L^2 Y_lm = l(l+1) hbar^2 Y_lm\` and \`L_z Y_lm = m hbar Y_lm\`, with \`l = 0, 1, 2, ...\` and \`m = -l, ..., +l\`, so \`2l+1\` values.

Two habitual errors: writing the \`L^2\` eigenvalue as \`l^2 hbar^2\` rather than \`l(l+1)hbar^2\`, and forgetting that \`|L| = sqrt(l(l+1)) hbar\` always **exceeds** the maximum \`L_z = l hbar\`. The vector can never lie fully along \`z\`, which is the geometric content of the non-commuting components.

## Spherical harmonics

\`Y_lm(theta, phi)\` are the eigenfunctions; \`Y_00\` is a constant (spherically symmetric, the s orbital), and their parity is \`(-1)^l\`. Parity matters for selection rules.

The letters: \`l = 0, 1, 2, 3\` are s, p, d, f.

## Worked example

For \`l = 2\`: \`|L| = sqrt(6) hbar = 2.45 hbar\`, and \`L_z\` takes the five values \`-2, -1, 0, 1, 2\` in units of \`hbar\`. The smallest angle to the \`z\` axis is \`arccos(2/sqrt(6)) = 35.3\` degrees, never zero.`,
      },
      {
        id: 'qm-ang-2-spin',
        title: '2. Spin and Addition of Angular Momenta',
        content: `## Spin-1/2

Spin obeys the same algebra with half-integer values allowed. For spin-1/2:

\`S^2 = (3/4) hbar^2\`, \`S_z = ±hbar/2\`, and \`S_i = (hbar/2) sigma_i\` with the Pauli matrices

\`sigma_x = [[0,1],[1,0]]\`, \`sigma_y = [[0,-i],[i,0]]\`, \`sigma_z = [[1,0],[0,-1]]\`.

Properties worth carrying: each squares to the identity, they anticommute with each other, their traces are zero, and their eigenvalues are \`±1\`. A spinor must be rotated through **720 degrees**, not 360, to return to itself.

## Adding angular momenta

Combining \`j1\` and \`j2\` gives total \`j\` running from \`|j1 - j2|\` to \`j1 + j2\` in integer steps. Dimensions must match: \`(2j1+1)(2j2+1) = sum over j of (2j+1)\`.

Two spin-1/2 particles give \`j = 1\` (triplet, three symmetric states) and \`j = 0\` (singlet, one antisymmetric state), and \`3 + 1 = 4 = 2 x 2\`. The singlet is the entangled state used in Bell experiments.

## Magnetic moment

\`mu = g (q/2m) S\`, with \`g ≈ 2\` for the electron. Energy in a field is \`-mu . B\`, which splits the two spin states by \`g mu_B B\` — the Zeeman splitting, and the basis of ESR and NMR.

## Worked example

Add \`l = 1\` and \`s = 1/2\`. Total \`j = 3/2\` or \`1/2\`, with \`4 + 2 = 6 = 3 x 2\` states. Those are the \`p_(3/2)\` and \`p_(1/2)\` levels that spin-orbit coupling separates in the sodium doublet.`,
        examTip: `Check any angular-momentum addition by counting states: the multiplicities must sum to the product of the two originals. It catches an omitted j value immediately.`,
      },
    ],
    keyTakeaways: [
      'L^2 gives l(l+1)hbar^2, never l^2 hbar^2, so |L| always exceeds max L_z.',
      'Pauli matrices square to the identity, anticommute, and are traceless.',
      'Adding j1 and j2 gives |j1-j2| to j1+j2; check by counting states.',
      'Two spin-1/2 particles give a symmetric triplet and an antisymmetric singlet.',
      'A spin-1/2 spinor needs a 720-degree rotation to return to itself.',
    ],
  },

  pgre_qm_hydrogen: {
    topicId: 'pgre_qm_hydrogen',
    title: 'The Hydrogen Atom',
    domainWeight: 'Quantum Mechanics · 12% of the exam',
    overview: `Hydrogen is the one exactly solvable atom and the reference for everything else. The energy formula, the quantum-number rules and the degeneracy count are the reliably asked pieces.`,
    sections: [
      {
        id: 'qm-hyd-1-solution',
        title: '1. Energies, Quantum Numbers and Degeneracy',
        content: `## The spectrum

\`E_n = -13.6 Z^2/n^2 eV\`, depending only on the principal quantum number \`n\` — not on \`l\`. That extra degeneracy is special to the \`1/r\` potential and is broken by anything that deviates from it, which is why multi-electron atoms have \`l\`-dependent energies.

The quantum numbers:

- \`n = 1, 2, 3, ...\`
- \`l = 0, 1, ..., n-1\`
- \`m = -l, ..., +l\`
- \`m_s = ±1/2\`

Degeneracy of level \`n\` is \`sum over l of (2l+1) = n^2\` orbital states, or \`2n^2\` including spin. That \`2n^2\` is the shell capacity of the periodic table: 2, 8, 18, 32.

## Scales

The Bohr radius \`a_0 = 0.529 Å\`, and \`<r>\` for state \`n, l\` is roughly \`(a_0/Z)(3n^2 - l(l+1))/2\` — growing as \`n^2\`, so excited atoms are much larger. The fine-structure constant \`alpha = e^2/(4 pi epsilon_0 hbar c) ≈ 1/137\` sets the ratio of the electron's orbital speed to \`c\`, which is why relativistic corrections are of order \`alpha^2 ≈ 5e-5\` relative to the gross structure.

## Radial wave functions

\`psi_(nlm) = R_nl(r) Y_lm(theta, phi)\`. Only \`l = 0\` states are nonzero at the origin, which is why only s electrons show contact hyperfine interaction and why s states have the largest relativistic corrections. The number of radial nodes is \`n - l - 1\`, and the total node count is \`n - 1\`.

## Worked example

The \`n = 3\` level: \`l\` can be 0, 1, 2, so \`1 + 3 + 5 = 9 = 3^2\` orbital states and 18 with spin. \`E_3 = -13.6/9 = -1.51 eV\`. The transition to \`n = 2\` (\`-3.4 eV\`) emits \`1.89 eV\` — 656 nm, the red H-alpha line.`,
        examTip: `Memorise -13.6 eV, a_0 = 0.53 Å, and alpha = 1/137. Between them you can reconstruct most hydrogen numbers, including the 13.6 alpha^2 scale of fine structure.`,
      },
      {
        id: 'qm-hyd-2-spectra',
        title: '2. Transitions and Series',
        content: `## Photon energies

\`E_photon = 13.6 Z^2 (1/n_f^2 - 1/n_i^2) eV\` for emission. The named series are by final state:

| Series | n_f | Region |
|---|---|---|
| Lyman | 1 | Ultraviolet |
| Balmer | 2 | Visible |
| Paschen | 3 | Infrared |

Balmer is the visible one because \`n = 3 -> 2\` is 1.89 eV and the series limit is 3.4 eV, straddling the visible band. That is why hydrogen's visible spectrum was found first.

## Selection rules

Electric-dipole transitions require \`Delta l = ±1\` and \`Delta m = 0, ±1\`. The \`Delta l\` rule is parity conservation: the photon carries one unit of angular momentum and odd parity, so \`l\` must change by exactly one. A transition violating it is not forbidden absolutely, but proceeds by much weaker higher-order processes, giving metastable states with long lifetimes — the 2s state of hydrogen lives about 1/8 second against the nanoseconds typical of allowed transitions.

## Worked example

The Lyman-alpha line is \`n = 2 -> 1\`: \`13.6(1 - 1/4) = 10.2 eV\`, or 121.6 nm. The Lyman series limit (ionisation from the ground state) is 13.6 eV at 91.2 nm. Both are deep ultraviolet, absorbed by the atmosphere — which is why hydrogen Lyman-alpha astronomy is done from space.`,
      },
    ],
    keyTakeaways: [
      'E_n = -13.6 Z^2/n^2 eV depends only on n; the l-degeneracy is special to 1/r.',
      'Degeneracy is n^2 orbital states, 2n^2 with spin — the periodic-table shell sizes.',
      'Radial nodes number n - l - 1; only s states are nonzero at the nucleus.',
      'Dipole selection rules are Delta l = ±1 and Delta m = 0, ±1.',
      'Balmer is the visible series because it ends on n = 2.',
    ],
  },

  pgre_qm_perturbation: {
    topicId: 'pgre_qm_perturbation',
    title: 'Perturbation Theory & Approximations',
    domainWeight: 'Quantum Mechanics · 12% of the exam',
    overview: `Three approximation methods cover almost everything beyond the exactly solvable problems. On this test you will most often need the first-order energy shift, which is a single expectation value.`,
    sections: [
      {
        id: 'qm-pert-1-timeindep',
        title: '1. Time-Independent Perturbation Theory',
        content: `## First order

Write \`H = H_0 + H'\` with \`H'\` small. The first-order energy shift is just the expectation of the perturbation in the **unperturbed** state:

\`E_n^(1) = <psi_n^(0)| H' |psi_n^(0)>\`.

That single line answers most perturbation questions on this exam. The first-order correction to the state is

\`psi_n^(1) = sum over m != n of (<m|H'|n>/(E_n - E_m)) |m>\`.

## Second order

\`E_n^(2) = sum over m != n of |<m|H'|n>|^2/(E_n - E_m)\`.

Note the sign: for the **ground state** every denominator is negative, so the second-order shift is always downward. The ground state is always pushed down by any perturbation — a genuinely useful check.

## Degenerate case

When the unperturbed level is degenerate, the naive formula divides by zero. Instead, diagonalise \`H'\` within the degenerate subspace; the eigenvalues of that small matrix are the first-order shifts, and its eigenvectors are the correct zeroth-order states. This is what produces the Zeeman and Stark splittings.

## Worked example

An infinite well of width \`L\` perturbed by a constant \`V_0\` over the whole well shifts every level by exactly \`V_0\` — the expectation of a constant. If instead the perturbation is \`V_0\` only over the left half, the shift is \`V_0 integral over left half of |psi_n|^2 = V_0/2\` for every \`n\`, by symmetry of \`sin^2\`.`,
        importantNote: `Perturbation theory requires the correction to be small compared with the level spacing. Near a degeneracy the denominators blow up and the non-degenerate formula is invalid — that is exactly when you must use the degenerate method.`,
      },
      {
        id: 'qm-pert-2-variational-wkb',
        title: '2. The Variational Principle and WKB',
        content: `## Variational

For **any** normalised trial function, \`<psi|H|psi> >= E_ground\`. So minimising the expectation over a family of trial functions gives an upper bound on the ground-state energy that improves as the family gets richer.

The bound is one-sided, and that direction is the point: a variational estimate can only be too high, never too low. Excited states can be reached by restricting to trial functions orthogonal to the (approximate) ground state.

## WKB

Valid when the potential varies slowly over a de Broglie wavelength. In the allowed region \`psi ∝ (1/sqrt(p)) exp(±(i/hbar) integral p dx)\` with \`p = sqrt(2m(E-V))\`. Two standard results:

- **Bound states**: \`integral p dx = (n + 1/2) pi hbar\` between turning points (the Bohr-Sommerfeld condition with the half from the turning-point connection formulas).
- **Tunnelling**: \`T ≈ exp(-(2/hbar) integral sqrt(2m(V-E)) dx)\` across the forbidden region.

WKB is exact for the harmonic oscillator, which is a pleasant accident and a good way to remember the \`+1/2\`.

## Worked example

Apply the Bohr-Sommerfeld condition to the oscillator: \`integral p dx\` over a full period equals the phase-space area of the ellipse, \`2 pi E/omega\`. Setting that to \`(n+1/2) 2 pi hbar\` gives \`E = (n+1/2) hbar omega\` — the exact answer.`,
        examTip: `A question offering "an upper bound on the ground state energy" is a variational question; one offering an exponential of an integral is WKB tunnelling; one offering an expectation value of a small term is first-order perturbation theory. The form of the answer choices usually tells you the method.`,
      },
    ],
    keyTakeaways: [
      'First-order energy shift is the expectation of H\' in the unperturbed state.',
      'Second-order shifts push the ground state down, always.',
      'Degenerate levels require diagonalising H\' inside the degenerate subspace.',
      'The variational principle gives an upper bound on the ground-state energy only.',
      'WKB bound states satisfy integral p dx = (n + 1/2) pi hbar and are exact for the oscillator.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // THERMODYNAMICS & STATISTICAL MECHANICS — 10% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_th_laws: {
    topicId: 'pgre_th_laws',
    title: 'The Laws of Thermodynamics',
    domainWeight: 'Thermodynamics & Statistical Mechanics · 10% of the exam',
    overview: `Thermodynamics is bookkeeping with signs that matter. Most errors on this section are sign conventions and forgetting which quantities are state functions and which are not.`,
    sections: [
      {
        id: 'th-laws-1-first',
        title: '1. State Functions and the First Law',
        content: `## The first law

\`dU = dQ - dW\` in the physics convention, where \`dW\` is work done **by** the system. \`U\` is a state function; \`Q\` and \`W\` are not. That distinction is the source of most exam questions here: going between two states, \`Delta U\` is fixed but \`Q\` and \`W\` depend on the path.

For a quasi-static process, \`dW = p dV\`, so work is the area under the curve on a \`p-V\` diagram, and for a cycle it is the enclosed area — positive for a clockwise loop (an engine), negative for a counterclockwise one (a refrigerator).

## Ideal gas relations

\`pV = nRT = N k_B T\`, with \`k_B = 1.38e-23 J/K\` and \`R = 8.314 J/mol K\`.

Internal energy depends on temperature alone: \`U = (f/2) n R T\` with \`f\` the number of active degrees of freedom (3 for monatomic, 5 for diatomic at room temperature, 7 once vibration activates). Hence \`C_V = (f/2)R\` and \`C_p = C_V + R\`, so \`gamma = C_p/C_V = (f+2)/f\`: 5/3 monatomic, 7/5 diatomic.

## The standard processes

| Process | Held fixed | Q | W |
|---|---|---|---|
| Isothermal | T | \`Q = W\` | \`nRT ln(V2/V1)\` |
| Adiabatic | none, Q = 0 | 0 | \`-Delta U = -nC_V Delta T\` |
| Isochoric | V | \`n C_V Delta T\` | 0 |
| Isobaric | p | \`n C_p Delta T\` | \`p Delta V\` |

Adiabatic processes follow \`pV^gamma\` = constant and \`TV^(gamma-1)\` = constant. An adiabat is steeper than an isotherm on a \`p-V\` diagram, by exactly the factor \`gamma\`.

## Worked example

One mole of a monatomic ideal gas expands isothermally at 300 K from 1 L to 2 L. \`Delta U = 0\`, so \`Q = W = nRT ln 2 = (8.314)(300)(0.693) = 1729 J\`. All the heat absorbed became work.`,
        examTip: `Check the sign convention the question uses. Chemistry texts often write dU = Q + W with W done ON the system, which flips a sign relative to the physics convention used here. The physical answer does not change, but the algebra does.`,
      },
      {
        id: 'th-laws-2-entropy',
        title: '2. Entropy and the Second Law',
        content: `## Definition

\`dS = dQ_rev/T\`, and \`S\` is a state function even though \`Q\` is not. To compute \`Delta S\` for an irreversible process, invent **any** reversible path between the same endpoints and integrate along that — the answer is the same because \`S\` is a state function.

The second law: the entropy of an isolated system never decreases. Equivalently (Clausius) heat does not flow spontaneously from cold to hot; equivalently (Kelvin) no cyclic engine converts heat entirely into work.

## Standard entropy changes

- Ideal gas, general: \`Delta S = n C_V ln(T2/T1) + nR ln(V2/V1)\`
- Free expansion into vacuum (\`Q = 0\`, \`W = 0\`, \`Delta U = 0\`, so \`T\` unchanged): \`Delta S = nR ln(V2/V1) > 0\`. Heat did not flow and yet entropy rose — the cleanest demonstration that \`dS = dQ/T\` requires a **reversible** path.
- Phase change at constant \`T\`: \`Delta S = L/T\` with \`L\` the latent heat.
- Reversible adiabatic: \`Delta S = 0\`, which is why such processes are called isentropic.

## Statistical meaning

\`S = k_B ln(Omega)\` with \`Omega\` the number of accessible microstates. Entropy increases because there are overwhelmingly more ways to be disordered — the second law is a statement about counting, not about a force.

## The third law

\`S -> 0\` as \`T -> 0\` for a perfect crystal, because the ground state is unique and \`ln 1 = 0\`. A consequence with teeth: heat capacities must vanish at absolute zero, and absolute zero cannot be reached in finitely many steps.

## Worked example

Two identical blocks at \`T_1\` and \`T_2\` are brought into contact and reach \`T_f = (T_1+T_2)/2\`. \`Delta S = mc[ln(T_f/T_1) + ln(T_f/T_2)] = mc ln(T_f^2/(T_1 T_2))\`. Since the arithmetic mean exceeds the geometric mean, \`T_f^2 > T_1 T_2\`, so \`Delta S > 0\` for any unequal temperatures. The second law falls out of an inequality between two means.`,
        importantNote: `Entropy of a system CAN decrease — a freezer does it every day. What cannot decrease is the entropy of the system plus its surroundings. Questions that offer "entropy always increases" as a bare statement are testing that distinction.`,
      },
    ],
    keyTakeaways: [
      'U, S, T, p, V are state functions; Q and W are not.',
      'gamma = (f+2)/f, so 5/3 monatomic and 7/5 diatomic at room temperature.',
      'Adiabats are steeper than isotherms by the factor gamma.',
      'Compute Delta S along any reversible path between the endpoints; free expansion has Delta S > 0 with Q = 0.',
      'S = k_B ln Omega: the second law is combinatorics, and only the total entropy is constrained.',
    ],
  },

  pgre_th_processes: {
    topicId: 'pgre_th_processes',
    title: 'Processes, Engines & Cycles',
    domainWeight: 'Thermodynamics & Statistical Mechanics · 10% of the exam',
    overview: `Engine questions reduce to two numbers: the heat in and the work out. Carnot efficiency is the ceiling nothing beats, and recognising when a claimed engine violates it is a standard question type.`,
    sections: [
      {
        id: 'th-proc-1-engines',
        title: '1. Engines, Refrigerators and Carnot',
        content: `## Definitions

An engine takes \`Q_H\` from a hot reservoir, does work \`W\`, and dumps \`Q_C\` to a cold one, with \`W = Q_H - Q_C\` over a cycle (since \`Delta U = 0\` for a cycle). Its efficiency is

\`eta = W/Q_H = 1 - Q_C/Q_H\`.

A refrigerator runs it backwards, with coefficient of performance \`COP = Q_C/W\`, and a heat pump with \`COP = Q_H/W\`. Note both COPs are usually greater than 1, which is not a violation of anything — you are moving heat, not creating it.

## The Carnot limit

For reversible operation between \`T_H\` and \`T_C\`,

\`eta_Carnot = 1 - T_C/T_H\` (absolute temperatures),

and no engine between the same two reservoirs can beat it. The corresponding refrigerator limit is \`COP = T_C/(T_H - T_C)\`.

The Carnot cycle is two isotherms and two adiabats, and it is reversible precisely because no heat ever crosses a finite temperature difference.

## Other cycles

- **Otto** (petrol engine): two adiabats, two isochores. \`eta = 1 - r^(1-gamma)\` with \`r\` the compression ratio.
- **Stirling**: two isotherms, two isochores, with regeneration.
- **Brayton** (gas turbine): two adiabats, two isobars.

## Worked example

An engine claims 60% efficiency between 400 K and 300 K. Carnot gives \`1 - 300/400 = 25%\`. The claim is impossible, and no engineering detail can rescue it. Efficiency questions of this shape are almost always answered by computing the Carnot bound first.`,
        examTip: `Always convert to kelvin before applying the Carnot formula. Using Celsius is the single most common error here and it produces a plausible-looking wrong answer.`,
      },
      {
        id: 'th-proc-2-potentials',
        title: '2. Thermodynamic Potentials',
        content: `## The four

| Potential | Definition | Natural variables | Minimised when |
|---|---|---|---|
| Internal energy \`U\` | — | \`S, V\` | \`S, V\` fixed |
| Enthalpy \`H\` | \`U + pV\` | \`S, p\` | \`S, p\` fixed |
| Helmholtz \`F\` | \`U - TS\` | \`T, V\` | \`T, V\` fixed |
| Gibbs \`G\` | \`H - TS\` | \`T, p\` | \`T, p\` fixed |

Which one to use is decided by what is held fixed. Laboratory chemistry at constant \`T\` and \`p\` is Gibbs; a gas in a sealed rigid container at fixed \`T\` is Helmholtz.

The differentials:

\`dU = T dS - p dV\`, \`dH = T dS + V dp\`, \`dF = -S dT - p dV\`, \`dG = -S dT + V dp\`.

## Maxwell relations

Because each differential is exact, the mixed second partials commute, giving four relations such as

\`(dS/dV)_T = (dp/dT)_V\` and \`(dS/dp)_T = -(dV/dT)_p\`.

Their use is converting an entropy derivative — hard to measure — into a mechanical one that is easy. That is the whole point, and it is worth knowing that is what they are for even if you do not memorise all four.

## Worked example

Enthalpy is the heat at constant pressure: from \`dH = T dS + V dp\`, at fixed \`p\`, \`dH = T dS = dQ\`. That is why reaction heats are tabulated as enthalpies and why \`C_p = (dH/dT)_p\`.`,
      },
    ],
    keyTakeaways: [
      'Over a cycle Delta U = 0, so W = Q_H - Q_C and eta = 1 - Q_C/Q_H.',
      'Carnot efficiency 1 - T_C/T_H is an absolute ceiling; convert to kelvin first.',
      'Refrigerator and heat-pump COPs exceed 1 without violating anything.',
      'Pick the potential whose natural variables are the ones held fixed.',
      'Maxwell relations trade an unmeasurable entropy derivative for a measurable mechanical one.',
    ],
  },

  pgre_th_kinetic: {
    topicId: 'pgre_th_kinetic',
    title: 'Kinetic Theory',
    domainWeight: 'Thermodynamics & Statistical Mechanics · 10% of the exam',
    overview: `Kinetic theory derives the gas laws from molecular motion and supplies the speed distributions and transport estimates the exam asks for. The three characteristic speeds and their ordering are asked about directly.`,
    sections: [
      {
        id: 'th-kin-1-pressure',
        title: '1. Pressure, Temperature and Equipartition',
        content: `## Pressure from momentum transfer

Molecules bouncing off a wall deliver momentum, and averaging gives

\`p = (1/3) n m <v^2>\`,

with \`n\` the number density. Comparing with \`pV = N k_B T\` identifies

\`(1/2) m <v^2> = (3/2) k_B T\`.

So temperature **is** average translational kinetic energy per molecule, up to a constant — three halves of \`k_B T\`, one half for each translational direction.

## Equipartition

In classical statistical mechanics, each quadratic degree of freedom in the energy carries \`(1/2) k_B T\` on average. A diatomic molecule has 3 translational plus 2 rotational quadratic terms at room temperature, giving \`(5/2) k_B T\` and \`C_V = (5/2)R\`. Vibration adds two more (kinetic and potential), taking it to \`(7/2)R\` — but only once \`k_B T\` exceeds the vibrational quantum.

That freezing-out of degrees of freedom is a purely quantum effect and was one of the first clear failures of classical physics: the measured \`C_V\` of hydrogen falls in steps as it cools, and classical equipartition cannot produce steps.

## Worked example

At 300 K, \`k_B T = 4.14e-21 J = 0.0259 eV\`. The room-temperature thermal energy scale of 1/40 eV is worth memorising: it tells you at a glance that a 1 eV electronic excitation is thermally inaccessible while a 0.01 eV rotational one is not.`,
        examTip: `k_B T at room temperature is about 1/40 eV. Comparing that to a level spacing tells you immediately whether a degree of freedom is active — and that comparison is what most equipartition questions are really asking.`,
      },
      {
        id: 'th-kin-2-distribution',
        title: '2. The Maxwell-Boltzmann Distribution and Transport',
        content: `## The distribution

The speed distribution is \`f(v) ∝ v^2 exp(-mv^2/2k_B T)\`. The \`v^2\` comes from the volume of a shell in velocity space and is why \`f(0) = 0\`: no molecule is exactly at rest.

Three characteristic speeds, always in this order:

- most probable \`v_p = sqrt(2 k_B T/m)\`
- mean \`<v> = sqrt(8 k_B T/(pi m)) = 1.128 v_p\`
- root-mean-square \`v_rms = sqrt(3 k_B T/m) = 1.225 v_p\`

\`v_p < <v> < v_rms\`, because the distribution has a long high-speed tail that pulls the higher moments up. All three scale as \`sqrt(T/m)\`, which is why light gases move faster and why hydrogen and helium escape planetary atmospheres while nitrogen does not.

## Mean free path and transport

\`lambda = 1/(sqrt(2) n sigma)\` with \`sigma = pi d^2\` the collision cross-section. Collision rate is \`<v>/lambda\`.

Transport coefficients all come out proportional to \`(1/3) n <v> lambda\` times whatever is being carried: mass for diffusion, momentum for viscosity, energy for thermal conductivity. A striking prediction: since \`lambda ∝ 1/n\`, the viscosity of a dilute gas is **independent of pressure** — counterintuitive, experimentally correct, and a favourite question.

## Worked example

Nitrogen at 300 K: \`m = 4.65e-26 kg\`, so \`v_rms = sqrt(3(1.38e-23)(300)/4.65e-26) = 517 m/s\`. At atmospheric pressure \`n = 2.4e25 m^-3\` and with \`d ≈ 3.7e-10 m\`, \`lambda ≈ 65 nm\` — about 200 molecular diameters, which is why a gas is dilute enough for the ideal model to work.`,
        importantNote: `Effusion through a small hole is governed by <v> ∝ 1/sqrt(m), giving Graham's law: light gases effuse faster as the inverse square root of molar mass. This is not the same as the mean free path and the two are sometimes swapped in answer choices.`,
      },
    ],
    keyTakeaways: [
      'Temperature is average translational kinetic energy: (3/2) k_B T per molecule.',
      'Each quadratic degree of freedom carries (1/2) k_B T, until quantum freezing removes it.',
      'v_p < <v> < v_rms, all scaling as sqrt(T/m).',
      'Room-temperature k_B T is about 1/40 eV.',
      'Dilute-gas viscosity is independent of pressure because lambda ∝ 1/n.',
    ],
  },

  pgre_th_ensembles: {
    topicId: 'pgre_th_ensembles',
    title: 'Statistical Ensembles',
    domainWeight: 'Thermodynamics & Statistical Mechanics · 10% of the exam',
    overview: `The partition function is the bridge from microscopic energy levels to macroscopic thermodynamics. Once you have Z, every thermodynamic quantity is a derivative of it, and that is usually what is being asked.`,
    sections: [
      {
        id: 'th-ens-1-boltzmann',
        title: '1. The Boltzmann Factor and the Partition Function',
        content: `## The canonical ensemble

A system in contact with a reservoir at temperature \`T\` occupies state \`i\` with probability

\`P_i = e^(-E_i/k_B T)/Z\`, with \`Z = sum over i of e^(-E_i/k_B T)\`.

The ratio of two populations is \`e^(-(E_2-E_1)/k_B T)\` — the single most used relation in this section. If levels are degenerate, weight each by its degeneracy \`g_i\`.

## Everything from Z

Writing \`beta = 1/k_B T\`:

- \`<E> = -d(ln Z)/d beta\`
- \`F = -k_B T ln Z\`
- \`S = -(dF/dT)_V\`
- \`C_V = d<E>/dT\`

For \`N\` independent distinguishable particles \`Z_total = z^N\`; for indistinguishable ones divide by \`N!\`, which resolves the Gibbs paradox about the entropy of mixing identical gases.

## Two-level system

The most-tested example. With levels \`0\` and \`epsilon\`:

\`Z = 1 + e^(-beta epsilon)\`, \`<E> = epsilon/(e^(beta epsilon) + 1)\`.

At low \`T\` the system is frozen in the ground state and \`C\` vanishes exponentially; at high \`T\` the levels equalise, \`<E> -> epsilon/2\`, and \`C\` falls again. The heat capacity therefore has a peak near \`k_B T ≈ epsilon\` — the Schottky anomaly, whose position measures the level splitting.

## Worked example

At what temperature is the excited state of a two-level system with \`epsilon = 0.1 eV\` populated at 10%? \`0.1/0.9 = e^(-epsilon/k_B T)\`, so \`epsilon/k_B T = ln 9 = 2.197\`, giving \`k_B T = 0.0455 eV\` and \`T = 528 K\`.`,
        examTip: `Population ratios are the fastest route into most statistical questions. Write N_2/N_1 = (g_2/g_1) e^(-Delta E/k_B T) and solve — no partition function needed unless a thermodynamic quantity is asked for.`,
      },
      {
        id: 'th-ens-2-ensembles',
        title: '2. Which Ensemble, and Fluctuations',
        content: `## The three

- **Microcanonical**: isolated, fixed \`E, V, N\`. All accessible microstates equally likely; \`S = k_B ln Omega\`.
- **Canonical**: fixed \`T, V, N\`, energy exchanged with a reservoir. Governed by \`Z\`.
- **Grand canonical**: fixed \`T, V, mu\`, both energy and particles exchanged. Governed by the grand partition function and the chemical potential \`mu\`.

In the thermodynamic limit all three give the same thermodynamics, because relative fluctuations vanish as \`1/sqrt(N)\`. That equivalence is why you may choose whichever is easiest — usually canonical.

## Fluctuations

Energy fluctuations in the canonical ensemble satisfy

\`<(Delta E)^2> = k_B T^2 C_V\`,

a fluctuation-dissipation relation: the size of spontaneous fluctuations is set by the response coefficient. Since \`C_V ∝ N\` and \`E ∝ N\`, the relative fluctuation \`Delta E/E ∝ 1/sqrt(N)\` — utterly negligible for a mole, which is why thermodynamics looks deterministic.

## Chemical potential

\`mu = (dG/dN)_(T,p)\`, the free-energy cost of adding one particle. Particles flow from high \`mu\` to low, exactly as heat flows from high \`T\` to low. \`mu\` becomes central in the quantum statistics section, where it is the Fermi level for fermions.

## Worked example

For a mole, \`N = 6e23\` and \`1/sqrt(N) ≈ 1.3e-12\`. A macroscopic energy measurement would have to be accurate to twelve digits to notice thermal fluctuations at all.`,
      },
    ],
    keyTakeaways: [
      'P_i ∝ e^(-E_i/k_B T); population ratios follow immediately.',
      'Every thermodynamic quantity is a derivative of ln Z.',
      'A two-level system shows a Schottky peak in C near k_B T ≈ epsilon.',
      'The ensembles agree in the thermodynamic limit because fluctuations go as 1/sqrt(N).',
      'Particles flow down a chemical-potential gradient as heat flows down a temperature gradient.',
    ],
  },

  pgre_th_quantum_stats: {
    topicId: 'pgre_th_quantum_stats',
    title: 'Quantum Statistics',
    domainWeight: 'Thermodynamics & Statistical Mechanics · 10% of the exam',
    overview: `Indistinguishability splits particles into two families with completely different low-temperature behaviour. This section carries an unusually high density of memorable results, and the exam asks for them directly.`,
    sections: [
      {
        id: 'th-qs-1-distributions',
        title: '1. Fermi-Dirac and Bose-Einstein',
        content: `## The two distributions

Mean occupation of a single-particle state of energy \`E\`:

- **Fermi-Dirac** (half-integer spin, antisymmetric, Pauli exclusion): \`n(E) = 1/(e^((E-mu)/k_B T) + 1)\`
- **Bose-Einstein** (integer spin, symmetric, no exclusion): \`n(E) = 1/(e^((E-mu)/k_B T) - 1)\`

The sign in the denominator is the entire difference and it changes everything. Fermi occupation never exceeds 1; Bose occupation is unbounded and diverges as \`E -> mu\`.

Both reduce to the classical Maxwell-Boltzmann form \`e^(-(E-mu)/k_B T)\` when occupation is small — at high temperature or low density, where quantum statistics stop mattering.

## The Fermi gas

At \`T = 0\` the Fermi function is a step: every state below \`E_F\` filled, every one above empty. Then

\`E_F = (hbar^2/2m)(3 pi^2 n)^(2/3)\`, and \`<E> = (3/5) E_F\` per particle.

Consequences that get asked:

- Electrons in a metal have \`E_F\` of several eV, so \`T_F = E_F/k_B\` is tens of thousands of kelvin. Room temperature is deeply degenerate, and only electrons within \`k_B T\` of \`E_F\` can be excited at all.
- That fraction is \`~T/T_F\`, so the electronic heat capacity is \`C ∝ T\`, not the classical \`(3/2)Nk_B\`. Resolving the "missing" electronic heat capacity of metals was an early triumph of the theory.
- The degeneracy pressure that survives at \`T = 0\` supports white dwarfs and neutron stars.

## Worked example

Copper has \`n = 8.5e28 m^-3\`. \`E_F = ((1.055e-34)^2/(2 x 9.11e-31))(3 pi^2 x 8.5e28)^(2/3) ≈ 7.0 eV\`, so \`T_F ≈ 81,000 K\`. At 300 K, \`T/T_F = 0.004\`: fewer than half a per cent of the electrons participate thermally.`,
        importantNote: `The chemical potential of a Fermi gas equals E_F only at T = 0 and decreases slowly with temperature. For a photon gas mu is exactly zero, because photon number is not conserved — which is why the Planck distribution has no mu in it.`,
      },
      {
        id: 'th-qs-2-photons-bec',
        title: '2. Blackbody Radiation and Bose Condensation',
        content: `## Planck's law

Photons are bosons with \`mu = 0\`, giving the spectral energy density

\`u(nu) dnu = (8 pi h nu^3/c^3)/(e^(h nu/k_B T) - 1) dnu\`.

Its limits are the two classical laws it replaced: the Rayleigh-Jeans form at low frequency (which diverges if extrapolated — the ultraviolet catastrophe) and the Wien form at high frequency.

Integrated results:

- **Stefan-Boltzmann**: total power per area \`= sigma T^4\`, \`sigma = 5.67e-8 W/m^2K^4\`.
- **Wien displacement**: \`lambda_max T = 2.898e-3 m K\`.

The \`T^4\` is why a modest temperature rise makes a large radiative difference, and the displacement law is why hot things glow blue-white and cool ones red.

## Phonons and the Debye model

The same Bose statistics applied to lattice vibrations gives \`C ∝ T^3\` at low temperature, approaching the classical Dulong-Petit value \`3Nk_B\` at high temperature. Adding the electronic \`C ∝ T\`, a metal at low temperature obeys \`C = gamma T + A T^3\`, and plotting \`C/T\` against \`T^2\` separates the two — a standard laboratory measurement.

## Bose-Einstein condensation

For massive bosons with conserved number, below a critical temperature a macroscopic fraction occupies the single ground state:

\`T_c ∝ (n^(2/3) hbar^2)/(m k_B)\`.

Below \`T_c\` the condensate fraction is \`1 - (T/T_c)^(3/2)\`. Superfluid helium-4 and dilute alkali gases are the physical realisations. Fermions cannot do this directly — but they can pair into composite bosons, which is superconductivity.

## Worked example

The Sun's surface at 5800 K peaks at \`lambda = 2.898e-3/5800 = 500 nm\` — green, in the middle of the visible band, which is not a coincidence for eyes that evolved under it. Its emitted flux is \`sigma T^4 = 6.4e7 W/m^2\`.`,
        examTip: `Recognise the low-temperature power law and you have identified the system: C ∝ T is a Fermi gas of electrons, C ∝ T^3 is phonons or photons, and exponential suppression means a gapped system.`,
      },
    ],
    keyTakeaways: [
      'The +1 versus -1 in the denominator is the whole difference between fermions and bosons.',
      'Both reduce to Maxwell-Boltzmann when occupation is small.',
      'Metals are degenerate at room temperature, giving electronic C ∝ T rather than a constant.',
      'Photons have mu = 0, giving Planck, Stefan-Boltzmann T^4 and Wien displacement.',
      'Below T_c a macroscopic fraction of bosons occupies the ground state.',
    ],
  },

  pgre_th_phase: {
    topicId: 'pgre_th_phase',
    title: 'Phase Transitions & Real Gases',
    domainWeight: 'Thermodynamics & Statistical Mechanics · 10% of the exam',
    overview: `Phase transitions are where the ideal-gas picture breaks and interactions matter. The Clausius-Clapeyron relation and the shape of the van der Waals isotherms are the two things reliably asked.`,
    sections: [
      {
        id: 'th-phase-1-transitions',
        title: '1. Phase Equilibrium and Clausius-Clapeyron',
        content: `## Coexistence

Two phases coexist when their chemical potentials are equal. Following that condition along the coexistence curve gives

\`dp/dT = L/(T Delta V)\`,

with \`L\` the latent heat and \`Delta V\` the volume change. For a vapour, \`Delta V ≈ V_gas = RT/p\`, and integrating gives the approximate vapour-pressure law

\`p ∝ e^(-L/RT)\`.

Water's solid-liquid line has **negative** slope because ice is less dense than water, so \`Delta V < 0\`. That is unusual, and it is why raising the pressure lowers the melting point of ice.

## Classification

- **First order**: latent heat, discontinuous density, phases coexist. Melting, boiling.
- **Continuous (second order)**: no latent heat, but a diverging susceptibility or heat capacity and a symmetry change. The ferromagnetic Curie point, the superconducting transition in zero field, the lambda point of helium.

## The triple point and the critical point

The triple point is where all three phases coexist — for water, 273.16 K and 611 Pa, and it defined the kelvin for decades. The critical point is where the liquid-gas distinction disappears; beyond it there is a single supercritical fluid and no boiling.

## Worked example

Water's latent heat of vaporisation is 2260 kJ/kg. At 373 K with \`Delta V ≈ 1.67 m^3/kg\`, \`dp/dT = 2.26e6/(373 x 1.67) = 3630 Pa/K\`. So a 1 kPa drop in atmospheric pressure lowers the boiling point by about 0.3 K — a few degrees at altitude, which is exactly what a pressure cooker is designed around.`,
      },
      {
        id: 'th-phase-2-vdw',
        title: '2. Real Gases and the van der Waals Equation',
        content: `## The equation

\`(p + a n^2/V^2)(V - nb) = nRT\`.

Two corrections to the ideal gas, each with a clear physical meaning:

- \`b\` is excluded volume: molecules have finite size, so the accessible volume is less than \`V\`.
- \`a\` accounts for attraction: molecules near the wall are pulled inward, so the measured pressure is below the ideal one.

## The critical point

Setting the first and second derivatives of \`p\` with respect to \`V\` to zero (where the isotherm has an inflection with a horizontal tangent) gives

\`V_c = 3nb\`, \`T_c = 8a/(27Rb)\`, \`p_c = a/(27b^2)\`,

and the dimensionless combination \`p_c V_c/(n R T_c) = 3/8 = 0.375\` for every substance. Real gases cluster around 0.29 — not exact, but the fact that a two-parameter model predicts a universal number at all is the point, and it foreshadows the law of corresponding states.

## Below T_c

The isotherm develops a wiggle with a region where \`dp/dV > 0\`, which is mechanically unstable. The physical isotherm replaces it with a flat coexistence line, positioned by the **Maxwell equal-area construction** so that the two enclosed areas match. The portions between the coexistence line and the instability are metastable — superheated liquid and supercooled vapour, both physically realisable and both what a bubble chamber exploits.

## Worked example

Why does a real gas cool on free expansion while an ideal one does not? In free expansion \`U\` is constant. For an ideal gas \`U\` depends on \`T\` alone, so \`T\` is unchanged. For a real gas, part of \`U\` is the attractive potential energy; expanding raises it, so the kinetic part must fall, and \`T\` drops. That is the Joule-Thomson effect, and it is how gases are liquefied.`,
        importantNote: `The van der Waals loop below T_c is not physical. The real isotherm is flat across coexistence, and the Maxwell construction is what puts it in the right place. Answer choices showing the unmodified S-shape as the physical isotherm are wrong.`,
      },
    ],
    keyTakeaways: [
      'Clausius-Clapeyron: dp/dT = L/(T Delta V); water\'s negative melting slope follows from ice being less dense.',
      'First-order transitions have latent heat; continuous ones have diverging response instead.',
      'The van der Waals a is attraction and b is excluded volume.',
      'The critical point sits where the isotherm has a horizontal inflection.',
      'The Maxwell construction replaces the unstable loop with the physical flat coexistence line.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // ATOMIC PHYSICS — 10% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_at_structure: {
    topicId: 'pgre_at_structure',
    title: 'Atomic Structure & Spectra',
    domainWeight: 'Atomic Physics · 10% of the exam',
    overview: `The Bohr model is wrong about mechanism and right about hydrogen energies, which is why it survives as a calculational shortcut. Knowing which of its results carry over and which do not is most of what this chapter is for.`,
    sections: [
      {
        id: 'at-str-1-bohr',
        title: '1. The Bohr Model and What It Gets Right',
        content: `## The construction

Quantise angular momentum, \`L = n hbar\`, and balance the Coulomb force against circular motion. Out comes

\`r_n = n^2 a_0/Z\` with \`a_0 = 0.529 Å\`, and \`E_n = -13.6 Z^2/n^2 eV\`.

The energies match the exact quantum solution. The mechanism — a particle on a definite circular orbit — does not survive at all, and the model's own angular momentum assignment is wrong: it gives the ground state \`L = hbar\`, whereas the true 1s state has \`L = 0\`.

## Scaling to remember

- \`r ∝ n^2/Z\`: highly excited (Rydberg) atoms are enormous, and heavier nuclei pull their inner shells in tightly.
- \`E ∝ Z^2/n^2\`: inner-shell binding energies rise steeply with atomic number, which is what makes X-ray lines element-specific.
- \`v ∝ Z/n\`, with \`v/c = Z alpha/n\`. For uranium's innermost electron \`v/c ≈ 0.67\`, which is why heavy-element inner shells need relativistic treatment.

## Reduced mass

The nucleus is not infinitely heavy; replacing \`m_e\` with the reduced mass \`mu = m_e M/(m_e + M)\` shifts the levels slightly. The effect is small for hydrogen but measurable, and it is exactly how deuterium was discovered — its lines are displaced from hydrogen's by the mass difference. For positronium (an electron and a positron) the reduced mass is \`m_e/2\`, halving every energy: its ground state is \`-6.8 eV\`.

## Worked example

For \`He+\` (\`Z = 2\`, one electron), \`E_n = -54.4/n^2 eV\`, so its ionisation energy is 54.4 eV and its \`n = 2\` level coincides with hydrogen's \`n = 1\`. That coincidence, \`E_n(Z=2, 2n) = E_n(Z=1, n)\`, put the Pickering series into the middle of a long argument about stellar spectra.`,
        examTip: `Any hydrogen-like ion (one electron, nuclear charge Z) can be handled by scaling: energies by Z^2, radii by 1/Z. That covers He+, Li2+ and muonic atoms, where instead you scale by the mass ratio.`,
      },
      {
        id: 'at-str-2-spectra',
        title: '2. Spectral Series and Line Widths',
        content: `## Emission and absorption

An atom emits when it drops between levels and absorbs at exactly the same energies. Absorption from a cool gas in front of a hot continuum gives dark lines — Fraunhofer lines in the solar spectrum — at the same wavelengths that gas would emit if excited. That symmetry lets a stellar spectrum identify elements.

## The Rydberg formula

\`1/lambda = R_H Z^2 (1/n_f^2 - 1/n_i^2)\`, with \`R_H = 1.097e7 m^-1\`.

## What broadens a line

Three mechanisms, and questions often ask which dominates:

- **Natural width**: from the finite lifetime, \`Delta E ≈ hbar/tau\`. A 10 ns lifetime gives about \`6.6e-8 eV\` — extremely narrow, and the irreducible floor.
- **Doppler**: thermal motion gives \`Delta lambda/lambda ≈ v/c ≈ sqrt(k_B T/mc^2)\`. Usually dominant in a hot dilute gas.
- **Pressure (collisional)**: collisions interrupt the emission, shortening the effective lifetime. Dominant at high density.

So a low-pressure discharge lamp gives sharp lines and a high-pressure one gives broad ones — which is exactly the design difference between a spectral calibration lamp and a street light.

## Worked example

Hydrogen at 300 K: \`sqrt(k_B T/mc^2) = sqrt(0.0259/(938e6)) = 5.3e-6\`. At 656 nm that is a Doppler width of about 3.4 pm, far larger than the natural width. Cooling the gas or working in a beam is the only way to see below it, and that is why laser cooling mattered.`,
      },
    ],
    keyTakeaways: [
      'Bohr gets hydrogen energies right and the mechanism wrong; its ground-state L = hbar is incorrect.',
      'Scale hydrogen-like ions by Z^2 in energy and 1/Z in radius.',
      'Reduced mass shifts levels measurably: positronium binds at 6.8 eV.',
      'Natural, Doppler and collisional broadening dominate in different density and temperature regimes.',
      'Absorption and emission occur at identical energies, which is what makes stellar spectroscopy work.',
    ],
  },

  pgre_at_multielectron: {
    topicId: 'pgre_at_multielectron',
    title: 'Multi-Electron Atoms',
    domainWeight: 'Atomic Physics · 10% of the exam',
    overview: `Add a second electron and the problem stops being exactly solvable, but the qualitative rules — exclusion, screening, Hund's rules — predict ground states reliably, and that prediction is what gets tested.`,
    sections: [
      {
        id: 'at-multi-1-shells',
        title: '1. The Exclusion Principle and Shell Filling',
        content: `## Pauli

No two identical fermions share a complete set of quantum numbers; equivalently the total wave function is antisymmetric under exchange. A subshell \`l\` holds \`2(2l+1)\` electrons, so s holds 2, p holds 6, d holds 10, f holds 14.

## Screening and the ordering of levels

Inner electrons screen the nucleus, so an outer electron sees an effective charge \`Z_eff < Z\`. Screening depends on \`l\`: low-\`l\` orbitals penetrate closer to the nucleus and are therefore **less** screened and more tightly bound. That is why \`E\` now depends on \`l\` as well as \`n\`, and why the filling order is 1s 2s 2p 3s 3p **4s** 3d 4p — the 4s dips below 3d because it penetrates better.

The exceptions (chromium and copper taking a half-filled or filled d shell at the cost of an s electron) are worth knowing because they are asked about as exceptions.

## Periodic trends

- **Ionisation energy** rises across a period (\`Z_eff\` grows) and falls down a group (larger \`n\`). Noble gases peak; alkalis are minima.
- **Atomic radius** does the reverse.
- Small local reversals occur at half-filled and filled subshells, which have extra exchange stability.

## Worked example

Why is the first ionisation energy of oxygen slightly **below** nitrogen's, against the general trend? Nitrogen has a half-filled 2p^3 with all spins parallel; oxygen's fourth p electron must pair up, paying the electron-electron repulsion. Removing it is therefore easier. That is exchange energy visible in a plain measurement.`,
        examTip: `Ionisation-energy questions usually hinge on a half-filled or filled subshell. If a trend seems violated, check whether the exceptional atom has a p^3, p^6, d^5 or d^10 configuration.`,
      },
      {
        id: 'at-multi-2-terms',
        title: '2. Term Symbols and Hund\'s Rules',
        content: `## Notation

A term symbol is \`^(2S+1) L_J\`, where \`S\` is the total spin, \`L\` the total orbital angular momentum (written S, P, D, F for 0, 1, 2, 3) and \`J\` the total. The superscript \`2S+1\` is the multiplicity.

## Hund's rules, in order

1. Maximise \`S\`. Parallel spins keep electrons apart (the exchange hole), lowering repulsion.
2. For that \`S\`, maximise \`L\`.
3. For a subshell **less** than half filled, \`J = |L - S|\`; more than half filled, \`J = L + S\`. Exactly half filled has \`L = 0\` so \`J = S\`.

The third rule's reversal is the one people forget, and it is exactly what the exam checks.

## Worked example: carbon, 2p^2

Two electrons in p. Maximise \`S\`: both spins parallel, \`S = 1\`, multiplicity 3. Maximise \`L\` subject to exclusion: \`m_l = 1\` and \`0\`, so \`L = 1\` (P). Less than half filled, so \`J = |1-1| = 0\`.

Ground term: \`^3P_0\`.

## Worked example: oxygen, 2p^4

Four electrons in p, so more than half filled. \`S = 1\`, \`L = 1\` again, but now \`J = L + S = 2\`.

Ground term: \`^3P_2\`. Same \`S\` and \`L\` as carbon, opposite \`J\` — which is the whole content of the third rule.`,
        importantNote: `Hund's rules give the GROUND state of a free atom only. They say nothing about the ordering of excited terms and they break down in strong crystal fields or under strong spin-orbit coupling in heavy atoms, where jj coupling replaces LS coupling.`,
      },
    ],
    keyTakeaways: [
      'A subshell holds 2(2l+1) electrons; filling order is set by penetration, hence 4s before 3d.',
      'Low-l orbitals penetrate more, are screened less, and bind more tightly.',
      'Half-filled and filled subshells have extra stability and cause local trend reversals.',
      "Hund: maximise S, then L, then J = |L-S| below half filling and L+S above.",
      'Carbon is ^3P_0 and oxygen is ^3P_2 — same S and L, opposite J.',
    ],
  },

  pgre_at_finestructure: {
    topicId: 'pgre_at_finestructure',
    title: 'Fine & Hyperfine Structure',
    domainWeight: 'Atomic Physics · 10% of the exam',
    overview: `The corrections beyond the gross structure are small but they are where the interesting physics is, and their relative sizes — each smaller than the last by a known factor — are exactly what the exam asks you to rank.`,
    sections: [
      {
        id: 'at-fine-1-fine',
        title: '1. Fine Structure',
        content: `## The three contributions

Fine structure is of order \`alpha^2 ≈ 5e-5\` relative to the gross structure, so about \`1e-4 eV\` in hydrogen. It has three parts, all the same order:

1. **Relativistic kinetic correction**, from expanding \`sqrt(p^2c^2 + m^2c^4)\` beyond \`p^2/2m\`.
2. **Spin-orbit coupling**: in the electron's rest frame the nucleus orbits it, producing a magnetic field that couples to the electron's spin. The energy is \`∝ L . S\`, and since \`L.S = (J^2 - L^2 - S^2)/2\`, states of different \`J\` split.
3. **Darwin term**, affecting only \`l = 0\` states, which are the only ones with density at the nucleus.

Remarkably, the three combine so that the total depends only on \`n\` and \`j\`, not on \`l\` separately. That is a peculiarity of the Coulomb problem, reproduced exactly by the Dirac equation.

## Sodium D lines

The 3p level splits into \`^2P_(1/2)\` and \`^2P_(3/2)\`, and their decays to 3s give 589.6 nm and 589.0 nm — the sodium doublet, the standard example, and the yellow of a street lamp.

Spin-orbit splitting scales roughly as \`Z^4\`, so it is tiny in hydrogen and large in heavy atoms. In the heaviest elements it exceeds the electrostatic term ordering, and LS coupling gives way to jj coupling.

## The Lamb shift

The 2s_(1/2) and 2p_(1/2) states are exactly degenerate in Dirac theory but are measurably split by about 1057 MHz. The explanation is quantum electrodynamic — vacuum fluctuations and self-energy — and its measurement is what launched QED. It is often used as a multiple-choice distractor against fine structure, so keep the mechanisms separate.

## Worked example

Rank the hydrogen energy scales: gross structure 13.6 eV; fine structure \`13.6 alpha^2 ≈ 7e-4 eV\`; Lamb shift \`~4e-6 eV\`; hyperfine \`~6e-6 eV\`. Each is smaller than the last by roughly \`alpha^2\` or by the electron-proton mass ratio.`,
        examTip: `Fine structure goes as alpha^2 relative to gross structure and as Z^4 across elements. Hyperfine is smaller again by the electron-to-proton mass ratio, about 1/1836.`,
      },
      {
        id: 'at-fine-2-hyperfine',
        title: '2. Hyperfine Structure and the 21 cm Line',
        content: `## Origin

The nucleus has its own spin \`I\` and hence a magnetic moment, smaller than the electron's by roughly \`m_e/m_p\`. Its coupling to the electron gives hyperfine structure, of order \`1e-6 eV\` in hydrogen — a thousand times smaller than fine structure.

The total angular momentum becomes \`F = J + I\`, running from \`|J - I|\` to \`J + I\`.

## The 21 cm line

In ground-state hydrogen, \`J = 1/2\` and the proton has \`I = 1/2\`, giving \`F = 0\` and \`F = 1\`. The splitting is \`5.9e-6 eV\`, a photon of 1420 MHz — 21 cm.

The transition is forbidden to electric dipole (it is a magnetic dipole spin flip), so the excited state lives about **11 million years**. In a laboratory that is unobservable; across a galaxy's worth of hydrogen it is bright, and 21 cm astronomy mapped the spiral arms of the Milky Way and measures galactic rotation curves. The absurd lifetime is the point of the question when it appears.

## Worked example

Why is a forbidden transition useful rather than useless? Because column density compensates: an interstellar cloud contains enough atoms that even a \`1/(11 Myr)\` rate produces a detectable flux, while its narrowness and lack of extinction let it be seen across the galactic disc. Allowed optical lines cannot penetrate the dust that 21 cm ignores.`,
      },
    ],
    keyTakeaways: [
      'Fine structure is order alpha^2 of gross structure and depends only on n and j.',
      'Spin-orbit splitting scales as Z^4, driving heavy atoms toward jj coupling.',
      'The Lamb shift is QED, not fine structure, and splits 2s_(1/2) from 2p_(1/2).',
      'Hyperfine is smaller than fine structure by roughly the electron-proton mass ratio.',
      'The 21 cm line is a forbidden magnetic-dipole spin flip with an 11-million-year lifetime.',
    ],
  },

  pgre_at_fields: {
    topicId: 'pgre_at_fields',
    title: 'Atoms in External Fields',
    domainWeight: 'Atomic Physics · 10% of the exam',
    overview: `External fields break the symmetries that produced degeneracy, and the pattern of the resulting splitting identifies the state. Weak-field and strong-field limits behave differently, and knowing which regime you are in is usually the question.`,
    sections: [
      {
        id: 'at-field-1-zeeman',
        title: '1. The Zeeman Effect',
        content: `## Weak field: anomalous Zeeman

For fields weak compared with the spin-orbit coupling, \`J\` remains good and each level splits into \`2J+1\` sublevels:

\`Delta E = g_J mu_B B m_J\`,

with the Lande g-factor

\`g_J = 1 + (J(J+1) + S(S+1) - L(L+1))/(2J(J+1))\`

and \`mu_B = 9.27e-24 J/T = 5.79e-5 eV/T\`.

For a pure singlet (\`S = 0\`) this reduces to \`g_J = 1\` and every line splits into exactly three — the **normal** Zeeman effect. That special case is the historically named one, but the general case is more common in real atoms, which is why it acquired the awkward name "anomalous".

## Strong field: Paschen-Back

When the field exceeds the spin-orbit coupling, \`L\` and \`S\` decouple and quantise separately:

\`Delta E = mu_B B (m_L + 2 m_S)\`,

giving a simpler pattern than the weak-field case. The crossover happens where the two energies are comparable, which is a few tesla in light atoms and much higher in heavy ones.

## Worked example

For a \`^2S_(1/2)\` state: \`L = 0\`, \`S = 1/2\`, \`J = 1/2\`, so \`g_J = 1 + (0.75 + 0.75 - 0)/(2 x 0.75) = 2\`. The splitting is \`2 mu_B B m_J = ±mu_B B\`. In a 1 T field that is \`5.8e-5 eV\`, or 28 GHz — which is precisely the frequency an electron-spin-resonance spectrometer works at.`,
        examTip: `Compute g_J before anything else in a Zeeman problem. A state with S = 0 gives g_J = 1 and the normal three-line pattern; anything else gives more lines and unequal spacings.`,
      },
      {
        id: 'at-field-2-stark',
        title: '2. The Stark Effect and Selection Rules',
        content: `## Linear versus quadratic

An electric field shifts levels by coupling to the electric dipole moment.

- Most atoms have **no** permanent dipole moment in a definite-parity state, so the first-order shift vanishes and the effect is **quadratic**: \`Delta E ∝ -(1/2) alpha_pol E^2\`, always lowering the ground state.
- **Hydrogen is the exception** for \`n >= 2\`, because states of different \`l\` are degenerate there and the field mixes them immediately. Degenerate perturbation theory gives a **linear** Stark effect.

That contrast — linear in hydrogen, quadratic elsewhere — is a standard question, and the reason is the accidental \`l\`-degeneracy of the Coulomb potential.

## Selection rules with a field

The field defines an axis, so \`m\` becomes meaningful. Transitions with \`Delta m = 0\` are polarised along the field (pi lines) and \`Delta m = ±1\` perpendicular to it (sigma lines), circularly polarised when viewed along the field. Observing polarisation therefore identifies \`Delta m\`, which is how Zeeman patterns are read in practice.

## Worked example

Why does a ground-state alkali atom show only a quadratic Stark shift? Its ground state is a single \`s\` state of definite parity, so \`<psi|z|psi> = 0\` by symmetry and the first-order term vanishes. Only the second-order sum over opposite-parity intermediate states survives, and every denominator is negative, so the ground state is pushed down — the atom is always attracted into a stronger field.`,
      },
    ],
    keyTakeaways: [
      'Weak-field Zeeman splitting is g_J mu_B B m_J; S = 0 gives the normal three-line pattern.',
      'Strong fields decouple L and S, giving the simpler Paschen-Back pattern.',
      'mu_B = 5.79e-5 eV/T, so 1 T gives about 28 GHz for a free spin.',
      'The Stark effect is quadratic in general and linear in hydrogen because of its l-degeneracy.',
      'pi lines (Delta m = 0) and sigma lines (Delta m = ±1) differ in polarisation.',
    ],
  },

  pgre_at_xray_lasers: {
    topicId: 'pgre_at_xray_lasers',
    title: 'X-Rays, Lasers & Transitions',
    domainWeight: 'Atomic Physics · 10% of the exam',
    overview: `Two applications with reliable question patterns: Moseley's law for X-ray lines, and the population-inversion condition for lasers. Both follow from material already covered rather than needing new theory.`,
    sections: [
      {
        id: 'at-xray-1-xrays',
        title: '1. X-Ray Production and Moseley\'s Law',
        content: `## The spectrum from an X-ray tube

Two components superimposed:

- **Bremsstrahlung**: a continuum from electrons decelerating in the target, with a sharp **short-wavelength cutoff** at \`lambda_min = hc/eV\` — the case where the entire kinetic energy becomes one photon. The cutoff depends on the accelerating voltage and not at all on the target material.
- **Characteristic lines**: sharp peaks where an inner-shell vacancy is filled. These depend on the target element and not on the voltage, provided the voltage is high enough to create the vacancy at all.

That the two components respond to different variables is the standard question.

## Moseley's law

For \`K_alpha\` (an \`n=2 -> n=1\` transition with one remaining 1s electron screening the nucleus):

\`E ≈ 13.6 (Z-1)^2 (1 - 1/4) = 10.2 (Z-1)^2 eV\`.

The \`(Z-1)\` is the screening by the surviving K electron. Moseley's plot of \`sqrt(f)\` against \`Z\` being a straight line established that atomic **number**, not atomic weight, orders the periodic table — and it identified the gaps where undiscovered elements sat.

## Auger emission

The vacancy can instead be filled with the energy ejecting another electron rather than emitting a photon. Auger emission dominates in light elements; fluorescence yield rises with \`Z\`. This is why X-ray fluorescence analysis works better on heavy elements.

## Worked example

Copper (\`Z = 29\`): \`E(K_alpha) = 10.2(28)^2 = 8000 eV = 8.0 keV\`, wavelength 0.154 nm. That is the standard Cu K-alpha line used in essentially every laboratory X-ray diffractometer, and its wavelength being comparable to atomic spacing is exactly why it is used.`,
        examTip: `The bremsstrahlung cutoff depends only on tube voltage; the characteristic lines depend only on the target element. A question varying one and asking what changes is testing that separation.`,
      },
      {
        id: 'at-laser-2-lasers',
        title: '2. Stimulated Emission and Lasers',
        content: `## The three processes

Einstein's coefficients relate them: absorption (\`B_12\`), spontaneous emission (\`A_21\`), and stimulated emission (\`B_21\`). Detailed balance in a blackbody field forces \`B_12 = B_21\` and

\`A_21/B_21 = 8 pi h nu^3/c^3\`.

The \`nu^3\` says spontaneous emission dominates at high frequency, which is why an X-ray laser is far harder to build than a microwave maser — and why the maser came first.

## Population inversion

Net stimulated emission requires more atoms in the upper state than the lower, weighted by degeneracy: \`N_2/g_2 > N_1/g_1\`. This is impossible in thermal equilibrium at any positive temperature, since the Boltzmann factor always favours the lower level. Inversion therefore requires pumping, and it is sometimes described as a negative temperature — a formal statement, not a cold system.

A **two-level** system cannot be inverted by optical pumping, because the same radiation that excites also stimulates emission, and the best achievable is equal populations. Real lasers use three or four levels, with a long-lived metastable upper laser level and a rapidly emptied lower one. Four-level schemes are more efficient because the lower laser level starts essentially empty.

## Properties of laser light

Coherent (fixed phase relationship), monochromatic (set by the cavity mode and the gain linewidth), directional (set by the cavity geometry), and capable of very high intensity. Every one of those follows from stimulated photons being emitted into the **same mode** as the stimulating photon — that single fact is the physical content.

## Worked example

Why is a metastable upper level essential? Gain requires atoms to wait in the upper state until a photon arrives. A state that decays spontaneously in nanoseconds empties before stimulated emission can dominate; the ruby laser's upper level lives about 3 ms, which is six orders of magnitude of extra patience.`,
        importantNote: `Population inversion is not a violation of thermodynamics; it is a non-equilibrium state maintained by continuous pumping. Answer choices describing it as spontaneous or as an equilibrium property are wrong.`,
      },
    ],
    keyTakeaways: [
      'Bremsstrahlung cutoff depends on voltage; characteristic lines depend on the element.',
      "Moseley's (Z-1)^2 screening ordered the periodic table by atomic number.",
      'A_21/B_21 goes as nu^3, which is why short-wavelength lasers are hard.',
      'Inversion is impossible in equilibrium and impossible in a pure two-level system.',
      'Laser coherence follows from stimulated photons entering the same mode.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // OPTICS & WAVE PHENOMENA — 9% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_ow_waves: {
    topicId: 'pgre_ow_waves',
    title: 'Wave Motion',
    domainWeight: 'Optics & Wave Phenomena · 9% of the exam',
    overview: `The wave equation and its consequences recur in strings, sound, light and quantum amplitudes. Learning the vocabulary once — phase velocity, group velocity, boundary conditions, superposition — pays across four sections of this exam.`,
    sections: [
      {
        id: 'ow-wav-1-basics',
        title: '1. The Wave Equation and Velocities',
        content: `## Form

\`d^2y/dx^2 = (1/v^2) d^2y/dt^2\`, with general solution any \`f(x - vt) + g(x + vt)\`. For a harmonic wave \`y = A sin(kx - omega t)\`, with \`k = 2 pi/lambda\`, \`omega = 2 pi f\`, and

\`v = omega/k = f lambda\`.

Wave speeds come from the medium:

- string: \`v = sqrt(T/mu)\` with \`mu\` the linear mass density
- sound in a gas: \`v = sqrt(gamma R T/M)\`, so it depends on temperature but **not** on pressure
- electromagnetic: \`c/n\`

## Phase and group velocity

\`v_phase = omega/k\` moves the individual crests; \`v_group = d omega/dk\` moves the envelope, and it is the group velocity that carries energy and information. They coincide only in a non-dispersive medium where \`omega ∝ k\`.

In a dispersive medium they differ, and \`v_phase\` can exceed \`c\` without any relativity violation — no signal travels at the phase velocity. A question offering a superluminal phase velocity as a paradox is testing this.

## Boundary conditions

A wave reflecting from a **fixed** end inverts (a \`pi\` phase shift); from a **free** end it does not. In optics the analogue is reflection from a medium of higher refractive index, which inverts, versus lower, which does not — and that distinction decides every thin-film problem.

## Worked example

A string of density \`0.01 kg/m\` under 100 N tension carries waves at \`sqrt(100/0.01) = 100 m/s\`. Fixed at both ends over 0.5 m, its fundamental is \`v/2L = 100 Hz\` and the harmonics are integer multiples. Fix one end and free the other and only odd harmonics survive, with a fundamental of \`v/4L = 50 Hz\` — the difference between an open and a closed organ pipe.`,
        examTip: `The speed of sound depends on temperature but not on pressure, because gamma R T/M has no p in it. A question about a gas at higher pressure and the same temperature is testing exactly that.`,
      },
      {
        id: 'ow-wav-2-superposition',
        title: '2. Superposition, Beats and Doppler',
        content: `## Standing waves

Two counter-propagating waves give \`y = 2A sin(kx) cos(omega t)\`: fixed nodes, no energy transport. On a string fixed at both ends, \`L = n lambda/2\`, so \`f_n = n v/2L\`. In a pipe open at both ends the same; closed at one end, \`L = (2n-1) lambda/4\` and only odd harmonics exist, an octave lower for the same length.

## Beats

Two nearby frequencies give an amplitude modulation at \`f_beat = |f_1 - f_2|\`. Note the beat frequency is the **difference**, not half the difference, even though the modulating envelope oscillates at half that — the ear hears two loudness maxima per envelope cycle. This factor of two is a classic trap.

## Doppler

For sound, source and observer motion enter asymmetrically because the medium defines a rest frame:

\`f' = f (v ± v_o)/(v ∓ v_s)\`,

signs chosen so that approach raises the pitch. For light there is no medium, so only the relative velocity matters, and the relativistic formula \`f' = f sqrt((1-beta)/(1+beta))\` for recession applies.

## Worked example

An ambulance at 30 m/s approaches, siren at 1000 Hz, sound speed 343 m/s. Observed: \`1000 (343)/(343-30) = 1096 Hz\`. Receding: \`1000(343)/(373) = 920 Hz\`. The jump as it passes is 176 Hz — nearly three semitones, which is why the effect is so audible.`,
        importantNote: `For sound, moving the source and moving the observer give different results at the same relative speed, because the air is a preferred frame. For light they cannot differ, and that is precisely what special relativity requires.`,
      },
    ],
    keyTakeaways: [
      'Group velocity carries energy; phase velocity may exceed c without consequence.',
      'Sound speed depends on temperature, not pressure.',
      'Reflection at a fixed end (or off a higher-index medium) inverts the wave.',
      'A pipe closed at one end has only odd harmonics and half the fundamental of an open one.',
      'Beat frequency is the full difference; sound Doppler is asymmetric, light Doppler is not.',
    ],
  },

  pgre_ow_geometric: {
    topicId: 'pgre_ow_geometric',
    title: 'Geometric Optics',
    domainWeight: 'Optics & Wave Phenomena · 9% of the exam',
    overview: `Ray optics is the fastest-scoring material in this section provided your sign conventions are consistent. Nearly every wrong answer here is a sign, not a physics error.`,
    sections: [
      {
        id: 'ow-geo-1-refraction',
        title: '1. Reflection, Refraction and Total Internal Reflection',
        content: `## Snell's law

\`n_1 sin(theta_1) = n_2 sin(theta_2)\`, angles from the **normal**. Light entering a denser medium bends toward the normal and slows to \`c/n\`, while its frequency is unchanged and its wavelength shortens to \`lambda_0/n\`.

That frequency is conserved and wavelength is not is worth stating explicitly, because questions about colour in water depend on it.

## Total internal reflection

Going from dense to rare, refraction becomes impossible beyond the critical angle

\`theta_c = arcsin(n_2/n_1)\`.

Beyond it, all the light reflects — the basis of optical fibre and of the prism reflectors in binoculars. There is still an evanescent field in the rarer medium, decaying exponentially, which is what frustrated total internal reflection exploits.

## Dispersion

\`n\` depends on wavelength, generally larger for blue. So blue bends more, which gives the prism spectrum and the rainbow, and puts red on the outside of the primary bow.

## Worked example

Critical angle for glass (\`n = 1.5\`) to air: \`arcsin(1/1.5) = 41.8\` degrees. That is below 45 degrees, which is exactly why a 45-45-90 glass prism reflects totally on its hypotenuse and can replace a mirror with no coating.`,
      },
      {
        id: 'ow-geo-2-lenses',
        title: '2. Mirrors, Lenses and Sign Conventions',
        content: `## The equations

\`1/f = 1/d_o + 1/d_i\`, magnification \`m = -d_i/d_o\`.

For a thin lens in air, the lensmaker's equation gives \`1/f = (n-1)(1/R_1 - 1/R_2)\`; for a spherical mirror \`f = R/2\`.

## The convention that decides everything

Using the standard real-is-positive convention:

- \`f > 0\` for converging (convex lens, concave mirror); \`f < 0\` for diverging.
- \`d_i > 0\` means a **real** image, on the far side for a lens and in front for a mirror.
- \`d_i < 0\` means a **virtual** image, on the same side as the object.
- \`m > 0\` means upright, \`m < 0\` inverted. \`|m| > 1\` is enlarged.

The reliable facts: a converging lens with the object inside \`f\` gives a virtual, upright, enlarged image (the magnifying glass); a diverging lens always gives a virtual, upright, reduced image whatever the object distance; a real image from a single lens is always inverted.

## Combinations

Trace lens by lens: the image of one is the object of the next, with a **negative** object distance if that image falls beyond the second lens. For thin lenses in contact, \`1/f = 1/f_1 + 1/f_2\`, so powers in dioptres simply add.

## Worked example

An object 15 cm from a converging lens of \`f = 10 cm\`: \`1/d_i = 1/10 - 1/15 = 1/30\`, so \`d_i = 30 cm\`, real and inverted with \`m = -2\`.

Move it to 5 cm: \`1/d_i = 1/10 - 1/5 = -1/10\`, so \`d_i = -10 cm\` — virtual, on the object's side, with \`m = +2\`: upright and doubled. Same lens, opposite character, decided entirely by whether the object is inside or outside \`f\`.`,
        examTip: `Sketch two rays before computing: one through the centre undeviated, one parallel to the axis then through the focus. The sketch tells you real or virtual and upright or inverted, which then checks the signs your algebra produces.`,
      },
    ],
    keyTakeaways: [
      'Frequency is unchanged on refraction; wavelength and speed both scale as 1/n.',
      'Total internal reflection needs dense-to-rare incidence beyond arcsin(n_2/n_1).',
      'Positive d_i means a real image; negative means virtual and on the object side.',
      'A single lens producing a real image always inverts it.',
      'Thin lenses in contact add their powers.',
    ],
  },

  pgre_ow_interference: {
    topicId: 'pgre_ow_interference',
    title: 'Interference',
    domainWeight: 'Optics & Wave Phenomena · 9% of the exam',
    overview: `Interference questions come down to counting path difference in wavelengths and remembering when a reflection adds half a wavelength. The second part is where most marks are lost.`,
    sections: [
      {
        id: 'ow-int-1-doubleslit',
        title: '1. Young\'s Double Slit',
        content: `## Conditions

With slit separation \`d\` and small angles,

- maxima: \`d sin(theta) = m lambda\`
- minima: \`d sin(theta) = (m + 1/2) lambda\`

On a screen at distance \`L\`, fringe positions are \`y_m = m lambda L/d\` and the fringe spacing is \`Delta y = lambda L/d\`. So wider slit separation gives **narrower** fringes — an inverse relationship that gets tested.

## Intensity

\`I = 4 I_0 cos^2(pi d sin(theta)/lambda)\`, so the peaks reach four times the single-slit intensity, not twice. Amplitudes add, then are squared. Energy is conserved because the dark fringes receive nothing; interference redistributes, it does not create.

## What changes what

- Longer wavelength: wider fringes. Red fringes are more widely spaced than blue.
- Immersion in water (\`n = 1.33\`): the wavelength shortens, so fringes contract by that factor.
- Covering one slit with a thin film: the pattern shifts sideways without changing its spacing.
- Reducing coherence: the fringes wash out.

## Worked example

Light of 600 nm through slits 0.2 mm apart, screen 2 m away: \`Delta y = (600e-9)(2)/(2e-4) = 6 mm\`. Immerse the whole apparatus in water and the spacing becomes \`6/1.33 = 4.5 mm\`.`,
      },
      {
        id: 'ow-int-2-films',
        title: '2. Thin Films and Interferometers',
        content: `## The half-wave rule

Reflection off a medium of **higher** index adds a \`pi\` phase shift — half a wavelength of path. Reflection off a lower-index medium adds nothing. Whether the two reflections in a thin film both shift, or only one, decides which condition is constructive.

For a film of index \`n\` and thickness \`t\` in air, with light at normal incidence, **one** reflection shifts (the top one), so:

- constructive: \`2 n t = (m + 1/2) lambda\`
- destructive: \`2 n t = m lambda\`

If the film sits between two media such that both reflections shift, or neither does, the conditions swap. Always count the shifts before writing the condition — the exam constructs both cases.

## Consequences

- A soap film thins to nothing at the top and appears **black** there just before it bursts: \`t -> 0\` gives destructive interference from the single \`pi\` shift alone.
- An anti-reflection coating uses \`n_coating = sqrt(n_glass)\` and \`t = lambda/4n\`, so that both reflections shift and the quarter-wave thickness makes them cancel.

## Michelson interferometer

Moving one mirror by \`d\` changes the path by \`2d\`, so the number of fringes passing is \`N = 2d/lambda\`. That factor of two is the whole instrument, and it is why the Michelson can measure displacements far below a wavelength — and why LIGO is one.

## Worked example

A Michelson at 633 nm shows 100 fringes as a mirror moves. \`d = N lambda/2 = 100(633e-9)/2 = 31.7 μm\`. Reading fringes to a tenth gives 30 nm resolution from a table-top instrument.`,
        importantNote: `Count the pi shifts before writing the interference condition. Air-film-air gives one shift; a coating whose index lies between air and substrate gives two, which reverses constructive and destructive.`,
      },
    ],
    keyTakeaways: [
      'Fringe spacing is lambda L/d: wider slits give narrower fringes.',
      'Two-slit maxima reach 4 I_0 because amplitudes add before squaring.',
      'Reflection off a higher-index medium adds a pi shift; off a lower-index one it does not.',
      'A very thin soap film looks black — the single pi shift alone gives destructive interference.',
      'A Michelson mirror moved by d passes 2d/lambda fringes.',
    ],
  },

  pgre_ow_diffraction: {
    topicId: 'pgre_ow_diffraction',
    title: 'Diffraction & Polarisation',
    domainWeight: 'Optics & Wave Phenomena · 9% of the exam',
    overview: `Diffraction sets the resolution limit of every optical instrument, and polarisation questions reduce to Malus's law plus one angle. Both are short calculations once the right formula is identified.`,
    sections: [
      {
        id: 'ow-dif-1-diffraction',
        title: '1. Single Slit, Gratings and Resolution',
        content: `## Single slit

Minima at \`a sin(theta) = m lambda\` for \`m = 1, 2, 3, ...\` — note this is the **minimum** condition, the reverse of the double slit, and the \`m = 0\` case is excluded because it is the central maximum. The central maximum is twice as wide as the others and holds most of the energy.

Narrower slits spread the pattern. In the limit \`a ≈ lambda\` the light spreads over nearly a hemisphere, which is why diffraction is invisible for macroscopic apertures and dominant for small ones.

## Gratings

\`d sin(theta) = m lambda\` for maxima, with \`N\` slits sharpening each peak. The resolving power is

\`lambda/Delta lambda = m N\`,

so a wide grating in a high order separates close lines. That is why spectrographs use gratings rather than prisms: the resolution is a design parameter rather than a material property.

## Circular aperture and the Rayleigh criterion

\`theta_min = 1.22 lambda/D\`. Two point sources are just resolved when the first minimum of one falls on the maximum of the other. This limits telescopes, microscopes and eyes alike, and it is the reason for large apertures and for short-wavelength microscopy.

## Worked example

A 2.4 m telescope at 550 nm: \`theta_min = 1.22(550e-9)/2.4 = 2.8e-7 rad = 0.058 arcsec\`. The human eye, pupil 3 mm, gets \`2.2e-4 rad\` — about 1 arcminute, which is exactly the conventional limit of unaided vision and why 20/20 is defined where it is.`,
        examTip: `Single-slit minima and double-slit maxima share the form (something) sin(theta) = m lambda. Check which one the question describes before substituting: the same equation means opposite things.`,
      },
      {
        id: 'ow-dif-2-polarisation',
        title: '2. Polarisation',
        content: `## Producing polarised light

- **Absorption**: a polaroid transmits one component. Unpolarised light loses exactly half.
- **Reflection**: at Brewster's angle \`theta_B = arctan(n_2/n_1)\`, the reflected light is completely polarised parallel to the surface. At that angle the reflected and refracted rays are exactly 90 degrees apart, which is the physical reason it works — a dipole cannot radiate along its own axis.
- **Scattering**: light scattered at 90 degrees from the beam is strongly polarised, which is why sky light is polarised and why a polarising filter darkens a blue sky most at 90 degrees from the sun.
- **Birefringence**: a crystal with different indices for two polarisations splits a beam.

## Malus's law

Already-polarised light through an analyser at angle \`theta\`: \`I = I_0 cos^2(theta)\`.

The classic three-polariser problem: crossed polarisers pass nothing, but inserting a third at 45 degrees between them restores \`I_0/2 x cos^2(45) x cos^2(45) = I_0/8\` of the original unpolarised intensity. Adding an element **increases** transmission, which is genuinely surprising and is asked about often.

## Worked example

Brewster's angle for air to glass (\`n = 1.5\`): \`arctan(1.5) = 56.3\` degrees from the normal. Sunlight glaring off a road or water surface arrives near this angle horizontally polarised, which is why polarised sunglasses are cut to block the horizontal component.`,
        importantNote: `Unpolarised light through the first polariser always loses exactly half, whatever its orientation. Malus's law applies from the second element onward — applying it to the first is the standard error in the three-polariser problem.`,
      },
    ],
    keyTakeaways: [
      'Single-slit minima at a sin(theta) = m lambda; the central maximum is twice as wide.',
      'Grating resolving power is mN, which is why gratings beat prisms.',
      'Rayleigh criterion theta = 1.22 lambda/D limits every aperture.',
      "Brewster's angle is arctan(n2/n1) and gives fully polarised reflection.",
      'Three polarisers can transmit where two transmit nothing: I_0/8 at 45 degrees.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SPECIALIZED TOPICS — 9% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_sp_nuclear: {
    topicId: 'pgre_sp_nuclear',
    title: 'Nuclear Physics',
    domainWeight: 'Specialized Topics · 9% of the exam',
    overview: `Nuclear questions are usually about binding energy, decay kinematics and conservation laws rather than nuclear structure. The binding-energy curve explains both fission and fusion in one picture.`,
    sections: [
      {
        id: 'sp-nuc-1-binding',
        title: '1. Binding Energy and the Mass Defect',
        content: `## Mass defect

A nucleus weighs less than its constituents; the difference is the binding energy via \`E = mc^2\`. The convenient unit is \`1 u = 931.5 MeV/c^2\`.

The binding energy **per nucleon** rises steeply from hydrogen, peaks near iron-56 at about 8.8 MeV, and declines slowly to about 7.6 MeV at uranium. That single curve says:

- **Fusion** of light nuclei releases energy (climbing toward the peak).
- **Fission** of heavy nuclei releases energy (also climbing toward the peak, from the other side).
- Iron is the end of the line, which is why stellar fusion stops there and why iron-peak elements are so abundant.

## The semi-empirical mass formula

Volume, surface, Coulomb, asymmetry and pairing terms. You will rarely need to evaluate it, but the terms explain the features: the surface term is why small nuclei are less bound, the Coulomb term is why heavy nuclei need excess neutrons, and the pairing term is why even-even nuclei are unusually stable and why there are so many stable even-\`Z\` isotopes.

## Worked example

Helium-4: \`2(1.00728) + 2(1.00867) = 4.03190 u\` of constituents against \`4.00151 u\` for the nucleus. The defect is \`0.03039 u\`, so \`B = 0.03039(931.5) = 28.3 MeV\`, or 7.07 MeV per nucleon. Unusually large for such a light nucleus, which is why the alpha particle is emitted as a unit.`,
      },
      {
        id: 'sp-nuc-2-decay',
        title: '2. Radioactive Decay',
        content: `## The law

\`N = N_0 e^(-lambda t)\`, with half-life \`t_(1/2) = ln2/lambda = 0.693/lambda\` and mean lifetime \`tau = 1/lambda\`. Activity \`A = lambda N\` decays with the same constant. Note \`tau = t_(1/2)/0.693\`, so the mean life is **longer** than the half-life — a swap the exam exploits.

## The modes

| Mode | Emission | Effect |
|---|---|---|
| Alpha | \`^4He\` nucleus | \`Z-2, A-4\` |
| Beta minus | electron + antineutrino | \`Z+1, A\` |
| Beta plus | positron + neutrino | \`Z-1, A\` |
| Electron capture | neutrino | \`Z-1, A\` |
| Gamma | photon | no change in Z or A |

Beta decay's continuous energy spectrum is what forced Pauli to postulate the neutrino: a two-body decay would give a single sharp energy, and the observed continuum requires a third body.

Alpha decay is tunnelling through the Coulomb barrier, which is why its half-lives span more than twenty orders of magnitude for a narrow range of energies — the exponential sensitivity of the tunnelling factor amplifies a small energy difference enormously. That is the Geiger-Nuttall relation.

## Worked example

A sample decays to 1/8 of its activity in 30 days. Three half-lives have passed, so \`t_(1/2) = 10\` days, \`lambda = 0.0693\` per day, and the mean lifetime is 14.4 days.`,
        importantNote: `Conserve charge, baryon number and lepton number in every decay. A beta-minus emits an ANTI-neutrino (to balance the lepton number of the electron) and beta-plus emits a neutrino. Getting that pairing backwards is a common error.`,
      },
    ],
    keyTakeaways: [
      'Binding energy per nucleon peaks at iron-56, which is why both fusion and fission can release energy.',
      '1 u = 931.5 MeV/c^2.',
      'Mean lifetime is 1/lambda, longer than the half-life by a factor 1/0.693.',
      "Beta decay's continuous spectrum is the evidence for the neutrino.",
      'Alpha decay is barrier tunnelling, hence the vast spread of half-lives.',
    ],
  },

  pgre_sp_particle: {
    topicId: 'pgre_sp_particle',
    title: 'Particle Physics',
    domainWeight: 'Specialized Topics · 9% of the exam',
    overview: `Particle questions on this test are conservation-law questions. Given a proposed reaction, check charge, baryon number, lepton number and the relevant flavour, and the allowed one falls out.`,
    sections: [
      {
        id: 'sp-part-1-inventory',
        title: '1. The Standard Model Inventory',
        content: `## Fermions

Three generations, each with two quarks and two leptons:

- Quarks: (u, d), (c, s), (t, b) — charges \`+2/3\` and \`-1/3\`, and they carry colour so they are always confined into hadrons.
- Leptons: (e, nu_e), (mu, nu_mu), (tau, nu_tau) — no colour, so they appear free.

Hadrons come in two families: **baryons** (three quarks, baryon number 1) and **mesons** (quark-antiquark, baryon number 0). A proton is \`uud\` and a neutron \`udd\`; a \`pi+\` is \`u dbar\`.

## Bosons and forces

| Force | Carrier | Relative strength | Range |
|---|---|---|---|
| Strong | gluon | 1 | \`~1 fm\` (confined) |
| Electromagnetic | photon | \`1/137\` | infinite |
| Weak | W, Z | \`1e-6\` | \`~1e-3 fm\` |
| Gravity | (graviton) | \`1e-39\` | infinite |

Range is inversely related to carrier mass: the massless photon gives infinite range, the ~80-90 GeV W and Z give an extremely short one. The Higgs boson gives mass to the W, Z and the fermions.

## Worked example

Why is the weak force weak? Not because its coupling is small — it is comparable to electromagnetism — but because the propagator carries \`1/M_W^2\` at low energy. At energies approaching \`M_W\` the weak and electromagnetic strengths converge, which is the electroweak unification.`,
      },
      {
        id: 'sp-part-2-conservation',
        title: '2. Conservation Laws and Allowed Reactions',
        content: `## Always conserved

Energy, momentum, angular momentum, electric charge, baryon number, and each lepton number separately (to a very good approximation; neutrino oscillation violates the separate ones but not the total).

## Conserved by some interactions only

- **Strangeness, charm, and other flavours**: conserved by strong and electromagnetic interactions, **violated** by the weak.
- **Parity**: conserved by strong and electromagnetic, violated by the weak — the Wu experiment.
- **CP**: nearly conserved, violated slightly in kaon and B-meson decays.

So a reaction that changes strangeness must be weak, and a weak process is slow: strong decays go in \`1e-23 s\`, electromagnetic in \`1e-16 s\`, weak in \`1e-10 s\` or longer. **The lifetime of a particle tells you which interaction governed its decay**, and that inference is a standard exam question.

## Worked example

Is \`p -> n + e+ + nu_e\` allowed for a free proton? Charge: \`+1 = 0 + 1 + 0\`, fine. Baryon: \`1 = 1\`, fine. Lepton: \`0 = 0 - 1 + 1\`, fine. But the neutron is heavier than the proton, so energy conservation forbids it for a free proton. Inside a nucleus, where binding energy can supply the difference, it happens routinely — that is beta-plus decay.

## Worked example

\`Lambda^0 -> p + pi^-\` changes strangeness from \`-1\` to \`0\`, so it must be weak. Its measured lifetime is \`2.6e-10 s\`, thirteen orders of magnitude longer than a strong decay — exactly as that inference predicts.`,
        examTip: `Given a candidate reaction, check in this order: charge, baryon number, lepton number by generation, then strangeness. The first violation you find settles it, and a strangeness-only violation means "allowed, but weak and slow" rather than "forbidden".`,
      },
    ],
    keyTakeaways: [
      'Baryons are three quarks, mesons a quark-antiquark pair.',
      'Force range is set by carrier mass; the weak force is weak at low energy because of the W mass.',
      'Strangeness and parity are conserved by strong and EM interactions but not by the weak.',
      'Decay lifetime identifies the interaction: 1e-23 strong, 1e-16 EM, 1e-10 or longer weak.',
      'Check charge, baryon and lepton number first; they are never violated.',
    ],
  },

  pgre_sp_condensed: {
    topicId: 'pgre_sp_condensed',
    title: 'Condensed Matter',
    domainWeight: 'Specialized Topics · 9% of the exam',
    overview: `Solid-state questions cluster around crystal structure, Bragg diffraction and band theory. The band picture in particular explains metals, insulators and semiconductors in one diagram.`,
    sections: [
      {
        id: 'sp-cond-1-crystals',
        title: '1. Crystal Structure and Diffraction',
        content: `## Lattices

Cubic structures and their packing:

| Structure | Atoms per cell | Coordination | Packing fraction |
|---|---|---|---|
| Simple cubic | 1 | 6 | 0.52 |
| Body-centred cubic | 2 | 8 | 0.68 |
| Face-centred cubic | 4 | 12 | 0.74 |

FCC and hexagonal close packing both reach 0.74, the maximum for identical spheres.

## Bragg's law

\`2 d sin(theta) = n lambda\`, with \`theta\` measured from the **planes**, not from the normal — the opposite convention to optics, and a reliable source of factor errors.

For cubic crystals the plane spacing is \`d = a/sqrt(h^2+k^2+l^2)\`. Since \`sin(theta) <= 1\`, diffraction requires \`lambda <= 2d\`, which is why X-rays (0.1 nm) and not visible light are used: atomic spacings are a few tenths of a nanometre.

## Reciprocal space

Diffraction probes the reciprocal lattice; the Brillouin zone is its primitive cell, and electron states are labelled by \`k\` within it. Band gaps open at the zone boundary, where the electron wave Bragg-reflects off the lattice — the same physics as X-ray diffraction, applied to the electrons themselves.

## Worked example

Copper is FCC with \`a = 0.361 nm\`. The (111) spacing is \`0.361/sqrt(3) = 0.208 nm\`. With Cu K-alpha at 0.154 nm, first-order Bragg gives \`sin(theta) = 0.154/(2 x 0.208) = 0.370\`, so \`theta = 21.7\` degrees, and the detector sits at \`2 theta = 43.4\` degrees.`,
        examTip: `Bragg angles are measured from the crystal planes and detector angles are 2 theta. Optics angles are measured from the normal. Mixing the two conventions is the most common solid-state slip.`,
      },
      {
        id: 'sp-cond-2-bands',
        title: '2. Band Theory, Semiconductors and Superconductivity',
        content: `## Bands

A periodic potential turns the free-electron parabola into bands separated by gaps. Whether a material conducts depends on where the Fermi level sits:

- **Metal**: the highest occupied band is partly filled, so states are available immediately above \`E_F\`.
- **Insulator**: a filled band with a large gap (\`> 3 eV\`) above it. A filled band carries no current, however many electrons it contains — every state is occupied so there is no net momentum available.
- **Semiconductor**: the same structure with a small gap (silicon 1.1 eV, germanium 0.67 eV), so thermal excitation puts some carriers in the conduction band.

That last point explains the sign of the temperature coefficient: metals become **worse** conductors when heated (more phonon scattering) while semiconductors become **better** (exponentially more carriers). The opposite signs are a standard question.

## Doping

- **n-type**: donors (group V in silicon) put electrons just below the conduction band.
- **p-type**: acceptors (group III) put holes just above the valence band.

Carrier concentration in an intrinsic semiconductor goes as \`e^(-E_g/2k_B T)\` — note the factor of two, because the Fermi level sits in the middle of the gap.

A p-n junction rectifies because the built-in field permits carrier flow in one direction only, and that is the basis of every diode, transistor, LED and solar cell.

## Superconductivity

Below \`T_c\`, zero resistance and the **Meissner effect** — complete expulsion of magnetic flux, which is a stronger statement than zero resistance alone and is what distinguishes a superconductor from a hypothetical perfect conductor. BCS theory explains it by phonon-mediated pairing of electrons into Cooper pairs, which are bosons and condense. The energy gap is about \`3.5 k_B T_c\`.

Type I superconductors expel flux until a critical field destroys the state; type II admit quantised flux vortices over a range of fields and are the ones used in high-field magnets.

## Worked example

Silicon at 300 K: \`e^(-1.1/(2 x 0.0259)) = e^-21 ≈ 7e-10\`. Intrinsic silicon is a poor conductor; doping at one part per million raises the carrier concentration by orders of magnitude, which is why semiconductor devices depend on purity control rather than on the pure material.`,
        importantNote: `A completely filled band carries no current no matter how many electrons it holds. Conduction requires accessible empty states adjacent in energy — that is why the gap, not the electron count, decides whether a solid conducts.`,
      },
    ],
    keyTakeaways: [
      'FCC and HCP reach the maximum sphere packing fraction of 0.74.',
      'Bragg angles are from the planes; diffraction needs lambda <= 2d.',
      'A filled band carries no current; the gap size decides metal, semiconductor or insulator.',
      'Metals conduct worse when heated; semiconductors conduct better.',
      'The Meissner effect, not just zero resistance, defines a superconductor.',
    ],
  },

  pgre_sp_astro: {
    topicId: 'pgre_sp_astro',
    title: 'Astrophysics & Cosmology',
    domainWeight: 'Specialized Topics · 9% of the exam',
    overview: `Astrophysics appears as applications of material already covered: blackbody radiation, gravitation, nuclear binding. The magnitude scale is the one genuinely new convention, and it is worth ten minutes because it is unintuitive.`,
    sections: [
      {
        id: 'sp-astro-1-stars',
        title: '1. Stars, Magnitudes and Evolution',
        content: `## Luminosity and magnitude

A star radiates as a blackbody: \`L = 4 pi R^2 sigma T^4\`. Two stars at the same temperature differ in luminosity only through radius, which is how "giant" and "dwarf" are distinguished on the same spectral type.

The magnitude scale is logarithmic, **inverted**, and defined so that 5 magnitudes is a factor of 100:

\`m_1 - m_2 = -2.5 log10(F_1/F_2)\`.

So one magnitude is a factor of \`100^(1/5) = 2.512\`, and a **larger** magnitude means a fainter object. Absolute magnitude is the apparent magnitude the star would have at 10 parsecs, and the distance modulus is

\`m - M = 5 log10(d/10 pc)\`.

## The HR diagram

Luminosity against temperature (with temperature increasing leftward, another inverted convention). The main sequence runs diagonally, and along it \`L ∝ M^3.5\`, so a star ten times the Sun's mass is about 3000 times more luminous — and burns out roughly \`M/L ∝ M^-2.5\` times faster. Massive stars live millions of years, the Sun about ten billion.

## Evolution and endpoints

Hydrogen burning on the main sequence, then shell burning and expansion to a red giant, then:

- Below about 1.4 solar masses of core (the **Chandrasekhar limit**): a white dwarf supported by electron degeneracy pressure.
- Above it: a neutron star supported by neutron degeneracy, up to a few solar masses.
- Above that: a black hole, with Schwarzschild radius \`r_s = 2GM/c^2\`.

Each limit is a competition between gravity and a degeneracy pressure from the quantum statistics section — that connection is often what a question is really testing.

## Worked example

The Sun's Schwarzschild radius: \`2(6.67e-11)(1.99e30)/(9e16) = 2.95 km\`. Earth's is about 9 mm. Neither is a black hole because neither is anywhere near that compact — the radius is a statement about what compactness would be required.`,
        examTip: `Magnitudes run backwards and logarithmically: 5 magnitudes is exactly 100 in flux. A question asking which object is brighter is testing the sign as much as the arithmetic.`,
      },
      {
        id: 'sp-astro-2-cosmology',
        title: '2. Cosmology',
        content: `## Expansion

Hubble's law, \`v = H_0 d\`, with \`H_0 ≈ 70 km/s/Mpc\`. Its reciprocal, the Hubble time \`1/H_0 ≈ 14\` billion years, estimates the age of the universe, and \`c/H_0\` gives a horizon scale of order 14 billion light years.

Redshift \`z = (lambda_obs - lambda_emit)/lambda_emit\`. For distant objects this is **not** a Doppler shift through space but an expansion of space itself, so the scale factor satisfies \`1 + z = a_now/a_then\`. Answer choices treating cosmological redshift as ordinary Doppler recession are testing that distinction.

## The cosmic microwave background

A near-perfect blackbody at 2.725 K, released when the universe cooled enough for neutral atoms to form (recombination, \`z ≈ 1100\`, about 380,000 years). Its temperature anisotropies are one part in \`1e5\` and their angular power spectrum is the main constraint on the cosmological parameters.

The CMB temperature scales as \`1/a\`, so it was hotter in the past — 3000 K at recombination, which is exactly the temperature at which hydrogen recombines.

## Nucleosynthesis and content

Big Bang nucleosynthesis in the first few minutes produced about 75% hydrogen and 25% helium-4 by mass, plus traces of deuterium and lithium. Everything heavier came from stars. The observed light-element abundances match the prediction across nine orders of magnitude, which is the strongest quantitative evidence for the hot Big Bang.

Present energy content is roughly 5% ordinary matter, 27% dark matter, 68% dark energy. Dark matter is inferred from galactic rotation curves staying flat rather than falling as \`1/sqrt(r)\`, and from cluster dynamics and lensing.

## Worked example

A galaxy at \`z = 0.1\` recedes at roughly \`0.1c = 3e4 km/s\`, so \`d = v/H_0 = 3e4/70 = 429 Mpc\`, about 1.4 billion light years. At small \`z\` the linear approximation is fine; at \`z\` of order 1 it is not, and a proper cosmological model is required.`,
      },
    ],
    keyTakeaways: [
      'Magnitudes are inverted and logarithmic: 5 magnitudes is a factor of 100 in flux.',
      'Main-sequence L goes as M^3.5, so massive stars are brief.',
      'Chandrasekhar (1.4 solar masses) separates white dwarfs from neutron stars.',
      'Cosmological redshift is expansion of space, not motion through it.',
      'The CMB is a 2.725 K blackbody from recombination at z ≈ 1100.',
    ],
  },

  pgre_sp_math: {
    topicId: 'pgre_sp_math',
    title: 'Mathematical Methods',
    domainWeight: 'Specialized Topics · 9% of the exam',
    overview: `The mathematics this exam uses is narrow and repetitive. Vector calculus identities, series expansions and a handful of standard integrals cover almost everything, and knowing them by sight saves minutes you do not have.`,
    sections: [
      {
        id: 'sp-math-1-vector',
        title: '1. Vector Calculus',
        content: `## The operators

- \`grad f\` points uphill on \`f\`, with magnitude the steepest slope.
- \`div F\` measures net outflow per volume — sources and sinks.
- \`curl F\` measures circulation per area.

Two identities that are always true and are frequently the answer:

\`curl(grad f) = 0\` and \`div(curl F) = 0\`.

The first is why a conservative field has a potential; the second is why \`B = curl A\` guarantees \`div B = 0\`.

## The theorems

- **Divergence (Gauss)**: \`integral over V of div F dV = integral over S of F . dA\`.
- **Stokes**: \`integral over S of curl F . dA = integral over C of F . dl\`.

Every one of Maxwell's equations has an integral and a differential form related by exactly these two theorems, which is worth seeing once explicitly so that the pairs are obvious.

## Coordinates

Know the volume elements: \`dV = r^2 sin(theta) dr d(theta) d(phi)\` in spherical and \`dV = rho d(rho) d(phi) dz\` in cylindrical. Getting the Jacobian wrong is the most common integration error, and the spherical one in particular is worth writing out rather than recalling under pressure.

## Worked example

Verify \`div(r_hat/r^2) = 0\` for \`r != 0\`. In spherical coordinates \`div F = (1/r^2) d(r^2 F_r)/dr\`, and \`r^2 F_r = 1\`, whose derivative vanishes. At the origin it is a delta function — which is Gauss's law for a point charge in differential form.`,
      },
      {
        id: 'sp-math-2-series',
        title: '2. Series, Complex Numbers and Fourier',
        content: `## Expansions worth memorising

For small \`x\`:

- \`e^x ≈ 1 + x + x^2/2\`
- \`sin x ≈ x - x^3/6\`
- \`cos x ≈ 1 - x^2/2\`
- \`(1+x)^n ≈ 1 + nx\`
- \`ln(1+x) ≈ x - x^2/2\`

The binomial one earns its place: relativistic energy expands as \`gamma mc^2 ≈ mc^2 + (1/2)mv^2\` through it, and half the small-angle and low-velocity approximations on this exam are one line of \`(1+x)^n\`.

## Complex numbers

\`e^(i theta) = cos(theta) + i sin(theta)\`. Using complex exponentials for oscillations and taking the real part at the end turns differential equations into algebra, and it is the standard method for AC circuits and for waves.

Residues are occasionally useful, but on this exam recognising that an integral is standard is worth more than evaluating it by contour.

## Fourier

Any periodic function decomposes into sines and cosines; any function decomposes into a Fourier integral. Two facts get asked:

- A **narrow** pulse in time has a **broad** spectrum, and vice versa: \`Delta t Delta omega >= 1/2\`. This is the classical origin of the uncertainty principle, and the same mathematics.
- The Fourier transform of a Gaussian is a Gaussian, which is why minimum-uncertainty states are Gaussian.

## Worked example

Estimate \`sqrt(101)\`. Write \`10 sqrt(1 + 0.01) ≈ 10(1 + 0.005) = 10.05\`. The exact value is 10.0499. On a test where every question is multiple choice, that level of accuracy in three seconds decides the answer.`,
        examTip: `Before computing anything exactly, check whether a small parameter lets you expand. Most physics-GRE arithmetic is designed to be done to two significant figures, and the answer choices are usually spaced far enough apart to allow it.`,
      },
    ],
    keyTakeaways: [
      'curl grad = 0 and div curl = 0 underlie potentials and div B = 0.',
      'Divergence and Stokes theorems relate the integral and differential Maxwell forms.',
      'The binomial expansion (1+x)^n ≈ 1 + nx covers most approximations on this exam.',
      'Complex exponentials turn oscillation problems into algebra.',
      'Narrow in time means broad in frequency; a Gaussian transforms to a Gaussian.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SPECIAL RELATIVITY — 6% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_sr_kinematics: {
    topicId: 'pgre_sr_kinematics',
    title: 'Relativistic Kinematics',
    domainWeight: 'Special Relativity · 6% of the exam',
    overview: `Two postulates generate everything here. The difficulty is never the algebra; it is keeping straight which frame measures which quantity, and remembering that simultaneity is frame-dependent.`,
    sections: [
      {
        id: 'sr-kin-1-postulates',
        title: '1. Postulates, Dilation and Contraction',
        content: `## The postulates

1. The laws of physics are identical in all inertial frames.
2. The speed of light in vacuum is \`c\` in every inertial frame, regardless of the motion of source or observer.

The second is the radical one, and everything else follows from it.

Define \`beta = v/c\` and \`gamma = 1/sqrt(1 - beta^2)\`, which is 1 at rest and grows without bound as \`v -> c\`. Useful values: \`gamma = 1.15\` at \`0.5c\`, \`2\` at \`0.866c\`, \`7\` at \`0.99c\`.

## Time dilation

\`Delta t = gamma Delta tau\`, where \`Delta tau\` is the **proper time** — the interval measured by a clock present at both events, in the frame where they occur at the same place. Moving clocks run slow, and the effect is symmetric: each observer sees the other's clock running slow, which is consistent because they disagree about simultaneity.

## Length contraction

\`L = L_0/gamma\`, where \`L_0\` is the **proper length**, measured in the object's rest frame. Contraction is along the direction of motion only; transverse dimensions are unchanged.

## The relativity of simultaneity

Two events simultaneous in one frame are not in another moving relative to it: \`Delta t' = gamma(Delta t - v Delta x/c^2)\`. Most apparent paradoxes — the ladder in the barn, the twin paradox — dissolve once simultaneity is treated as frame-dependent rather than absolute.

## Worked example

Muons created at 15 km altitude live \`2.2 μs\` in their own frame and travel at \`0.998c\`, giving \`gamma = 15.8\`. Classically they would cover \`660 m\` and never reach the ground. In the ground frame their lifetime is dilated to \`34.8 μs\`, giving \`10.4 km\`. In the **muon's** frame the atmosphere is contracted from 15 km to \`0.95 km\`, which it crosses easily. Two descriptions, one outcome — and it is measured every day.`,
        importantNote: `Proper time and proper length are measured in different frames: proper time in the frame where the events coincide in space, proper length in the frame where the object is at rest. Identifying which is which correctly is most of the work in a relativity problem.`,
      },
      {
        id: 'sr-kin-2-lorentz',
        title: '2. The Lorentz Transformation and Invariants',
        content: `## The transformation

For motion along \`x\`:

\`x' = gamma(x - vt)\`, \`t' = gamma(t - vx/c^2)\`, \`y' = y\`, \`z' = z\`.

At \`v << c\` this reduces to the Galilean transformation, as it must.

## The invariant interval

\`s^2 = c^2 t^2 - x^2\` is the same in every inertial frame. Its sign classifies the separation between two events:

- \`s^2 > 0\` **timelike**: a signal can connect them, their order is absolute, and a frame exists where they occur at the same place.
- \`s^2 = 0\` **lightlike**: connected by a light signal.
- \`s^2 < 0\` **spacelike**: no causal connection, their order is frame-dependent, and a frame exists where they are simultaneous.

Causality survives because only timelike-separated events can influence each other, and their order is invariant. That is the answer to every "could an effect precede its cause" question.

## Worked example

Two events 3 km apart occur 5 μs apart. \`c t = (3e8)(5e-6) = 1500 m\`, and \`x = 3000 m\`, so \`s^2 = 1500^2 - 3000^2 < 0\`: spacelike. There is a frame in which they are simultaneous, and another in which their order is reversed. Neither can have caused the other.`,
      },
    ],
    keyTakeaways: [
      'Proper time is measured by a clock at both events; proper length in the object rest frame.',
      'Dilation and contraction are symmetric, reconciled by the relativity of simultaneity.',
      'Contraction acts along the motion only.',
      'The interval c^2t^2 - x^2 is invariant and classifies event pairs.',
      'Only timelike-separated events have an invariant order, which is what protects causality.',
    ],
  },

  pgre_sr_dynamics: {
    topicId: 'pgre_sr_dynamics',
    title: 'Relativistic Dynamics',
    domainWeight: 'Special Relativity · 6% of the exam',
    overview: `Four-vectors make relativistic collisions tractable, and the invariant-mass trick turns most of them into one line. Learning that trick is the highest-value thing in this section.`,
    sections: [
      {
        id: 'sr-dyn-1-energy',
        title: '1. Energy, Momentum and Invariant Mass',
        content: `## The relations

\`E = gamma m c^2\`, \`p = gamma m v\`, and the fundamental relation

\`E^2 = (pc)^2 + (mc^2)^2\`.

Rest energy is \`mc^2\`; kinetic energy is \`E - mc^2 = (gamma - 1)mc^2\`, which reduces to \`(1/2)mv^2\` at low speed through the binomial expansion.

For a massless particle, \`E = pc\` exactly, and it always moves at \`c\`.

A useful combination: \`v/c = pc/E\`. It gives the speed straight from the energy and momentum with no \`gamma\` in sight.

## Units

Work in eV and \`eV/c^2\`. Electron \`0.511 MeV\`, proton \`938.3 MeV\`, neutron \`939.6 MeV\`. Keeping \`c\` symbolic and cancelling at the end avoids most arithmetic errors.

## Invariant mass

For a system of particles, \`(sum E)^2 - (sum pc)^2\` is invariant. Evaluate it in whichever frame is easiest — usually the centre-of-momentum frame, where the total momentum is zero and the expression collapses to \`(sum E)^2\`. That single trick solves most threshold problems.

## Worked example

What is the threshold energy for \`p + p -> p + p + p + pbar\` with a stationary target?

At threshold all four final particles are at rest in the centre-of-momentum frame, so the invariant mass squared is \`(4 m_p c^2)^2\`. In the lab, the invariant is \`(E + m_p c^2)^2 - (pc)^2 = E^2 - (pc)^2 + 2 E m_p c^2 + (m_p c^2)^2 = 2(m_p c^2)^2 + 2 E m_p c^2\`.

Setting them equal: \`16(m_p c^2)^2 = 2(m_p c^2)^2 + 2 E m_p c^2\`, giving \`E = 7 m_p c^2\` and kinetic energy \`6 m_p c^2 = 5.6 GeV\`.

That six-fold cost for a two-fold mass increase is why colliders beat fixed targets: with two beams the centre-of-momentum frame is the lab frame and no energy is wasted on carrying momentum.`,
        examTip: `Compute the invariant (sum E)^2 - (sum pc)^2 in the frame where it is simplest and equate it to its value in the frame you care about. Nearly every relativistic collision question yields to that in one step.`,
      },
      {
        id: 'sr-dyn-2-fourvectors',
        title: '2. Four-Vectors and Conservation',
        content: `## The structure

The energy-momentum four-vector is \`P = (E/c, p)\`, with invariant square \`P.P = (E/c)^2 - p^2 = (mc)^2\`. Four-vectors transform by the Lorentz transformation exactly as \`(ct, x)\` does, and their scalar products are frame-independent.

**Total four-momentum is conserved in any interaction**, which packages energy and momentum conservation into one statement and is why the invariant-mass trick works.

## Massless particles

A photon has \`P = (E/c, p)\` with \`|p| = E/c\`, so \`P.P = 0\`. This is why a free electron cannot absorb a photon: energy and momentum conservation together would require the electron to end with \`P.P\` different from \`(m_e c)^2\`, which is impossible. A nucleus must be present to absorb the recoil — which is exactly why the photoelectric effect happens in bound electrons and not free ones.

## Compton scattering

A photon scattering off a free electron shifts wavelength by

\`Delta lambda = (h/m_e c)(1 - cos(theta))\`,

with the Compton wavelength \`h/m_e c = 2.43 pm\`. The shift depends only on the scattering angle, not on the incident wavelength — which is the striking prediction that confirmed the photon picture. Maximum shift at backscatter, \`2 x 2.43 = 4.86 pm\`.

## Worked example

Why is Compton scattering negligible for visible light? A 500 nm photon shifted by at most 4.86 pm changes by one part in \`1e5\`. For an X-ray at 0.1 nm the same absolute shift is a few per cent — measurable, which is why Compton used X-rays.`,
      },
    ],
    keyTakeaways: [
      'E^2 = (pc)^2 + (mc^2)^2, and v/c = pc/E.',
      'The invariant mass of a system lets you evaluate a collision in whichever frame is easiest.',
      'Fixed-target thresholds cost far more than collider ones, which is why colliders exist.',
      'A free electron cannot absorb a photon; a third body must take the recoil.',
      'Compton shift depends only on angle, with scale h/m_e c = 2.43 pm.',
    ],
  },

  pgre_sr_applications: {
    topicId: 'pgre_sr_applications',
    title: 'Applications & Common Traps',
    domainWeight: 'Special Relativity · 6% of the exam',
    overview: `A short chapter on the specific things this exam likes to catch people with: velocity addition, the relativistic Doppler effect, and the paradoxes whose resolution is always the same.`,
    sections: [
      {
        id: 'sr-app-1-addition',
        title: '1. Velocity Addition and the Doppler Effect',
        content: `## Adding velocities

\`u' = (u - v)/(1 - uv/c^2)\`.

Two consequences: the result never exceeds \`c\`, and if \`u = c\` then \`u' = c\` for any \`v\` — the second postulate falling out of the algebra. Adding \`0.9c\` and \`0.9c\` gives \`1.8/1.81 = 0.994c\`, not \`1.8c\`.

## Relativistic Doppler

For motion directly away:

\`f_obs = f_src sqrt((1-beta)/(1+beta))\`,

and the reciprocal for approach. Unlike the sound case, only the **relative** velocity appears, because there is no medium to define a preferred frame.

There is also a **transverse** Doppler effect, \`f_obs = f_src/gamma\`, with no classical analogue at all: an object moving purely across the line of sight is still redshifted, purely from time dilation. Its existence is a direct test of dilation and it is a favourite distractor.

## Worked example

A galaxy recedes at \`0.5c\`. Its light is redshifted by \`sqrt(0.5/1.5) = 0.577\`, so a 500 nm line arrives at 866 nm. The naive non-relativistic estimate would give 750 nm — a 15% error, which is why cosmological redshifts must use the relativistic formula.`,
        examTip: `If a question mentions motion perpendicular to the line of sight and asks about frequency, it wants the transverse Doppler effect. The classical answer of "no shift" is the trap.`,
      },
      {
        id: 'sr-app-2-paradoxes',
        title: '2. The Paradoxes and Their Resolution',
        content: `## The twin paradox

One twin travels out and back at high speed and returns younger. The apparent symmetry is broken because the travelling twin **accelerates** to turn around and therefore does not remain in a single inertial frame. Only the stay-at-home twin's frame is inertial throughout, and its proper time is the longest of any path between the two meeting events.

The deeper statement: of all paths between two timelike-separated events, the straight (inertial) one maximises proper time. That is the relativistic analogue of a straight line being the shortest spatial path — with the sign reversed, which is exactly what the minus in \`c^2t^2 - x^2\` does.

## The ladder and the barn

A ladder longer than a barn fits inside it when moving fast enough, in the barn's frame. In the ladder's frame the barn is shorter still, so it cannot possibly fit. Both are correct, because "both doors closed at the same time" is a statement about simultaneity, and the two frames disagree about it. In the barn frame the doors close simultaneously; in the ladder frame they close at different times, and the ladder is never wholly enclosed.

## What is and is not invariant

| Invariant | Frame-dependent |
|---|---|
| Rest mass | Energy, momentum |
| The interval \`s^2\` | Time and space separately |
| The speed of light | All other speeds |
| Charge | Charge density, current density |
| Proper time along a path | Coordinate time |
| Event order for timelike pairs | Event order for spacelike pairs |

Reading a question against this table usually identifies the trap directly.

## Worked example

Does a moving charge's electric field stay spherically symmetric? No — the charge itself is invariant, but the field is not: it compresses along the motion and strengthens transversely by \`gamma\`. Confusing an invariant quantity with its frame-dependent distribution is the general shape of the error this section tests.`,
      },
    ],
    keyTakeaways: [
      'Relativistic velocity addition never yields more than c, and returns c for light.',
      'Light Doppler depends only on relative velocity; sound Doppler does not.',
      'Transverse Doppler is a pure time-dilation redshift with no classical counterpart.',
      'The twin paradox breaks symmetry through acceleration; the inertial path maximises proper time.',
      'Rest mass, interval, charge and c are invariant; energy, momentum and simultaneity are not.',
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // LABORATORY METHODS — 6% of the exam
  // ═══════════════════════════════════════════════════════════

  pgre_lab_uncertainty: {
    topicId: 'pgre_lab_uncertainty',
    title: 'Measurement & Uncertainty',
    domainWeight: 'Laboratory Methods · 6% of the exam',
    overview: `Error propagation and the statistical-versus-systematic distinction are the two things asked here, and both are quick marks. The rules are short enough to memorise outright.`,
    sections: [
      {
        id: 'lab-unc-1-propagation',
        title: '1. Propagating Uncertainty',
        content: `## The rules

For independent, random errors:

- **Sums and differences**: absolute errors add in quadrature. \`z = x ± y\` gives \`sigma_z = sqrt(sigma_x^2 + sigma_y^2)\`.
- **Products and quotients**: **relative** errors add in quadrature. \`z = xy\` or \`x/y\` gives \`(sigma_z/z)^2 = (sigma_x/x)^2 + (sigma_y/y)^2\`.
- **Powers**: \`z = x^n\` gives \`sigma_z/z = |n| sigma_x/x\`.
- **General**: \`sigma_z^2 = sum (dz/dx_i)^2 sigma_i^2\`.

Two consequences worth internalising: the largest single uncertainty dominates a quadrature sum, so improving the others is wasted effort; and a quantity raised to a power multiplies its relative error by that power, so a cubed measurement needs three times the precision for the same result.

Note that the difference of two nearly equal numbers has a small value but the same absolute error, so its **relative** error explodes. Experiments are designed to avoid measuring small differences of large numbers wherever possible.

## Statistical versus systematic

- **Statistical (random)**: scatters both ways, reduces as \`1/sqrt(N)\` with repeated measurement. The standard error of a mean is \`sigma/sqrt(N)\`.
- **Systematic**: shifts every measurement the same way — a miscalibrated scale, a zero offset. **It does not reduce with repetition at all**, which is exactly why it is the harder problem and why calibration matters.

Taking a thousand readings on a badly zeroed instrument gives a very precise wrong answer. That distinction is the most-asked idea in this chapter.

## Worked example

A cylinder has \`r = 2.00 ± 0.02 cm\` and \`h = 10.0 ± 0.1 cm\`. Volume \`= pi r^2 h = 125.7 cm^3\`. Relative errors: \`r\` contributes \`2(0.01) = 0.02\`, \`h\` contributes \`0.01\`. In quadrature, \`sqrt(0.0004 + 0.0001) = 0.0224\`, so \`V = 125.7 ± 2.8 cm^3\`. The radius dominates because it is squared — measuring the height ten times better would barely help.`,
        examTip: `Ask which variable enters at the highest power before doing any arithmetic. That variable almost always dominates the uncertainty and often lets you answer by inspection.`,
      },
      {
        id: 'lab-unc-2-fitting',
        title: '2. Distributions and Fitting',
        content: `## Which distribution

- **Gaussian**: the default for a measurement with many small independent error sources, by the central limit theorem. 68% within \`1 sigma\`, 95% within \`2 sigma\`, 99.7% within \`3 sigma\`.
- **Poisson**: for counting rare independent events — radioactive decays, photon arrivals. Mean \`= variance\`, so the uncertainty on \`N\` counts is \`sqrt(N)\` and the **relative** uncertainty is \`1/sqrt(N)\`. To halve the fractional error, count four times as long.
- **Binomial**: fixed number of trials with fixed probability; approaches Poisson for rare events and Gaussian for many.

## Fitting

Least squares minimises \`sum (y_i - f(x_i))^2/sigma_i^2\`, which is \`chi^2\`. A reduced \`chi^2\` (divided by degrees of freedom) near 1 indicates a good fit with correctly estimated errors. Much greater than 1 means a bad model or underestimated errors; much less than 1 usually means the errors were overestimated, which is a real diagnosis rather than a good result.

## Linearising

Plot to make the relationship straight, because a straight line is the easiest thing to judge by eye and to fit. An exponential \`y = A e^(kx)\` becomes linear on a log-linear plot with slope \`k\`; a power law \`y = A x^n\` becomes linear on a log-log plot with slope \`n\`. **Reading the exponent off a log-log slope is a standard exam question** and it needs no calculation.

## Worked example

A detector records 400 counts. The uncertainty is \`sqrt(400) = 20\`, a 5% relative error. For 1% you need \`N = 10,000\` — twenty-five times the counting time. That \`1/sqrt(N)\` is why counting experiments are slow.`,
        importantNote: `Poisson uncertainty on N counts is sqrt(N), not a fixed percentage of the reading. Applying an instrument's percentage accuracy to a counting measurement is a category error the exam tests.`,
      },
    ],
    keyTakeaways: [
      'Absolute errors add in quadrature for sums; relative errors for products.',
      'A power n multiplies the relative error by n, so the highest power dominates.',
      'Statistical error falls as 1/sqrt(N); systematic error does not fall at all.',
      'Counting statistics give sqrt(N) uncertainty, so 1% needs 10,000 counts.',
      'A log-log slope is the power-law exponent; a log-linear slope is the exponential rate.',
    ],
  },

  pgre_lab_electronics: {
    topicId: 'pgre_lab_electronics',
    title: 'Instrumentation & Electronics',
    domainWeight: 'Laboratory Methods · 6% of the exam',
    overview: `Practical electronics questions are about loading, filtering and noise. They are answerable from the impedance ideas already covered plus a few facts about what real instruments do.`,
    sections: [
      {
        id: 'lab-elec-1-instruments',
        title: '1. Meters, Scopes and Loading',
        content: `## Loading

Every instrument disturbs what it measures.

- A **voltmeter** goes in parallel and must have **high** input impedance so it draws negligible current. A cheap meter across a high-impedance divider reads low.
- An **ammeter** goes in series and must have **low** impedance so it drops negligible voltage.

A good rule: the measuring impedance should differ from the circuit impedance by at least a factor of 100 in the right direction. Questions describing an unexpectedly low reading are almost always about loading.

## The oscilloscope

Displays voltage against time. Typical input impedance 1 MΩ in parallel with ~20 pF, and that capacitance matters at high frequency — it is why a 10x probe with a compensation trimmer exists, and why an uncompensated probe distorts square waves into rounded or peaked shapes.

Bandwidth is the frequency where response falls 3 dB. Rise time and bandwidth are related by roughly \`t_r ≈ 0.35/BW\`, so a 100 MHz scope cannot show an edge faster than about 3.5 ns however fast the signal really is.

## Grounding and shielding

Ground loops — two ground connections at different potentials — inject mains-frequency noise. Single-point grounding, twisted pairs for differential signals, and coaxial shielding are the standard fixes. A 50 or 60 Hz component in a spectrum is almost always mains pickup, and recognising it is a practical exam question.

## Worked example

A 1 MΩ source measured with a 1 MΩ voltmeter reads exactly **half** the true voltage: the meter and source form an even divider. With a 10 MΩ meter the error falls to about 9%, and with 100 MΩ to about 1%.`,
        examTip: `Voltmeters need high impedance and ammeters low. If a measurement reads low, suspect loading; if a fast edge looks slow, suspect bandwidth.',`,
      },
      {
        id: 'lab-elec-2-filters',
        title: '2. Filters, Amplifiers and Noise',
        content: `## Passive filters

An RC **low-pass** (output across the capacitor) passes low frequencies and rolls off above \`f_c = 1/(2 pi RC)\` at 20 dB per decade. Swap the components for a **high-pass**. At \`f_c\` the output is \`1/sqrt(2)\` of the input, which is the -3 dB point, and the phase shift is 45 degrees.

An RC low-pass is also an **integrator** well above \`f_c\`, and a high-pass is a **differentiator** well below it. Recognising the time-domain behaviour from the frequency-domain circuit is a standard question.

## Operational amplifiers

Idealised: infinite gain, infinite input impedance, zero output impedance. With negative feedback the two golden rules apply — no current flows into the inputs, and the inputs are driven to the same voltage.

- Inverting amplifier: gain \`= -R_f/R_in\`.
- Non-inverting: gain \`= 1 + R_f/R_in\`.
- Voltage follower: gain 1, used purely as a buffer to solve a loading problem.

## Noise

- **Johnson (thermal)**: \`V_rms = sqrt(4 k_B T R B)\` — present in any resistor at any temperature, and reducible only by cooling, lowering resistance, or narrowing bandwidth.
- **Shot**: \`I_rms = sqrt(2 q I B)\`, from the discreteness of charge.
- **1/f (flicker)**: rises at low frequency, which is why slow measurements are moved to a higher frequency and demodulated — the principle of the lock-in amplifier.

Signal-to-noise improves as \`sqrt(N)\` with averaging, the same statistics as counting. A lock-in achieves an extremely narrow effective bandwidth, which is why it can pull a signal out from far below the broadband noise floor.

## Worked example

A 1 MΩ resistor at 300 K over a 1 kHz bandwidth: \`V_rms = sqrt(4(1.38e-23)(300)(1e6)(1e3)) = sqrt(1.66e-11) = 4.1 μV\`. That sets the floor for any measurement across that resistor, and narrowing the bandwidth to 1 Hz drops it to 130 nV.`,
      },
    ],
    keyTakeaways: [
      'Voltmeters need high input impedance, ammeters low; loading explains most low readings.',
      'Scope bandwidth limits observable rise time to about 0.35/BW.',
      'RC corner is 1/(2 pi RC); low-pass integrates and high-pass differentiates outside the corner.',
      'Op-amp rules with feedback: no input current, inputs at equal voltage.',
      'Johnson noise scales as sqrt(4 k_B T R B), so narrowing bandwidth is the cheapest improvement.',
    ],
  },

  pgre_lab_detectors: {
    topicId: 'pgre_lab_detectors',
    title: 'Detectors & Radiation Safety',
    domainWeight: 'Laboratory Methods · 6% of the exam',
    overview: `Detector questions ask what each device is good for and why. The answers are usually about the trade-off between energy resolution, efficiency and timing.`,
    sections: [
      {
        id: 'lab-det-1-detectors',
        title: '1. Detecting Particles and Photons',
        content: `## The families

- **Gas detectors**. An ionisation chamber collects the primary ions; a **proportional counter** applies enough field to multiply them while keeping the signal proportional to the deposited energy; a **Geiger-Muller tube** goes further into full avalanche, giving a large uniform pulse that **carries no energy information at all**. That last point is the standard question: a GM tube counts, it does not spectroscope.
- **Scintillators** (NaI(Tl), plastic, liquid). Light output proportional to energy, read out by a photomultiplier. Fast timing and good efficiency, but modest energy resolution — around 7% at 662 keV for NaI.
- **Semiconductor detectors** (Si, high-purity Ge). Electron-hole pairs cost only ~3 eV against ~30 eV per ion pair in gas, so many more carriers are produced and the statistical resolution is far better — under 0.2% at 1.3 MeV for germanium. The price is cryogenic cooling for Ge.
- **Photomultipliers**: a photocathode plus a dynode chain, gains of \`1e6\` and better, single-photon sensitive with nanosecond timing.

## Resolution and efficiency

Energy resolution scales as \`1/sqrt(N)\` in the number of information carriers, which is exactly why germanium beats sodium iodide by roughly the square root of the ratio of pair-creation energies. Efficiency, in contrast, favours dense high-\`Z\` materials, which is why NaI is still used where you need to catch the gammas more than measure them precisely.

That trade-off — resolution against efficiency — is the shape of most detector questions.

## Worked example

Why can a GM tube not measure energy? Because the avalanche saturates: every ionising event, however energetic, produces the same size pulse once the discharge propagates along the anode. A proportional counter deliberately stops short of that regime to keep proportionality, which is where its name comes from.`,
        examTip: `Germanium for resolution, sodium iodide for efficiency and cost, Geiger for counting only, photomultiplier for single photons and timing. Matching the device to the requirement answers most of these questions directly.`,
      },
      {
        id: 'lab-det-2-safety',
        title: '2. Radiation Units and Shielding',
        content: `## Units

- **Activity**: becquerel (1 decay/s); the curie is \`3.7e10 Bq\`.
- **Absorbed dose**: gray (1 J/kg); the rad is 0.01 Gy.
- **Equivalent dose**: sievert = gray × a quality factor; the rem is 0.01 Sv.

Quality factors are about 1 for beta, gamma and X-rays, and about 20 for alpha and neutrons, because densely ionising radiation does more biological damage per joule. This is why an alpha emitter is comparatively harmless outside the body and dangerous inside it — the range in tissue is microns, so it deposits everything locally.

Natural background is roughly 2-3 mSv per year, and typical occupational limits are around 20 mSv per year. Keeping those numbers in mind makes order-of-magnitude questions easy.

## Attenuation and shielding

Photons attenuate exponentially, \`I = I_0 e^(-mu x)\`, with half-value layer \`= ln2/mu\`. Charged particles instead have a definite **range**, ending in the Bragg peak — most of the energy deposited near the end of the track, which is exactly what proton therapy exploits.

Shielding by radiation type:
- Alpha: paper, or a few cm of air.
- Beta: a few mm of a **low**-Z material such as aluminium or plastic — low-Z deliberately, because high-Z produces bremsstrahlung.
- Gamma: high-Z and dense, so lead or concrete thickness.
- Neutrons: hydrogenous moderators such as water or polyethylene to slow them, then an absorber such as boron or cadmium. Lead is nearly useless against neutrons, which is a favourite question.

## Worked example

If a shield's half-value layer is 1 cm, how thick for a factor of 1000? \`2^10 = 1024\`, so 10 cm. Attenuation questions are usually powers of two in disguise.`,
        importantNote: `Shield beta with LOW-Z material. High-Z stops the electrons efficiently but converts their energy into penetrating bremsstrahlung X-rays, making the situation worse rather than better.`,
      },
    ],
    keyTakeaways: [
      'A Geiger tube counts but gives no energy information; a proportional counter does.',
      'Germanium resolves best because pair creation costs ~3 eV against ~30 eV in gas.',
      'Sievert is gray times a quality factor: about 20 for alpha and neutrons, 1 for gamma.',
      'Photons attenuate exponentially; charged particles have a definite range and a Bragg peak.',
      'Shield beta with low-Z to avoid bremsstrahlung; shield neutrons with hydrogen, not lead.',
    ],
  },
};

export function getGRECourseContent(topicId: string): TopicLesson | null {
  return GRE_COURSE[topicId] ?? null;
}

export function hasGRECourseContent(topicId: string): boolean {
  return topicId in GRE_COURSE;
}
