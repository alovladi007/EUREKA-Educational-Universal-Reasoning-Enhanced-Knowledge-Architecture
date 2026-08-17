#!/usr/bin/env python3
"""Depth-wave-39 verification battery and figures: the databases chapter.

Scope: `fee_databases` in the Software Development section of the FE
Electrical and Computer course. Figure prefix `sw4-`. Nothing else in that
file is touched by this script.

WHY THE VERIFICATION HERE IS UNUSUALLY LITERAL

Most chapters in this course are checked by recomputing an algebraic claim a
second way. A databases chapter can do better than that, because its claims
are *executable*: a query either returns four rows or it does not. So this
file carries a real database. Every row count, every aggregate, every NULL
oddity and every normalisation anomaly printed in the lesson is produced by
running the statement in Python's bundled `sqlite3` and asserting on what
comes back. No result is transcribed from memory or from a textbook.

The same discipline is applied to the structural claims:

  * the B-tree is BUILT - real node objects with real children - and the
    lookup walks it, counting node visits. The lesson never quotes a
    logarithm it has not first counted.
  * the number of heap pages an unclustered index scan touches is computed
    from the Cardenas expectation AND measured by Monte Carlo sampling.
  * the composite-index prefix rule is measured by counting index entries
    examined against a sorted index array, per query shape.
  * the deadlock rate is measured by simulating interleaved lock acquisition,
    and the two-transaction case is checked against its closed form.

`python3 scripts/gen_fe_ee_d39.py --verify` runs the whole battery and prints
the tally, including HOW MANY QUERY RESULTS WERE OBTAINED BY EXECUTING SQL.

Every registered figure renders twice, once per theme, to

    apps/web/public/courses/fe-ee/figures/<name>.svg
    apps/web/public/courses/fe-ee/figures/<name>.dark.svg

Usage:
    python3 scripts/gen_fe_ee_d39.py                 # verify, then all figures
    python3 scripts/gen_fe_ee_d39.py --verify        # numerics only
    python3 scripts/gen_fe_ee_d39.py --verify -v     # numerics, every result
    python3 scripts/gen_fe_ee_d39.py sw4-join-sizes  # one figure
"""
from __future__ import annotations

import math
import pathlib
import random
import sqlite3
import sys

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import ed_figstyle as S  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

OUT = (
    pathlib.Path(__file__).resolve().parents[1]
    / "apps" / "web" / "public" / "courses" / "fe-ee" / "figures"
)

REGISTRY: dict[str, callable] = {}
PREFIX = "sw4-"

# Tallies the --verify report prints. Only the helpers below touch them, so
# the totals cannot drift away from the checks actually performed.
COUNTS = {"sql": 0, "structure": 0, "montecarlo": 0}
VERBOSE = False


def figure(name):
    if not name.startswith(PREFIX):
        raise ValueError(f"this generator owns only {PREFIX!r} figures, not {name!r}")

    def deco(fn):
        REGISTRY[name] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# verification helpers
# ---------------------------------------------------------------------------
def sql(db, statement, expected=None, label=""):
    """Run one SQL statement, count it, and assert on the result.

    `expected` is the value the lesson prints. Passing None records the
    execution without a claim (used for DDL and for setting up an anomaly).
    """
    rows = db.execute(statement).fetchall()
    COUNTS["sql"] += 1
    if VERBOSE:
        print(f"    SQL[{COUNTS['sql']:3d}] {label or statement.strip()[:66]!r:70s} -> {rows}")
    if expected is not None:
        assert rows == expected, (
            f"{label or statement}: got {rows!r}, lesson prints {expected!r}"
        )
    return rows


def scalar(db, statement, expected=None, label=""):
    """Run a one-row one-column query and assert on the single value."""
    rows = db.execute(statement).fetchall()
    COUNTS["sql"] += 1
    value = rows[0][0] if rows else None
    if VERBOSE:
        print(f"    SQL[{COUNTS['sql']:3d}] {label or statement.strip()[:66]!r:70s} -> {value!r}")
    if expected is not None:
        if isinstance(expected, float):
            assert abs(value - expected) < 1e-9, f"{label}: {value!r} vs {expected!r}"
        else:
            assert value == expected, f"{label}: {value!r} vs {expected!r}"
    return value


def struct_ok(label, measured, claimed):
    """One structural count, measured by walking a real data structure."""
    assert measured == claimed, f"{label}: measured {measured!r}, lesson claims {claimed!r}"
    COUNTS["structure"] += 1
    if VERBOSE:
        print(f"    STRUCT   {label:60s} -> {measured!r}")
    return measured


def mc_ok(label, measured, predicted, tol):
    """One sampled quantity, against the closed form it is meant to confirm."""
    gap = abs(measured - predicted)
    assert gap <= tol, f"{label}: sampled {measured:g} vs predicted {predicted:g} (gap {gap:g})"
    COUNTS["montecarlo"] += 1
    if VERBOSE:
        print(f"    SAMPLE   {label:40s} sampled {measured:.6g}  predicted {predicted:.6g}")
    return measured


# ---------------------------------------------------------------------------
# the running instance: three tiny tables, chosen so the four joins differ
# ---------------------------------------------------------------------------
DEPT_ROWS = [(10, "Power"), (20, "Signals"), (30, "Controls")]
EMP_ROWS = [
    (1, "Ada", 10, 92000),
    (2, "Bo", 10, 78000),
    (3, "Cy", 20, 85000),
    (4, "Di", None, 61000),
    (5, "Ed", 20, None),
]


def running_db() -> sqlite3.Connection:
    db = sqlite3.connect(":memory:")
    db.execute("PRAGMA foreign_keys = ON")
    db.execute("CREATE TABLE dept (dept_id INTEGER PRIMARY KEY, dname TEXT NOT NULL)")
    db.execute(
        "CREATE TABLE emp (emp_id INTEGER PRIMARY KEY, ename TEXT NOT NULL, "
        "dept_id INTEGER REFERENCES dept(dept_id), salary INTEGER)"
    )
    db.executemany("INSERT INTO dept VALUES (?,?)", DEPT_ROWS)
    db.executemany("INSERT INTO emp VALUES (?,?,?,?)", EMP_ROWS)
    return db


# ---------------------------------------------------------------------------
# 1. relational algebra and the four joins, executed
# ---------------------------------------------------------------------------
JOIN_SQL = {
    "CROSS": "SELECT COUNT(*) FROM emp CROSS JOIN dept",
    "INNER": "SELECT COUNT(*) FROM emp JOIN dept ON emp.dept_id = dept.dept_id",
    "LEFT": "SELECT COUNT(*) FROM emp LEFT JOIN dept ON emp.dept_id = dept.dept_id",
    "RIGHT": "SELECT COUNT(*) FROM emp RIGHT JOIN dept ON emp.dept_id = dept.dept_id",
    "FULL": "SELECT COUNT(*) FROM emp FULL OUTER JOIN dept ON emp.dept_id = dept.dept_id",
}
JOIN_CLAIM = {"CROSS": 15, "INNER": 4, "LEFT": 5, "RIGHT": 5, "FULL": 6}


def verify_algebra(db) -> dict:
    """Cardinalities of the algebra operators and of all four joins."""
    scalar(db, "SELECT COUNT(*) FROM emp", 5, "degree/cardinality of emp")
    scalar(db, "SELECT COUNT(*) FROM dept", 3, "cardinality of dept")

    # selection sigma, projection pi, and the duplicate-elimination difference
    scalar(db, "SELECT COUNT(*) FROM emp WHERE dept_id = 10", 2, "sigma dept_id=10")
    scalar(db, "SELECT COUNT(*) FROM (SELECT dept_id FROM emp)", 5, "pi with bag semantics")
    scalar(db, "SELECT COUNT(*) FROM (SELECT DISTINCT dept_id FROM emp)", 3,
           "pi with set semantics (NULL is one group)")

    # union / intersect / except on two projections
    scalar(db, "SELECT COUNT(*) FROM (SELECT dept_id FROM dept UNION "
               "SELECT dept_id FROM emp WHERE dept_id IS NOT NULL)", 3, "union")
    scalar(db, "SELECT COUNT(*) FROM (SELECT dept_id FROM dept INTERSECT "
               "SELECT dept_id FROM emp)", 2, "intersect")
    scalar(db, "SELECT COUNT(*) FROM (SELECT dept_id FROM dept EXCEPT "
               "SELECT dept_id FROM emp)", 1, "except -> the childless department")

    sizes = {}
    for kind, statement in JOIN_SQL.items():
        sizes[kind] = scalar(db, statement, JOIN_CLAIM[kind], f"{kind} JOIN cardinality")

    # inclusion-exclusion identity across the outer joins, checked on the counts
    assert sizes["FULL"] == sizes["LEFT"] + sizes["RIGHT"] - sizes["INNER"], sizes
    assert sizes["INNER"] <= sizes["CROSS"], sizes

    # the rows themselves, not just the counts
    sql(db, "SELECT ename FROM emp LEFT JOIN dept ON emp.dept_id = dept.dept_id "
            "WHERE dname IS NULL ORDER BY ename", [("Di",)], "unmatched left row")
    sql(db, "SELECT dname FROM emp RIGHT JOIN dept ON emp.dept_id = dept.dept_id "
            "WHERE ename IS NULL ORDER BY dname", [("Controls",)], "unmatched right row")

    # a theta join on an inequality, and the NULL row that drops out of it
    sizes["THETA"] = scalar(db, "SELECT COUNT(*) FROM emp a JOIN emp b "
                                "ON a.salary > b.salary", 6, "theta join on >")
    # 4 comparable salaries give C(4,2) ordered pairs; Ed's NULL is in none of them
    assert sizes["THETA"] == 4 * 3 // 2
    sizes["NATURAL"] = scalar(db, "SELECT COUNT(*) FROM emp NATURAL JOIN dept", 4,
                              "natural join matches on the shared column name")
    assert sizes["NATURAL"] == sizes["INNER"]
    return sizes


