# AXIOM API image. Build context is the axiom/ repo root so the local packages
# can be copied and installed.
#   docker build -f apps/api/Dockerfile -t axiom-api .
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Runtime deps first for layer caching.
COPY apps/api/requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

# Lean 4 toolchain for the formal-proof track (Curriculum & Proof Extension,
# Section 4.1). Pinned and installed as its own early layer so it is cached
# across app-code rebuilds. This bundles the core Lean 4 kernel only; Mathlib is
# NOT bundled (it is multi-GB and would balloon the image), so core-kernel and
# Natural-Number-Game-style proofs verify, while proofs that `import Mathlib`
# will not resolve. Enable it with AXIOM_FORMAL_VERIFIER=lean (set in compose).
# Production should run this in a dedicated sandboxed container; the verifier
# interface does not change when it does.
ENV ELAN_HOME=/opt/elan
ENV PATH="/opt/elan/bin:${PATH}"
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl git ca-certificates \
    && curl -fsSL https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh \
       -o /tmp/elan-init.sh \
    && sh /tmp/elan-init.sh -y --default-toolchain leanprover/lean4:v4.31.0 \
    && rm -rf /tmp/elan-init.sh /var/lib/apt/lists/* \
    && lean --version

# Real neural embedding model for copilot semantic retrieval (Build prompt
# Section 5). CPU-only torch + sentence-transformers, installed as their own
# cached layer, and the all-MiniLM-L6-v2 weights pre-downloaded so the image is
# self-contained (no first-request network fetch). This is a large layer (~1GB);
# a deployment that wants a smaller image can drop this and set
# AXIOM_EMBEDDING_PROVIDER=hash to fall back to the offline hashed embedder.
ENV HF_HOME=/opt/hf
RUN pip install --index-url https://download.pytorch.org/whl/cpu torch \
    && pip install sentence-transformers \
    && python -c "from sentence_transformers import SentenceTransformer as S; S('sentence-transformers/all-MiniLM-L6-v2')"

# Local workspace packages.
COPY packages/shared_schemas /app/packages/shared_schemas
COPY packages/events /app/packages/events
COPY packages/math_core /app/packages/math_core
RUN pip install /app/packages/shared_schemas /app/packages/events /app/packages/math_core

# Application code.
COPY apps/api /app/api
WORKDIR /app/api

EXPOSE 8400
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8400"]
