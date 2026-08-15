"""Chapters for GEN1 unit 5, Thermochemistry - first half.

Nodes: ENERGYBASICS, FIRSTLAW, HEATCAPACITY, CALORIMETRY. The second half
(ENTHALPY, THERMOSTOICH, HESS, FORMATION, BONDENTHALPY) lives in
extras_gen1_u5b.py.

Every number is computed or sourced. Specific heats are CRC values, the same
ones the unit's arc lessons cite; energy unit conversions are exact
definitions; worked-example inputs are round values chosen for clean
arithmetic and said to be so; every derived number is recomputed from the
stated inputs. Sign convention throughout: quantities are written from the
system's point of view, energy in positive, energy out negative, and the
convention is restated wherever a sign is the point.
"""

from __future__ import annotations

from app.data.lesson_extras import (
    LessonExtras,
    ReadingSection,
    Table,
)

EXTRAS_GEN1_U5: dict[str, LessonExtras] = {}


def _add(extras: LessonExtras) -> None:
    EXTRAS_GEN1_U5[extras.node] = extras


# --------------------------------------------------------------------------
# 5.1 Energy, heat, work and temperature
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.ENERGYBASICS",
    lead=(
        "Thermochemistry asks one question of every chemical change: how "
        "much energy moved, and in which direction? Answering it takes a "
        "vocabulary that everyday speech blurs together. Energy, heat, "
        "work, temperature and thermal energy are five different things, "
        "and most early mistakes in this unit are really one of these "
        "words being used where another belongs. This chapter separates "
        "them, puts units on them, and ends with the first working "
        "equation of the unit: $q = mc\\Delta T$."
    ),
    sections=(
        ReadingSection(
            id="energy-and-the-joule",
            heading="Energy, and the unit it comes in",
            body=(
                "Energy is the capacity to do work or to transfer heat - a "
                "definition that sounds circular until the two halves get "
                "their own definitions below, at which point it becomes the "
                "book-keeping currency of the whole unit. Energy comes in "
                "two broad kinds. Kinetic energy is energy of motion, "
                "$E_k = \\tfrac{1}{2}mv^2$. Potential energy is energy of "
                "position or arrangement: a boulder held above a valley, "
                "two charges held apart or pressed together.\n\n"
                "The SI unit is the joule, defined mechanically: one joule "
                "is the kinetic energy of two kilograms moving at one metre "
                "per second, since $\\tfrac{1}{2} \\times 2 \\times 1^2 = "
                "1$. In base units, 1 J = 1 kg m$^2$/s$^2$. For a feel of "
                "its size: a 58 g tennis ball served at 20 m/s carries "
                "$\\tfrac{1}{2} \\times 0.058 \\times 20^2 = 0.5 \\times "
                "0.058 \\times 400 = 11.6$ J. A joule is small, which is "
                "why chemistry reports almost everything in kilojoules.\n\n"
                "Chemical energy is not a third kind. It is potential "
                "energy - the electrostatic energy of electrons and nuclei "
                "held in a particular arrangement. A reaction rearranges "
                "those particles into a new set of bonds with a different "
                "potential energy, and the difference has to go somewhere "
                "or come from somewhere. That difference, leaving or "
                "arriving as heat and work, is what this unit measures. "
                "Nothing in a flask contains a substance called energy in "
                "the way it contains a substance called water; what it has "
                "is an arrangement, and arrangements can be worth more or "
                "fewer joules."
            ),
            table=Table(
                caption="Energy units in circulation",
                columns=("Unit", "Definition", "In joules"),
                rows=(
                    ("joule (J)", "1 kg m2/s2, the SI unit", "1"),
                    ("kilojoule (kJ)", "1000 J; chemistry's working unit",
                     "1000"),
                    ("calorie (cal)",
                     "defined as exactly 4.184 J", "4.184"),
                    ("food Calorie (Cal)", "1 kilocalorie", "4184"),
                    ("kilowatt-hour (kWh)",
                     "defined as exactly 3.6 MJ", "3,600,000"),
                ),
                source=(
                    "Exact definitions: the thermochemical calorie is "
                    "defined as 4.184 J and the kilowatt-hour as 3.6 MJ."
                ),
                note=(
                    "The capital-C food Calorie is a kilocalorie. A 250 "
                    "Cal snack carries 1046 kJ, a number worth comparing "
                    "with the worked example below."
                ),
            ),
        ),
        ReadingSection(
            id="temperature",
            heading="Temperature: the average, not the total",
            body=(
                "The particles of any sample are in ceaseless motion - "
                "molecules of a gas flying between collisions, particles "
                "of a solid vibrating about fixed positions. Temperature "
                "measures the average kinetic energy of that motion. The "
                "word doing the work is average: temperature is computed "
                "per particle, so it does not care how many particles "
                "there are. A cup of water at 50 °C and a bathtub of "
                "water at 50 °C have identical temperatures, because the "
                "average molecule in each is moving equally hard. "
                "Properties like this, independent of the amount of "
                "material, are called intensive.\n\n"
                "Two scales matter here. Celsius sets 0 and 100 at "
                "water's freezing and boiling points. Kelvin keeps the "
                "same size of degree but starts at absolute zero, the "
                "temperature at which particle motion is at its minimum, "
                "so that $T(\\text{K}) = T(°\\text{C}) + 273.15$. For "
                "this unit the practical consequence is small but "
                "constant: a temperature CHANGE is the same number in "
                "both scales, because the offset subtracts away. Warming "
                "from 22.0 °C to 100.0 °C is a rise of 78.0 °C and "
                "equally a rise of 78.0 K, so $q = mc\\Delta T$ works "
                "with either scale unchanged.\n\n"
                "A thermometer, note, reports its own temperature. It "
                "reads the sample correctly only after the two have "
                "traded energy long enough to reach the same "
                "temperature - the state called thermal equilibrium, "
                "which is also where the next section starts."
            ),
        ),
        ReadingSection(
            id="thermal-energy-and-heat",
            heading="Thermal energy and heat: the total, and the transfer",
            body=(
                "Thermal energy is the total kinetic energy of all the "
                "particles in the sample. Unlike temperature it is "
                "extensive - it scales with the amount. The bathtub at "
                "50 °C holds vastly more thermal energy than the cup at "
                "50 °C: same average per molecule, enormously more "
                "molecules.\n\n"
                "Heat is neither of those. Heat, symbol $q$, is energy in "
                "transit between two objects because their temperatures "
                "differ. It flows spontaneously from the hotter object to "
                "the cooler one, and stops when the temperatures equalise "
                "at thermal equilibrium. An object never holds heat; it "
                "holds thermal energy, and transfers heat. The distinction "
                "is the same one a bank makes: an account holds a balance "
                "and receives deposits - nobody's account contains a "
                "deposit.\n\n"
                "One classroom demonstration keeps all three ideas apart "
                "at once. A spark thrown from a burning sparkler is above "
                "1000 °C, hotter than molten aluminium, and lands on skin "
                "harmlessly. Bathwater at a mere 60 °C scalds in seconds. "
                "The spark's temperature is enormous but the spark is a "
                "speck - a fraction of a milligram - so the total thermal "
                "energy it has to transfer is close to nothing. The bath "
                "is only moderately hot, but kilograms of water at 60 °C "
                "hold an enormous reserve of thermal energy and keep "
                "delivering it as long as skin stays in contact. "
                "Temperature says how hard the average particle hits; "
                "thermal energy says how much the whole object can "
                "deliver; heat is the delivery itself."
            ),
            important=(
                "Hot is not the same as energy-rich. Temperature is an "
                "average per particle; the energy available to transfer "
                "depends on the total, and a tiny very hot object can "
                "carry less of it than a large warm one."
            ),
        ),
        ReadingSection(
            id="work",
            heading="Work: the other way energy moves",
            body=(
                "Heat is one of exactly two ways energy crosses the "
                "boundary of a closed system; the other is work, symbol "
                "$w$. Work is energy transferred by a force acting through "
                "a distance - a piston pushed outward, a weight lifted, "
                "charge driven through a circuit.\n\n"
                "The variety that matters most in chemistry is "
                "pressure-volume work, because so much chemistry happens "
                "in vessels open to the atmosphere. A reaction that "
                "produces gas must shove the atmosphere back to make room "
                "for it, and shoving the atmosphere - a force applied "
                "through the distance the gas front advances - costs "
                "energy. A reaction in an open flask that releases gas is "
                "quietly paying that tax the whole time it runs. The next "
                "chapter makes the accounting exact with $w = "
                "-P\\Delta V$; this one only needs the idea. "
                "Electrochemical cells doing electrical work are the "
                "other chemically important case, and they wait until the "
                "electrochemistry unit.\n\n"
                "It is worth seeing what distinguishes heat from work at "
                "the particle level, because the two can have identical "
                "effects on the system. Work is organised transfer: when "
                "a gas is compressed, every layer of molecules is pushed "
                "the same direction by the advancing piston. Heat is "
                "disorganised transfer: molecules of the hotter body "
                "batter molecules of the cooler one at a shared boundary, "
                "random collision by random collision, and the net drift "
                "of energy is downhill in temperature. Both change the "
                "system's energy; neither is a substance; and the first "
                "law, next chapter, treats them as the two entries in one "
                "ledger."
            ),
        ),
        ReadingSection(
            id="q-mc-dt",
            heading="Putting numbers on heating: q = mcΔT",
            body=(
                "How much heat does a given temperature change cost? That "
                "depends on how much material is being heated, and on what "
                "the material is. The substance's contribution is its "
                "specific heat $c$: the energy needed to raise one gram of "
                "it by one degree Celsius. For liquid water, $c$ is 4.184 "
                "J/(g·°C) - a famously large value. For aluminium it is "
                "0.897 J/(g·°C); both are standard tabulated constants. "
                "The working equation assembles the three factors:\n\n"
                "$$q = m \\times c \\times \\Delta T$$\n\n"
                "with $m$ in grams, $\\Delta T = T_{final} - T_{initial}$, "
                "and $q$ landing in joules.\n\n"
                "### Worked: a kettle's worth of water\n\n"
                "Heat 250. g of water from 22.0 °C to 100.0 °C. The "
                "temperature change is $100.0 - 22.0 = 78.0$ °C. Multiply "
                "in two steps so each has a meaning: $250. \\times 4.184 "
                "= 1046$ J/°C - this sample costs 1046 J per degree - and "
                "then $1046 \\times 78.0 = 81{,}588$ J. To three "
                "significant figures, $q = +81.6$ kJ. The sign is "
                "positive because $\\Delta T$ is positive: the water "
                "absorbed energy.\n\n"
                "Now the same mass of aluminium through the same rise: "
                "$250. \\times 0.897 = 224.25$ J/°C, and $224.25 \\times "
                "78.0 = 17{,}491.5$ J, which is 17.5 kJ. The ratio of the "
                "two answers, $81.6 / 17.5 = 4.66$, is exactly the ratio "
                "of the specific heats, $4.184 / 0.897 = 4.66$ - the "
                "masses and temperature changes cancel, and what remains "
                "is the substances themselves. Water is remarkably "
                "expensive to heat, which is the fact behind mild coastal "
                "winters and behind how long a full kettle takes.\n\n"
                "Run the kettle backward and the sign does the talking: "
                "cooling 250. g of water from 100.0 °C to 22.0 °C makes "
                "$\\Delta T = -78.0$ °C and $q = -81.6$ kJ. The negative "
                "sign says the water released 81.6 kJ to its "
                "surroundings. Always compute $\\Delta T$ as final minus "
                "initial and let the sign ride through the arithmetic; "
                "deciding the direction by feel and bolting a sign on "
                "afterward is how signs get lost."
            ),
            important=(
                "ΔT is final minus initial, in that order, every time. "
                "The sign of q then reports the direction of the "
                "transfer: positive into the sample, negative out of it."
            ),
        ),
    ),
    key_takeaways=(
        "Energy is the capacity to transfer heat or do work; chemical "
        "energy is potential energy stored in the arrangement of charges.",
        "Temperature is the average kinetic energy per particle "
        "(intensive); thermal energy is the total (extensive); heat is "
        "energy in transit between temperatures.",
        "Heat and work are the only two ways energy enters or leaves a "
        "closed system.",
        "q = mcΔT prices a temperature change; water's c = 4.184 "
        "J/(g·°C) is unusually high.",
        "ΔT means final minus initial, and the sign of q carries the "
        "direction of the flow.",
    ),
    exam_tips=(
        "Items that pair a small hot object against a large warm one are "
        "testing temperature against thermal energy. Answer with the "
        "totals, not the temperatures.",
        "A ΔT is numerically identical in °C and K. Converting a "
        "temperature CHANGE by adding 273 is a planted error.",
    ),
))


