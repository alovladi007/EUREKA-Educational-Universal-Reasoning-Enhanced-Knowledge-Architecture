# Proximity, Touch, Movement, Force, and Pressure

<!-- covers: 6.3, 6.4 -->

## Sensing presence

Proximity and touch sensing is a catalog of physical excuses to change a
capacitance, a light path, or an echo time.

**Capacitive** sensing measures the extra capacitance a nearby body adds to
an electrode - the touchscreen's principle and the microcontroller's
favorite, since a pin, a resistor, and charge-time measurement suffice.
**Optical** proximity pairs an LED and detector from Module 5, reflective
or through-beam, with ambient light defeated by modulation. **Ultrasonic**
ranging emits a chirp and times the echo: distance = time x speed of sound
/ 2, the divide-by-two forgotten exactly once per career. **Inductive**
sensors detect metal by the eddy currents it steals from an oscillating
coil - dirt-proof, the industrial standard. **Hall-effect** devices sense
magnetic fields directly: a magnet on a door plus a Hall switch is the
modern reed switch, and Hall latches count spinning magnets into RPM.
Mechanical **limit switches** remain the honest fallback: physical contact,
Module 3's bounce included.

## Movement and acceleration

**PIR** motion detectors sense the moving warmth of bodies through a
segmented lens - the ubiquitous security sensor, detecting change, not
presence. **Accelerometers** are MEMS: a silicon proof mass on springs
whose deflection - capacitively read - measures acceleration including
gravity, so tilt comes free. **Gyroscopes** measure rotation rate via the
Coriolis effect on a vibrating structure; integrating rate into angle
drifts, so real orientation systems fuse gyro (fast, drifting) with
accelerometer (slow, absolute) - the complementary-filter idea, and the
IMU chip does both on one die. **Encoders** from the potentiometer lesson's
ending measure shaft motion digitally: quadrature's two offset channels
give direction from phase and speed from rate.

## Force, strain, and pressure

The **strain gauge** is a resistor whose geometry - and thus resistance,
by Module 2's R = rho L / A - changes when stretched. The change is parts
per thousand, so gauges live in a **Wheatstone bridge**: four arms, excited
by a stable voltage, output proportional to imbalance, temperature effects
cancelling between matched arms. Bonded to a metal flexure the assembly is
a **load cell** - every digital scale - read by a high-gain differential
amplifier (the HX711 class combines amplifier and ADC for pennies).
**Piezoelectric** elements generate charge when stressed: excellent for
dynamic force, knocks, and vibration, useless for static loads (charge
leaks), read by charge amplifiers. **FSRs** - force-sensitive resistors -
are printed films whose resistance falls under pressure: unrepeatable but
adequate for "how hard is the squeeze".

**Pressure sensors** are strain gauges or capacitive cells on a
micromachined diaphragm, sold absolute, gauge (relative to atmosphere), or
differential; barometric versions resolve altitude to a meter and ship
their readings over I2C like every modern MEMS part.
