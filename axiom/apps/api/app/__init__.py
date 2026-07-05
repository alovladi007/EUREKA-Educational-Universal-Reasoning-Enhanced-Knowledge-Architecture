"""AXIOM API gateway and modular monolith.

Phase 0 runs the identity and dashboard domains in a single FastAPI process.
The services/ directory holds README stubs for the future extraction into
separate deployables (microservices-lite), but the domain boundaries already
live under app/domains so the split is mechanical when the time comes.
"""

__version__ = "0.1.0"