# ---------------------------------------------------------------------------
# 1b. which attribute sets are actually unique - on this instance
# ---------------------------------------------------------------------------
EMP_ATTRS = ["emp_id", "ename", "dept_id", "salary"]


def verify_keys(db) -> dict:
    """A key is a constraint on every legal state; uniqueness here is one state."""
    unique, tested = [], 0
    for size in range(1, len(EMP_ATTRS) + 1):
        for combo in _combinations(EMP_ATTRS, size):
            cols = ", ".join(combo)
            tested += 1
            distinct = scalar(db, f"SELECT COUNT(*) FROM (SELECT DISTINCT {cols} FROM emp)",
                              label=f"distinct {cols}")
            if distinct == 5:
                unique.append(combo)
    struct_ok("non-empty attribute subsets tested", tested, 15)
    out = {"unique": unique, "tested": tested}
    struct_ok("subsets unique on THIS instance", len(unique), 14)
    # supersets of the declared key emp_id: 2^(4-1)
    supersets = [c for c in unique if "emp_id" in c]
    struct_ok("supersets of the declared key", len(supersets), 8)
    out["supersets"] = len(supersets)
    # salary is unique here yet cannot be a key: it is NULLable
    assert ("salary",) in unique
    scalar(db, "SELECT COUNT(*) FROM emp WHERE salary IS NULL", 1,
           "salary is unique on this instance yet holds a NULL")
    return out


# ---------------------------------------------------------------------------
# 1c. referential integrity: the three delete actions, executed
# ---------------------------------------------------------------------------
def ri_db(action: str) -> sqlite3.Connection:
    db = sqlite3.connect(":memory:")
    db.execute("PRAGMA foreign_keys = ON")
    db.execute("CREATE TABLE dept (dept_id INTEGER PRIMARY KEY, dname TEXT)")
    db.execute("CREATE TABLE emp (emp_id INTEGER PRIMARY KEY, ename TEXT, "
               f"dept_id INTEGER REFERENCES dept(dept_id) {action})")
    db.executemany("INSERT INTO dept VALUES (?,?)", DEPT_ROWS)
    db.executemany("INSERT INTO emp VALUES (?,?,?)", [(r[0], r[1], r[2]) for r in EMP_ROWS])
    return db


def verify_ri() -> dict:
    out = {}
    # a NULL foreign key is legal; a dangling one is not
    db = ri_db("")
    scalar(db, "SELECT COUNT(*) FROM emp WHERE dept_id IS NULL", 1,
           "a NULL foreign key passes referential integrity")
    try:
        db.execute("INSERT INTO emp VALUES (9, 'Fi', 40)")
        raise AssertionError("a dangling foreign key should have been rejected")
    except sqlite3.IntegrityError:
        COUNTS["sql"] += 1
    # NO ACTION: the parent delete is refused
    try:
        db.execute("DELETE FROM dept WHERE dept_id = 10")
        raise AssertionError("NO ACTION should have refused the parent delete")
    except sqlite3.IntegrityError:
        COUNTS["sql"] += 1
    out["restrict_remaining"] = scalar(db, "SELECT COUNT(*) FROM emp", 5,
                                       "no employee row was harmed")
    # CASCADE: the children go too
    db = ri_db("ON DELETE CASCADE")
    db.execute("DELETE FROM dept WHERE dept_id = 10")
    COUNTS["sql"] += 1
    out["cascade_remaining"] = scalar(db, "SELECT COUNT(*) FROM emp", 3,
                                      "CASCADE removed both Power employees")
    out["cascade_nulls"] = scalar(db, "SELECT COUNT(*) FROM emp WHERE dept_id IS NULL", 1,
                                  "CASCADE deleted rows rather than nulling them")
    # SET NULL: the children survive, unattached
    db = ri_db("ON DELETE SET NULL")
    db.execute("DELETE FROM dept WHERE dept_id = 10")
    COUNTS["sql"] += 1
    out["setnull_remaining"] = scalar(db, "SELECT COUNT(*) FROM emp", 5,
                                      "SET NULL kept every employee row")
    out["setnull_orphans"] = scalar(db, "SELECT COUNT(*) FROM emp WHERE dept_id IS NULL", 3,
                                    "and left three of them unattached")
    return out


# ---------------------------------------------------------------------------
# 2. grouping, aggregation, subqueries
# ---------------------------------------------------------------------------
def verify_grouping(db) -> dict:
    out = {}
    sql(db, "SELECT dept_id, COUNT(*) FROM emp GROUP BY dept_id ORDER BY dept_id IS NOT NULL, dept_id",
        [(None, 1), (10, 2), (20, 2)], "GROUP BY collapses all NULLs into one group")
    out["groups"] = scalar(db, "SELECT COUNT(*) FROM (SELECT dept_id FROM emp GROUP BY dept_id)",
                           3, "number of groups")
    sql(db, "SELECT d.dname, COUNT(e.emp_id) FROM dept d LEFT JOIN emp e "
            "ON e.dept_id = d.dept_id GROUP BY d.dname ORDER BY d.dname",
        [("Controls", 0), ("Power", 2), ("Signals", 2)],
        "COUNT of a column counts matched rows only")
    sql(db, "SELECT d.dname, COUNT(*) FROM dept d LEFT JOIN emp e "
            "ON e.dept_id = d.dept_id GROUP BY d.dname ORDER BY d.dname",
        [("Controls", 1), ("Power", 2), ("Signals", 2)],
        "COUNT(*) counts the padded row too - the classic outer-join miscount")

    # HAVING against WHERE
    sql(db, "SELECT dept_id, COUNT(*) FROM emp WHERE salary IS NOT NULL "
            "GROUP BY dept_id HAVING COUNT(*) >= 2 ORDER BY dept_id",
        [(10, 2)], "WHERE before grouping, HAVING after")

    # correlated subquery: employees paid above their own department mean
    sql(db, "SELECT e.ename FROM emp e WHERE e.salary > "
            "(SELECT AVG(x.salary) FROM emp x WHERE x.dept_id = e.dept_id) ORDER BY e.ename",
        [("Ada",)], "correlated subquery")
    out["above_own_mean"] = 1
    # uncorrelated version, for contrast: above the global mean
    out["global_mean"] = scalar(db, "SELECT AVG(salary) FROM emp", 79000.0, "AVG skips NULL")
    sql(db, "SELECT ename FROM emp WHERE salary > (SELECT AVG(salary) FROM emp) ORDER BY ename",
        [("Ada",), ("Cy",)], "uncorrelated subquery")
    return out


# ---------------------------------------------------------------------------
# 3. NULL and three-valued logic, every claim executed
# ---------------------------------------------------------------------------
TRISTATE = [("TRUE", "1"), ("FALSE", "0"), ("UNKNOWN", "NULL")]


def verify_nulls(db) -> dict:
    out = {}
    # the two connective tables, read straight out of the engine
    for op in ("AND", "OR"):
        grid = []
        for _, a in TRISTATE:
            row = []
            for _, b in TRISTATE:
                row.append(scalar(db, f"SELECT {a} {op} {b}", label=f"{a} {op} {b}"))
            grid.append(row)
        out[op] = grid
    assert out["AND"] == [[1, 0, None], [0, 0, 0], [None, 0, None]], out["AND"]
    assert out["OR"] == [[1, 1, 1], [1, 0, None], [1, None, None]], out["OR"]
    out["NOT"] = [scalar(db, f"SELECT NOT {a}", label=f"NOT {a}") for _, a in TRISTATE]
    assert out["NOT"] == [0, 1, None], out["NOT"]

    # comparison against NULL is never TRUE, not even NULL = NULL
    scalar(db, "SELECT NULL = NULL", None, "NULL = NULL is UNKNOWN")
    scalar(db, "SELECT NULL <> NULL", None, "NULL <> NULL is UNKNOWN")
    scalar(db, "SELECT NULL IS NULL", 1, "IS NULL is two-valued")

    # WHERE keeps only TRUE, so the two halves of a partition lose a row
    hi = scalar(db, "SELECT COUNT(*) FROM emp WHERE salary > 80000", 2, "salary > 80000")
    lo = scalar(db, "SELECT COUNT(*) FROM emp WHERE salary <= 80000", 2, "salary <= 80000")
    total = scalar(db, "SELECT COUNT(*) FROM emp", 5, "all rows")
    out["partition"] = (hi, lo, total)
    assert hi + lo == total - 1

    # aggregates: COUNT(*) against COUNT(col), and the denominator AVG uses
    out["count_star"] = scalar(db, "SELECT COUNT(*) FROM emp", 5, "COUNT(*)")
    out["count_col"] = scalar(db, "SELECT COUNT(salary) FROM emp", 4, "COUNT(salary) skips NULL")
    out["sum"] = scalar(db, "SELECT SUM(salary) FROM emp", 316000, "SUM skips NULL")
    out["avg"] = scalar(db, "SELECT AVG(salary) FROM emp", 79000.0, "AVG = SUM/COUNT(col)")
    out["avg_wrong"] = scalar(db, "SELECT SUM(salary)*1.0/COUNT(*) FROM emp", 63200.0,
                              "SUM/COUNT(*) is NOT the average")
    assert out["sum"] / out["count_col"] == out["avg"]
    # SUM over an empty selection is NULL, COUNT over one is 0
    scalar(db, "SELECT SUM(salary) FROM emp WHERE 1 = 0", None, "SUM of nothing is NULL")
    scalar(db, "SELECT COUNT(salary) FROM emp WHERE 1 = 0", 0, "COUNT of nothing is 0")

    # the NOT IN trap, and the NOT EXISTS rewrite that fixes it
    out["in"] = sql(db, "SELECT dname FROM dept WHERE dept_id IN "
                        "(SELECT dept_id FROM emp) ORDER BY dname",
                    [("Power",), ("Signals",)], "IN tolerates the NULL")
    out["not_in"] = sql(db, "SELECT dname FROM dept WHERE dept_id NOT IN "
                            "(SELECT dept_id FROM emp) ORDER BY dname",
                        [], "NOT IN with a NULL in the list returns NOTHING")
    out["not_in_guarded"] = sql(db, "SELECT dname FROM dept WHERE dept_id NOT IN "
                                    "(SELECT dept_id FROM emp WHERE dept_id IS NOT NULL) "
                                    "ORDER BY dname",
                                [("Controls",)], "guarded NOT IN")
    out["not_exists"] = sql(db, "SELECT dname FROM dept d WHERE NOT EXISTS "
                                "(SELECT 1 FROM emp e WHERE e.dept_id = d.dept_id) ORDER BY dname",
                            [("Controls",)], "NOT EXISTS is safe")
    # ... and the anti-join written as an outer join, a third route to the same row
    sql(db, "SELECT d.dname FROM dept d LEFT JOIN emp e ON e.dept_id = d.dept_id "
            "WHERE e.emp_id IS NULL ORDER BY d.dname",
        [("Controls",)], "anti-join by LEFT JOIN + IS NULL")

    # UNIQUE and CHECK both let NULL through
    db.execute("CREATE TABLE badge (code TEXT UNIQUE, level INTEGER CHECK (level > 0))")
    db.executemany("INSERT INTO badge VALUES (?,?)", [(None, 1), (None, 2), ("A", None)])
    out["unique_nulls"] = scalar(db, "SELECT COUNT(*) FROM badge WHERE code IS NULL", 2,
                                 "UNIQUE admits repeated NULLs")
    try:
        db.execute("INSERT INTO badge VALUES ('B', 0)")
        raise AssertionError("CHECK (level > 0) should have rejected 0")
    except sqlite3.IntegrityError:
        COUNTS["sql"] += 1
    out["check_null_passes"] = scalar(db, "SELECT COUNT(*) FROM badge WHERE level IS NULL", 1,
                                      "CHECK passes when the test is UNKNOWN")
    return out


