# DC Motors: Speed and Direction

<!-- covers: 14.1, 14.2, 14.3 -->

## The brushed DC motor

Current through a rotor winding in a magnetic field makes torque; a
commutator flips the winding each half-turn so torque keeps one sign.
Electrically the motor is Module 2 in motion: winding resistance in series
with an inductance and a **back-EMF** proportional to speed. At stall,
back-EMF is zero and current is V/R - the **stall current**, several times
running current, which sizes drivers and fuses. As speed rises, back-EMF
subtracts, current falls, and the speed-torque line slopes down from
no-load speed to stall torque. Power peaks mid-curve; heat decides what is
sustainable. Brushes wear and spark (RFI - the capacitor across the
terminals is traditional); brushless (BLDC) motors move commutation into
electronics and appear at this course's edge as ESC-driven modules.

## Speed control

Dropping voltage with a resistor wastes power and softens torque; the
right tool is Module 5's trick at power scale - **PWM**. Switch the full
supply at kilohertz; the winding inductance averages current; torque stays
stiff at low speed. The chopper is Module 4's MOSFET with Module 2's
flyback diode - non-negotiable, the inductive-kick rule at its most
literal. Switching frequency trades audible whine (below ~20 kHz) against
switching loss. Closed-loop speed control adds feedback - an encoder or
back-EMF sensing during PWM off-times - and a control loop, usually PI:
Module 8's ideas in firmware.

## Direction: the H-bridge

Reversing a motor means reversing its current: four switches in an **H**
around the motor. Diagonal pairs conduct for each direction; both low-side
switches on gives braking; all off coasts. The fatal state - both switches
of one leg on - is **shoot-through**, a supply short; real bridges enforce
dead-time between transitions. Practical bridges are ICs and modules: the
antique L298's bipolar drops teach why modern MOSFET bridges (DRV8871
class and kin) run cool. Control is two pins plus PWM (sign-magnitude or
locked-antiphase), and the motor supply is decoupled hard - motors are the
noisiest neighbors a microcontroller ever has, so separate supplies with a
common ground, or Module 5's optical isolation, keep resets away.
