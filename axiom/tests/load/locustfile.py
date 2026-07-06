"""Load test for the AXIOM API (Locust).

Models a signed-in learner working the practice loop and reading their dashboard,
which is the hot path. Each simulated user signs in once via dev-login, then
loops: read the dashboard, fetch a question, and answer it.

Run against a running stack:

    pip install locust
    locust -f tests/load/locustfile.py --host http://localhost:8400

Then open http://localhost:8089 and set the user count and spawn rate. Headless:

    locust -f tests/load/locustfile.py --host http://localhost:8400 \
        --headless -u 50 -r 10 --run-time 2m

The dev-login endpoint is only enabled outside production, so this drives a real
authenticated session locally without standing up EUREKA.
"""

from __future__ import annotations

from locust import HttpUser, between, task


class Learner(HttpUser):
    wait_time = between(0.5, 2.0)

    def on_start(self) -> None:
        self.token = ""
        resp = self.client.post("/api/v1/auth/dev-login", name="auth: dev-login")
        if resp.status_code == 200:
            self.token = resp.json().get("access_token", "")

    def _auth(self) -> dict:
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    @task(1)
    def health(self) -> None:
        self.client.get("/health", name="health")

    @task(3)
    def dashboard(self) -> None:
        self.client.get(
            "/api/v1/dashboard/summary", headers=self._auth(), name="dashboard: summary"
        )

    @task(6)
    def practice_loop(self) -> None:
        served = self.client.post(
            "/api/v1/practice/next", headers=self._auth(), name="practice: next", json={}
        )
        if served.status_code != 200:
            return
        body = served.json()
        token = body.get("response_token")
        if not token:
            return  # a "done" response
        # Submit a plausible answer for the served kind; correctness is not the
        # point, only that the grade path runs under load.
        answer = "0" if body.get("kind") == "mcq_single" else "1"
        self.client.post(
            "/api/v1/practice/answer",
            headers=self._auth(),
            name="practice: answer",
            json={"response_token": token, "answer": answer},
        )
