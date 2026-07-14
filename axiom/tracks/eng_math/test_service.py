"""End-to-end tests for the AXIOM grading service, run against the live app
via FastAPI's TestClient. Each grader is exercised with at least one correct
and one incorrect response.
"""

from fastapi.testclient import TestClient

from axiom_service import app

client = TestClient(app)


def post(path: str, payload: dict, **params) -> dict:
    r = client.post(path, json=payload, params=params)
    assert r.status_code == 200, f"{path} -> {r.status_code}: {r.text}"
    return r.json()


def test_health():
    r = client.get("/health")
    assert r.status_code == 200 and r.json()["status"] == "ok"


def test_point_grader():
    good = post("/v1/grade/point",
                {"response": {"x": "4/2", "y": "1"}, "key": {"x": "2", "y": "1"}})
    bad = post("/v1/grade/point",
               {"response": {"x": "2", "y": "0"}, "key": {"x": "2", "y": "1"}})
    assert good["correct"] and not bad["correct"]


def test_rref_grader():
    pm = [[1, 2, 1], [2, 4, 0], [1, 1, 3]]
    good = post("/v1/grade/rref",
                {"response_matrix": [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
                 "problem_matrix": pm})
    bad = post("/v1/grade/rref",
               {"response_matrix": [[1, 2, 0], [0, 0, 1], [0, 0, 0]],
                "problem_matrix": pm})
    assert good["correct"] and not bad["correct"]


def test_solution_set_grader():
    base = {"A": [[1, 1, 0], [0, 0, 1]], "b": [2, 5]}
    g1 = post("/v1/grade/solution-set",
              {**base, "particular": [2, 0, 5], "directions": [[-1, 1, 0]]})
    g2 = post("/v1/grade/solution-set",
              {**base, "particular": [0, 2, 5], "directions": [[1, -1, 0]]})
    g3 = post("/v1/grade/solution-set",
              {**base, "particular": [2, 0, 5], "directions": [[1, 1, 0]]})
    assert g1["correct"] and g2["correct"] and not g3["correct"]


def test_steps_grader_localizes_error():
    payload = {
        "lines": ["2*x + y = 5; x - y = 1",
                  "3*x = 6; x - y = 1",
                  "x = 2; x - y = 1",
                  "x = 2; y = 3"],
        "variables": ["x", "y"],
        "milestones": [{"name": "y eliminated", "kind": "isolated", "var": "x", "credit": 0.5}],
        "final_key": {"x": "2", "y": "1"},
    }
    r = post("/v1/grade/steps", payload)
    assert r["first_error_index"] == 3
    assert not r["final_correct"]
    assert 0 < r["score"] < 1  # partial credit for the valid prefix

    payload["lines"][-1] = "x = 2; y = 1"
    r2 = post("/v1/grade/steps", payload)
    assert r2["first_error_index"] is None and r2["final_correct"]
    assert r2["score"] == 1.0


def test_ode_grader():
    base = {"ode": "Derivative(y(x), x) - y(x)", "func": "y", "var": "x"}
    good = post("/v1/grade/ode", {**base, "response": "C1*exp(x)", "order": 1})
    particular = post("/v1/grade/ode", {**base, "response": "exp(x)", "order": 1})
    wrong = post("/v1/grade/ode", {**base, "response": "C1*exp(2*x)", "order": 1})
    ivp = post("/v1/grade/ode",
               {"ode": "Derivative(y(x), x, 2) + y(x)", "func": "y", "var": "x",
                "response": "3*cos(x)", "initial_conditions": {"y(0)": "3"}})
    assert good["correct"] and ivp["correct"]
    assert not particular["correct"] and not wrong["correct"]
    assert "particular solution" in particular["detail"]


def test_eigen_grader():
    m = [[2, 0], [0, 3]]
    good = post("/v1/grade/eigenpair",
                {"matrix": m, "eigenvalue": "3", "eigenvector": ["0", "5"]})
    wrong_vec = post("/v1/grade/eigenpair",
                     {"matrix": m, "eigenvalue": "3", "eigenvector": ["1", "0"]})
    wrong_val = post("/v1/grade/eigenpair",
                     {"matrix": m, "eigenvalue": "7", "eigenvector": ["1", "0"]})
    assert good["correct"]
    assert not wrong_vec["correct"] and "eigenspace" in wrong_vec["detail"]
    assert not wrong_val["correct"] and "not an eigenvalue" in wrong_val["detail"]


def test_antiderivative_grader():
    good = post("/v1/grade/antiderivative",
                {"integrand": "x*cos(x)", "response": "x*sin(x) + cos(x) + 7"})
    bad = post("/v1/grade/antiderivative",
               {"integrand": "x*cos(x)", "response": "x*sin(x)"})
    assert good["correct"] and not bad["correct"]


def test_fourier_grader():
    good = post("/v1/grade/fourier",
                {"f": "x", "period_half": "pi",
                 "a0": "0", "an": "0", "bn": "2*(-1)**(n+1)/n"})
    bad = post("/v1/grade/fourier", {"f": "x", "period_half": "pi", "bn": "2/n"})
    assert good["correct"] and not bad["correct"]


def test_laplace_grader():
    good = post("/v1/grade/laplace",
                {"f": "t*exp(2*t)", "response": "1/(s-2)**2"})
    bad = post("/v1/grade/laplace", {"f": "t*exp(2*t)", "response": "1/(s-2)"})
    assert good["correct"] and not bad["correct"]


def test_template_variant_is_verified_and_hides_key():
    r = post("/v1/template/variant", {"template_kind": "generate_unique_3x3", "seed": 42})
    assert r["verified"] and r["key"] is None
    r2 = post("/v1/template/variant",
              {"template_kind": "generate_unique_3x3", "seed": 42},
              include_key="true")
    assert r2["verified"] and isinstance(r2["key"], list) and len(r2["key"]) == 3


if __name__ == "__main__":
    import sys
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    failed = 0
    for fn in fns:
        try:
            fn()
            print(f"PASS  {fn.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"FAIL  {fn.__name__}: {e}")
    print(f"\n{len(fns) - failed}/{len(fns)} passed")
    sys.exit(1 if failed else 0)
