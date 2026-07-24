FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# RDKit wheels need a couple of shared libraries at runtime.
RUN apt-get update && apt-get install -y --no-install-recommends \
      libxrender1 libxext6 libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# chem_core is a first party package, installed in editable form so the image
# and the test environment resolve it identically.
COPY packages/chem_core /app/packages/chem_core
RUN pip install --no-cache-dir -e /app/packages/chem_core

COPY apps/api /app

EXPOSE 8500
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8500"]