# --------------------------------------------------------------------------
# 5.2 System, surroundings and the first law
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.FIRSTLAW",
    lead=(
        "Energy accounting starts the way all accounting starts: by "
        "deciding whose books are being kept. Draw a boundary around the "
        "part of the world under study, call it the system, call "
        "everything else the surroundings, and the first law of "
        "thermodynamics becomes a single sentence: the energy of system "
        "plus surroundings never changes. For the system alone the "
        "ledger has exactly two entry columns - heat and work - and one "
        "balance, $\\Delta U = q + w$. Most of what goes wrong in "
        "first-law problems is a sign, so this chapter is deliberate "
        "about the convention and repeats it until it sticks."
    ),
    sections=(
        ReadingSection(
            id="system-and-surroundings",
            heading="Drawing the boundary",
            body=(
                "The system is whatever the problem is about: the "
                "reacting mixture in a flask, the gas trapped in a "
                "cylinder, the water in a calorimeter's cup. The "
                "surroundings are everything outside that choice - the "
                "glass, the bench, the room, the rest of the universe. "
                "System plus surroundings together are the universe, in "
                "the thermodynamic rather than astronomical sense.\n\n"
                "The choice of boundary is free, but once made it is "
                "binding: every $q$ and every $w$ in the problem is "
                "measured across that boundary, from the system's point "
                "of view. Half the sign errors in this unit come from "
                "silently switching allegiance mid-problem - calling the "
                "reaction the system in one line and adopting the "
                "water's viewpoint in the next.\n\n"
                "Boundaries come in three grades of permeability, and "
                "the vocabulary appears constantly. An open system "
                "exchanges both matter and energy with its surroundings: "
                "a beaker on a bench, losing vapour and heat alike. A "
                "closed system exchanges energy but not matter: a "
                "stoppered flask that can still warm the hand holding "
                "it. An isolated system exchanges neither: no matter in "
                "or out, no heat, no work. A good vacuum flask "
                "approximates isolation for an afternoon; nothing in a "
                "laboratory achieves it exactly, and the calorimetry "
                "chapter leans on the approximation deliberately. The "
                "mass-conservation arguments of the stoichiometry unit "
                "already used this same discipline - a balance reading "
                "only means something once the boundary is stated - and "
                "thermochemistry inherits it wholesale, with energy in "
                "place of mass."
            ),
        ),
        ReadingSection(
            id="the-law",
            heading="Internal energy and the law itself",
            body=(
                "The internal energy $U$ of a system is the sum of every "
                "energy its particles hold: their kinetic energy of "
                "motion and the potential energy of their arrangements, "
                "chemical bonds included. Its absolute value is neither "
                "knowable nor needed; what chemistry measures and uses "
                "is the change, $\\Delta U = U_{final} - U_{initial}$.\n\n"
                "The first law of thermodynamics states that energy is "
                "conserved: the total energy of system plus surroundings "
                "is constant through any process. Energy the system "
                "loses, the surroundings gain, joule for joule, and vice "
                "versa:\n\n"
                "$$\\Delta U_{system} = -\\Delta U_{surroundings}$$\n\n"
                "For a closed system, energy crosses the boundary in "
                "exactly two forms - heat and work - so the change in "
                "internal energy is their sum:\n\n"
                "$$\\Delta U = q + w$$\n\n"
                "That equation is the entire content of the law as this "
                "course uses it. Its power is its refusal of "
                "alternatives: energy does not appear, does not vanish, "
                "and does not cross a boundary by any third route. A "
                "reaction that releases 100 kJ has not destroyed 100 kJ "
                "of chemical energy; it has moved 100 kJ across the "
                "boundary, and the law obliges the books of the "
                "surroundings to show the matching deposit."
            ),
        ),
        ReadingSection(
            id="sign-convention",
            heading="The sign convention, stated once and used always",
            body=(
                "Both $q$ and $w$ are signed quantities, and the signs "
                "are written from the system's point of view. Energy "
                "arriving in the system is positive; energy leaving is "
                "negative. Spelled out:\n\n"
                "- $q$ is positive when heat flows into the system, "
                "negative when heat flows out.\n"
                "- $w$ is positive when the surroundings do work on the "
                "system (a piston compressing a gas), negative when the "
                "system does work on the surroundings (a gas driving a "
                "piston outward).\n\n"
                "With that convention, $\\Delta U = q + w$ needs no case "
                "analysis: put each transfer in with its sign and add. "
                "The system's energy rises when more arrives than "
                "leaves, falls when more leaves than arrives, and the "
                "arithmetic keeps the score.\n\n"
                "One warning about the wider literature. Some physics "
                "and engineering texts define work with the opposite "
                "sign - counting work done BY the system as positive, "
                "and writing the law as $\\Delta U = q - w$. Neither "
                "convention is wrong; they are two bookkeeping dialects "
                "describing the same physics. But mixing them produces "
                "wrong answers with perfect arithmetic, so fix the "
                "dialect before computing. This course, like nearly "
                "every chemistry text, uses $\\Delta U = q + w$ with "
                "work-on-the-system positive, throughout."
            ),
            table=Table(
                caption="The four sign cases, from the system's viewpoint",
                columns=("Transfer", "Direction", "Sign"),
                rows=(
                    ("heat", "flows into the system", "q positive"),
                    ("heat", "flows out of the system", "q negative"),
                    ("work", "done on the system", "w positive"),
                    ("work", "done by the system", "w negative"),
                ),
                note=(
                    "Same rule four times: energy in, positive; energy "
                    "out, negative. The system's account, always."
                ),
            ),
            important=(
                "Before writing any sign, say the direction in words: "
                "'heat flows in', 'the gas does work on the piston'. The "
                "sign then follows from the convention instead of from a "
                "guess."
            ),
        ),
        ReadingSection(
            id="worked-ledgers",
            heading="Two ledgers, worked in full",
            body=(
                "The numbers in both examples are round values chosen "
                "for clean arithmetic, not measurements of a particular "
                "gas.\n\n"
                "### A gas that gains more than it spends\n\n"
                "A gas sealed behind a piston absorbs 150 J of heat from "
                "a flame and, expanding as it warms, does 100 J of work "
                "pushing the piston outward. Take the gas as the system. "
                "Heat flows in: $q = +150$ J. The system does work on "
                "the surroundings: $w = -100$ J. Then\n\n"
                "$$\\Delta U = q + w = 150 + (-100) = +50 \\text{ J}$$\n\n"
                "The gas ends 50 J richer: it took in 150 and paid 100 "
                "back out as work. The surroundings' books mirror the "
                "story - the flame gave up 150 J, the piston mechanism "
                "banked 100 J, and the missing 50 J is exactly what the "
                "gas now holds. Nothing appeared, nothing vanished.\n\n"
                "### A system that loses on both counts, then one\n\n"
                "A system releases 75 J of heat while the surroundings "
                "do 30 J of work on it. Heat leaves: $q = -75$ J. Work "
                "arrives: $w = +30$ J.\n\n"
                "$$\\Delta U = -75 + 30 = -45 \\text{ J}$$\n\n"
                "The system's internal energy falls by 45 J - it lost "
                "more as heat than it recovered as work. Notice what the "
                "arithmetic did NOT require: knowing what the system "
                "was, what reaction ran, or what the temperatures were. "
                "The first law is bookkeeping, and bookkeeping needs "
                "only the entries, each with its sign."
            ),
        ),
        ReadingSection(
            id="pv-work",
            heading="Pressure-volume work made quantitative",
            body=(
                "When a system changes volume against a constant "
                "external pressure - the standard situation for a "
                "reaction open to the atmosphere - the work has a closed "
                "form:\n\n"
                "$$w = -P_{ext}\\,\\Delta V$$\n\n"
                "The minus sign is the convention doing its job. "
                "Expansion makes $\\Delta V$ positive; the system is "
                "pushing the surroundings back, spending energy, so $w$ "
                "must come out negative, and the minus sign arranges "
                "exactly that. Compression makes $\\Delta V$ negative "
                "and $w$ positive: work arrives.\n\n"
                "With $P$ in atmospheres and $V$ in litres, $w$ lands in "
                "litre-atmospheres, and the conversion is 1 L·atm = "
                "101.325 J (an exact consequence of the definitions of "
                "the litre and the standard atmosphere). A gas expanding "
                "by 2.50 L against a steady 1.00 atm does\n\n"
                "$$w = -(1.00)(2.50) = -2.50 \\text{ L·atm} = -2.50 "
                "\\times 101.325 = -253 \\text{ J}$$\n\n"
                "of work on the atmosphere - a quarter of a kilojoule "
                "for a couple of litres, which is why the correction "
                "matters to careful work and yet stays small next to "
                "reaction heats in the tens or hundreds of "
                "kilojoules.\n\n"
                "Two limiting cases earn their names now and pay rent "
                "later. Expansion into a vacuum has $P_{ext} = 0$, so "
                "$w = 0$: free expansion does no work however large the "
                "volume change. And a rigid sealed container has "
                "$\\Delta V = 0$, so $w = 0$ and the first law collapses "
                "to $\\Delta U = q_V$: at constant volume, the heat IS "
                "the internal energy change. That identity is the "
                "operating principle of the bomb calorimeter two "
                "chapters ahead, just as its constant-pressure "
                "counterpart - heat at constant pressure - is about to "
                "be given its own name and symbol: enthalpy."
            ),
        ),
        ReadingSection(
            id="state-functions",
            heading="State functions and path functions",
            body=(
                "Internal energy has a property the individual entries "
                "lack: it is a state function. $\\Delta U$ depends only "
                "on where the system starts and where it ends, never on "
                "the route between. Heat and work are path functions - "
                "their values depend on how the change was carried "
                "out.\n\n"
                "The standard picture is elevation. The altitude gained "
                "between a trailhead and a summit is fixed by the two "
                "elevations - every route, steep or winding, gains the "
                "same height. The distance walked, though, belongs to "
                "the route. Altitude is the state function; mileage is "
                "the path function.\n\n"
                "A concrete gas example: take a gas from the same "
                "initial state to the same final state by two routes. "
                "Route one, heat it gently in a rigid container: all the "
                "energy arrives as heat, none as work. Route two, "
                "compress it briskly and let some heat escape: energy "
                "arrives as work while some leaves as heat. The split "
                "between $q$ and $w$ is entirely different, yet the sum "
                "$q + w$ - and only the sum - is identical, because both "
                "routes connect the same two states and $\\Delta U$ "
                "belongs to the states, not the journey.\n\n"
                "This is why tables list energies of states and never "
                "energies of routes, and it is the load-bearing fact "
                "under the entire back half of this unit: Hess's law is "
                "nothing but the state-function property of enthalpy "
                "used as a calculating device. The habit to build now is "
                "noticing which quantities in a problem are state "
                "functions ($\\Delta U$, and soon $\\Delta H$) and which "
                "are path entries ($q$, $w$) - the former can be looked "
                "up and combined; the latter must be tracked through the "
                "actual process."
            ),
        ),
    ),
    key_takeaways=(
        "Define the system first; every q and w is measured across its "
        "boundary, from its point of view.",
        "First law: ΔU = q + w, and energy lost by the system is gained "
        "by the surroundings exactly.",
        "Signs: energy in, positive; energy out, negative - for heat and "
        "work alike.",
        "Expansion work is w = -P·ΔV; constant volume means w = 0 and "
        "ΔU = qV.",
        "ΔU is a state function; q and w are path functions, and only "
        "their sum is path-independent.",
    ),
    exam_tips=(
        "The work sign is the tested step: 'the gas expands' means w is "
        "negative regardless of what the heat is doing.",
        "If a problem states ΔU = q - w, it is using the physics "
        "convention; translate before mixing it with chemistry-convention "
        "numbers.",
    ),
))


