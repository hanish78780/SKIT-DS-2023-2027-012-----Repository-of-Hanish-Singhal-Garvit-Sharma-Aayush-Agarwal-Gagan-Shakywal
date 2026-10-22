# Progress report generator

Run commands from the repository root so Git history and the repository name are resolved in the same way as the scheduled workflow.

```powershell
python -m pip install -r scripts/reports/requirements.txt
python scripts/reports/generate_report.py weekly
```

The existing tool also accepts `monthly` and `final`. It writes a PDF to the current directory. Weekly PDFs are archived in `docs/reports/weekly/`; generated PDFs in the root are ignored until moved to the archive.

The workflow `.github/workflows/auto_weekly_report.yml` runs every Thursday at 23:59 IST, with manual dispatch also available. It invokes this script and commits the resulting PDF to the weekly archive. Existing historical PDFs are retained unchanged.
