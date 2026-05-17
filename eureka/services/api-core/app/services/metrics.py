"""
Phase 14.3 — Prometheus metrics.

Tiny self-contained Prometheus exposition format. We don't pull in the
`prometheus_client` library to keep dependencies lean — the format is a
handful of lines, and we only need counters + gauges + histograms with one
default-bucket histogram for HTTP latency.

If `prometheus_client` is installed later, we can swap the implementation
without touching call sites.
"""

from __future__ import annotations

import threading
import time
from collections import defaultdict
from typing import Iterable

_LOCK = threading.Lock()


class _Counter:
    def __init__(self, name: str, help_text: str, labels: Iterable[str] = ()):
        self.name = name
        self.help_text = help_text
        self.labels = tuple(labels)
        self._values: dict[tuple[str, ...], float] = defaultdict(float)

    def inc(self, amount: float = 1.0, **label_values) -> None:
        key = tuple(label_values.get(lbl, "") for lbl in self.labels)
        with _LOCK:
            self._values[key] += amount

    def expose(self) -> list[str]:
        out = [f"# HELP {self.name} {self.help_text}", f"# TYPE {self.name} counter"]
        if not self.labels:
            v = self._values.get((), 0.0)
            out.append(f"{self.name} {v}")
        else:
            for key, v in self._values.items():
                labels = ",".join(f'{lbl}="{val}"' for lbl, val in zip(self.labels, key))
                out.append(f"{self.name}{{{labels}}} {v}")
        return out


class _Gauge:
    def __init__(self, name: str, help_text: str, labels: Iterable[str] = ()):
        self.name = name
        self.help_text = help_text
        self.labels = tuple(labels)
        self._values: dict[tuple[str, ...], float] = defaultdict(float)

    def set(self, value: float, **label_values) -> None:
        key = tuple(label_values.get(lbl, "") for lbl in self.labels)
        with _LOCK:
            self._values[key] = float(value)

    def expose(self) -> list[str]:
        out = [f"# HELP {self.name} {self.help_text}", f"# TYPE {self.name} gauge"]
        if not self.labels:
            v = self._values.get((), 0.0)
            out.append(f"{self.name} {v}")
        else:
            for key, v in self._values.items():
                labels = ",".join(f'{lbl}="{val}"' for lbl, val in zip(self.labels, key))
                out.append(f"{self.name}{{{labels}}} {v}")
        return out


class _Histogram:
    """Single histogram with Prometheus-default buckets (in seconds)."""
    BUCKETS = (0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0)

    def __init__(self, name: str, help_text: str, labels: Iterable[str] = ()):
        self.name = name
        self.help_text = help_text
        self.labels = tuple(labels)
        # per-label-tuple: list of bucket counters + sum + count
        self._buckets: dict[tuple[str, ...], list[int]] = defaultdict(
            lambda: [0] * len(self.BUCKETS)
        )
        self._sum: dict[tuple[str, ...], float] = defaultdict(float)
        self._count: dict[tuple[str, ...], int] = defaultdict(int)

    def observe(self, seconds: float, **label_values) -> None:
        key = tuple(label_values.get(lbl, "") for lbl in self.labels)
        with _LOCK:
            self._count[key] += 1
            self._sum[key] += seconds
            for i, edge in enumerate(self.BUCKETS):
                if seconds <= edge:
                    self._buckets[key][i] += 1

    def expose(self) -> list[str]:
        out = [
            f"# HELP {self.name} {self.help_text}",
            f"# TYPE {self.name} histogram",
        ]
        all_keys = set(self._count.keys()) | set(self._sum.keys()) | set(self._buckets.keys())
        if not all_keys:
            all_keys = {()}
        for key in sorted(all_keys):
            base_labels = ",".join(f'{lbl}="{val}"' for lbl, val in zip(self.labels, key))
            sep = "," if base_labels else ""
            buckets = self._buckets.get(key, [0] * len(self.BUCKETS))
            cumulative = 0
            for i, edge in enumerate(self.BUCKETS):
                cumulative += buckets[i]
                out.append(
                    f'{self.name}_bucket{{{base_labels}{sep}le="{edge}"}} {cumulative}'
                )
            count = self._count.get(key, 0)
            out.append(
                f'{self.name}_bucket{{{base_labels}{sep}le="+Inf"}} {count}'
            )
            out.append(f"{self.name}_sum{{{base_labels}}} {self._sum.get(key, 0.0)}")
            out.append(f"{self.name}_count{{{base_labels}}} {count}")
        return out


# ---------------------------------------------------------------------------
# Public metrics
# ---------------------------------------------------------------------------

http_requests_total = _Counter(
    "eureka_http_requests_total",
    "Total HTTP requests by method + path-prefix + status.",
    labels=("method", "path_prefix", "status"),
)
http_request_duration_seconds = _Histogram(
    "eureka_http_request_duration_seconds",
    "HTTP request latency in seconds.",
    labels=("method", "path_prefix"),
)
jobs_executed_total = _Counter(
    "eureka_jobs_executed_total",
    "Background jobs that have terminated, by kind + outcome.",
    labels=("kind", "outcome"),
)
jobs_queue_depth = _Gauge(
    "eureka_jobs_queue_depth",
    "Most recent observed background_jobs row count by status.",
    labels=("status",),
)
cache_hits_total = _Counter("eureka_cache_hits_total", "Cache hits.")
cache_misses_total = _Counter("eureka_cache_misses_total", "Cache misses.")


def _path_prefix(path: str) -> str:
    """Cardinality control: only keep the first two URL segments."""
    parts = [p for p in path.split("/") if p]
    return "/" + "/".join(parts[:2]) if parts else "/"


def observe_http(*, method: str, path: str, status: int, duration_seconds: float) -> None:
    prefix = _path_prefix(path)
    http_requests_total.inc(method=method, path_prefix=prefix, status=str(status))
    http_request_duration_seconds.observe(duration_seconds, method=method, path_prefix=prefix)


def expose() -> str:
    lines: list[str] = []
    for m in (
        http_requests_total, http_request_duration_seconds,
        jobs_executed_total, jobs_queue_depth,
        cache_hits_total, cache_misses_total,
    ):
        lines.extend(m.expose())
    return "\n".join(lines) + "\n"
