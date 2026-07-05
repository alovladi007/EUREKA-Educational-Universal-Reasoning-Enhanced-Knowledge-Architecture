"""Celery worker package.

Phase 0 ships the worker scaffold and one sample task so the async plumbing
(broker, backend, worker, beat) is proven end to end. The heavy jobs (grading,
item generation, analytics rollups, proctoring analysis) attach here in later
phases.
"""
