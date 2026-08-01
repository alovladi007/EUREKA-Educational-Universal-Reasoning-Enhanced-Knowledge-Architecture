# Switches, Relays, and Circuit Protection

<!-- covers: 3.3, 3.4, 3.9 -->

## Switches

A switch is contacts and an actuator, described by its pole and throw count:
poles are how many separate circuits it switches, throws are how many
positions each pole connects to. SPST is on-off; SPDT selects between two
paths; DPDT switches two circuits together, and cross-wired it reverses a
motor. Momentary switches (pushbuttons) act only while pressed and are
normally-open or normally-closed; toggles, slides, rockers and rotaries hold
their state.

Ratings are not decoration. Contacts are rated for current and voltage, and
separately for AC and DC - DC arcs are harder to extinguish because the
current never crosses zero. Switching an inductive load derates a switch
further (the kickback lesson applies to contacts too). Mechanical contacts
also **bounce**: they make and break for a few milliseconds before settling,
invisible to a lamp and very visible to a logic input counting edges. The
digital module returns to debouncing; know now that the raw waveform is
messy.

Simple applications carry surprising utility: two SPDTs wired as a hallway
pair, a center-off DPDT for forward-stop-reverse, a normally-closed button
as an emergency break.

## Relays

A relay is a switch thrown by an electromagnet: energize the coil, contacts
move. This buys three separations at once - control from load (milliamps
throwing tens of amps), voltage domains (logic switching mains-rated
contacts), and complete galvanic isolation between the two circuits.

The coil is an inductor, so the flyback rule from Module 2 is mandatory: a
diode across a DC coil, or the driving transistor dies at turn-off. Contact
varieties mirror switches (SPDT changeover being the most useful), and the
datasheet's mechanical and electrical life numbers differ because arcing
erodes contacts. Reed relays switch small signals fast; contactors are
relays grown industrial. Where no isolation is needed and speed matters, a
transistor does the job with no moving parts - Module 4's territory. Classic
relay circuits worth recognizing: the latching pair (a relay holding itself
on through its own contact), the interlock (two relays each wired to forbid
the other), and the astable buzzer (a relay wired to interrupt its own coil).

## Fuses and circuit breakers

Protection devices are the deliberate weak link. A fuse is a calibrated wire
that melts; its rating is the current it carries forever, not where it opens
- opening takes a substantial overload, faster the larger the fault.
Fast-blow fuses protect semiconducturally-innocent circuits; slow-blow
tolerate the inrush of motors and capacitor banks. Voltage ratings matter
because an opened fuse must not arc across its own gap.

Circuit breakers do the same job resettably, tripping thermally on sustained
overload and magnetically on dead shorts. Placement rule from Module 2
stands: protection sits upstream, sized to save the wiring and the board,
chosen so normal operation never grazes the rating. And the diagnostic rule:
a blown fuse is a symptom. Replace it once; if it blows again, the fault is
still there and the fuse is telling the truth.
