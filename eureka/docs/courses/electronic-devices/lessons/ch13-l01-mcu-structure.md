# Microcontroller Structure and the Board Ecosystem

<!-- covers: 13.1, 13.2, 13.3 -->

## What a microcontroller is

A microcontroller is a computer reduced to a component: CPU, flash for
program, SRAM for data, and - the defining part - **peripherals** wired
to pins. Timers/counters (PWM, input capture), ADCs and sometimes DACs,
serial engines (UART, SPI, I2C, USB), and interrupt logic that lets
events preempt the main loop. GPIO pins multiplex between these roles
under register control; clocking arrived in Module 10; reset and
brown-out supervision keep startup honest. Program memory is flash
(Module 12's endurance rules apply to self-writing firmware), and a
watchdog timer reboots code that wedges - enable it in anything
unattended.

Architecturally: 8-bit families (AVR, PIC) remain perfectly adequate for
control tasks; 32-bit ARM Cortex-M dominates new design (M0 for cost, M4
with DSP and floating point); RISC-V arrives fast. What matters at this
course's level is not the ISA but the peripheral set, the supply range,
sleep currents (microamps matter - the sensors module's duty-cycle
arithmetic), and the toolchain's friendliness.

## Example silicon

Representative parts anchor the abstractions: the AVR ATmega328 (the
classic Arduino's heart - 8-bit, 32 K flash, forgiving 5 V I/O); the
STM32 lineage (Cortex-M spanning pennies to gigahertz-class); the ESP32
(Wi-Fi and Bluetooth on die - connectivity as a peripheral); the RP2040
(dual M0+ with programmable I/O state machines). Their datasheets share
a grammar - pin multiplexing tables, electrical absolute maxima, current
per pin (tens of milliamps, driving Module 4's transistor rule for
anything larger) - and learning to read one family's reference manual
teaches all of them.

## Evaluation and development boards

Bare chips need support: regulator, crystal, programming header, USB
bridge. **Development boards** package exactly that - the vendor's
Nucleo/Discovery/LaunchPad class exposes every pin with a built-in
debugger; community boards add breadboard-friendly form factors. The
in-circuit **programmer/debugger** (SWD on ARM, ISP on AVR) is the
honest tool underneath: it flashes code and, more importantly, sets
breakpoints and inspects memory - printf-by-serial being the fallback
everywhere else. Choosing a board is choosing its ecosystem: libraries,
examples, community answers - which is the bridge to the next lesson's
Arduino phenomenon.