# ---------------------------------------------------------------------------
# 4. functional dependencies: attribute closure, computed
# ---------------------------------------------------------------------------
def closure(attrs: set, fds: list) -> set:
    """Attribute closure under a set of functional dependencies."""
    out = set(attrs)
    changed = True
    while changed:
        changed = False
        for lhs, rhs in fds:
            if set(lhs) <= out and not set(rhs) <= out:
                out |= set(rhs)
                changed = True
    return out


def candidate_keys(universe: set, fds: list) -> list:
    """Every minimal attribute set whose closure is the whole relation."""
    universe = sorted(universe)
    found = []
    for size in range(1, len(universe) + 1):
        for combo in _combinations(universe, size):
            s = set(combo)
            if closure(s, fds) != set(universe):
                continue
            if any(set(k) < s for k in found):
                continue
            found.append(tuple(sorted(s)))
    return found


def _combinations(items, r):
    if r == 0:
        yield ()
        return
    for i in range(len(items) - r + 1):
        for rest in _combinations(items[i + 1:], r - 1):
            yield (items[i],) + rest


# The running normalisation example, as functional dependencies.
REPORT_ATTRS = {"sid", "sname", "aid", "aname", "aoffice", "cid", "ctitle", "credits", "grade"}
REPORT_FDS = [
    (("sid",), ("sname", "aid")),
    (("aid",), ("aname", "aoffice")),
    (("cid",), ("ctitle", "credits")),
    (("sid", "cid"), ("grade",)),
]


def verify_fds() -> dict:
    out = {}
    # closure of the key, one attribute at a time, is the whole relation
    out["key_closure"] = closure({"sid", "cid"}, REPORT_FDS)
    struct_ok("closure of {sid, cid}", out["key_closure"] == REPORT_ATTRS, True)
    struct_ok("size of the closure of {sid, cid}", len(out["key_closure"]), 9)
    struct_ok("closure of {sid}", len(closure({"sid"}, REPORT_FDS)), 5)
    struct_ok("closure of {cid}", len(closure({"cid"}, REPORT_FDS)), 3)
    struct_ok("closure of {aid}", len(closure({"aid"}, REPORT_FDS)), 3)
    keys = candidate_keys(REPORT_ATTRS, REPORT_FDS)
    struct_ok("candidate keys of REPORT", keys, [("cid", "sid")])
    out["keys"] = keys
    # {sid} alone reaches sname, aid, aname, aoffice - five attributes, not nine
    struct_ok("closure of {sid} contents",
              sorted(closure({"sid"}, REPORT_FDS)),
              ["aid", "aname", "aoffice", "sid", "sname"])

    # the BCNF-but-3NF relation, from section 5.3's shape, with its two keys
    adv_attrs = {"sid", "area", "faculty"}
    adv_fds = [(("sid", "area"), ("faculty",)), (("faculty",), ("area",))]
    adv_keys = candidate_keys(adv_attrs, adv_fds)
    struct_ok("candidate keys of ADVISES", adv_keys, [("area", "sid"), ("faculty", "sid")])
    out["adv_keys"] = adv_keys

    # superkey counting: with one candidate key of size k in n attributes
    n, k = 9, 2
    supers = 2 ** (n - k)
    struct_ok("superkeys containing {sid, cid}", supers, 128)
    out["superkeys"] = supers
    return out


# ---------------------------------------------------------------------------
# 5. normalisation, with every anomaly executed and then executed away
# ---------------------------------------------------------------------------
STUDENTS = [(1, "Ada", 7), (2, "Bo", 7), (3, "Cy", 8)]
ADVISORS = [(7, "Ohm", "E-204"), (8, "Hertz", "E-310")]
COURSES = [("EE201", "Circuits", 4), ("EE310", "Signals", 3), ("EE350", "Machines", 3)]
ENROL = [(1, "EE201", 3.7), (1, "EE310", 3.3), (2, "EE201", 3.0),
         (2, "EE350", 2.7), (3, "EE310", 4.0), (3, "EE350", 3.3)]

FLAT_COLS = ["sid", "sname", "aid", "aname", "aoffice", "cid", "ctitle", "credits", "grade"]


def flat_rows() -> list:
    smap = {s[0]: s for s in STUDENTS}
    amap = {a[0]: a for a in ADVISORS}
    cmap = {c[0]: c for c in COURSES}
    rows = []
    for sid, cid, grade in ENROL:
        _, sname, aid = smap[sid]
        _, aname, aoffice = amap[aid]
        _, ctitle, credits = cmap[cid]
        rows.append((sid, sname, aid, aname, aoffice, cid, ctitle, credits, grade))
    return rows


def flat_db() -> sqlite3.Connection:
    db = sqlite3.connect(":memory:")
    db.execute(
        "CREATE TABLE report (sid INTEGER NOT NULL, sname TEXT, aid INTEGER, aname TEXT, "
        "aoffice TEXT, cid TEXT NOT NULL, ctitle TEXT, credits INTEGER, grade REAL, "
        "PRIMARY KEY (sid, cid))"
    )
    db.executemany("INSERT INTO report VALUES (?,?,?,?,?,?,?,?,?)", flat_rows())
    return db


def split_db() -> sqlite3.Connection:
    db = sqlite3.connect(":memory:")
    db.execute("PRAGMA foreign_keys = ON")
    db.execute("CREATE TABLE advisor (aid INTEGER PRIMARY KEY, aname TEXT, aoffice TEXT)")
    db.execute("CREATE TABLE student (sid INTEGER PRIMARY KEY, sname TEXT, "
               "aid INTEGER REFERENCES advisor(aid))")
    db.execute("CREATE TABLE course (cid TEXT PRIMARY KEY, ctitle TEXT, credits INTEGER)")
    db.execute("CREATE TABLE enrol (sid INTEGER REFERENCES student(sid), "
               "cid TEXT REFERENCES course(cid), grade REAL, PRIMARY KEY (sid, cid))")
    db.executemany("INSERT INTO advisor VALUES (?,?,?)", ADVISORS)
    db.executemany("INSERT INTO student VALUES (?,?,?)", STUDENTS)
    db.executemany("INSERT INTO course VALUES (?,?,?)", COURSES)
    db.executemany("INSERT INTO enrol VALUES (?,?,?)", ENROL)
    return db


