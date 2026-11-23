# Local Dataset Directory (`backend/data/`)

This directory holds the local copy of the official **UCI Online Retail** dataset (`ID: 352`, https://archive.ics.uci.edu/dataset/352/online+retail).

Large binary files (`*.xlsx`, `*.parquet`, `*.zip`) are git-ignored in the repository root `.gitignore`. To download or re-verify the dataset locally, run:

```powershell
cd backend
.\.venv\Scripts\python.exe scripts\download_dataset.py
```

Expected file:
- `online_retail.xlsx` (`23,715,344` bytes, `541,909` transaction rows)
- SHA-256: `43465a06f2ccf7c8b5bd2892bc7defb52f97487934fe93b16ae4c3936424676d`
