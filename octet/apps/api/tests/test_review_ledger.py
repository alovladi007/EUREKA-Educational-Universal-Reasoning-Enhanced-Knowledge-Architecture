"""The expert review ledger.

The load-bearing test in this file is
test_editing_a_reviewed_claim_orphans_its_review. Everything else is
bookkeeping around it.

A review system whose reviewed text can change underneath an approval is worse
than having none, because it launders unreviewed content through a named
expert. The ledger keys on a hash of the wording, so any edit produces a
different id, the old entry matches nothing, and that orphan blocks. These
tests exist to prove that actually happens rather than being a claim in a
docstring.
"""

from __future__ import annotations

import json

import pytest

from app.data import review_ledger as rl


@pytest.fixture
def ledger_file(tmp_path):
    """A writable ledger, so tests never touch the committed one."""

    def write(reviews):
        path = tmp_path / "fact_reviews.json"
        path.write_text(json.dumps({"reviews": reviews}), "utf-8")
        return path

    return write


def _entry(item_id, **over):
    row = {
        "item_id": item_id,
        "kind": "fact",
        "verdict": "confirmed",
        "reviewer": "Dr A. Rivera, Associate Professor of Chemistry, Univ of X",
        "reviewed_on": "2026-08-01",
    }
    row.update(over)
    return row


# ---------------------------------------------------------------------------
# Identity
# ---------------------------------------------------------------------------


class TestIdentity:
    def test_the_same_claim_always_hashes_the_same(self):
        a = rl.fact_id("ORG1.NMR", "Aldehyde protons appear near 9.7 ppm", "Pavia, 5th ed.")
        b = rl.fact_id("ORG1.NMR", "Aldehyde protons appear near 9.7 ppm", "Pavia, 5th ed.")
        assert a == b

    def test_changing_the_statement_changes_the_id(self):
        a = rl.fact_id("ORG1.NMR", "Aldehyde protons appear near 9.7 ppm", "Pavia, 5th ed.")
        b = rl.fact_id("ORG1.NMR", "Aldehyde protons appear near 9.8 ppm", "Pavia, 5th ed.")
        assert a != b

    def test_changing_the_citation_changes_the_id(self):
        """A different source is a different claim, even at the same number."""
        a = rl.fact_id("ORG1.NMR", "near 9.7 ppm", "Pavia, 5th ed.")
        b = rl.fact_id("ORG1.NMR", "near 9.7 ppm", "Silverstein, 8th ed.")
        assert a != b

    def test_the_same_fact_on_two_nodes_gets_two_ids(self):
        """Each needs reviewing in its own context, so they cannot share one."""
        a = rl.fact_id("ORG1.NMR", "near 9.7 ppm", "Pavia")
        b = rl.fact_id("ORG2.NMR", "near 9.7 ppm", "Pavia")
        assert a != b

    def test_surrounding_whitespace_does_not_count_as_an_edit(self):
        """Reflowing a docstring must not cost a sign-off."""
        a = rl.fact_id("ORG1.NMR", "near 9.7 ppm", "Pavia")
        b = rl.fact_id("ORG1.NMR", "  near 9.7 ppm  ", "  Pavia  ")
        assert a == b

    def test_a_misconception_id_ignores_its_citation(self):
        """Fixing a reference format should not discard a pedagogical review.

        What an expert judges here is the belief and the counterexample, not
        how the source line is punctuated.
        """
        a = rl.misconception_id("X", "name", "desc", "counter")
        b = rl.misconception_id("X", "name", "desc", "counter")
        assert a == b

    def test_a_misconception_id_tracks_its_counterexample(self):
        a = rl.misconception_id("X", "name", "desc", "counter")
        b = rl.misconception_id("X", "name", "desc", "a different counterexample")
        assert a != b

    def test_facts_and_misconceptions_cannot_collide(self):
        """Both hash the same shape of input, so the kind is in the payload."""
        assert rl.fact_id("A", "B", "C") != rl.misconception_id("A", "B", "C", "")


# ---------------------------------------------------------------------------
# The property this exists for
# ---------------------------------------------------------------------------


