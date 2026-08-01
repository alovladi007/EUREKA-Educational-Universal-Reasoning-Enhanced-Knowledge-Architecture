# Error Analysis

<!-- covers: B.1, B.2 -->

## Naming error honestly

A measurement without a stated uncertainty is an anecdote. **Absolute
error** is the difference from the true (or reference) value, in the
measurand's own units; **relative error** divides that by the value;
**percent error** multiplies by 100. Which matters depends on use: a
5 mV offset is fatal at thermocouple scale and invisible on a 12 V
rail. The sensors module's precision/accuracy distinction returns as
bookkeeping: scatter (random error) shrinks with averaging as one over
the square root of N; bias (systematic error) does not average away and
falls only to calibration.

## Estimating uncertainty

Every instrument contributes what its maker specifies - the multimeter
lesson's percent-of-reading plus digits is an uncertainty budget line
item. Resolution contributes half a least count. Repeated readings
contribute their standard deviation. When a result is computed from
several measured quantities, uncertainties **propagate**: for sums and
differences, absolute uncertainties add (in quadrature when independent
- the square root of the sum of squares); for products and quotients,
relative uncertainties combine the same way. So a resistance from V/I
with 1 percent on each is uncertain by about 1.4 percent, and Module
2's P = V-squared/R doubles voltage's relative contribution - powers
multiply relative uncertainty by the exponent.

The discipline in practice: budget before measuring (which term
dominates? improve that one, ignore the rest), quote results to digits
the uncertainty supports and no more, and let component tolerance
propagate through designs the same way - the divider built from 1
percent resistors is a 1.4 percent divider, which either meets the
ADC's honest bits from Module 12 or does not. Stating that plainly is
what separates engineering from optimism.
