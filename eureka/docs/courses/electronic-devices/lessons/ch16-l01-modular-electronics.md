# Modular Electronics

<!-- covers: 16.1, 16.2, 16.3, 16.4 -->

## There is an IC for it

The recurring discovery of this course - decoupling recipes, driver
bridges, translator chips - generalizes into a method: before designing a
function from primitives, check whether it ships as a part. Voltage
references, instrumentation amplifiers, motor bridges, energy-metering
chips, radio transceivers: integration keeps swallowing schematics. The
craft shifts from inventing the block to selecting it - datasheet
literacy as the core skill - and to the glue: supplies, levels, and the
buses of Module 13.

## Breakout boards and modules

Where the IC's package defeats the prototyper (Module 4's QFN and BGA),
the **breakout board** adapts it to 0.1-inch humanity, usually adding
regulator, level shifting, pull-ups, and the datasheet's own decoupling.
The sensor modules of Module 6, GPS receivers, display boards, driver
modules of Module 14, converter modules of Module 11 - the modern
prototype is modules wired by buses, and it is a legitimate engineering
artifact, not a shortcut. Diligence transfers rather than disappears:
which regulator is aboard (3.3 V-only silicon behind a 5 V-tolerant
module?), whose pull-ups are duplicated on a shared I2C bus, and what
the module's schematic - usually published - actually says.

## Plug-and-play prototyping

Connector ecosystems remove even the wiring: shield/HAT stacking headers
give whole-board expansion for Arduino and Raspberry Pi; polarized
four-wire I2C connector systems (Grove, STEMMA QT/Qwiic) chain sensors
without a soldering iron. The trade is the usual one - speed against
control - and the graduation path runs backward through this course:
module to breakout to bare IC on your own PCB (Module 7's construction
ladder), taken only as far as the project's constraints demand. Cost,
size, and power favor integration eventually; learning and iteration
favor modules now.

## Open source hardware

Much of this ecosystem publishes its schematics, layouts, and firmware
under open licenses - Arduino's boards, most breakout vendors, whole
instrument designs. For the builder this is working documentation:
reference schematics that answer "how do they wire it," layouts that
teach Module 11's hot-loop rules by example, and firmware to fork.
Licenses (from permissive to share-alike) set the terms of reuse, and
derivative respect - credit, license inheritance, no trademark
borrowing - keeps the commons that made the modules possible. Publishing
your own designs closes the loop this course opened: the schematic you
document today is a stranger's Module 1 tomorrow.
