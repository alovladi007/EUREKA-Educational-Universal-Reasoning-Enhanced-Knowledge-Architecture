# Switching Regulators and Power Supply Practice

<!-- covers: 11.8, 11.9, 11.10, 11.11 -->

## The switching idea

Instead of burning the excess voltage, a switcher chops the input at tens
of kilohertz to megahertz and lets an LC store-and-release average it to
the target: transistor as switch (loss only in transitions and Rds(on)),
inductor as energy shuttle - Module 2's kickback as a feature, formally.
Efficiencies of 85-95 percent follow, and with them batteries that last
and bricks that stay cool.

**Buck** (step-down): switch connects the inductor to input, then
freewheels through a diode or synchronous FET; output is roughly duty
cycle times input. **Boost** (step-up): inductor charges to ground, then
dumps above the input - the kickback harvester promised in Module 2.
**Buck-boost and inverting** variants cover crossing or negating the
input; transformer-based **flyback** and **forward** topologies add
isolation and multiple outputs - the shape of every offline adapter.
Control loops regulate by PWM; feedback crosses isolation via Module 5's
optocoupler in mains designs.

## The price: noise and layout

Switchers pay in ripple at the switching frequency, harmonics into the
radio bands, and layout sensitivity. The rules: keep the hot loop (switch,
diode, input cap) tiny; low-ESR capacitors where the datasheet says;
inductor chosen for saturation current with margin (Module 3's hard
limit); and the LDO post-regulator when analog circuits downstream
complain. Modern **switching modules** - complete converters on a
board or in a package - reduce the design to choosing one and honoring
its layout note, which is Module 16's philosophy arriving early.

## Commercial packages and practice

The catalog of finished supplies: wall adapters (isolated flyback,
labeled output, verify polarity), open-frame and enclosed frame supplies
for equipment builds, DIN-rail industrial units, bench supplies (Module
7), USB power with its negotiated voltages, and battery-charger modules
whose chemistry-specific profiles Module 3 insisted on. Ratings to read:
voltage accuracy, ripple spec, current, efficiency curve (light-load
efficiency differs), and protection behaviors - current limit style,
over-voltage, thermal.

**Construction practice** for anything mains-side remains this course's
boundary: understand it via Appendix A, buy the isolated converter as a
certified module, and build your electronics on its safe secondary side.
On that side, the assembly rules are the accumulated course: fuse first,
reverse-polarity protection (series Schottky or FET), bulk plus ceramic
decoupling, one star point where grounds meet, and a scope check of
ripple under real load before declaring victory.