class TestReviewsAreBoundToWording:
    def test_editing_a_reviewed_claim_orphans_its_review(self, ledger_file):
        """The whole point. Sign-off does not survive a rewrite.

        Reviewed wording, then the number is changed. The old entry now
        matches nothing, and that must surface as stale rather than either
        following the edit or vanishing.
        """
        original = rl.fact_id("ORG1.NMR", "near 9.7 ppm", "Pavia")
        path = ledger_file([_entry(original, label="near 9.7 ppm")])

        assert original in rl.load_ledger(path)

        edited = rl.fact_id("ORG1.NMR", "near 12.0 ppm", "Pavia")
        assert edited not in rl.load_ledger(path), "the review followed the edit"
        assert rl.load_ledger(path)[original].item_id != edited

    def test_an_orphaned_review_is_reported_as_stale(self, ledger_file):
        path = ledger_file([_entry("deadbeefcafe", label="a claim that no longer exists")])
        st = rl.status(path)
        assert st["stale"] == 1
        assert st["stale_entries"][0]["item_id"] == "deadbeefcafe"
        assert "no longer exists" in st["stale_entries"][0]["label"]

    def test_a_stale_review_blocks_compliance(self, monkeypatch, ledger_file):
        """Blocking, not a warning: an expert's name on wording they never saw."""
        from app import compliance

        path = ledger_file([_entry("deadbeefcafe", label="gone")])
        monkeypatch.setattr(rl, "LEDGER_PATH", path)

        problems = compliance._check_review_ledger()
        assert any(p["check"] == "review_stale" for p in problems)
        assert all(p["severity"] == "blocking" for p in problems)


# ---------------------------------------------------------------------------
# Loading
# ---------------------------------------------------------------------------


class TestLoading:
    def test_a_missing_ledger_is_empty_not_an_error(self, tmp_path):
        assert rl.load_ledger(tmp_path / "nope.json") == {}

    def test_broken_json_raises_rather_than_reading_none_of_it(self, tmp_path):
        path = tmp_path / "fact_reviews.json"
        path.write_text("{not json", "utf-8")
        with pytest.raises(rl.LedgerError, match="not valid JSON"):
            rl.load_ledger(path)

    def test_a_half_parsed_ledger_is_refused(self, tmp_path):
        """Degrading to "no reviews" would silently un-review everything."""
        path = tmp_path / "fact_reviews.json"
        path.write_text('{"reviews": "not a list"}', "utf-8")
        with pytest.raises(rl.LedgerError):
            rl.load_ledger(path)

    @pytest.mark.parametrize("missing", ["item_id", "kind", "verdict", "reviewer", "reviewed_on"])
    def test_every_field_is_required(self, ledger_file, missing):
        row = _entry("abc123abc123")
        del row[missing]
        with pytest.raises(rl.LedgerError, match=missing):
            rl.load_ledger(ledger_file([row]))

    def test_an_unknown_verdict_is_refused(self, ledger_file):
        path = ledger_file([_entry("abc123abc123", verdict="looks-fine-to-me")])
        with pytest.raises(rl.LedgerError, match="verdict"):
            rl.load_ledger(path)

    def test_corrected_is_explicitly_not_a_verdict(self, ledger_file):
        """And the error says why, because it is the obvious thing to reach for."""
        path = ledger_file([_entry("abc123abc123", verdict="corrected")])
        with pytest.raises(rl.LedgerError, match="returns it to pending"):
            rl.load_ledger(path)

    def test_a_malformed_date_is_refused(self, ledger_file):
        path = ledger_file([_entry("abc123abc123", reviewed_on="August 2026")])
        with pytest.raises(rl.LedgerError, match="ISO"):
            rl.load_ledger(path)

    def test_a_bare_name_is_not_accountability(self, ledger_file):
        path = ledger_file([_entry("abc123abc123", reviewer="Bob")])
        with pytest.raises(rl.LedgerError, match="standing"):
            rl.load_ledger(path)

    def test_two_reviews_of_one_claim_are_refused(self, ledger_file):
        path = ledger_file([_entry("abc123abc123"), _entry("abc123abc123", verdict="disputed")])
        with pytest.raises(rl.LedgerError, match="duplicate"):
            rl.load_ledger(path)


# ---------------------------------------------------------------------------
# The live corpus and the join
# ---------------------------------------------------------------------------


