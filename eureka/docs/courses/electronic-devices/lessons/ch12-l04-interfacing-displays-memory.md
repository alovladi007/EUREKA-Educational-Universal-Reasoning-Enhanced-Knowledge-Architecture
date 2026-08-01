# Analog Interfacing, Displays, and Memory

<!-- covers: 12.10, 12.11, 12.12 -->

## Crossing the analog border

**ADCs** quantize: N bits divide the reference into 2^N steps, so a
10-bit converter on 3.3 V resolves ~3.2 mV. Resolution is not accuracy -
noise, reference quality, and INL/DNL decide the honest bit count.
Architectures map to jobs: successive-approximation (SAR) for
general-purpose speed, sigma-delta for slow precision (the load-cell
readers of Module 6), flash for speed at low resolution. Sampling obeys
Nyquist: capture above twice the highest frequency present, and
band-limit first - Module 9's anti-aliasing filter is not optional,
because aliases are indistinguishable after the fact. Source impedance
matters too: SAR inputs sample onto a capacitor, and a high-impedance
source needs a buffer (Module 8) or settling time.

**DACs** reverse the trip - R-2R ladders and switched references - and
their stepped output wants Module 9's reconstruction filter. The poor
man's DAC is **PWM through a low-pass**: duty cycle times supply, filtered
- Module 5's LED dimming generalized to any analog output a
microcontroller fakes.

Comparators with hysteresis (Module 8) remain the one-bit ADC, and
optocouplers the clean way to bring dirty analog worlds across.

## Displays

**LEDs and seven-segment** displays: common-anode or common-cathode,
current-limited per segment, multiplexed by scanning digits faster than
the eye - persistence of vision as an engineering budget (current
per-segment rises as duty falls). **Dot-matrix LED** scans rows into
columns identically. **LCDs** are voltage-driven light valves: character
modules with the HD44780-class controller speak a 4/8-bit parallel
protocol every hobby platform wraps; graphic LCDs and **OLED** modules
(SSD1306 class) speak I2C/SPI and hand the pixel bookkeeping to a
controller chip. Backlights are LEDs with the usual arithmetic;
**e-paper** holds its image unpowered and pays in refresh time. The
selection axes: readability in the target light, interface pins
available, and update rate.

## Memory

Taxonomy first: **volatile** RAM (SRAM - flip-flop cells, fast, pricey;
DRAM - capacitor cells, dense, refresh-hungry) versus **non-volatile**
ROM lineage (mask ROM, EPROM's UV window, EEPROM's byte-erase, and
**flash** - block-erased EEPROM that ate the category). Flash's fine
print: erase-before-write, finite endurance (thousands to hundreds of
thousands of cycles per block), and wear-leveling as the answer -
relevant every time firmware logs to it. Serial EEPROM and flash chips
on I2C/SPI hold settings and data files; SD cards package flash with a
controller; FRAM buys RAM-like endurance at NV permanence for niche
duty. Address-times-width arithmetic sizes any of them, and the bus
discipline of the previous lesson wires them in.
