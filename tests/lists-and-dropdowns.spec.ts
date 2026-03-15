import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: "Owners" }).click()
  await page.getByRole('link', { name: "Search" }).click()
  await expect(page.getByRole('heading')).toHaveText("Owners")
})

test.describe('Lists and dropdowns', () => {
  test('Validate selected pet types from the list', async ({ page }) => {
    await page.getByRole('link', { name: "George Franklin" }).click()
    await expect(page.locator('.ownerFullName')).toHaveText("George Franklin")
    await page.getByRole('button', { name: "Edit Pet" }).click()
    await expect(page.getByRole('heading')).toHaveText("Pet")
    await expect(page.getByRole('textbox').first()).toHaveValue("George Franklin")

  })
})