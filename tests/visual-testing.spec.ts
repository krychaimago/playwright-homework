import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})
test('visual testing', { tag: ['@visual'] }, async ({ page }) => {
    await page.getByRole('button', { name: 'OWNER' }).click()
    await page.getByRole('link', { name: 'ADD NEW' }).click()
    await expect(page.getByRole('button', { name: 'Add Owner' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Add Owner' })).toHaveScreenshot('add-owner-button-disabled.png', { maxDiffPixels: 100 })
    await page.getByRole('textbox', { name: 'First Name' }).fill('John')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Travolta')
    await page.getByRole('textbox', { name: 'Address' }).fill('123 Main St')
    await page.getByRole('textbox', { name: 'City' }).fill('Hollywood')
    await page.getByRole('textbox', { name: 'Telephone' }).fill('123123123')
    await expect(page.getByRole('button', { name: 'Add Owner' })).toBeEnabled()
    await expect(page.getByRole('button', { name: 'Add Owner' })).toHaveScreenshot('add-owner-button-enabled.png', { maxDiffPixels: 100 })
})