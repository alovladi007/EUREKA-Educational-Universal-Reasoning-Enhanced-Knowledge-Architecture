# Transformers, Rectifiers, and Linear Supplies

<!-- covers: 11.3, 11.4, 11.5, 11.6, 11.7 -->

## The linear supply chain

The classic mains supply is a pipeline: transformer isolates and steps
down, rectifier makes pulsating DC, reservoir capacitor smooths it,
regulator flattens what remains. Module 3 supplied the transformer
(isolation being the safety heart), Module 4 the diodes; this lesson
assembles them. Mains wiring itself stays descriptive per Appendix A - the
work here begins at the transformer's secondary.

## Rectifier choices

**Half-wave**: one diode, one pulse per cycle - maximal ripple, minimal
parts. **Full-wave center-tapped**: two diodes on a center-tapped
secondary, one diode drop, but each half-winding works half-time.
**Full-wave bridge**: four diodes (packaged as one part with ~ ~ + -
terminals), both half-cycles used, two diode drops - the default. Diode
ratings follow the topology: peak reverse voltage roughly twice the peak
secondary voltage for the tapped design, and surge rating sized for the
reservoir's inrush.

## Ripple arithmetic

The reservoir capacitor supplies the load between peaks, so its voltage
sags - **ripple** - by approximately dV = I / (f C), with f the ripple
frequency (twice mains for full-wave). Bigger C means less ripple but
larger inrush and a stiffer start; the working recipe computes C from the
allowed sag, then hands the remainder to the regulator, whose ripple
rejection (PSRR, in Module 2 decibels) finishes the job. Unloaded, the
output rises to the secondary's peak - 1.414 times RMS - which sets the
regulator's maximum input and the capacitor's voltage rating.

## Loose ends that matter

Bleeder resistors discharge the reservoir after power-off (the charged-
capacitor safety rule, automated). Fuse on the primary side, sized for
inrush per Module 3. Transformer VA rating comfortably above the DC watts
drawn (rectifier current flows in unflattering peaks, heating windings
more than average current suggests). Dual complementary rails for op-amp
work come from a center-tapped secondary and mirrored rectifier-regulator
pairs. And the whole linear pipeline's virtues - simplicity, low noise, no
switching artifacts - keep it alive for audio and lab supplies even as
switchers win everything portable.
