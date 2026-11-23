"""Download and verify the official UCI Online Retail dataset (UCI ID: 352)."""

from __future__ import annotations

import hashlib
import io
import urllib.request
import zipfile
from pathlib import Path

UCI_ZIP_URL = "https://archive.ics.uci.edu/static/public/352/online+retail.zip"
DATA_DIR = Path(__file__).resolve().parents[1] / "data"
OUTPUT_XLSX = DATA_DIR / "online_retail.xlsx"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def download_online_retail(force: bool = False) -> Path:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if OUTPUT_XLSX.exists() and not force:
        print(f"Dataset already exists: {OUTPUT_XLSX} ({OUTPUT_XLSX.stat().st_size:,} bytes)")
        print(f"SHA-256: {sha256_file(OUTPUT_XLSX)}")
        return OUTPUT_XLSX

    print(f"Downloading official UCI Online Retail dataset from {UCI_ZIP_URL} ...")
    req = urllib.request.Request(UCI_ZIP_URL, headers={"User-Agent": "KERNEL-ORBIT/1.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        raw_bytes = resp.read()

    print(f"Downloaded archive: {len(raw_bytes):,} bytes")
    with zipfile.ZipFile(io.BytesIO(raw_bytes)) as zf:
        xlsx_members = [m for m in zf.namelist() if m.lower().endswith(".xlsx")]
        if not xlsx_members:
            raise RuntimeError(f"No .xlsx file found inside archive: {zf.namelist()}")
        member = xlsx_members[0]
        print(f"Extracting {member} -> {OUTPUT_XLSX}")
        with zf.open(member) as src, OUTPUT_XLSX.open("wb") as dst:
            dst.write(src.read())

    print(f"Saved: {OUTPUT_XLSX} ({OUTPUT_XLSX.stat().st_size:,} bytes)")
    print(f"SHA-256: {sha256_file(OUTPUT_XLSX)}")
    return OUTPUT_XLSX


if __name__ == "__main__":
    download_online_retail()
