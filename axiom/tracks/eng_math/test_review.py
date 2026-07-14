"""End-to-end test of the missed-question review flow."""
import os
os.environ["DATABASE_URL"] = "sqlite:///test_review.db"
if os.path.exists("test_review.db"):
    os.remove("test_review.db")

from fastapi.testclient import TestClient
import axiom_service
from axiom_service import app
from axiom_db import init_db
init_db()  # registers missed_questions via the axiom_review import above

client = TestClient(app)
client.__enter__()  # fire startup (init_db + seed load)
L = "review-learner"
ok = 0; total = 0

def check(name, cond):
    global ok, total
    total += 1
    ok += bool(cond)
    print(("PASS" if cond else "FAIL"), name)

# Find an MC item with a misconception-keyed distractor from the seed.
from axiom_db import SessionLocal, ItemRow
from sqlalchemy import select
with SessionLocal() as db:
    mc = next(i for i in db.execute(select(ItemRow)).scalars()
              if i.grader == "mc" and any(c.get("misconception") for c in i.choices))
    wrong_key = next(c["key"] for c in mc.choices if c.get("misconception"))
    right_key = next(c["key"] for c in mc.choices if c.get("correct"))
    item_id = mc.id

# 1. Miss it, twice.
for _ in range(2):
    r = client.post("/v2/attempt", json={"learner_id": L, "item_id": item_id, "choice_key": wrong_key})
    assert r.status_code == 200 and r.json()["correct"] is False

# 2. It appears in the open queue with diagnosis and count 2.
r = client.get(f"/v1/review/{L}/missed").json()
check("missed queue has 1 entry", len(r) == 1)
e = r[0]
check("wrong_count is 2", e["wrong_count"] == 2)
check("status open", e["status"] == "open")
check("diagnosis present and named", e["diagnosis"] and ":" in e["diagnosis"])
check("stem snapshot saved", len(e["stem"]) > 0)
check("learner response saved", "chose" in e["your_answer"])

# 3. Summary counts it.
s = client.get(f"/v1/review/{L}/summary").json()
check("summary open_count 1", s["open_count"] == 1 and s["cleared_count"] == 0)

# 4. Retry serves the question with no answer leakage.
rt = client.post(f"/v1/review/{L}/retry/{e['missed_id']}").json()
check("retry returns same item", rt["item_id"] == item_id)
check("retry has choices without correctness", rt["choices"] and all("correct" not in c and "misconception" not in c for c in rt["choices"]))
check("retry routes to /v3/attempt", rt["submit_via"] == "/v3/attempt")

# 5. Answer correctly: the entry clears.
r = client.post("/v3/attempt", json={"learner_id": L, "item_id": item_id, "choice_key": right_key})
assert r.json()["correct"] is True
r = client.get(f"/v1/review/{L}/missed").json()
check("open queue now empty", len(r) == 0)
r = client.get(f"/v1/review/{L}/missed", params={"status": "cleared"}).json()
check("cleared queue has the entry", len(r) == 1 and r[0]["status"] == "cleared")

# 6. Miss it again: the row reopens (history preserved, count 3).
client.post("/v2/attempt", json={"learner_id": L, "item_id": item_id, "choice_key": wrong_key})
r = client.get(f"/v1/review/{L}/missed").json()
check("reopened with wrong_count 3", len(r) == 1 and r[0]["wrong_count"] == 3)

# 7. Template-variant flow: issue a variant directly, miss it, retry it.
from axiom_service import _issue_variant
from axiom_db import SessionLocal as SL, ItemRow as IR
from sqlalchemy import select as sel
with SL() as db:
    titem = next(i for i in db.execute(sel(IR)).scalars()
                 if i.template_json not in (None, "null"))
    vid, vstem = _issue_variant(db, "vlearner", titem)
bad = {"x1": "999", "x2": "999", "x3": "999"}
r = client.post("/v3/attempt", json={"learner_id": "vlearner", "item_id": titem.id,
                                      "variant_id": vid, "point_response": bad}).json()
check("variant wrong attempt graded", r["correct"] is False and r["grader"] != "none")
q = client.get("/v1/review/vlearner/missed").json()
check("variant miss recorded with variant_id", q and q[0]["variant_id"] == vid)
check("variant stem snapshot is the rendered system", "x1" in q[0]["stem"] or "x_1" in q[0]["stem"] or "=" in q[0]["stem"])
rt = client.post(f"/v1/review/vlearner/retry/{q[0]['missed_id']}").json()
check("variant retry preserves variant_id", rt["variant_id"] == vid)
check("variant retry shows the same stem", rt["stem"] == q[0]["stem"])
# Answer it correctly with the true key: clears the entry.
with SL() as db:
    from axiom_db import IssuedVariantRow as IVR
    import json as _j
    key = _j.loads(db.get(IVR, vid).key_json)
r = client.post("/v3/attempt", json={"learner_id": "vlearner", "item_id": titem.id,
                                      "variant_id": vid, "point_response": key}).json()
check("variant correct retry grades correct", r["correct"] is True)
q = client.get("/v1/review/vlearner/missed").json()
check("variant entry cleared after correct retry", len(q) == 0)

print(f"\n{ok}/{total} review tests passed")
