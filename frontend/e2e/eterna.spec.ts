import { test, expect } from '@playwright/test';

test.describe('Eterna Platform End-to-End Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should display hero section and vetted talent engineers', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Indonesian Tech Talent');
    await expect(page.locator('.hero-stats-row')).toBeVisible();

    const talentCards = page.locator('.talent-card');
    await expect(talentCards).toHaveCount(5);
  });

  test('should filter engineers by tech stack Java 21', async ({ page }) => {
    const javaPill = page.locator('.filter-pill:has-text("Java 21")');
    await javaPill.click();

    // Verify filtered cards all have Java skills (Arya, Rizky, Siti, Bagus)
    const cards = page.locator('.talent-card');
    await expect(cards).toHaveCount(4);
  });

  test('should open engineer profile modal with timezone overlap matrix', async ({ page }) => {
    const viewProfileBtn = page.locator('.talent-card button:has-text("View Profile")').first();
    await viewProfileBtn.click();

    const modal = page.locator('.modal-card');
    await expect(modal).toBeVisible();
    await expect(modal.locator('.timezone-overlap-box')).toContainText('Global Timezone Overlap Matrix');

    await modal.locator('.btn-close').click();
    await expect(modal).not.toBeVisible();
  });

  test('should navigate to Global Map and calculate timezone overlaps', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.goto('/talent-map');
    } else {
      await page.click('a[routerLink="/talent-map"]');
    }
    await expect(page).toHaveURL(/.*talent-map/);
    await expect(page.locator('.live-clock-card')).toBeVisible();
    await expect(page.locator('.timeline-visualizer')).toBeVisible();
  });

  test('should navigate to Payroll Engine and simulate gross to net tax deductions', async ({ page, isMobile }) => {
    if (isMobile) {
      await page.goto('/payroll');
    } else {
      await page.click('a[routerLink="/payroll"]');
    }
    await expect(page).toHaveURL(/.*payroll/);
    await expect(page.locator('.tax-calculator-section')).toBeVisible();

    // Verify gross to net numbers are rendered
    await expect(page.locator('.breakdown-col.net-col .bd-amount')).toContainText('Rp');
  });

  test('should toggle Ionic 8 hybrid mobile shell', async ({ page }) => {
    const toggleBtn = page.locator('.toggle-device-btn');
    await toggleBtn.click();

    await expect(page.locator('.smartphone-bezel')).toBeVisible();
    await expect(page.locator('.ionic-bottom-tabs')).toBeVisible();
  });
});
