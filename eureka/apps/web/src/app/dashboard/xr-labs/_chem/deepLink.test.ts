/**
 * Checks on the OCTET-to-lab deep link table.
 *
 * The failure this file exists to catch is silent. A node mapped to a mode a
 * lab does not have, or a node listed twice under two different modes, does not
 * throw: the learner simply arrives somewhere other than the view the lesson
 * was sending them to, and nothing anywhere reports it. Neither is visible by
 * reading the table, because both look exactly like a correct entry.
 */

import { describe, expect, it } from 'vitest';

import { POE_ITEMS, SCENARIOS, TRIANGLE_VIEWS } from './chemContent';
import {
  GENERAL_DEEP_LINKS,
  GENERAL_MODES,
  MOLECULES_DEEP_LINKS,
  MOLECULES_MODES,
  benchSelectionFor,
  resolveGeneralDeepLink,
  resolveMoleculesDeepLink,
  teachingKey,
} from './deepLink';

const LABS = [
  {
    name: 'molecules',
    groups: MOLECULES_DEEP_LINKS,
    modes: MOLECULES_MODES as readonly string[],
    resolve: resolveMoleculesDeepLink as (n: string) => { mode: string } | null,
  },
  {
    name: 'general-chemistry',
    groups: GENERAL_DEEP_LINKS,
    modes: GENERAL_MODES as readonly string[],
    resolve: resolveGeneralDeepLink as (n: string) => { mode: string } | null,
  },
];

describe('the deep link table', () => {
  LABS.forEach((lab) => {
    it(`${lab.name}: every entry names a mode that lab has`, () => {
      lab.groups.forEach((g) => {
        expect(lab.modes, `${lab.name} has no mode "${g.mode}"`).toContain(
          g.mode,
        );
      });
    });

    it(`${lab.name}: every node in the table resolves to its own mode`, () => {
      lab.groups.forEach((g) => {
        g.nodes.forEach((node) => {
          const target = lab.resolve(node);
          expect(target, `${node} resolved to nothing`).not.toBeNull();
          expect(target!.mode, node).toBe(g.mode);
        });
      });
    });

    it(`${lab.name}: names no node twice`, () => {
      // A node under two modes is not a type error and not a runtime error. It
      // silently resolves to whichever mode happens to be listed first.
      const all = lab.groups.flatMap((g) => g.nodes);
      const seen = new Map<string, string[]>();
      lab.groups.forEach((g) => {
        g.nodes.forEach((n) => seen.set(n, [...(seen.get(n) ?? []), g.mode]));
      });
      const dupes = [...seen.entries()].filter(([, modes]) => modes.length > 1);
      expect(dupes, `duplicated: ${JSON.stringify(dupes)}`).toEqual([]);
      expect(new Set(all).size).toBe(all.length);
    });

    it(`${lab.name}: uses well-formed OCTET node codes`, () => {
      lab.groups.forEach((g) => {
        g.nodes.forEach((n) => expect(n, n).toMatch(/^(GEN1|GEN2|ORG1|ORG2)\.[A-Z0-9]+$/));
      });
    });
  });
});

describe('the triangle fallback', () => {
  it('opens a node with a Johnstone view but no mode of its own in triangle', () => {
    // GEN2.EQUILIBRIUM has a view and is in no mode's list.
    const target = resolveGeneralDeepLink('GEN2.EQUILIBRIUM');
    expect(target).toEqual({ mode: 'triangle', triangleNode: 'GEN2.EQUILIBRIUM' });

    const org = resolveMoleculesDeepLink('ORG2.BENZENE');
    expect(org).toEqual({ mode: 'triangle', triangleNode: 'ORG2.BENZENE' });
  });

  it('catches every triangle-only node for the lab that carries its course', () => {
    const tabled = new Set([
      ...MOLECULES_DEEP_LINKS.flatMap((g) => g.nodes),
      ...GENERAL_DEEP_LINKS.flatMap((g) => g.nodes),
    ]);
    TRIANGLE_VIEWS.filter((v) => !tabled.has(v.node)).forEach((v) => {
      const resolver = v.course.startsWith('ORG')
        ? resolveMoleculesDeepLink
        : resolveGeneralDeepLink;
      expect(resolver(v.node), v.node).toEqual({
        mode: 'triangle',
        triangleNode: v.node,
      });
    });
  });

  it('does not offer a lab a view from the other lab\'s course', () => {
    // The organic lab lists only ORG views, so a GEN node with a view has
    // nothing to fall back to there and must reach the default instead.
    expect(TRIANGLE_VIEWS.some((v) => v.node === 'GEN1.MOLE')).toBe(true);
    expect(resolveMoleculesDeepLink('GEN1.MOLE')).toBeNull();
    expect(TRIANGLE_VIEWS.some((v) => v.node === 'ORG1.SN2')).toBe(true);
    expect(resolveGeneralDeepLink('ORG1.SN2')).toBeNull();
  });

  it('prefers the table over the fallback where a node has both', () => {
    // GEN1.VSEPR is a mode AND a Johnstone view. The mode wins.
    expect(TRIANGLE_VIEWS.some((v) => v.node === 'GEN1.VSEPR')).toBe(true);
    expect(resolveGeneralDeepLink('GEN1.VSEPR')?.mode).toBe('vsepr');
    expect(TRIANGLE_VIEWS.some((v) => v.node === 'ORG1.CHAIR')).toBe(true);
    expect(resolveMoleculesDeepLink('ORG1.CHAIR')?.mode).toBe('chair');
  });
});

