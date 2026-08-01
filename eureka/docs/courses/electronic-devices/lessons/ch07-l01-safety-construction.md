# Workshop Safety and Circuit Construction

<!-- covers: 7.1, 7.2 -->

## Safety, concretely

This course's projects live at low voltage, and the safety rules exist to
keep it that way. Current through the body is what injures; tens of
milliamps across the chest can be fatal, and voltage is what pushes it -
treat anything above about 50 V as hazardous, and mains as a specialist
domain described in Appendix A rather than practiced here. The workshop
rules: no rings or dangling metal at the bench; charged capacitors are
discharged through a resistor before handling (the camera-flash lesson from
Module 2); lithium packs charge on manufactured protection boards, never
improvised; one hand in the pocket when probing anything energetic, so no
path crosses the chest. Soldering adds heat and fumes: irons live in their
stands, fume extraction or ventilation runs, and eye protection is cheap
compared to flux spatter. ESD care - a grounded wrist strap or at least
touching chassis before handling bare MOS parts - protects the components
from you.

## Breadboards

The solderless breadboard is the prototyping default: five-hole rows joined
under the surface, split by the center channel that DIP packages straddle,
with power rails down the sides (check for the mid-rail break that catches
everyone once). Its virtues are speed and reversibility; its vices are the
parasitics of every springy contact - intermittent joints, a fraction of an
ohm here, picofarads everywhere - so breadboards are trusted at audio and
logic speeds and doubted above a few megahertz. Discipline that pays: solid
22 AWG hookup wire cut to length rather than flying leaps, color
convention enforced, one function per region of the board, and decoupling
capacitors placed at the chips, not at the far rail.

## More permanent construction

**Perfboard and stripboard** solder the same topology down: stripboard's
copper strips run under the rows, cut where the circuit demands (a drill
bit twisted by hand is the traditional strip cutter). Point-to-point wiring
on perfboard suits one-offs; wire-wrap survives in niches for dense
revisable prototypes. **Printed circuit boards** are the destination:
designed in EDA software (schematic capture, then layout), fabricated
cheaply in days, with the layout rules this course has been accumulating -
short high-current loops, ground planes, decoupling at pins, connectors
strain-relieved. Surface-mount assembly by hand is entirely practical down
to 0603 parts and fine-pitch ICs with flux, drag soldering, and braid;
solder paste plus a hot plate or toaster-oven reflow handles the rest. The
construction ladder - breadboard to stripboard to PCB - is also the
debugging ladder: each step trades flexibility for reliability, and moving
up only after the circuit works is the cheap path.
