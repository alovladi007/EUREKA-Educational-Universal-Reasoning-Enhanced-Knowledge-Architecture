/**
 * OCTET Phase 3 visualization components.
 *
 * Every component here is a client component that takes its data as props and
 * calls no API of its own. The page fetches, these render.
 */

export { default as PeriodicTable } from './PeriodicTable';
export type {
  ElementData,
  PeriodicTableProps,
  PeriodicTrend,
} from './PeriodicTable';

export { default as MolViewer } from './MolViewer';
export type { MolViewerProps, MolStyle } from './MolViewer';

export { default as Sketcher } from './Sketcher';
export type { SketcherProps } from './Sketcher';

export { default as TriangleView } from './TriangleView';
export type {
  TriangleViewProps,
  TriangleMacroscopic,
  TriangleParticulate,
  TriangleSymbolic,
} from './TriangleView';

export { default as Simulator } from './Simulator';
export type {
  SimulatorProps,
  SimulatorPhase,
  SimulatorScenario,
  SeriesPoint,
} from './Simulator';
