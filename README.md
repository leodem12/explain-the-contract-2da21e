# Explain the Contract — A PDF Contract Analysis Tool

Turn any PDF contract into a plain-language breakdown: Summary, Key obligations, Risks, Red flags, and Questions to ask before signing. Built for freelancers, small-business owners, and employees who receive contracts but can't afford a lawyer for a basic review.

## What Was Built

A **full-stack web application** (ASP.NET Core 10 backend + Angular frontend) that:

1. **Authenticates users** — Register and sign in with email/password; role-based access (Editor can upload/add notes; Viewer can read only).
2. **Extracts PDF text** — Upload a PDF contract via file picker or drag & drop; app extracts plain text for analysis.
3. **Analyzes with an LLM** — Sends extracted text to Google Gemini (or a mock for offline tests); receives a structured five-section breakdown.
4. **Stores contract history** — Previously processed contracts are listed and can be reopened without re-uploading.
5. **Compares versions** — Upload a newer version of a contract; LLM identifies key differences between the two.
6. **Collaboration via notes** — Editors leave notes on contracts; Viewers can read them but not modify.
7. **Exports results** — Download the analysis as a PDF or Markdown file.

The app runs as a **single Docker container** with an embedded SQLite database — no external services needed.

## How to Install and Run

### Prerequisites
- Docker with WSL engine (Windows) or standard Docker (Linux/Mac)
- `.env` file with LLM credentials (see [Configuration](#configuration) below)

### Quick Start

```bash
# Navigate to the workspace directory
cd workspace/

# Start the app
wsl docker compose up --build --detach

# App is now running at http://localhost:5000
```

To stop:
```bash
wsl docker stop <app_container>
```

To view logs:
```bash
wsl docker compose logs -f
```

### Configuration

The app requires these environment variables (set in `.env` at the workspace root):

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `LLM_PROVIDER` | Yes | `gemini` | Which LLM to use (`gemini` or `mock` for offline tests) |
| `GEMINI_API_KEY` | If `gemini` | `AQ.Ab8R...` | Google Cloud API key for Gemini |
| `GEMINI_MODEL` | If `gemini` | `gemini-2.5-flash` | Model version to call |
| `Jwt__Key` | Yes | (32+ char string) | Secret for signing JWT tokens — must be >= 32 characters |

A template `.env.example` is provided. Copy it and fill in your credentials:

```bash
cp .env.example .env
# Then edit .env with your real API key and JWT secret
```

**Never commit `.env`** — it contains secrets. The `runs/` directory is already in `.gitignore`.

### Running Tests

The backend includes 51 xUnit tests (AuthService, ContractService, AnalysisService with LLM mocking, etc.):

```bash
cd workspace/
dotnet test tests/WebApi.Tests
```

Tests use:
- EF Core InMemory database for isolation
- MockLlmClient (scaffolded adapter) so no API keys or network calls are needed
- All pass offline

## Architecture Overview

### Backend: ASP.NET Core Minimal APIs
- **Language:** C# (.NET 10)
- **Framework:** ASP.NET Core 10 with Minimal APIs
- **Database:** SQLite (embedded file at `app.db` inside the container)
- **Authentication:** JWT (HS256), issued on login
- **PDF extraction:** UglyToad.PdfPig (text-based PDFs only, no OCR)
- **PDF export:** QuestPDF 2024.3.2
- **LLM integration:** ILlmClient adapter (env-driven, supports Gemini or mock)

#### API Endpoints
All endpoints require Bearer JWT authentication (except login/register).

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create account (email, password, Viewer/Editor role) |
| POST | `/api/auth/login` | Authenticate (returns JWT + user) |
| POST | `/api/contracts` | Upload a PDF contract (Editor only) |
| GET | `/api/contracts` | List your contracts |
| GET | `/api/contracts/{id}` | Fetch a contract and its analysis |
| POST | `/api/contracts/{id}/analyze` | Run LLM analysis (or re-run if it failed) |
| POST | `/api/contracts/{id}/compare` | Upload a newer version and get key differences |
| GET | `/api/contracts/{id}/notes` | Read notes on a contract |
| POST | `/api/contracts/{id}/notes` | Add a note (Editor only) |
| GET | `/api/contracts/{id}/export?format=pdf\|markdown` | Download the analysis |

### Frontend: Angular with Material Design
- **Language:** TypeScript
- **Framework:** Angular 21 with standalone components
- **UI Components:** Angular Material (v21)
- **Styling:** Custom Material theme (Periwinkle indigo primary, Copper secondary)
- **Fonts:** Space Grotesk (UI) + Newsreader serif (rendered analysis)

#### Screens
1. **Sign In / Create Account** — Authentication
2. **My Contracts** — List of uploaded contracts (sortable, paginated)
3. **Upload Contract** — File picker + drag & drop with optional language selector
4. **Contract Analysis** — Five expansion panels (Summary, Key Obligations, Risks, Red Flags, Questions); notes sidebar; Export buttons
5. **Version Comparison** — Key differences between two contract versions

## Database & Data Model

SQLite schema created automatically at startup (`EnsureCreated`):

| Table | Purpose |
|-------|---------|
| `Users` | Email, BCrypt password hash, role (Viewer/Editor) |
| `Contracts` | Uploaded PDFs, extracted text, status (Extracted/Analysed/AnalysisFailed), version tracking |
| `Analyses` | Five sections (summary, keyObligations, risks, redFlags, questions) as JSON strings, language |
| `Notes` | Per-contract collaboration notes, author, timestamp |

All queries are scoped by the logged-in user's ID — one user's contracts are never visible to another.

## Known Limitations

1. **PDF extraction is text-based only** — Scanned PDFs or image-only documents will fail with a clear error. No OCR.
2. **UglyToad.PdfPig is a prerelease** — Uses version 1.7.0-custom-5 (no stable release); functionality is production-ready.
3. **JWT tokens stored in localStorage** — Hackathon-scope tradeoff; a production app should use HttpOnly cookies + CSRF tokens.
4. **QuestPDF uses Community License** — Free for non-commercial use; a commercial deployment requires a commercial license or a different export library.
5. **Comparison generates key-differences text only** — No visual diff highlighting; LLM returns a list of plain-text changes.
6. **File upload size limit: 20 MB** — Enforced to prevent DoS; adjust via `Kestrel:Limits:MaxRequestBodySize` if needed.
7. **LLM analysis has a timeout and single retry** — If Gemini is unavailable, the app returns HTTP 503 and the user can retry; the contract is preserved for re-analysis.

## Performance Notes

- **Startup:** ~3 seconds (dotnet runtime + schema creation on first run)
- **PDF upload:** Depends on file size and network latency; typical 2–5 seconds for a 1 MB contract
- **LLM analysis:** Depends on Gemini API latency; typical 5–15 seconds for a short contract
- **Subsequent analysis views:** <100 ms (cached in database)
- **Build time:** ~2 min for `dotnet build` (includes Angular build to `web/dist/`)

## Development & Troubleshooting

### App fails to start
- **Missing `Jwt__Key`:** Error message says "JWT key not configured." Set `Jwt__Key` in `.env`.
- **API key missing/invalid:** If using Gemini, check `GEMINI_API_KEY` and `GEMINI_MODEL` in `.env`.
- **Port 5000 in use:** Change the docker-compose.yml port mapping or stop the conflicting service.

### PDF upload fails with "not a readable PDF"
- Ensure the file is a text-based PDF (not scanned/image-only).
- Try a different PDF file to isolate the issue.

### Analysis returns "AI service unavailable"
- Check your Gemini API key and quota.
- Fallback: Set `LLM_PROVIDER=mock` in `.env` to use the offline mock (returns a fixed stub response).
- Retry: The contract is preserved; click **Analyse** again once the service is back.

### How to reset the database
Stop the container and delete the `app.db` file inside the container, or rebuild:
```bash
wsl docker compose down -v  # Remove containers and volumes
wsl docker compose up --build --detach  # Rebuild and start fresh
```

## Deployment Notes

The Dockerfile:
1. Builds the .NET app from source (`dotnet publish` Release mode)
2. Builds the Angular app via the `ng build` step in the prior implement stage
3. Copies the pre-built Angular SPA (`web/dist/`) into `wwwroot/`
4. Exposes port 5000 with `ASPNETCORE_URLS=http://+:5000`

The app serves both the API (`/api/*`) and the static frontend from the same container. No separate reverse proxy needed.

### Environment on Deployment
In production, populate `.env` (or pass vars via `docker compose --env-file`) with:
- A **strong, random `Jwt__Key`** (>= 32 characters, high entropy)
- Valid **Gemini API credentials**
- Set `LLM_PROVIDER=gemini` (or `mock` for testing without API keys)

---

**Questions or issues?** See the DEMO.md for a step-by-step walkthrough of the happy path.