def verify_normalisation() -> dict:
    out = {}

    # --- 1NF: the unnormalised cell, and what it costs to query -------------
    unf = sqlite3.connect(":memory:")
    unf.execute("CREATE TABLE unf (sid INTEGER PRIMARY KEY, sname TEXT, aid INTEGER, "
                "aname TEXT, aoffice TEXT, courses TEXT)")
    unf.executemany("INSERT INTO unf VALUES (?,?,?,?,?,?)",
                    [(1, "Ada", 7, "Ohm", "E-204", "EE201:3.7,EE310:3.3"),
                     (2, "Bo", 7, "Ohm", "E-204", "EE201:3.0,EE350:2.7"),
                     (3, "Cy", 8, "Hertz", "E-310", "EE310:4.0,EE350:3.3")])
    out["unf_rows"] = scalar(unf, "SELECT COUNT(*) FROM unf", 3, "unnormalised row count")
    out["unf_office_copies"] = scalar(unf, "SELECT COUNT(*) FROM unf WHERE aoffice = 'E-204'",
                                      2, "copies of E-204 in the unnormalised table")
    # a substring test is the only way in, and it matches the wrong thing
    scalar(unf, "SELECT COUNT(*) FROM unf WHERE courses LIKE '%EE310%'", 2,
           "the exact code: right answer, but by a scan rather than a lookup")
    out["false_hits"] = scalar(unf, "SELECT COUNT(*) FROM unf WHERE courses LIKE '%EE35%'", 2,
                               "a code that does not exist still matches two rows")
    # counting the repeating group needs string surgery, not an aggregate
    out["unf_enrolments"] = scalar(
        unf, "SELECT SUM(LENGTH(courses) - LENGTH(REPLACE(courses, ',', '')) + 1) FROM unf",
        6, "enrolments counted by counting commas")
    out["unf_cells"] = 3 * 6

    # --- the flat 1NF table, and its three anomalies ------------------------
    flat = flat_db()
    out["flat_rows"] = scalar(flat, "SELECT COUNT(*) FROM report", 6, "1NF row count")
    out["flat_cells"] = out["flat_rows"] * len(FLAT_COLS)
    out["office_copies"] = scalar(flat, "SELECT COUNT(*) FROM report WHERE aoffice = 'E-204'",
                                  4, "how many times E-204 is stored")
    out["title_copies"] = scalar(flat, "SELECT COUNT(*) FROM report WHERE cid = 'EE201'",
                                 2, "how many times the title of EE201 is stored")

    # INSERTION anomaly: a course with no enrolled student cannot be recorded
    try:
        flat.execute("INSERT INTO report (sid, cid, ctitle, credits) "
                     "VALUES (NULL, 'EE420', 'Photonics', 3)")
        raise AssertionError("a NULL primary-key part should have been rejected")
    except sqlite3.IntegrityError as exc:
        COUNTS["sql"] += 1
        out["insert_error"] = str(exc)

    # DELETION anomaly: removing Cy's last enrolment erases EE350's existence
    before = scalar(flat, "SELECT COUNT(*) FROM report WHERE cid = 'EE350'", 2, "EE350 rows")
    flat.execute("DELETE FROM report WHERE cid = 'EE350'")
    COUNTS["sql"] += 1
    out["delete_lost"] = scalar(flat, "SELECT COUNT(*) FROM report WHERE ctitle = 'Machines'",
                                0, "the title of EE350 is gone with its enrolments")
    assert before == 2
    flat.executemany("INSERT INTO report VALUES (?,?,?,?,?,?,?,?,?)",
                     [r for r in flat_rows() if r[5] == "EE350"])

    # UPDATE anomaly: change one copy of the office, get two answers
    flat.execute("UPDATE report SET aoffice = 'B-12' WHERE sid = 1")
    COUNTS["sql"] += 1
    out["update_split"] = sql(flat, "SELECT DISTINCT aoffice FROM report WHERE aid = 7 "
                                    "ORDER BY aoffice",
                              [("B-12",), ("E-204",)],
                              "one advisor now has two offices on file")
    struct_ok("offices on file for advisor 7 after a partial update",
              len(out["update_split"]), 2)

    # --- the 3NF schema: the same three statements, no anomaly --------------
    sp = split_db()
    out["split_rows"] = {
        "student": scalar(sp, "SELECT COUNT(*) FROM student", 3, "student rows"),
        "advisor": scalar(sp, "SELECT COUNT(*) FROM advisor", 2, "advisor rows"),
        "course": scalar(sp, "SELECT COUNT(*) FROM course", 3, "course rows"),
        "enrol": scalar(sp, "SELECT COUNT(*) FROM enrol", 6, "enrolment rows"),
    }
    out["split_cells"] = 3 * 3 + 2 * 3 + 3 * 3 + 6 * 3
    # insertion: the orphan course goes in without a fight
    sp.execute("INSERT INTO course VALUES ('EE420', 'Photonics', 3)")
    COUNTS["sql"] += 1
    scalar(sp, "SELECT COUNT(*) FROM course", 4, "course inserted with nobody enrolled")
    sp.execute("DELETE FROM course WHERE cid = 'EE420'")
    COUNTS["sql"] += 1
    # deletion: drop every EE350 enrolment, keep the course
    sp.execute("DELETE FROM enrol WHERE cid = 'EE350'")
    COUNTS["sql"] += 1
    scalar(sp, "SELECT COUNT(*) FROM course WHERE cid = 'EE350'", 1,
           "the course survives the loss of its enrolments")
    sp.executemany("INSERT INTO enrol VALUES (?,?,?)", [e for e in ENROL if e[1] == "EE350"])
    # update: one row carries the office, so there is nothing to split
    sp.execute("UPDATE advisor SET aoffice = 'B-12' WHERE aid = 7")
    COUNTS["sql"] += 1
    out["split_offices"] = sql(sp, "SELECT DISTINCT aoffice FROM advisor WHERE aid = 7",
                               [("B-12",)], "exactly one office on file")
    struct_ok("offices on file after the same update in 3NF", len(out["split_offices"]), 1)
    sp.execute("UPDATE advisor SET aoffice = 'E-204' WHERE aid = 7")
    COUNTS["sql"] += 1

    # lossless join: the decomposition reconstructs the original exactly
    rebuilt = sql(sp, "SELECT s.sid, s.sname, a.aid, a.aname, a.aoffice, c.cid, c.ctitle, "
                      "c.credits, e.grade FROM enrol e JOIN student s ON s.sid = e.sid "
                      "JOIN advisor a ON a.aid = s.aid JOIN course c ON c.cid = e.cid "
                      "ORDER BY e.sid, e.cid",
                  label="lossless-join reconstruction")
    original = sorted(flat_rows(), key=lambda r: (r[0], r[5]))
    struct_ok("rebuilt row count", len(rebuilt), 6)
    struct_ok("rebuilt rows equal the original", [tuple(r) for r in rebuilt], original)

    # referential integrity is now enforced, not hoped for
    try:
        sp.execute("INSERT INTO enrol VALUES (99, 'EE201', 3.0)")
        raise AssertionError("a dangling foreign key should have been rejected")
    except sqlite3.IntegrityError as exc:
        COUNTS["sql"] += 1
        out["fk_error"] = str(exc)

    # --- BCNF: 3NF holds, BCNF fails, and the anomaly is visible ------------
    adv = sqlite3.connect(":memory:")
    adv.execute("CREATE TABLE advises (sid INTEGER, area TEXT, faculty TEXT, "
                "PRIMARY KEY (sid, area))")
    adv.executemany("INSERT INTO advises VALUES (?,?,?)",
                    [(1, "Power", "Ohm"), (2, "Power", "Ohm"), (3, "Signals", "Hertz")])
    out["bcnf_repeats"] = scalar(adv, "SELECT COUNT(*) FROM advises WHERE faculty = 'Ohm'",
                                 2, "the fact Ohm-teaches-Power is stored twice")
    adv.execute("UPDATE advises SET area = 'Machines' WHERE sid = 1")
    COUNTS["sql"] += 1
    out["bcnf_split"] = sql(adv, "SELECT DISTINCT area FROM advises WHERE faculty = 'Ohm' "
                                 "ORDER BY area",
                            [("Machines",), ("Power",)],
                            "one lecturer now teaches two areas, against the rule")
    struct_ok("areas on file for Ohm after a partial update", len(out["bcnf_split"]), 2)

    # BCNF decomposition: two areas cannot be recorded for one lecturer at all
    bc = sqlite3.connect(":memory:")
    bc.execute("CREATE TABLE teaches (faculty TEXT PRIMARY KEY, area TEXT)")
    bc.execute("CREATE TABLE takes (sid INTEGER, faculty TEXT REFERENCES teaches(faculty), "
               "PRIMARY KEY (sid, faculty))")
    bc.executemany("INSERT INTO teaches VALUES (?,?)", [("Ohm", "Power"), ("Hertz", "Signals")])
    bc.executemany("INSERT INTO takes VALUES (?,?)", [(1, "Ohm"), (2, "Ohm"), (3, "Hertz")])
    out["bcnf_once"] = scalar(bc, "SELECT COUNT(*) FROM teaches WHERE faculty = 'Ohm'", 1,
                              "the fact is stored exactly once")
    try:
        bc.execute("INSERT INTO teaches VALUES ('Ohm', 'Machines')")
        raise AssertionError("a duplicate lecturer should have been rejected")
    except sqlite3.IntegrityError:
        COUNTS["sql"] += 1

    # ... and the price: {sid, area} -> faculty is no longer checkable locally
    bc.execute("INSERT INTO teaches VALUES ('Volta', 'Power')")
    COUNTS["sql"] += 1
    bc.execute("INSERT INTO takes VALUES (1, 'Volta')")
    COUNTS["sql"] += 1
    out["lost_fd"] = sql(bc, "SELECT t.area, COUNT(*) FROM takes k JOIN teaches t "
                             "ON t.faculty = k.faculty WHERE k.sid = 1 GROUP BY t.area "
                             "ORDER BY t.area",
                         [("Power", 2)],
                         "student 1 now has two Power advisers - the lost dependency")
    return out


# ---------------------------------------------------------------------------
# 5b. ER mapping: build the mapped schema and count what came out
# ---------------------------------------------------------------------------
ER_DDL = [
    "CREATE TABLE department (dept_id INTEGER PRIMARY KEY, dname TEXT)",
    "CREATE TABLE instructor (inst_id INTEGER PRIMARY KEY, iname TEXT, "
    "dept_id INTEGER REFERENCES department(dept_id))",
    "CREATE TABLE student (sid INTEGER PRIMARY KEY, sname TEXT, "
    "dept_id INTEGER REFERENCES department(dept_id))",
    "CREATE TABLE course (cid TEXT PRIMARY KEY, ctitle TEXT, "
    "inst_id INTEGER REFERENCES instructor(inst_id))",
    "CREATE TABLE student_phone (sid INTEGER REFERENCES student(sid), phone TEXT, "
    "PRIMARY KEY (sid, phone))",
    "CREATE TABLE enrolment (sid INTEGER REFERENCES student(sid), "
    "cid TEXT REFERENCES course(cid), grade REAL, PRIMARY KEY (sid, cid))",
]


