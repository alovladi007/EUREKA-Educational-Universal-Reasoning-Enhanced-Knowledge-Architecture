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