# --------------------------------------------------------------------------
# 5.3 Heat capacity and specific heat
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.HEATCAPACITY",
    lead=(
        "The same 1000 J warms a teaspoon of water noticeably and a "
        "bathtub imperceptibly, warms a gram of iron nine times further "
        "than a gram of water, and warms a mole of iron about as far as "
        "a mole of aluminium. Those three sentences use three different "
        "constants - heat capacity, specific heat, and molar heat "
        "capacity - and this chapter's business is keeping them "
        "distinct, converting between them, and seeing what each is "
        "for. One of them belongs to an object, the other two to a "
        "substance, and the distinction settles most of the questions "
        "this topic gets asked."
    ),
    sections=(
        ReadingSection(
            id="three-quantities",
            heading="Three constants, carefully told apart",
            body=(
                "All three constants answer the same question - how much "
                "energy per degree of warming? - but they attach the "
                "answer to different things.\n\n"
                "The heat capacity $C$ of an object is the energy needed "
                "to raise that whole object by one degree Celsius, in "
                "J/°C. It belongs to the particular object, and it is "
                "extensive: double the object and the heat capacity "
                "doubles, because twice the material shares the "
                "incoming energy.\n\n"
                "The specific heat $c$ divides the object's heat "
                "capacity by its mass: energy per gram per degree, "
                "J/(g·°C). Mass has been divided out, so $c$ is "
                "intensive - a property of the substance itself, "
                "identical for a droplet and a lake. Liquid water's is "
                "4.184 J/(g·°C); iron's is 0.449; both are standard "
                "tabulated values, and the contrast is why a metal "
                "spoon left in a hot pan burns fingers while the "
                "water beside it is still warming up.\n\n"
                "The molar heat capacity does the same division per "
                "mole instead of per gram: J/(mol·°C), also intensive. "
                "Chemists keep both intensive forms because both "
                "denominators are natural - grams for weighing and "
                "engineering, moles for comparing substances particle "
                "against particle, a comparison the last section of "
                "this chapter turns into a small revelation.\n\n"
                "The grammar of the three is the practical point. 'The "
                "heat capacity of this block' is a sensible phrase; "
                "'the heat capacity of iron' is not, until a quantity "
                "of iron is named. Specific heat and molar heat "
                "capacity are properties of iron; heat capacity is a "
                "property of a lump."
            ),
            important=(
                "A swimming pool and a cup of water have the same "
                "specific heat and wildly different heat capacities. "
                "If a question asks about the substance, use c; if it "
                "asks about the object, use C = mc."
            ),
        ),
        ReadingSection(
            id="conversions",
            heading="Converting between them",
            body=(
                "The three constants interconvert by multiplying or "
                "dividing by the amount:\n\n"
                "$$C = m \\times c \\qquad C_{molar} = c \\times M$$\n\n"
                "with $M$ the molar mass. Run both on water. A 250. g "
                "sample has $C = 250. \\times 4.184 = 1046$ J/°C: this "
                "particular sample costs 1046 J per degree, and a 500. g "
                "sample would cost twice that. Water as a substance has "
                "$C_{molar} = 4.184 \\times 18.02 = 75.4$ J/(mol·°C), "
                "and that number is the same for any amount of water "
                "anywhere.\n\n"
                "Once $C$ for a sample is in hand, heating problems "
                "shrink to one multiplication, $q = C\\,\\Delta T$, "
                "which is just $q = mc\\Delta T$ with the first product "
                "precomputed. The calorimetry chapter leans on exactly "
                "this form, because a calorimeter is an object - cup, "
                "water, thermometer and all - and objects carry $C$, "
                "not $c$.\n\n"
                "The reverse direction is how the constants are "
                "measured in the first place: deliver a known $q$, "
                "read $\\Delta T$, divide. Deliver 4184 J to 1.000 kg "
                "of water and the temperature rises 1.00 °C; the "
                "division $4184 / (1000 \\times 1.00) = 4.184$ "
                "J/(g·°C) recovers the specific heat. Every value in "
                "the tables was born as such a measurement, which is "
                "worth remembering when the tables start to feel like "
                "revealed truth: they are careful bookkeeping on "
                "experiments simple enough to describe in a "
                "sentence."
            ),
        ),
        ReadingSection(
            id="worked-unknown-metal",
            heading="Worked: identifying a metal from its specific heat",
            body=(
                "A 500. g block of an unknown metal absorbs 2250 J of "
                "heat and warms from 20.0 °C to 30.0 °C. What is the "
                "block's heat capacity, and what might the metal be?\n\n"
                "The temperature change is $30.0 - 20.0 = 10.0$ °C. The "
                "block's heat capacity is the heat per degree:\n\n"
                "$$C = \\frac{q}{\\Delta T} = \\frac{2250}{10.0} = 225 "
                "\\text{ J/°C}$$\n\n"
                "Divide out the mass for the substance's specific "
                "heat:\n\n"
                "$$c = \\frac{C}{m} = \\frac{225}{500.} = 0.450 "
                "\\text{ J/(g·°C)}$$\n\n"
                "Against the table below, 0.450 sits on iron's "
                "tabulated 0.449 J/(g·°C) to within the experiment's "
                "precision. The measurement is consistent with iron - "
                "phrased exactly that way, because specific heat alone "
                "cannot prove identity. Other materials can share a "
                "specific heat, and a mixture can imitate one; the "
                "honest claim is that iron fits and, say, aluminium "
                "(0.897) and copper (0.385) do not. Identification "
                "needs converging evidence - density, appearance, "
                "chemistry - of which this is one line.\n\n"
                "The template generalises to any calorimetric "
                "constant-hunting: measure $q$, measure $\\Delta T$, "
                "divide by whichever amount - grams or moles - matches "
                "the constant being sought. The next chapter runs the "
                "same template with the unknown on the other side: "
                "known constants, unknown $q$."
            ),
        ),
        ReadingSection(
            id="why-water-is-high",
            heading="Why water's value is so large, and why it matters",
            body=(
                "Water's 4.184 J/(g·°C) is among the highest specific "
                "heats of any common substance - roughly nine times "
                "iron's, five times aluminium's per gram. The molecular "
                "reason is hydrogen bonding. Warming a substance means "
                "making its particles move faster, but energy fed into "
                "liquid water is partly spent working against the "
                "hydrogen-bond network that laces the molecules "
                "together - flexing, stretching and breaking those "
                "attractions - and energy so spent is energy not "
                "raising the temperature. A substance whose molecules "
                "grip each other absorbs more per degree, and water's "
                "grip is exceptional for its size.\n\n"
                "The consequences run from geography to physiology. "
                "Oceans and large lakes absorb summer heat and release "
                "it in winter with only small temperature swings, which "
                "is why coastal climates are milder than continental "
                "interiors at the same latitude. A hot-water bottle "
                "stays warm through a night because each gram surrenders "
                "4.184 J for every degree it drops. The human body, "
                "mostly water, rides out changes in surroundings and "
                "bursts of metabolic heat with a stability that a body "
                "built of almost any other liquid would not have. And "
                "in the laboratory, water's high specific heat is "
                "precisely what makes it the working fluid of "
                "calorimetry: a large, accurately known energy "
                "appetite per degree means a measurable, well-behaved "
                "temperature change when a reaction dumps heat into "
                "it.\n\n"
                "The same reasoning read backward explains the low "
                "values of metals: no hydrogen bonds to fight, so "
                "nearly every incoming joule goes directly into "
                "particle motion, and the temperature climbs quickly. "
                "Low specific heat is why a pan handle gets hot before "
                "the soup does."
            ),
        ),
        ReadingSection(
            id="per-mole-view",
            heading="The per-mole view: a pattern the per-gram view hides",
            body=(
                "Compare metals per gram and they look diverse: iron "
                "0.449, aluminium 0.897, copper 0.385, gold 0.129 "
                "J/(g·°C). Compare them per mole - multiply each by its "
                "molar mass - and the diversity nearly vanishes:\n\n"
                "- iron: $0.449 \\times 55.85 = 25.1$ J/(mol·°C)\n"
                "- aluminium: $0.897 \\times 26.98 = 24.2$ J/(mol·°C)\n"
                "- copper: $0.385 \\times 63.55 = 24.5$ J/(mol·°C)\n"
                "- gold: $0.129 \\times 196.97 = 25.4$ J/(mol·°C)\n\n"
                "Four metals spanning a sevenfold range of specific "
                "heat collapse onto one number near 25 J/(mol·°C). "
                "This is the Dulong-Petit pattern, observed in 1819, "
                "and its content is simple and deep: equal numbers of "
                "metal atoms have nearly equal appetites for thermal "
                "energy. Per atom, storing heat costs about the same "
                "regardless of the metal; specific heats differ only "
                "because atoms of different metals weigh differently, "
                "so a gram contains different numbers of them. Gold's "
                "tiny per-gram value is not thermal stinginess - it is "
                "gold atoms being heavy, so that a gram holds few of "
                "them.\n\n"
                "The number 25 is not arbitrary either: classical "
                "physics predicts $3R = 3 \\times 8.314 = 24.9$ "
                "J/(mol·°C) for a lattice of vibrating atoms, and the "
                "table sits within a few percent of it. Where the "
                "pattern fails - diamond falls far short at room "
                "temperature, and all solids fall short when cold - "
                "quantum mechanics is the reason, and that story "
                "belongs to a later course. Water, note, obeys no such "
                "rule: its 75.4 J/(mol·°C) towers over the metals, "
                "hydrogen bonding again. The pattern is a property of "
                "simple atomic solids, and its very failure elsewhere "
                "is diagnostic of structure."
            ),
            table=Table(
                caption="Specific and molar heat capacities near room "
                        "temperature",
                columns=("Substance", "c, J/(g·°C)", "M, g/mol",
                         "c × M, J/(mol·°C)"),
                rows=(
                    ("water (l)", "4.184", "18.02", "75.4"),
                    ("aluminium", "0.897", "26.98", "24.2"),
                    ("iron", "0.449", "55.85", "25.1"),
                    ("copper", "0.385", "63.55", "24.5"),
                    ("gold", "0.129", "196.97", "25.4"),
                ),
                source=(
                    "Specific heats: CRC Handbook of Chemistry and "
                    "Physics, table of specific heat capacities. Molar "
                    "masses from IUPAC standard atomic weights. Final "
                    "column computed as c × M."
                ),
                note=(
                    "The metals cluster near 3R = 24.9 J/(mol·°C) "
                    "(Dulong-Petit); water does not, because hydrogen "
                    "bonding gives it extra ways to absorb energy."
                ),
            ),
        ),
    ),
    key_takeaways=(
        "Heat capacity C (J/°C) belongs to an object and is extensive; "
        "specific heat c (J/(g·°C)) and molar heat capacity (J/(mol·°C)) "
        "belong to a substance and are intensive.",
        "Conversions: C = mc and molar heat capacity = c × M.",
        "Measure a constant by delivering known heat and dividing: "
        "C = q/ΔT, then c = C/m.",
        "Water's high c comes from hydrogen bonding and underlies "
        "climate moderation, thermoregulation, and calorimetry itself.",
        "Per mole, common metals all absorb about 25 J per degree "
        "(Dulong-Petit); their per-gram differences are mostly atomic "
        "mass differences.",
    ),
    exam_tips=(
        "When two samples of different substances receive equal heat, "
        "the one with the smaller mc product warms further - compute "
        "both products rather than comparing c alone.",
        "An unknown-metal item wants c = q/(m·ΔT) and then a table "
        "match; answer 'consistent with', since specific heat alone "
        "cannot prove identity.",
    ),
))


