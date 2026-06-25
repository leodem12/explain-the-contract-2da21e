# Explain the Contract — Demo Walkthrough

A step-by-step guide to demonstrate the app live. Everything below has been verified end-to-end by smoke testing and browser automation.

## Prerequisites

Before you start:
1. Ensure `.env` is configured with valid LLM credentials (see [README.md § Configuration](README.md#configuration))
2. Docker is running
3. No other service is using port 5000

**Time to complete:** ~3 minutes for the happy path

---

## Step 1: Start the App

From the `workspace/` directory:

```bash
wsl docker compose up --build --detach
```

Expected output:
```
[+] Running 1/1
 ✔ Container sdlc-20260623-102731-2da21e-app-1  Started
```

The app is now accessible at **http://localhost:5000**

🔗 **Open in your browser:** http://localhost:5000

---

## Step 2: Sign In (or Create an Account First)

**Sign In page** appears with two fields: Email and Password.

### Option A: Sign in with the test account
- **Email:** `editor@test.com`
- **Password:** `Password123!`
- Click **Sign In**

### Option B: Create a new account
- Click **Create Account**
- Enter a new email (e.g., `test123@example.com`)
- Enter a password (min. 8 characters, e.g., `TestPass123!`)
- Select your role: **Editor** (to upload contracts) or **Viewer** (read-only)
- Click **Create Account**
- You'll be logged in automatically and redirected to the next screen

**Expected:** After successful login, the page shows **"My Contracts"** header with an **"Upload Contract"** button and an empty contract list (or your previously uploaded contracts).

💡 **If sign in fails:** Check your email/password, or try the test account `editor@test.com` / `Password123!`

---

## Step 3: Upload a Contract

On the **My Contracts** screen, click **"Upload Contract"** button.

**Upload screen** appears with:
- A **drop zone** (gray dashed box) with text "Drag a PDF here or click to select"
- A **Language** dropdown (defaults to "Auto-detect")

### Upload a PDF

**Option A: File picker**
- Click anywhere in the drop zone
- A file browser opens
- Select a PDF file (we'll use `test_contract.pdf` from the workspace, or use your own)
- Click **Open**

**Option B: Drag & drop**
- Drag a PDF file from your desktop/file explorer
- Drop it onto the drop zone

After selection:
- The file name appears in the drop zone as a chip (e.g., "test_contract.pdf")
- A blue **"Analyse"** button appears below the drop zone

### (Optional) Change the output language

By default, the analysis is produced in the contract's detected language. To request a different language:
- Click the **Language** dropdown
- Select a language (e.g., "Spanish", "French")
- Click **Analyse**

**Expected:** 
- The app shows a progress spinner
- After 5–15 seconds, the page redirects to the **Contract Analysis** screen

🔗 The URL changes to something like `/contracts/042339cc-d10f-4b3a-a5ca-c7cd5f48dcbf`

💡 **If upload fails with "not a readable PDF":** The file is likely a scanned/image-only PDF with no extractable text. Try a different PDF or use `test_contract.pdf` from the workspace.

---

## Step 4: View the Analysis

The **Contract Analysis** screen displays the contract's breakdown under five collapsible sections:

### Sections visible on screen

1. **Summary** — What the contract is about, the parties involved, duration, key financials
2. **Key Obligations** — What each party must do
3. **Risks** — Penalties, liability limits, indemnification clauses
4. **Red Flags** — Auto-renewal clauses, hidden fees, unilateral termination, vague terms
5. **Questions to Ask Before Signing** — Specific gaps or ambiguities the user should clarify

### Interacting with the analysis

- Click any section header to **expand/collapse** its content
- Each section shows plain-language bullet points (not legal jargon)
- On a desktop browser, a **Notes panel** appears on the right side (collapsible on mobile)

**Expected:**
- All five sections are populated with real analysis text (not empty)
- Text is readable and relevant to the uploaded contract

---

## Step 5: (Optional) Add a Note

If you are logged in as an **Editor**, you can annotate the contract:

1. On the right side of the **Contract Analysis** screen, find the **Notes** section
2. Click the input field at the bottom (placeholder: "Add a note...")
3. Type a note (e.g., "Verify payment terms with client")
4. Click **Add Note** or press Enter

**Expected:**
- Your note appears in the list above with your email and a timestamp
- **Viewers** will see this note but cannot add or delete notes

💡 If you're a **Viewer**, the note input field is hidden. Only Editors can add notes.

---

## Step 6: Export the Analysis

On the **Contract Analysis** screen, find the **Export** buttons at the top right (or bottom, depending on scroll):

- **Export PDF** — Downloads the five sections as a nicely formatted PDF file
- **Export Markdown** — Downloads the five sections as a Markdown document

### Export to PDF

Click **Export PDF**:
- The browser downloads a file named `contract_analysis_[date].pdf`
- Open it in your PDF reader
- You'll see the five sections with clear headers, ready to share or archive

### Export to Markdown

Click **Export Markdown**:
- The browser downloads a file named `contract_analysis_[date].md`
- Open it in any text editor
- You'll see the five sections in Markdown format (easily importable into Notion, Obsidian, etc.)

**Expected:**
- Files download without errors
- PDF is readable; Markdown has proper headers and formatting

---

## Step 7: (Optional) Compare a New Version

If you upload a newer version of the same contract, the app can show key differences.

1. On the **My Contracts** screen, find a previously uploaded contract in the list
2. Click **"Compare Version"** action on that row
3. Upload a different version of the contract (or a modified PDF)
4. Click **Analyse**

**Expected:**
- The app shows a **Comparison** screen
- A list of key differences appears (e.g., "Payment amount increased", "Termination clause removed")

---

## Step 8: Return to Contract History

To review your contracts:

1. Click the **"My Contracts"** link in the top navigation (or the logo)
2. The contract list shows all your uploaded PDFs
3. Columns display: File name, Status (Extracted / Analysed / AnalysisFailed), Upload date
4. Sort by any column (click the header)
5. Paginate (5 contracts per page by default)

Click any row to reopen that contract's saved analysis (no re-upload, instant load).

**Expected:**
- Your previously uploaded contracts are listed
- No other user's contracts appear (data is private)
- Status updates correctly after analysis

---

## Step 9: Sign Out

To log out:

1. Look for the **"Sign Out"** button in the top right corner of the toolbar
2. Click it

**Expected:**
- You are redirected to the **Sign In** page
- Your session is cleared

---

## Fallback & Troubleshooting

### "AI service unavailable" error during analysis

**What happened:** The Gemini API is rate-limited, unavailable, or the API key is invalid.

**Recovery:**
1. Wait 30 seconds
2. On the analysis screen, you'll see a **Retry** button or a message prompting you to retry
3. Click **Retry** — the app re-runs the LLM analysis without re-uploading the contract

**Alternative:** If you want to test without using your API quota:
1. Stop the app: `wsl docker stop <container_name>`
2. Edit `.env`: Change `LLM_PROVIDER=mock`
3. Restart: `wsl docker compose up --build --detach`
4. Log in again and upload a contract — the analysis will return a fixed stub response (offline mode, no API calls)

### "Wrong credentials" error on sign in

**Recovery:**
1. Try the test account: `editor@test.com` / `Password123!`
2. If you created a custom account, double-check your email/password spelling
3. If you forgot your password: Create a new account with a different email and try again

### PDF upload hangs or times out

**What happened:** The file is very large (>20 MB) or a corrupted/malformed PDF.

**Recovery:**
1. Try a different PDF file
2. Check the file size: `ls -lh test_contract.pdf` (should be < 20 MB)
3. Use `test_contract.pdf` from the workspace (known to work)

### Database is "locked" or app crashes after upload

**Recovery:**
```bash
# Stop and remove containers (database resets)
wsl docker compose down -v

# Rebuild and start fresh
wsl docker compose up --build --detach

# Log in again and try the upload once more
```

---

## Container & Database Reference

### List running containers
```bash
wsl docker ps
```

Expected output includes a row with `sdlc-20260623-102731-2da21e-app-1` (running on port 5000).

### Stop the app container
```bash
wsl docker stop sdlc-20260623-102731-2da21e-app-1
```

Or stop all running containers:
```bash
wsl docker stop $(wsl docker ps -q)
```

### View app logs
```bash
wsl docker compose logs -f app
```

Press Ctrl+C to exit the log tail.

### Database: SQLite

The app uses an **embedded SQLite database** (no separate Docker service).

The database file (`app.db`) is created inside the container at startup and persists in a Docker volume. To inspect or query it:

#### Option 1: Exec into the container
```bash
wsl docker exec -it sdlc-20260623-102731-2da21e-app-1 bash
sqlite3 /app/app.db
```

Then run SQL queries (see examples below).

#### Option 2: Copy the database out
```bash
wsl docker cp sdlc-20260623-102731-2da21e-app-1:/app/app.db ./app.db
sqlite3 ./app.db
```

### Sample SQLite Queries

Inside `sqlite3`, you can explore the schema and data:

**List all tables:**
```sql
.tables
```

**Count uploaded contracts:**
```sql
SELECT COUNT(*) FROM "Contracts";
```

**Show contract filenames and status:**
```sql
SELECT "FileName", "Status", "UploadedAt" FROM "Contracts" LIMIT 10;
```

**List all analyses (5 sections per analysis):**
```sql
SELECT "ContractId", "Summary", "KeyObligations", "Risks" FROM "Analyses" LIMIT 5;
```

**Show all notes with their author emails:**
```sql
SELECT N."Text", U."Email", N."CreatedAt" 
FROM "Notes" N
JOIN "Users" U ON N."AuthorUserId" = U."Id"
ORDER BY N."CreatedAt" DESC;
```

**Exit sqlite3:**
```
.exit
```

---

## Summary

You've walked through:
✓ Starting the app  
✓ Signing in  
✓ Uploading a PDF  
✓ Viewing the five-section analysis  
✓ Adding notes (if Editor)  
✓ Exporting to PDF/Markdown  
✓ Reviewing contract history  
✓ (Optional) Comparing versions  
✓ Signing out  

All steps verified in smoke testing. If you hit any issues, refer to the [README.md](README.md) troubleshooting section or the fallback notes above.

---

**Questions?** The source code is in the `workspace/` directory:
- **Backend:** `api/` (C# / ASP.NET Core)
- **Frontend:** `web/` (Angular)
- **Tests:** `tests/` (xUnit)
- **LLM Adapter:** `LlmAdapter/` (env-driven, no vendor SDK calls)
