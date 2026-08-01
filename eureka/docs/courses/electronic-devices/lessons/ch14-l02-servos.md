# RC Servos

<!-- covers: 14.4 -->

## A motor with an opinion

An RC servo packages motor, gearbox, position feedback potentiometer, and
control electronics into one obedient unit: command an angle and it goes
there and holds - Module 8's negative feedback sold as an actuator. The
standard interface is a pulse every 20 ms whose **width** encodes the
target: 1.5 ms centers, ~1.0 ms and ~2.0 ms are the extremes (roughly +/-
45 to 90 degrees depending on the servo). This is pulse-width *position*
encoding - related to, but not the same as, the PWM power control of the
motor lesson, a distinction worth keeping crisp.

## Using them

Any microcontroller timer generates the pulse train; hobby ecosystems wrap
it in a one-line library. Electrical practice: servos run on 4.8-6 V
(digital and high-voltage variants differ - read the label), draw brief
amps under load, and share only ground with the controller - powering a
servo from a board's regulator is the classic brown-out generator.
Mechanical practice: the horn's spline sets mounting; stall at the end
stops strips gears and cooks windings, so software limits live inside the
physical ones.

Variants map the design space: **continuous-rotation** servos reinterpret
the pulse as speed (feedback removed - a gearmotor with a driver);
**digital servos** sample the command faster and hold stiffer at the cost
of current; **linear servos** trade rotation for travel; robotics-class
**smart servos** speak serial buses, report position and load, and blur
into the closed-loop drives of industry. When a project outgrows hobby
precision, the upgrade path is the previous lesson's motor plus encoder
plus control loop - the servo un-bundled, with every choice exposed.