describe('an unknown node', () => {
  it('returns null rather than throwing or guessing', () => {
    expect(resolveGeneralDeepLink('GEN1.NOTATHING')).toBeNull();
    expect(resolveMoleculesDeepLink('ORG9.MADEUP')).toBeNull();
    expect(resolveGeneralDeepLink('nonsense')).toBeNull();
  });

  it('treats a missing or empty node the same way', () => {
    expect(resolveGeneralDeepLink(null)).toBeNull();
    expect(resolveGeneralDeepLink(undefined)).toBeNull();
    expect(resolveGeneralDeepLink('')).toBeNull();
    expect(resolveMoleculesDeepLink(null)).toBeNull();
  });
});

describe('bench preselection', () => {
  it('opens the scenario authored against the node', () => {
    expect(resolveGeneralDeepLink('GEN2.TITRATIONWEAK')?.bench).toEqual({
      scenarioId: 'sim.titr.weak',
      poeItemId: 'poe.titr.weak-equivalence',
    });
    expect(resolveGeneralDeepLink('GEN2.TITRATIONSTRONG')?.bench?.scenarioId).toBe(
      'sim.titr.strong',
    );
  });

  it('reaches an item that owns no scenario through the one it is asked about', () => {
    // GEN2.BUFFER has no simulation. Its question is about the weak-acid curve,
    // and it is the second item on that scenario, so the switcher has to open
    // on it rather than on the first.
    const bench = resolveGeneralDeepLink('GEN2.BUFFER')?.bench;
    expect(bench).toEqual({
      scenarioId: 'sim.titr.weak',
      poeItemId: 'poe.titr.buffer-region',
    });
  });

  it('always names a scenario and item that exist', () => {
    const scenarioIds = new Set(SCENARIOS.map((s) => s.id));
    const itemIds = new Set(POE_ITEMS.map((i) => i.id));
    GENERAL_DEEP_LINKS.filter((g) => g.mode === 'bench').forEach((g) => {
      g.nodes.forEach((node) => {
        const bench = benchSelectionFor(node);
        if (!bench) return;
        expect(scenarioIds.has(bench.scenarioId), node).toBe(true);
        if (bench.poeItemId) {
          expect(itemIds.has(bench.poeItemId), node).toBe(true);
          const item = POE_ITEMS.find((i) => i.id === bench.poeItemId)!;
          // The item has to belong to the scenario it is opened alongside.
          expect(item.scenario, node).toBe(bench.scenarioId);
        }
      });
    });
  });
});

describe('teachingKey', () => {
  const catalogue = [
    { key: 'first', teaches: ['GEN1.VSEPR', 'GEN1.POLARITY'] },
    { key: 'second', teaches: ['GEN1.POLARITY'] },
    { key: 'third', teaches: [] as string[] },
  ];

  it('returns the first entry that teaches the node', () => {
    expect(teachingKey(catalogue, 'GEN1.POLARITY')).toBe('first');
    expect(teachingKey(catalogue, 'GEN1.VSEPR')).toBe('first');
  });

  it('returns null for a node nothing teaches, so the caller keeps its selection', () => {
    expect(teachingKey(catalogue, 'GEN1.LEWIS')).toBeNull();
    expect(teachingKey(catalogue, null)).toBeNull();
  });
});
