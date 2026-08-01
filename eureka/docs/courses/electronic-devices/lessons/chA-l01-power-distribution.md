# Power Distribution and Home Wiring, Described

<!-- covers: A.1, A.2, A.3, A.4 -->

This appendix explains how mains power works so its hazards and
conventions make sense. It is descriptive, not instructional: wiring
practice is regulated, jurisdiction-specific, and belongs to licensed
work. This course's projects stay on the safe side of a certified
supply.

## From plant to panel

Generation is three-phase AC, transmitted at hundreds of kilovolts
because Module 2's transmission arithmetic (same power, less current,
losses as I-squared-R) demands it, then stepped down through
substation and pole transformers - the transformer's isolation and
ratio doing at grid scale what Module 11 did on the bench. North
American homes receive **split-phase**: a center-tapped 240 V secondary
whose grounded center is neutral, yielding two 120 V legs and 240 V
across them for heavy appliances.

## Three-phase, briefly

Three windings 120 degrees apart deliver constant total power, start
motors without capacitor tricks, and use conductors efficiently - hence
industry's preference. Line-to-line voltage exceeds line-to-neutral by
the square root of three (400/230 V in Europe, 208/120 V in North
American commercial wye systems); delta and wye connections name how
windings tie. For the electronics builder the practical consequence is
recognizing the plugs and panels, and expecting phase-to-phase voltages
in equipment rooms.

## Inside the walls

The domestic conductor trio: **hot** (energized), **neutral** (return,
bonded to earth at the service panel only), and **protective earth** -
the Module 2 safety ground whose whole job is to carry fault current
and trip protection fast. Breakers protect the wiring (Module 3's rule
at building scale); **RCD/GFCI** devices compare hot and neutral
current and trip on milliamp imbalance - protection of people, which
fuses never were. Receptacle polarization and grounding pins encode all
of this mechanically; equipment classes (earthed metal chassis versus
double-insulated) explain why some plugs have two pins and others
three. The recurring electronics-bench relevance: ground loops (hum
when signal grounds and safety grounds meet at multiple potentials -
the audio module's enemy), and why isolation transformers and
optocouplers exist.

## Elsewhere

The world splits roughly into 230 V/50 Hz and 120 V/60 Hz camps, with a
zoo of plug shapes. Equipment marked with universal-input switching
supplies (Module 11's flyback earning its keep) spans all of it;
transformer-input and motor-timed devices do not travel. Frequency
matters to clocks and motors; voltage matters to everything - reading
the label is the entire trick.
