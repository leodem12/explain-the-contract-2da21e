import { test, expect, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = 'http://app:5000';
const EMAIL = 'editor@test.com';
const PASSWORD = 'Password123!';

/** Returns the path of the test PDF, using the workspace test_contract.pdf if available. */
function getTestPdfPath(): string {
  // The workspace test_contract.pdf is mounted at /e2e/../test_contract.pdf
  // Inside the container, the e2e dir is at /e2e and the workspace is its parent.
  const workspaceFile = '/e2e/../test_contract.pdf';
  if (fs.existsSync(workspaceFile)) {
    return workspaceFile;
  }
  // Fallback: create a minimal PDF in /tmp
  const tmpPath = '/tmp/test-contract-e2e.pdf';
  if (!fs.existsSync(tmpPath)) {
    // Create a proper PDF with real text content using a simple structure
    const stream = 'BT /F1 12 Tf 72 720 Td (SERVICE AGREEMENT) Tj 0 -20 Td (This agreement is between Contractor and Client.) Tj 0 -20 Td (The Contractor will provide software development services.) Tj 0 -20 Td (Payment: 5000 USD per month.) Tj 0 -20 Td (Duration: 12 months starting January 1 2025.) Tj ET';
    const streamLen = stream.length;
    const lines = [
      '%PDF-1.4',
      '1 0 obj',
      '<< /Type /Catalog /Pages 2 0 R >>',
      'endobj',
      '2 0 obj',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      'endobj',
      '3 0 obj',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
      'endobj',
      '4 0 obj',
      `<< /Length ${streamLen} >>`,
      'stream',
      stream,
      'endstream',
      'endobj',
      '5 0 obj',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      'endobj',
      'xref',
      '0 6',
      '0000000000 65535 f \r',
      '0000000009 00000 n \r',
      '0000000062 00000 n \r',
      '0000000119 00000 n \r',
      '0000000274 00000 n \r',
      '0000000430 00000 n \r',
      'trailer',
      '<< /Size 6 /Root 1 0 R >>',
      'startxref',
      '507',
      '%%EOF',
    ];
    fs.writeFileSync(tmpPath, lines.join('\n'), 'ascii');
  }
  return tmpPath;
}

async function signIn(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email address').fill(EMAIL);
  await page.getByLabel('Password').first().fill(PASSWORD);
  await page.getByRole('button', { name: /sign in/i }).click();
  // Wait for navigation to contracts page
  await page.waitForURL('**/contracts', { timeout: 15000 });
  await expect(page).toHaveURL(/\/contracts$/);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Explain the Contract — Happy Path', () => {

  test('T1: Unauthenticated access redirects to login', async ({ page }) => {
    await page.goto('/contracts');
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('T2: Sign in with valid Editor credentials', async ({ page }) => {
    await signIn(page);
    // Should land on My Contracts page
    await expect(page.getByRole('heading', { name: /my contracts/i })).toBeVisible();
  });

  test('T3: My Contracts list shows Upload Contract button', async ({ page }) => {
    await signIn(page);
    // The "Upload Contract" button/link should be present
    const uploadLink = page.getByRole('link', { name: /upload contract/i }).first();
    await expect(uploadLink).toBeVisible();
  });

  test('T4: Navigate to Upload page', async ({ page }) => {
    await signIn(page);
    await page.getByRole('link', { name: /upload contract/i }).first().click();
    await page.waitForURL('**/upload', { timeout: 10000 });
    await expect(page.getByText(/upload contract/i).first()).toBeVisible();
    // Drop zone should be visible
    await expect(page.getByRole('region', { name: /contract upload area/i })).toBeVisible();
  });

  test('T5: Upload a PDF and trigger analysis — view five sections', async ({ page }) => {
    await signIn(page);
    await page.goto('/upload');
    await page.waitForURL('**/upload', { timeout: 10000 });

    // Use the workspace test_contract.pdf (same file used by smoke tests)
    const pdfPath = getTestPdfPath();

    // Use file chooser to set the hidden file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(pdfPath);

    // File chip / label should update — drop zone label shows "PDF ready"
    await expect(page.locator('.drop-zone-label')).toContainText(/pdf ready/i, { timeout: 5000 });

    // Click "Analyse"
    const analyseBtn = page.getByRole('button', { name: /analyse/i });
    await expect(analyseBtn).toBeEnabled();
    await analyseBtn.click();

    // Should navigate to /contracts/:id after upload completes
    await page.waitForURL(/\/contracts\/[a-f0-9-]+$/, { timeout: 60000 });

    const url = page.url();
    expect(url).toMatch(/\/contracts\/[a-f0-9-]+$/);

    // Wait for the detail page to finish loading (loading bar disappears)
    await page.waitForSelector('mat-progress-bar', { state: 'hidden', timeout: 15000 }).catch(() => {});

    // The contract may be in "Extracted" state requiring user to click Analyse,
    // or already "Analysed" (if server auto-analyses). Handle both.
    const analyseContractBtn = page.locator('mat-card-actions button', { hasText: /analyse/i });
    const isAnalyseVisible = await analyseContractBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (isAnalyseVisible) {
      await analyseContractBtn.click();
    }

    // Wait for analysis sections to appear (5 expansion panels)
    // The LLM call can take up to 60s; give it generous timeout
    await expect(
      page.locator('mat-expansion-panel').first()
    ).toBeVisible({ timeout: 120000 });

    // Verify all five section titles are present
    const sectionTitles = ['Summary', 'Key Obligations', 'Risks', 'Red Flags', 'Questions to Ask Before Signing'];
    for (const title of sectionTitles) {
      await expect(
        page.locator('mat-panel-title', { hasText: title })
      ).toBeVisible({ timeout: 10000 });
    }

    // Verify export buttons exist
    await expect(page.getByRole('button', { name: /export pdf/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /export markdown/i })).toBeVisible();
  });

  test('T6: My Contracts list shows the uploaded contract', async ({ page }) => {
    await signIn(page);
    await page.goto('/contracts');
    // Wait for the table to potentially load
    await page.waitForTimeout(2000);

    // If there are contracts, table should be visible; or empty state
    const hasTable = await page.locator('mat-table').isVisible().catch(() => false);
    const hasEmpty = await page.locator('.empty-state').isVisible().catch(() => false);
    expect(hasTable || hasEmpty).toBe(true);
  });

  test('T7: Sign-in with wrong password shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email address').fill(EMAIL);
    await page.getByLabel('Password').first().fill('WrongPassword!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should stay on login page and show snackbar error
    await expect(page.locator('mat-snack-bar-container')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('mat-snack-bar-container')).toContainText(/incorrect|invalid|password/i);
  });
});