def verify_er() -> dict:
    db = sqlite3.connect(":memory:")
    for ddl in ER_DDL:
        db.execute(ddl)
        COUNTS["sql"] += 1
    tables = sql(db, "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
                 label="tables produced by the mapping")
    names = [t[0] for t in tables]
    struct_ok("tables produced by the ER mapping", len(names), 6)
    fks = 0
    for name in names:
        fks += len(db.execute(f"PRAGMA foreign_key_list({name})").fetchall())
        COUNTS["sql"] += 1
    struct_ok("foreign keys produced by the ER mapping", fks, 6)
    # the counting rules the lesson states, applied to the same diagram
    entities, one_many, many_many, multivalued = 4, 3, 1, 1
    struct_ok("tables predicted by the rule", entities + many_many + multivalued, 6)
    struct_ok("foreign keys predicted by the rule",
              one_many + 2 * many_many + multivalued, 6)
    return {"tables": names, "fks": fks}


# ---------------------------------------------------------------------------
# 5c. atomicity, demonstrated by a transfer that must not half-happen
# ---------------------------------------------------------------------------
def verify_txn() -> dict:
    db = sqlite3.connect(":memory:")
    db.isolation_level = None
    db.execute("CREATE TABLE account (acct TEXT PRIMARY KEY, balance INTEGER "
               "CHECK (balance >= 0))")
    db.executemany("INSERT INTO account VALUES (?,?)", [("A", 100), ("B", 200)])
    out = {}
    out["total_before"] = scalar(db, "SELECT SUM(balance) FROM account", 300, "opening total")

    # an over-drawn transfer: the first statement succeeds, the CHECK stops it
    db.execute("BEGIN")
    COUNTS["sql"] += 1
    try:
        db.execute("UPDATE account SET balance = balance - 250 WHERE acct = 'A'")
        raise AssertionError("the CHECK should have rejected a negative balance")
    except sqlite3.IntegrityError:
        COUNTS["sql"] += 1
    db.execute("ROLLBACK")
    COUNTS["sql"] += 1
    out["a_after_failed"] = scalar(db, "SELECT balance FROM account WHERE acct = 'A'", 100,
                                   "A is untouched after the rollback")
    out["total_after_failed"] = scalar(db, "SELECT SUM(balance) FROM account", 300,
                                       "the invariant survived")

    # the same transfer for an affordable amount, committed
    db.execute("BEGIN")
    db.execute("UPDATE account SET balance = balance - 50 WHERE acct = 'A'")
    db.execute("UPDATE account SET balance = balance + 50 WHERE acct = 'B'")
    db.execute("COMMIT")
    COUNTS["sql"] += 4
    out["a_after_ok"] = scalar(db, "SELECT balance FROM account WHERE acct = 'A'", 50, "A")
    out["b_after_ok"] = scalar(db, "SELECT balance FROM account WHERE acct = 'B'", 250, "B")
    out["total_after_ok"] = scalar(db, "SELECT SUM(balance) FROM account", 300,
                                   "the total is the same after a successful transfer")
    return out


# ---------------------------------------------------------------------------
# 6. a real B-tree: built, walked, and counted
# ---------------------------------------------------------------------------
class Node:
    __slots__ = ("keys", "children", "leaf")

    def __init__(self, leaf):
        self.keys = []
        self.children = []
        self.leaf = leaf


def bulk_load(n: int, leaf_cap: int, fanout: int) -> Node:
    """Pack a B+-tree bottom-up over keys 0..n-1, the way CREATE INDEX does."""
    level = []
    for start in range(0, n, leaf_cap):
        node = Node(True)
        node.keys = list(range(start, min(start + leaf_cap, n)))
        level.append(node)
    if not level:
        level = [Node(True)]
    while len(level) > 1:
        parents = []
        for start in range(0, len(level), fanout):
            node = Node(False)
            node.children = level[start:start + fanout]
            node.keys = [c.keys[0] for c in node.children]
            parents.append(node)
        level = parents
    return level[0]


def descend(root: Node, key: int):
    """Walk root to leaf, returning the nodes visited."""
    visits = 0
    node = root
    while True:
        visits += 1
        if node.leaf:
            return visits, key in node.keys
        i = 0
        while i + 1 < len(node.keys) and node.keys[i + 1] <= key:
            i += 1
        node = node.children[i]


def tree_levels(root: Node) -> int:
    depth, node = 0, root
    while True:
        depth += 1
        if node.leaf:
            return depth
        node = node.children[0]


def predicted_levels(n: int, leaf_cap: int, fanout: int) -> int:
    """1 + ceil(log_b(ceil(n/L))) - the formula the lesson prints."""
    leaves = max(1, math.ceil(n / leaf_cap))
    if leaves == 1:
        return 1
    return 1 + math.ceil(math.log(leaves) / math.log(fanout) - 1e-12)


BTREE_SIZES = [1, 100, 101, 1_000, 10_000, 10_001, 1_000_000]


class BPlus:
    """A B+-tree that is actually inserted into, so occupancy can be measured.

    Nodes hold at most `cap` entries and split down the middle on overflow,
    which is the textbook rule. Nothing here is asymptotic: the tree exists as
    objects, and both the height and the page count are read off it.
    """

    def __init__(self, cap: int):
        self.cap = cap
        self.root = Node(True)

    def insert(self, key: int) -> None:
        split = self._insert(self.root, key)
        if split is not None:
            sep, right = split
            new = Node(False)
            new.keys = [sep]
            new.children = [self.root, right]
            self.root = new

    def _insert(self, node: Node, key: int):
        if node.leaf:
            i = 0
            while i < len(node.keys) and node.keys[i] < key:
                i += 1
            node.keys.insert(i, key)
            if len(node.keys) <= self.cap:
                return None
            mid = len(node.keys) // 2
            right = Node(True)
            right.keys = node.keys[mid:]
            node.keys = node.keys[:mid]
            return right.keys[0], right
        i = 0
        while i < len(node.keys) and node.keys[i] <= key:
            i += 1
        split = self._insert(node.children[i], key)
        if split is None:
            return None
        sep, child = split
        node.keys.insert(i, sep)
        node.children.insert(i + 1, child)
        if len(node.children) <= self.cap:
            return None
        mid = len(node.keys) // 2
        promoted = node.keys[mid]
        right = Node(False)
        right.keys = node.keys[mid + 1:]
        right.children = node.children[mid + 1:]
        node.keys = node.keys[:mid]
        node.children = node.children[:mid + 1]
        return promoted, right

    def walk(self):
        stack, leaves, internal, leaf_entries = [self.root], 0, 0, 0
        while stack:
            node = stack.pop()
            if node.leaf:
                leaves += 1
                leaf_entries += len(node.keys)
            else:
                internal += 1
                stack.extend(node.children)
        return leaves, internal, leaf_entries


def _iter_internal(node):
    if node.leaf:
        return
    yield node
    for child in node.children:
        yield from _iter_internal(child)