# --------------------------------------------------------------------------
# 5.4 Calorimetry
# --------------------------------------------------------------------------
_add(LessonExtras(
    node="GEN1.CALORIMETRY",
    lead=(
        "No instrument reads reaction heat directly. What a laboratory "
        "can read is a thermometer, and calorimetry is the art of "
        "arranging matters so that a temperature reading IS an energy "
        "measurement: let the reaction exchange its heat with a known "
        "amount of material whose specific heat is known, watch the "
        "temperature change, and compute. The whole method is one "
        "equation, $q_{reaction} = -q_{calorimeter}$, and the minus "
        "sign in it is not decoration - it is the first law, saying "
        "that what one side loses the other gains."
    ),
    sections=(
        ReadingSection(
            id="the-central-idea",
            heading="The central idea: measure the surroundings",
            body=(
                "Assign the roles carefully, because the whole method "
                "lives in the assignment. The system is the reaction - "
                "the dissolving salt, the neutralising acid, the "
                "burning sample. The measured surroundings are the "
                "water (or solution) and hardware in thermal contact "
                "with it. Insulation isolates the pair from the room, "
                "so that energy leaving the reaction has nowhere to go "
                "but the measured surroundings, and vice versa.\n\n"
                "Then the first law does the rest. Whatever heat the "
                "reaction releases, the calorimeter absorbs; whatever "
                "the reaction absorbs, the calorimeter supplies:\n\n"
                "$$q_{reaction} = -q_{calorimeter}$$\n\n"
                "The calorimeter's side is measurable by the last two "
                "chapters' tools: $q_{calorimeter} = mc\\,\\Delta T$ "
                "for a water bath, or $C_{cal}\\,\\Delta T$ once the "
                "whole instrument's heat capacity has been calibrated. "
                "The reaction's side is the unknown, delivered by one "
                "sign flip.\n\n"
                "Keep the direction of inference straight with the "
                "thermometer in mind: the thermometer sits in the "
                "SURROUNDINGS. When it rises, the surroundings gained "
                "energy, so the reaction lost it - the reaction is "
                "exothermic with negative $q$. A warming calorimeter "
                "means a negative reaction heat, and confusing the two "
                "signs is the single most common calorimetry error. "
                "Said once more, as a rule: the thermometer reports the "
                "water's gain, and the reaction's $q$ is that number "
                "negated."
            ),
            important=(
                "The temperature rise belongs to the surroundings. An "
                "exothermic reaction WARMS the calorimeter: q(water) is "
                "positive, q(reaction) is negative. Flip the sign "
                "exactly once."
            ),
        ),
        ReadingSection(
            id="coffee-cup",
            heading="The coffee-cup calorimeter",
            body=(
                "The constant-pressure calorimeter of a teaching "
                "laboratory is two nested foam cups, a lid, a "
                "thermometer, and a measured mass of water - open to "
                "the atmosphere, so the reaction runs at constant "
                "pressure, which (next chapter) means the heat it "
                "exchanges is its enthalpy change. Three working "
                "assumptions, each worth stating because each can be "
                "interrogated: the foam absorbs a negligible share of "
                "the heat; nothing escapes past the lid during the "
                "measurement; and for dilute aqueous mixtures, the "
                "solution's density and specific heat are close enough "
                "to pure water's (1.00 g/mL, 4.184 J/(g·°C)) to use "
                "water's values.\n\n"
                "### Worked: a hot metal, identified\n\n"
                "A 50.0 g piece of metal is heated to 100.0 °C in "
                "boiling water, then dropped into a coffee-cup "
                "calorimeter holding 100.0 g of water at 25.0 °C. The "
                "temperature settles at 28.3 °C. Find the metal's "
                "specific heat.\n\n"
                "The water's side: $\\Delta T = 28.3 - 25.0 = 3.3$ °C, "
                "so $q_{water} = 100.0 \\times 4.184 \\times 3.3 = "
                "1381$ J, rounded from 1380.7. The metal supplied it, "
                "so $q_{metal} = -1381$ J across its own fall of "
                "$28.3 - 100.0 = -71.7$ °C. Its specific heat:\n\n"
                "$$c = \\frac{-1381}{50.0 \\times (-71.7)} = "
                "\\frac{-1381}{-3585} = 0.385 \\text{ J/(g·°C)}$$\n\n"
                "which matches copper's tabulated 0.385 J/(g·°C) - the "
                "measurement is consistent with copper. Notice the "
                "signs cancelling in the division: both the metal's "
                "heat and its temperature change are negative, as they "
                "must be for a cooling object, and a positive specific "
                "heat emerges. Carrying the signs formally, rather "
                "than dropping them and hoping, is what makes the "
                "method self-checking - a negative specific heat at "
                "the end announces a sign slipped somewhere upstream."
            ),
        ),
        ReadingSection(
            id="solution-calorimetry",
            heading="Worked: the heat of a neutralisation",
            body=(
                "Mix 50.0 mL of 1.00 M HCl with 50.0 mL of 1.00 M NaOH, "
                "both starting at 22.0 °C, in a coffee-cup calorimeter; "
                "the mixture reaches 28.8 °C. Find the enthalpy change "
                "per mole of water formed for\n\n"
                "$$\\ce{HCl(aq) + NaOH(aq) -> NaCl(aq) + H2O(l)}$$\n\n"
                "Amounts first: each solution delivers $0.0500 \\times "
                "1.00 = 0.0500$ mol, an exact stoichiometric match with "
                "neither in excess. The mixed solution's mass, taking "
                "the dilute-solution assumptions, is 100.0 mL at 1.00 "
                "g/mL = 100.0 g.\n\n"
                "The solution's side: $\\Delta T = 28.8 - 22.0 = 6.8$ "
                "°C, so\n\n"
                "$$q_{soln} = 100.0 \\times 4.184 \\times 6.8 = 2845 "
                "\\text{ J}$$\n\n"
                "The reaction released it: $q_{rxn} = -2845$ J for "
                "0.0500 mol of water formed. Per mole:\n\n"
                "$$\\Delta H = \\frac{-2845}{0.0500} = -56{,}900 "
                "\\text{ J/mol} \\approx -56.9 \\text{ kJ/mol}$$\n\n"
                "The accepted value for a strong acid neutralising a "
                "strong base is about $-57$ kJ per mole of water "
                "formed - the same number for HCl, HBr or HNO3 against "
                "NaOH or KOH, because (as the net ionic chapter showed) "
                "the reaction underneath is the same in every case: "
                "$\\ce{H+ + OH- -> H2O}$. The small shortfall in our "
                "result is the instrument's honesty about its "
                "assumptions: the cups do absorb a little heat, the "
                "lid does leak a little, and both losses shave the "
                "measured $\\Delta T$. Good technique shrinks these "
                "errors; stating them is part of reporting the "
                "measurement."
            ),
        ),
        ReadingSection(
            id="bomb-calorimetry",
            heading="The bomb calorimeter",
            body=(
                "Combustion will not run in a foam cup. For reaction "
                "heats measured to four figures, the sample is sealed "
                "with excess oxygen into a rigid steel vessel - the "
                "bomb - which sits submerged in a weighed water bath "
                "inside an insulated jacket; ignition is electrical, "
                "and the thermometer watches the bath. Because the "
                "vessel is rigid, $\\Delta V = 0$: no expansion work, "
                "so the heat released equals $\\Delta U$ rather than "
                "$\\Delta H$. The distinction is real but small - for "
                "typical combustions the two differ by well under one "
                "percent - and the next chapter prices it exactly.\n\n"
                "The bomb, bath and hardware absorb heat together, so "
                "the instrument is used as an object with one overall "
                "heat capacity $C_{cal}$, found by calibration: burn a "
                "sample whose heat output is certified, and divide. "
                "The standard calibrant is benzoic acid, whose "
                "combustion releases a tabulated 26.4 kJ per gram. "
                "Suppose burning 1.000 g of it raises this "
                "calorimeter's temperature by 2.64 °C:\n\n"
                "$$C_{cal} = \\frac{26.4 \\text{ kJ}}{2.64 \\text{ °C}} "
                "= 10.0 \\text{ kJ/°C}$$\n\n"
                "### Worked: glucose, burned and priced\n\n"
                "Burn 1.000 g of glucose ($\\ce{C6H12O6}$, molar mass "
                "180.16 g/mol) in the calibrated instrument. The "
                "tabulated molar heat of combustion is about 2803 kJ "
                "released per mole, so the expected temperature rise "
                "is:\n\n"
                "moles $= 1.000 / 180.16 = 0.005551$ mol; heat "
                "released $= 0.005551 \\times 2803 = 15.56$ kJ; "
                "$\\Delta T = 15.56 / 10.0 = 1.56$ °C.\n\n"
                "Read in reverse - measure 1.56 °C, multiply by "
                "$C_{cal}$, divide by the sample's moles - and the "
                "same arithmetic IS the measurement of glucose's heat "
                "of combustion. One more division connects it to the "
                "kitchen: $15.56 \\text{ kJ/g} / 4.184 = 3.72$ "
                "kilocalories per gram, which is the '4 Calories per "
                "gram of carbohydrate' printed on food labels. "
                "Nutritional Calories are bomb calorimetry, lightly "
                "rounded."
            ),
            table=Table(
                caption="The two calorimeters compared",
                columns=("Property", "Coffee cup", "Bomb"),
                rows=(
                    ("held constant", "pressure", "volume"),
                    ("expansion work", "possible", "none"),
                    ("heat measured", "enthalpy change",
                     "internal energy change"),
                    ("suited to", "solution reactions", "combustions"),
                    ("calibration", "water mass and c",
                     "burning a certified standard"),
                ),
                note=(
                    "Both instruments are the same idea - trap the "
                    "heat, read the temperature - engineered for "
                    "different reactions."
                ),
            ),
        ),
        ReadingSection(
            id="whose-q",
            heading="Whose q is it? The discipline of the ledger",
            body=(
                "Every calorimetry mistake worth cataloguing is a "
                "failure to say whose energy a symbol denotes. The "
                "discipline that prevents all of them: write the owner "
                "under every $q$ before any arithmetic, and flip the "
                "sign exactly once, at the boundary.\n\n"
                "- **The thermometer measures the surroundings.** "
                "$mc\\Delta T$ with the WATER's mass and the water's "
                "specific heat computes $q_{water}$, never "
                "$q_{reaction}$. The reaction's heat is its "
                "negative.\n"
                "- **Use the right mass.** In the neutralisation above, "
                "the heated object is 100.0 g of mixed solution - not "
                "50.0 g, and not the mass of HCl. In the metal "
                "problem, the water's $q$ uses the water's 100.0 g and "
                "the metal's $q$ uses the metal's 50.0 g: two objects, "
                "two ledger lines.\n"
                "- **Report per mole, with sign.** A measured "
                "$-2845$ J becomes a molar $\\Delta H$ only after "
                "dividing by the moles that reacted, and the sign "
                "travels with it. 'Releases 56.9 kJ/mol' and "
                "'$\\Delta H = -56.9$ kJ/mol' say the same thing; "
                "'$\\Delta H = 56.9$ kJ/mol' says the opposite.\n"
                "- **An endothermic run reads backward.** Dissolve "
                "ammonium nitrate - the cold-pack salt - and the "
                "thermometer falls: the solution LOST energy to the "
                "dissolving, $q_{soln}$ is negative, and the "
                "reaction's $q$ is positive. The machinery is "
                "unchanged; only the directions reverse.\n\n"
                "The habit of naming the owner sounds pedantic for "
                "one-step problems and becomes survival equipment the "
                "moment a problem holds three objects - metal, water "
                "and cup - each with its own $q$ summing to zero. "
                "That three-body bookkeeping is exactly how real "
                "instruments are corrected for the cup's own heat "
                "capacity, and it is nothing but the first law with "
                "more lines in the ledger."
            ),
        ),
    ),
    key_takeaways=(
        "Calorimetry measures the surroundings and infers the reaction: "
        "q(reaction) = -q(calorimeter).",
        "The thermometer sits in the surroundings - a rising reading "
        "means an exothermic reaction with negative q.",
        "Coffee-cup calorimeters run at constant pressure and measure "
        "enthalpy; bombs run at constant volume and measure internal "
        "energy.",
        "Instruments are calibrated as whole objects: C(cal) = q/ΔT with "
        "a certified standard such as benzoic acid.",
        "Label every q with its owner and flip the sign exactly once; "
        "food Calories are bomb calorimetry per gram, divided by 4.184.",
    ),
    exam_tips=(
        "The planted error is using the sample's mass in mcΔT instead of "
        "the water's, or forgetting the sign flip between q(water) and "
        "q(reaction). Check both before the arithmetic.",
        "In mixing problems the heated mass is the TOTAL solution mass, "
        "and the mole count for the per-mole step comes from the "
        "limiting reactant.",
    ),
))
