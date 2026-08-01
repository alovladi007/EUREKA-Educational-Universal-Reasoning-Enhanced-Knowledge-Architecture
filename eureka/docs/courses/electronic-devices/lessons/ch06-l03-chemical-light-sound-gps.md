# Chemical, Radiation, Magnetic, Acoustic Sensing, and GPS

<!-- covers: 6.5, 6.6, 6.7 -->

## Chemical sensors

Gas and moisture sensing is chemistry harnessed to resistance and
electrochemistry. **Metal-oxide** gas sensors (the MQ family) heat a tin
dioxide surface whose resistance drops as reducing gases adsorb; they are
cheap, unselective, need warm-up and burn-in, and their heater dominates
the power budget - honest calibration against a known reference is the
difference between an indicator and a number. **Electrochemical cells**
generate current proportional to a target gas concentration (the CO
detector's core): selective, self-consuming, replaced on a schedule. **NDIR**
sensors measure CO2 by how much 4.3-micron infrared it absorbs - Module 5
optics in a sensing role. **Humidity** sensors read a polymer film's
capacitance changing with moisture; **pH** electrodes deliver about 59 mV
per pH unit at enormous source impedance, demanding the highest-impedance
amplifier input this course meets. Cross-sensitivity is the family curse:
most chemical sensors respond somewhat to temperature, humidity, and each
other, so compensation is design, not decoration.

## Radiation, magnetism, and sound

Ionizing radiation announces itself in a **Geiger-Muller tube**: a particle
ionizes gas at several hundred volts and triggers a discharge - a click per
event, no energy information. PIN photodiodes shrouded from light serve as
compact detectors, and scintillators convert particle energy into light
pulses a photodiode can grade. **Magnetic** sensing beyond the Hall switch:
ratiometric Hall parts output voltage proportional to field, current
sensors measure a wire's field to meter amperes without breaking the
circuit, and magnetoresistive compasses read the Earth's field - after
hard- and soft-iron calibration correct for the machine around them.
**Sound** sensing belongs to microphones, treated in the audio module;
here, note only that ultrasonic transducers double as transmitters and
receivers, and that acoustic sensing is often the cheapest vibration
diagnostic - a machine's health audible before it is visible.

## GPS

A GNSS receiver measures time-of-flight from satellites whose positions
and clocks are broadcast: four satellites solve latitude, longitude,
altitude, and receiver clock error. For the electronics builder, the
receiver is a module: power it, give its antenna sky view, and read NMEA
sentences over a serial port at 9600 baud - position, time, satellite
count, fix quality. Accuracy is meters (better with corrections), cold
start takes tens of seconds, canyons and ceilings degrade everything, and
the receiver's one-pulse-per-second output is a laboratory-grade timing
reference for free. The deeper lesson generalizes: modern sensors
increasingly arrive as subsystems speaking digital protocols, and the
electronics craft shifts from amplifying microvolts to reading, validating,
and fusing data - which is exactly where the microcontroller module picks
up.