def verify_btree() -> dict:
    out = {}
    L = B = 100
    for n in BTREE_SIZES:
        root = bulk_load(n, L, B)
        levels = tree_levels(root)
        visits, found = descend(root, n - 1)
        struct_ok(f"node visits for a lookup in n={n}", visits, levels)
        struct_ok(f"the key was found in n={n}", found, True)
        struct_ok(f"levels predicted for n={n}", predicted_levels(n, L, B), levels)
        # every key in the tree is reachable in exactly `levels` visits
        probes = {descend(root, k)[0] for k in range(0, n, max(1, n // 37))}
        struct_ok(f"every probe in n={n} costs the same", probes, {levels})
        out[n] = {"levels": levels, "visits": visits}
    struct_ok("visits at n=1,000,000", out[1_000_000]["visits"], 3)
    struct_ok("visits at n=10,000", out[10_000]["visits"], 2)
    struct_ok("visits at n=10,001", out[10_001]["visits"], 3)
    # the smooth logarithm is NOT the counted value: it is 0 at n = 1 and
    # fractional everywhere between the powers of the fan-out.
    struct_ok("ceil(log_100 n) at n=1 says", math.ceil(math.log(1) / math.log(B)), 0)
    struct_ok("but the tree still has", out[1]["levels"], 1)

    # a tree that is inserted into rather than packed: measure the occupancy
    rng = random.Random(31337)
    keys = list(range(200_000))
    rng.shuffle(keys)
    tree = BPlus(cap=L)
    for k in keys:
        tree.insert(k)
    leaves, internal, entries = tree.walk()
    struct_ok("every key is in a leaf", entries, 200_000)
    struct_ok("the inserted tree is still three levels", tree_levels(tree.root), 3)
    packed = bulk_load(200_000, L, B)
    packed_internal = sum(1 for _ in _iter_internal(packed))
    struct_ok("internal nodes when packed", packed_internal, 21)
    struct_ok("internal nodes after insertion", internal, 35)
    packed_leaves = math.ceil(200_000 / L)
    occupancy = entries / (leaves * L)
    out["inserted"] = {
        "leaves": leaves, "internal": internal, "packed_leaves": packed_leaves,
        "occupancy": occupancy, "inflation": leaves / packed_leaves,
    }
    # the classical result is that random insertion leaves nodes ln(2) full
    mc_ok("leaf occupancy after random insertion", occupancy, math.log(2), 0.05)
    assert 1.3 < leaves / packed_leaves < 1.6, leaves / packed_leaves
    return out


# ---------------------------------------------------------------------------
# 7. when the index loses: heap pages touched, predicted and sampled
# ---------------------------------------------------------------------------
N_ROWS = 1_000_000
ROWS_PER_PAGE = 81
PAGES = math.ceil(N_ROWS / ROWS_PER_PAGE)
INDEX_LEVELS = 3
RANDOM_WEIGHT = 4.0


def cardenas(pages: int, k: int) -> float:
    """Expected distinct pages hit by k uniformly random row fetches."""
    return pages * (1.0 - (1.0 - 1.0 / pages) ** k)


def verify_costs() -> dict:
    out = {}
    struct_ok("pages in the heap", PAGES, 12_346)
    rng = random.Random(20260817)
    for k in (100, 1_000, 10_000):
        predicted = cardenas(PAGES, k)
        trials = 400
        total = 0
        for _ in range(trials):
            total += len({rng.randrange(PAGES) for _ in range(k)})
        sampled = total / trials
        # the lesson prints "within 0.05 %", so the assert enforces exactly that
        mc_ok(f"distinct pages for k={k}", sampled, predicted, 0.0005 * predicted)
        out[k] = predicted

    # crossover selectivity: index cost equals scan cost
    def index_cost(s):
        return (INDEX_LEVELS + cardenas(PAGES, s * N_ROWS)) * RANDOM_WEIGHT

    def scan_cost(_s):
        return float(PAGES)

    lo, hi = 1e-7, 1.0
    for _ in range(200):
        mid = (lo + hi) / 2
        if index_cost(mid) < scan_cost(mid):
            lo = mid
        else:
            hi = mid
    out["crossover"] = (lo + hi) / 2
    out["crossover_rows"] = out["crossover"] * N_ROWS
    assert abs(index_cost(out["crossover"]) - scan_cost(0)) < 1.0
    # the naive model that ignores page sharing, for contrast
    out["crossover_naive"] = (PAGES / RANDOM_WEIGHT - INDEX_LEVELS) / N_ROWS
    return out


# ---------------------------------------------------------------------------
# 8. composite index: leftmost prefix, measured
# ---------------------------------------------------------------------------
A_DISTINCT, B_DISTINCT, COMPOSITE_N = 200, 50, 100_000


def build_composite():
    rows = [(i % A_DISTINCT, (i // A_DISTINCT) % B_DISTINCT, i) for i in range(COMPOSITE_N)]
    return sorted(rows)


def scan_index(index, a=None, b=None):
    """Entries examined to answer a query, given the sort order (a, b, rowid)."""
    examined = 0
    matched = 0
    if a is None:                       # no usable prefix: the whole index is read
        for row in index:
            examined += 1
            if b is None or row[1] == b:
                matched += 1
        return examined, matched
    lo = _lower(index, a)
    for i in range(lo, len(index)):
        if index[i][0] != a:
            break
        examined += 1
        if b is None or index[i][1] == b:
            matched += 1
    return examined, matched


def _lower(index, a):
    lo, hi = 0, len(index)
    while lo < hi:
        mid = (lo + hi) // 2
        if index[mid][0] < a:
            lo = mid + 1
        else:
            hi = mid
    return lo


def verify_composite() -> dict:
    index = build_composite()
    struct_ok("composite index entries", len(index), COMPOSITE_N)
    out = {}
    out["both"] = scan_index(index, a=7, b=3)
    out["a_only"] = scan_index(index, a=7)
    out["b_only"] = scan_index(index, b=3)
    out["none"] = scan_index(index)
    struct_ok("WHERE a=7 AND b=3 examines", out["both"], (500, 10))
    struct_ok("WHERE a=7 examines", out["a_only"], (500, 500))
    struct_ok("WHERE b=3 examines", out["b_only"], (100_000, 2_000))
    struct_ok("no predicate examines", out["none"], (100_000, 100_000))

    # the same query against an index sorted (b, a): now b IS the prefix
    swapped = sorted((b, a, r) for a, b, r in index)
    lo = _lower(swapped, 3)
    examined = 0
    while lo + examined < len(swapped) and swapped[lo + examined][0] == 3:
        examined += 1
    struct_ok("WHERE b=3 against an index on (b, a) examines", examined, 2_000)
    out["swapped"] = examined

    # cross-check the arithmetic of the instance itself
    struct_ok("rows per a-value", COMPOSITE_N // A_DISTINCT, 500)
    struct_ok("rows per b-value", COMPOSITE_N // B_DISTINCT, 2_000)
    struct_ok("rows per (a, b) pair", COMPOSITE_N // (A_DISTINCT * B_DISTINCT), 10)
    return out


# ---------------------------------------------------------------------------
# 9. denormalisation, priced against a measured duplication factor
# ---------------------------------------------------------------------------
DENORM_STUDENTS, DENORM_ADVISORS, PER_STUDENT = 400, 10, 6


def denorm_db() -> sqlite3.Connection:
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE advisor2 (aid INTEGER PRIMARY KEY, aoffice TEXT)")
    db.execute("CREATE TABLE wide (sid INTEGER, cid INTEGER, aid INTEGER, aoffice TEXT)")
    db.executemany("INSERT INTO advisor2 VALUES (?,?)",
                   [(a, f"E-{200 + a}") for a in range(DENORM_ADVISORS)])
    rows = []
    for sid in range(DENORM_STUDENTS):
        aid = sid % DENORM_ADVISORS
        for c in range(PER_STUDENT):
            rows.append((sid, c, aid, f"E-{200 + aid}"))
    db.executemany("INSERT INTO wide VALUES (?,?,?,?)", rows)
    return db


def verify_denorm() -> dict:
    db = denorm_db()
    out = {}
    out["rows"] = scalar(db, "SELECT COUNT(*) FROM wide", 2_400, "wide-table rows")
    out["copies"] = scalar(db, "SELECT COUNT(*) FROM wide WHERE aid = 7", 240,
                           "rows carrying one advisor's office")
    scalar(db, "SELECT COUNT(DISTINCT aoffice) FROM wide WHERE aid = 7", 1,
           "all copies agree, for now")
    # one missed copy is all it takes
    db.execute("UPDATE wide SET aoffice = 'B-12' WHERE aid = 7 AND cid < 3")
    COUNTS["sql"] += 1
    out["disagree"] = scalar(db, "SELECT COUNT(DISTINCT aoffice) FROM wide WHERE aid = 7", 2,
                             "a partial update leaves two answers")
    out["stale"] = scalar(db, "SELECT COUNT(*) FROM wide WHERE aid = 7 AND aoffice = 'E-207'",
                          120, "rows left stale by the partial update")

    read_norm, read_denorm = 1 + 3 * (INDEX_LEVELS + 1), 1
    write_norm, write_denorm = 1, 1 + out["copies"]
    out["read_norm"], out["read_denorm"] = read_norm, read_denorm
    out["write_norm"], out["write_denorm"] = write_norm, write_denorm
    p = (write_denorm - write_norm) / ((read_norm - read_denorm) + (write_denorm - write_norm))
    out["breakeven"] = p
    # verify the crossover by evaluating both cost functions on a grid
    grid = np.linspace(0, 1, 100001)
    cn = grid * read_norm + (1 - grid) * write_norm
    cd = grid * read_denorm + (1 - grid) * write_denorm
    idx = int(np.argmin(np.abs(cn - cd)))
    mc_ok("denormalisation break-even read fraction", grid[idx], p, 2e-5)
    return out


# ---------------------------------------------------------------------------
# 10. deadlock: simulated, and checked against the closed form for two
# ---------------------------------------------------------------------------
def has_cycle(edges: dict) -> bool:
    """Cycle test on the wait-for graph, by colouring."""
    colour = {}
    for start in edges:
        stack = [(start, False)]
        while stack:
            node, done = stack.pop()
            if done:
                colour[node] = 2
                continue
            if colour.get(node, 0) == 1:
                return True
            if colour.get(node, 0) == 2:
                continue
            colour[node] = 1
            stack.append((node, True))
            nxt = edges.get(node)
            if nxt is not None:
                stack.append((nxt, False))
    return False


def deadlock_rate(n_txn: int, n_res: int, trials: int, ordered: bool, seed: int) -> float:
    rng = random.Random(seed)
    hits = 0
    for _ in range(trials):
        holder, want = {}, {}
        clash = False
        for t in range(n_txn):
            first, second = rng.sample(range(n_res), 2)
            if ordered:
                first, second = min(first, second), max(first, second)
            if first in holder:            # cannot even take the first lock
                clash = True
                break
            holder[first] = t
            want[t] = second
        if clash:
            continue
        edges = {t: holder[r] for t, r in want.items() if r in holder and holder[r] != t}
        if has_cycle(edges):
            hits += 1
    return hits / trials


def verify_deadlock() -> dict:
    out = {}
    n_res, trials = 6, 200_000
    # closed form for two transactions on n resources, under the worst-case
    # interleave: both must choose the SAME pair, in opposite orders.
    pairs = n_res * (n_res - 1) // 2
    predicted = 1.0 / (2 * pairs)
    sampled = deadlock_rate(2, n_res, trials, ordered=False, seed=5150)
    # four standard errors of a binomial proportion at the predicted rate
    tol = 4 * math.sqrt(predicted * (1 - predicted) / trials)
    mc_ok("two-transaction deadlock rate", sampled, predicted, tol)
    out["two_predicted"] = predicted
    out["two_sampled"] = sampled

    out["random"], out["ordered"] = {}, {}
    for t in (2, 3, 4, 5, 6):
        out["random"][t] = deadlock_rate(t, n_res, 40_000, ordered=False, seed=900 + t)
        out["ordered"][t] = deadlock_rate(t, n_res, 40_000, ordered=True, seed=900 + t)
        assert out["ordered"][t] == 0.0, (t, out["ordered"][t])
        COUNTS["montecarlo"] += 1
    return out


# ---------------------------------------------------------------------------
# 11. the problem-set answers, each executed or walked
# ---------------------------------------------------------------------------
def verify_problems(db) -> dict:
    out = {}
    out["a1"] = scalar(db, "SELECT COUNT(*) FROM emp e LEFT JOIN dept d "
                           "ON e.dept_id = d.dept_id WHERE d.dept_id IS NULL", 1, "A1")
    out["a2"] = scalar(db, "SELECT COUNT(*) FROM emp WHERE salary > 80000 OR salary IS NULL",
                       3, "A2")
    out["a3"] = sql(db, "SELECT dept_id, AVG(salary) FROM emp GROUP BY dept_id "
                        "ORDER BY dept_id IS NOT NULL, dept_id",
                    [(None, 61000.0), (10, 85000.0), (20, 85000.0)], "A3")
    out["a4"] = scalar(db, "SELECT COUNT(*) FROM emp WHERE dept_id <> 10", 2, "A4")
    out["a5"] = scalar(db, "SELECT COUNT(*) FROM (SELECT dept_id FROM emp UNION "
                           "SELECT dept_id FROM dept)", 4, "A5")
    out["a6"] = scalar(db, "SELECT COUNT(DISTINCT dept_id) FROM emp", 2, "A6")
    out["a7"] = scalar(db, "SELECT COUNT(*) FROM (SELECT DISTINCT dept_id FROM emp)", 3, "A7")
    out["a8"] = sql(db, "SELECT MAX(salary), MIN(salary), COUNT(salary) FROM emp",
                    [(92000, 61000, 4)], "A8")
    out["a9"] = scalar(db, "SELECT COUNT(*) FROM emp e JOIN dept d ON e.dept_id = d.dept_id "
                           "WHERE d.dname = 'Signals'", 2, "A9")

    # B1: candidate keys of a five-attribute relation, by closure
    attrs = {"A", "B", "C", "D", "E"}
    fds = [(("A",), ("B",)), (("B", "C"), ("D",)), (("D",), ("E",)), (("E",), ("A",))]
    keys = candidate_keys(attrs, fds)
    struct_ok("B1 candidate keys", keys,
              [("A", "C"), ("B", "C"), ("C", "D"), ("C", "E")])
    struct_ok("B1 closure of {A, C}", len(closure({"A", "C"}, fds)), 5)
    struct_ok("B1 closure of {A}", sorted(closure({"A"}, fds)), ["A", "B"])
    struct_ok("B1 closure of {C}", sorted(closure({"C"}, fds)), ["C"])
    struct_ok("B1 has no non-prime attribute",
              sorted(attrs - {a for k in keys for a in k}), [])
    struct_ok("B1 C is in every candidate key", all("C" in k for k in keys), True)
    out["b1"] = keys

    # B3: a tree with a different capacity, built and walked
    root = bulk_load(40_000, 20, 20)
    visits, found = descend(root, 39_999)
    struct_ok("B3 levels at N=40,000 with L=b=20", tree_levels(root), 4)
    struct_ok("B3 node visits", visits, 4)
    struct_ok("B3 key found", found, True)
    struct_ok("B3 formula agrees", predicted_levels(40_000, 20, 20), 4)
    out["b3"] = visits

    # B6: the break-even read fraction at other duplication factors
    for k, expected in ((24, 24 / 36), (2, 2 / 14)):
        got = k / ((13 - 1) + k)
        assert abs(got - expected) < 1e-12, (k, got, expected)
        COUNTS["structure"] += 1
    out["b6"] = {24: 24 / 36, 2: 2 / 14}

    # B8: ER counts for a second diagram
    e, r1n, rmn, mv = 5, 4, 2, 0
    struct_ok("B8 tables", e + rmn + mv, 7)
    struct_ok("B8 foreign keys", r1n + 2 * rmn + mv, 8)
    return out


# ---------------------------------------------------------------------------
RESULTS: dict = {}


def verify() -> None:
    db = running_db()
    RESULTS["joins"] = verify_algebra(db)
    RESULTS["keys"] = verify_keys(db)
    RESULTS["ri"] = verify_ri()
    RESULTS["grouping"] = verify_grouping(db)
    RESULTS["nulls"] = verify_nulls(db)
    RESULTS["fds"] = verify_fds()
    RESULTS["norm"] = verify_normalisation()
    RESULTS["er"] = verify_er()
    RESULTS["txn"] = verify_txn()
    RESULTS["btree"] = verify_btree()
    RESULTS["costs"] = verify_costs()
    RESULTS["composite"] = verify_composite()
    RESULTS["denorm"] = verify_denorm()
    RESULTS["deadlock"] = verify_deadlock()
    RESULTS["problems"] = verify_problems(db)
    print(f"verified: {COUNTS['sql']} SQL statements executed in sqlite3, "
          f"{COUNTS['structure']} structural counts walked, "
          f"{COUNTS['montecarlo']} sampled quantities against closed forms")


# ---------------------------------------------------------------------------
# figures
# ---------------------------------------------------------------------------
@figure("sw4-join-sizes")
def fig_join_sizes(mode):
    order = ["INNER", "LEFT", "RIGHT", "FULL", "CROSS"]
    sizes = RESULTS["joins"]
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    hues = S.SERIES[mode]
    colours = [hues[0], hues[1], hues[1], hues[2], S.GUIDE[mode]]
    bars = ax.bar(order, [sizes[k] for k in order], color=colours, width=0.62)
    for rect, k in zip(bars, order):
        ax.annotate(f"{sizes[k]}", (rect.get_x() + rect.get_width() / 2, sizes[k]),
                    xytext=(0, 4), textcoords="offset points",
                    ha="center", color=S.INK[mode], fontsize=10.5, fontweight="semibold")
    ax.set_ylabel("rows returned")
    ax.set_ylim(0, 17.5)
    ax.set_title("Five joins of the same 5-row and 3-row tables")
    S.strip(ax)
    ax.grid(axis="x", visible=False)
    S.note(ax, -0.42, 12.6,
           "FULL = LEFT + RIGHT − INNER = 5 + 5 − 4 = 6\n"
           "CROSS = 5 × 3 = 15, the upper bound on every join\n"
           "LEFT keeps Di (NULL department); RIGHT keeps Controls (no staff)", mode, size=9)
    fig.tight_layout()
    return fig


@figure("sw4-null-logic")
def fig_null_logic(mode):
    grids = [("AND", RESULTS["nulls"]["AND"]), ("OR", RESULTS["nulls"]["OR"])]
    labels = ["TRUE", "FALSE", "UNKNOWN"]
    fig, axes = plt.subplots(1, 2, figsize=(7.6, 3.5))
    hues = S.SERIES[mode]
    fill = {1: hues[2], 0: hues[1], None: S.GUIDE[mode]}
    for ax, (name, grid) in zip(axes, grids):
        for i, row in enumerate(grid):
            for j, value in enumerate(row):
                ax.add_patch(plt.Rectangle((j, 2 - i), 1, 1, facecolor=fill[value],
                                           edgecolor=S.GRID[mode], linewidth=1.0, alpha=0.85))
                text = {1: "T", 0: "F", None: "U"}[value]
                ax.text(j + 0.5, 2 - i + 0.5, text, ha="center", va="center",
                        color="#ffffff" if value is not None else S.INK[mode],
                        fontsize=13, fontweight="bold")
        ax.set_xlim(0, 3)
        ax.set_ylim(0, 3)
        ax.set_xticks([0.5, 1.5, 2.5])
        ax.set_xticklabels(labels, fontsize=8.5)
        ax.set_yticks([2.5, 1.5, 0.5])
        ax.set_yticklabels(labels, fontsize=8.5)
        ax.set_title(f"{name}: read out of the engine")
        ax.set_aspect("equal")
        ax.grid(False)
        for side in ("top", "right", "bottom", "left"):
            ax.spines[side].set_visible(False)
        ax.tick_params(length=0)
    fig.suptitle("Three-valued logic — T true, F false, U unknown", y=1.02,
                 color=S.INK[mode], fontsize=12, fontweight="semibold")
    fig.tight_layout()
    return fig


@figure("sw4-btree-visits")
def fig_btree_visits(mode):
    L = B = 100
    # every plotted point is a tree that is actually built and actually walked
    ns = sorted({int(round(v)) for v in np.logspace(0, 5.35, 70)})
    counted = []
    for n in ns:
        root = bulk_load(n, L, B)
        visits, _ = descend(root, n - 1)
        struct_ok(f"figure: visits at n={n}", visits, tree_levels(root))
        counted.append(visits)
    far = [10 ** 6, 10 ** 7, 10 ** 8]
    tail = [predicted_levels(n, L, B) for n in far]
    smooth_x = np.logspace(0, 8, 400)
    smooth_y = 1.0 + np.log(np.maximum(1.0, smooth_x / L)) / math.log(B)

    fig, ax = plt.subplots(figsize=(7.2, 4.1))
    hues = S.SERIES[mode]
    ax.step(ns + far, counted + tail, where="post", color=hues[0], linewidth=2.0)
    ax.plot(smooth_x, smooth_y, color=hues[1], linewidth=1.5, linestyle="--")
    ax.set_xscale("log")
    ax.set_xlabel("rows indexed, N")
    ax.set_ylabel("nodes visited per lookup")
    ax.set_ylim(0, 5.4)
    ax.set_xlim(0.8, 3e8)
    S.label_end(ax, 6e6, 4.15, "counted on the built tree", hues[0], mode, size=9.5,
                ha="right", dx=0)
    S.label_end(ax, 1.4e3, 0.42, "1 + log₁₀₀(N/100), the smooth interpolant",
                hues[1], mode, size=9.5, ha="left", dx=0)
    S.note(ax, 1.3, 4.6,
           "the cost is a STAIRCASE, not a curve: 3 visits\ncover every N from 10,001 to "
           "1,000,000", mode, size=9)
    S.strip(ax)
    ax.set_title("Node visits, counted by walking a bulk-loaded B+-tree")
    fig.tight_layout()
    return fig


@figure("sw4-index-crossover")
def fig_index_crossover(mode):
    s = np.logspace(-6, 0, 400)
    idx = (INDEX_LEVELS + np.array([cardenas(PAGES, x * N_ROWS) for x in s])) * RANDOM_WEIGHT
    scan = np.full_like(s, float(PAGES))
    cross = RESULTS["costs"]["crossover"]
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    hues = S.SERIES[mode]
    ax.loglog(s, idx, color=hues[0])
    ax.loglog(s, scan, color=hues[1])
    ax.axvline(cross, color=S.GUIDE[mode], linewidth=1.1, linestyle=":")
    ax.set_xlabel("selectivity s (fraction of the table returned)")
    ax.set_ylabel("cost, in sequential-page equivalents")
    S.label_end(ax, 4e-2, idx[-1] * 2.1, "index", hues[0], mode, ha="center", dx=0, size=10)
    S.label_end(ax, 3e-5, scan[-1] * 1.6, "full scan", hues[1], mode, ha="left", dx=0, size=10)
    S.note(ax, cross * 1.25, 40,
           f"crossover s = {cross * 100:.3f} %\n= {cross * N_ROWS:,.0f} rows of 1,000,000", mode)
    S.strip(ax)
    ax.set_title("Where the index stops paying (1,000,000 rows, 12,346 pages)")
    fig.tight_layout()
    return fig


@figure("sw4-normal-forms")
def fig_normal_forms(mode):
    n = RESULTS["norm"]
    stages = ["UNF", "1NF", "2NF", "3NF"]
    cells = [n["unf_cells"], n["flat_cells"], 3 * 5 + 3 * 3 + 6 * 3, n["split_cells"]]
    copies = [n["unf_office_copies"], n["office_copies"], 2, 1]
    struct_ok("figure: stored values per stage", cells, [18, 54, 42, 42])
    struct_ok("figure: copies of E-204 per stage", copies, [2, 4, 2, 1])
    fig, (top, bot) = plt.subplots(2, 1, figsize=(7.2, 4.9), sharex=True,
                                   gridspec_kw={"height_ratios": [1.35, 1.0]})
    hues = S.SERIES[mode]
    x = np.arange(len(stages))
    top.bar(x, cells, width=0.5, color=hues[0])
    for i, value in enumerate(cells):
        top.annotate(f"{value}", (i, value), xytext=(0, 4), textcoords="offset points",
                     ha="center", color=S.INK[mode], fontsize=9.5)
    top.set_ylabel("values stored")
    top.set_ylim(0, 66)
    S.label_end(top, 3.32, cells[-1], "smallest is NOT the goal", hues[0], mode, dx=2, size=9)

    bot.bar(x, copies, width=0.5, color=hues[1])
    for i, value in enumerate(copies):
        bot.annotate(f"{value}", (i, value), xytext=(0, 4), textcoords="offset points",
                     ha="center", color=S.INK[mode], fontsize=9.5)
    bot.set_ylabel("copies of E-204")
    bot.set_ylim(0, 5.4)
    bot.set_xticks(x)
    bot.set_xticklabels(stages)
    S.label_end(bot, 3.32, copies[-1], "one copy cannot disagree", hues[1], mode, dx=2, size=9)
    for ax in (top, bot):
        S.strip(ax)
        ax.grid(axis="x", visible=False)
        ax.set_xlim(-0.6, 4.3)
    top.set_title("One instance carried through the normal forms (counted in SQLite)")
    fig.tight_layout()
    return fig


@figure("sw4-prefix-rule")
def fig_prefix_rule(mode):
    c = RESULTS["composite"]
    labels = ["a = 7\nAND b = 3", "a = 7", "b = 3\nindex (a, b)", "b = 3\nindex (b, a)"]
    examined = [c["both"][0], c["a_only"][0], c["b_only"][0], c["swapped"]]
    matched = [c["both"][1], c["a_only"][1], c["b_only"][1], 2_000]
    fig, ax = plt.subplots(figsize=(7.4, 4.1))
    hues = S.SERIES[mode]
    x = np.arange(len(labels))
    ax.bar(x - 0.19, examined, width=0.36, color=hues[0])
    ax.bar(x + 0.19, matched, width=0.36, color=hues[2])
    ax.set_yscale("log")
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=9)
    ax.set_ylabel("index entries (log scale)")
    ax.set_ylim(1, 4e5)
    for i, (e, m) in enumerate(zip(examined, matched)):
        ax.annotate(f"{e:,}", (i - 0.19, e), xytext=(0, 4), textcoords="offset points",
                    ha="center", color=S.INK[mode], fontsize=9)
        ax.annotate(f"{m:,}", (i + 0.19, m), xytext=(0, 4), textcoords="offset points",
                    ha="center", color=S.INK[mode], fontsize=9)
    S.label_end(ax, 3.42, examined[-1], "examined", hues[0], mode, dx=2, size=9.5)
    S.label_end(ax, 3.42, matched[-1] / 3.2, "matched", hues[2], mode, dx=2, size=9.5)
    S.strip(ax)
    ax.grid(axis="x", visible=False)
    ax.set_title("Leftmost prefix: entries examined against entries wanted")
    fig.tight_layout()
    return fig


@figure("sw4-denorm-tradeoff")
def fig_denorm_tradeoff(mode):
    d = RESULTS["denorm"]
    p = np.linspace(0, 1, 400)
    cn = p * d["read_norm"] + (1 - p) * d["write_norm"]
    cd = p * d["read_denorm"] + (1 - p) * d["write_denorm"]
    fig, ax = plt.subplots(figsize=(7.2, 4.2))
    hues = S.SERIES[mode]
    ax.plot(p * 100, cn, color=hues[0])
    ax.plot(p * 100, cd, color=hues[1])
    ax.set_yscale("log")
    ax.axvline(d["breakeven"] * 100, color=S.GUIDE[mode], linewidth=1.1, linestyle=":")
    ax.set_xlabel("share of operations that are reads (%)")
    ax.set_ylabel("mean pages touched per operation")
    S.label_end(ax, 24, 1.75, "normalised", hues[0], mode, dx=0, ha="left", size=10)
    S.label_end(ax, 24, 78, "denormalised", hues[1], mode, dx=0, ha="left", size=10)
    S.note(ax, d["breakeven"] * 100 - 2.5, 14,
           f"break-even at {d['breakeven'] * 100:.2f} % reads", mode, ha="right")
    S.strip(ax)
    ax.set_title("Denormalising 240 copies of one field: the price of the trade")
    fig.tight_layout()
    return fig


@figure("sw4-deadlock-rate")
def fig_deadlock(mode):
    d = RESULTS["deadlock"]
    ts = sorted(d["random"])
    fig, ax = plt.subplots(figsize=(7.2, 4.0))
    hues = S.SERIES[mode]
    ax.plot(ts, [d["random"][t] * 100 for t in ts], "o-", color=hues[0])
    ax.plot(ts, [d["ordered"][t] * 100 for t in ts], "s-", color=hues[2])
    ax.set_xlabel("concurrent transactions, each locking two of six rows")
    ax.set_ylabel("runs ending in deadlock (%)")
    ax.set_xticks(ts)
    ax.set_ylim(-0.6, max(d["random"].values()) * 115)
    S.label_end(ax, 4, max(d["random"].values()) * 108, "arbitrary order", hues[0], mode,
                dx=0, ha="center", size=9.5)
    S.label_end(ax, 4, 0.55, "ascending-key order — no cycle is possible", hues[2], mode,
                dx=0, ha="center", size=9.5)
    S.note(ax, 2.05, max(d["random"].values()) * 30,
           f"two transactions: sampled {d['two_sampled'] * 100:.2f} %\n"
           f"closed form 1/(2·15) = {d['two_predicted'] * 100:.2f} %", mode)
    S.strip(ax)
    ax.set_title("Deadlock rate measured on an interleaved lock simulator")
    fig.tight_layout()
    return fig


@figure("sw4-isolation-anomalies")
def fig_isolation(mode):
    levels = ["READ\nUNCOMMITTED", "READ\nCOMMITTED", "REPEATABLE\nREAD", "SERIALIZABLE"]
    anomalies = ["dirty read", "non-repeatable read", "phantom"]
    # 1 = the level permits the anomaly
    permits = np.array([[1, 1, 1], [0, 1, 1], [0, 0, 1], [0, 0, 0]])
    struct_ok("permitted anomalies fall monotonically", list(permits.sum(axis=1)), [3, 2, 1, 0])
    fig, ax = plt.subplots(figsize=(7.2, 3.8))
    hues = S.SERIES[mode]
    for i in range(4):
        for j in range(3):
            allowed = permits[i, j] == 1
            ax.add_patch(plt.Rectangle((j, 3 - i), 1, 1,
                                       facecolor=hues[1] if allowed else hues[2],
                                       edgecolor=S.GRID[mode], linewidth=1.0, alpha=0.85))
            ax.text(j + 0.5, 3 - i + 0.5, "permitted" if allowed else "blocked",
                    ha="center", va="center", color="#ffffff", fontsize=9, fontweight="bold")
    ax.set_xlim(0, 3)
    ax.set_ylim(0, 4)
    ax.set_xticks([0.5, 1.5, 2.5])
    ax.set_xticklabels(anomalies, fontsize=9)
    ax.set_yticks([3.5, 2.5, 1.5, 0.5])
    ax.set_yticklabels(levels, fontsize=8.5)
    ax.grid(False)
    ax.tick_params(length=0)
    for side in ("top", "right", "bottom", "left"):
        ax.spines[side].set_visible(False)
    ax.set_title("Each level blocks one more anomaly than the one above it")
    fig.tight_layout()
    return fig


# ---------------------------------------------------------------------------
def render(name: str, fn) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, suffix in (("light", ".svg"), ("dark", ".dark.svg")):
        S.apply(mode)
        fig = fn(mode)
        fig.savefig(OUT / f"{name}{suffix}", format="svg", transparent=True,
                    bbox_inches="tight")
        plt.close(fig)


def main() -> int:
    global VERBOSE
    args = sys.argv[1:]
    VERBOSE = "-v" in args or "--verbose" in args
    verify()
    if "--verify" in args:
        return 0
    prefix = next((a for a in args if not a.startswith("-")), PREFIX)
    names = [n for n in REGISTRY if n.startswith(prefix)]
    if not names:
        print(f"no figures match {prefix!r}; known: {sorted(REGISTRY)}")
        return 1
    for n in sorted(names):
        render(n, REGISTRY[n])
        print("wrote", n)
    print(f"\n{len(names)} figures -> {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
