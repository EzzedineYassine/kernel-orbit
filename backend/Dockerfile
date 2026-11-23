FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    OPENBLAS_NUM_THREADS=1 \
    OMP_NUM_THREADS=1 \
    PORT=8000

WORKDIR /app

# OpenMP runtime required by implicit / scikit-learn C++ extensions
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY scripts ./scripts
COPY data/README.md ./data/README.md

# Download the official UCI Online Retail dataset and materialize the fast
# parquet cache at build time so container cold starts take ~1-2s, then
# drop the 23MB raw xlsx to keep the production image lean.
RUN python scripts/download_dataset.py \
    && python -c "from app.orbit.preprocessing import get_orbit_dataset; ds = get_orbit_dataset(); print(f'Cached UCI Online Retail: {ds.stats.num_users} users x {ds.stats.num_items} items ({ds.stats.train_interactions} interactions)')" \
    && rm -f data/online_retail.xlsx

EXPOSE 8000

CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