class TestLiveCorpus:
    def test_it_covers_both_facts_and_misconceptions(self):
        kinds = {i.kind for i in rl.live_items()}
        assert kinds == {"fact", "misconception"}

    def test_every_live_id_is_unique(self):
        """A collision would attach one review to two different claims."""
        ids = [i.item_id for i in rl.live_items()]
        assert len(ids) == len(set(ids))

    def test_the_corpus_matches_what_compliance_counts(self):
        """The queue and the debt report must not drift apart."""
        import chem_core as cc

        from app.data.claims import Source
        from app.data.lessons import LESSONS

        sources = sum(
            1
            for lesson in LESSONS.values()
            for c in getattr(lesson, "claims", ())
            if isinstance(c, Source)
        )
        items = rl.live_items()
        assert sum(1 for i in items if i.kind == "fact") == sources
        assert sum(1 for i in items if i.kind == "misconception") == len(cc.MISCONCEPTIONS)

    def test_the_order_is_stable(self):
        """So a CSV handed to a reviewer twice does not reshuffle."""
        assert [i.item_id for i in rl.live_items()] == [i.item_id for i in rl.live_items()]


class TestStatus:
    def test_with_an_empty_ledger_everything_is_pending(self, ledger_file):
        st = rl.status(ledger_file([]))
        assert st["pending"] == st["total"]
        assert st["confirmed"] == 0
        assert st["disputed"] == 0
        assert st["stale"] == 0

    def test_a_confirmed_claim_leaves_the_pending_pile(self, ledger_file):
        first = rl.live_items()[0]
        before = rl.status(ledger_file([]))
        after = rl.status(ledger_file([_entry(first.item_id, kind=first.kind)]))
        assert after["confirmed"] == 1
        assert after["pending"] == before["pending"] - 1

    def test_a_disputed_claim_is_counted_apart_from_confirmed(self, ledger_file):
        first = rl.live_items()[0]
        st = rl.status(ledger_file([_entry(first.item_id, kind=first.kind, verdict="disputed")]))
        assert st["disputed"] == 1
        assert st["confirmed"] == 0

    def test_a_disputed_claim_blocks(self, monkeypatch, ledger_file):
        """Serving a number an expert says is wrong beats not knowing."""
        from app import compliance

        first = rl.live_items()[0]
        path = ledger_file([_entry(first.item_id, kind=first.kind, verdict="disputed")])
        monkeypatch.setattr(rl, "LEDGER_PATH", path)

        problems = compliance._check_review_ledger()
        assert any(p["check"] == "review_disputed" for p in problems)


# ---------------------------------------------------------------------------
# The committed ledger, and the honesty of the current state
# ---------------------------------------------------------------------------


class TestTheCommittedLedger:
    def test_it_parses(self):
        rl.load_ledger()

    def test_nothing_is_claimed_as_reviewed(self):
        """Guards against a well-meaning sign-off nobody actually performed.

        If this test ever fails legitimately, a real expert reviewed something
        and the assertion should be replaced with one that names them. Failing
        it by accident is the point: adding rows here is not a routine edit.
        """
        assert rl.load_ledger() == {}, (
            "fact_reviews.json is no longer empty. If that is a real expert "
            "review, update this test to assert who and what. If it is not, "
            "remove it: a fabricated sign-off is worse than an honest gap."
        )

    def test_the_platform_reports_the_debt_rather_than_hiding_it(self):
        st = rl.status()
        assert st["total"] > 400, "expected the 347 facts plus 83 misconceptions"
        assert st["pending"] == st["total"]
        assert st["confirmed"] == 0

    def test_the_committed_ledger_leaves_compliance_unblocked(self):
        """An empty ledger is a debt, not a defect. It must not fail CI."""
        from app import compliance

        assert compliance._check_review_ledger() == []


class TestExport:
    def test_the_csv_carries_the_id_that_binds_a_row_to_its_wording(self):
        csv_text = rl.export_csv(kind="misconception")
        header = csv_text.splitlines()[0]
        assert header.startswith("item_id,")
        assert "verdict" in header and "reviewer" in header

    def test_the_verdict_column_ships_empty(self):
        """The reviewer fills it in. Prefilling it would be answering for them."""
        rows = rl.export_csv(kind="misconception").splitlines()
        assert len(rows) > 1
        assert rows[1].endswith(",,,")

    def test_filtering_by_kind_narrows_the_queue(self):
        assert len(rl.queue(kind="misconception")) <= len(rl.queue())
        assert all(r["kind"] == "misconception" for r in rl.queue(kind="misconception"))
