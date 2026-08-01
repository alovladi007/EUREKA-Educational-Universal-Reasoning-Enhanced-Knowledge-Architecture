# Combinational Devices, Logic Families, and Powering Logic

<!-- covers: 12.3, 12.4, 12.5 -->

## Combinational building blocks

Combinational logic's output depends only on present inputs, and the
catalog packages the recurring functions. **Multiplexers** select one of
N inputs onto one output by a binary address - data routing and, fed
constants, a universal function generator. **Demultiplexers/decoders** go
the other way: an address activates one of N outputs (the 3-to-8 decoder
being address-decoding's workhorse). **Encoders** compress one-active-
of-N to binary; priority encoders arbitrate when several are active.
**Adders** chain full-adder cells with carries; **comparators** answer
equal/greater/less in hardware; **parity** trees of XORs check words at a
glance. Seven-segment **display drivers** decode BCD to segments -
Module 5's LEDs acquiring literacy.

## Families and their electrical manners

A logic family fixes supply, levels, speed, and drive. **TTL** (bipolar,
5 V) set history's conventions - its asymmetric thresholds and
current-sinking inputs still echo in "TTL-compatible" claims. **CMOS**
(the 4000 series, then 74HC and descendants) took over: rail-to-rail
levels, near-zero static draw, supply-flexible. Modern boards run
**3.3 V and lower**, and the family letters (HC, HCT, LVC, AUP...)
encode speed, supply range, and input tolerance. Two interfacing rules
carry the day: check Voh/Vol of the driver against Vih/Vil of the
receiver at the actual supplies, and when domains differ use
5V-tolerant-input parts or proper level shifters (a FET and two
resistors for I2C; dedicated translators for buses). CMOS input rules
are absolute: never float an input (drift, oscillation, current), and
remember inputs are static-sensitive per Module 4.

## Powering and testing logic

Fan-out counts how many inputs an output drives within spec - generous
in CMOS at DC, eroded by capacitance at speed, since every input's
picofarads must charge each edge: dynamic current is C V f summed over
the switching nodes, which is why CMOS power scales with clock. The
decoupling law (100 nF at every package) is here not hygiene but
function - each edge is a current spike the capacitor must serve.
Totem-pole outputs drive both ways; **open-drain** outputs only sink,
need pull-ups, and in exchange wire-AND and level-shift (I2C lives on
this). **Three-state** outputs add a high-impedance mode so many devices
share a bus - enable discipline preventing two drivers fighting.
Testing digital circuits uses Module 7's tools with logic manners: logic
probe or scope for levels and edges, and the logic analyzer once buses
multiply.
