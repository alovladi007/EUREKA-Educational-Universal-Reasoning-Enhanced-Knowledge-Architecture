# Capacitors, Inductors, and Transformers as Components

<!-- covers: 3.6, 3.7, 3.8 -->

## Choosing capacitors

The physics lived in Module 2; the catalog lives here, and the catalog is
dominated by dielectrics.

- **Ceramic** capacitors are the default: tiny, cheap, low ESL, from
  picofarads to tens of microfarads. Their classes matter - C0G/NP0 is
  stable enough for timing and filters; X7R drifts with temperature and
  loses capacitance under DC bias; Y5V is a rough approximation of a
  capacitor. Decouple with ceramics; time with C0G or film.
- **Film** capacitors are stable, low-loss, and handle voltage well - the
  audio and precision choice.
- **Aluminum electrolytics** buy bulk microfarads for supply smoothing,
  polarized, with real ESR, finite life measured in hours-at-temperature,
  and a dramatic response to reversed polarity.
- **Tantalum** packs electrolytic capacitance into small packages, wants
  derating, and fails short - respect the voltage rating doubly.
- **Supercapacitors** blur into energy storage: farads at a few volts, for
  memory keep-alive and burst power, not for supply filtering.

The standard board recipe follows from ESL: a bulk electrolytic where power
enters, a 100 nF ceramic at every IC's pins, because the big part cannot
move charge fast and the small one cannot move much - together they cover
the spectrum.

## Choosing inductors

Inductor selection is a four-way negotiation: inductance, saturation current
(where the core gives up - the hard limit), winding resistance (loss and
heat), and self-resonant frequency (above which it is a capacitor). Shielded
drum cores keep their field to themselves on crowded boards; unshielded
parts are cheaper and noisier neighbors. Ferrite **beads** are deliberately
lossy inductors - at high frequency they turn noise into heat rather than
reflecting it, which is why they sit on supply pins and cable exits.
**Chokes** are inductors named for their job of blocking AC while passing
DC; common-mode chokes wind two conductors on one core so normal signal
current cancels and only common-mode interference sees the inductance.

## Transformers

Two or more windings sharing a core make a transformer: changing current in
the primary induces voltage in the secondary, scaled by the turns ratio.
Voltage transforms with the ratio, current inversely, and impedance with
its square - the third being why transformers match impedances as well as
change voltages. Power is conserved minus core and copper losses; nothing is
amplified.

Transformers only work on changing current - drive a winding with DC and you
get a heater with kickback. Ratings cover volt-amperes, primary and
secondary voltages at rated load (unloaded secondaries read high), and
isolation - the safety property that a mains transformer's secondary has no
galvanic path to the wall, which is the foundation of every linear supply in
Module 11. Center-tapped secondaries enable the two-diode rectifier there;
autotransformers share one winding and sacrifice exactly the isolation that
made the transformer safe. Small signal transformers do for audio and
ethernet what power transformers do for supplies: isolate, match, and
reject common-mode hum.
