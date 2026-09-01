import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json'

test.beforeEach(async ({ page }) => {
    await page.route('**/api/owners', async route => {
        await route.fulfill({
            json: owners
        })
    })
    await page.route('**/api/owners/*', async route => {
        await route.fulfill({
            json: owners[0]
        })
    })
    await page.goto('/')
})

test('mocking API request', async ({ page }) => {
    await page.getByRole('button', { name: 'OWNERS' }).click()
    await page.getByRole('link', { name: 'SEARCH' }).click()
    await expect(page.locator('#ownersTable > table > tbody > tr')).toHaveCount(owners.length)
    await page.getByRole('link', { name: 'Przemek Kowalski' }).click()
    await expect(page).toHaveURL('/owners/2211')
    await expect(page.getByRole('table').first().getByRole('row', { name: 'Name' }).getByRole('cell')).toHaveText('Przemek Kowalski')
    await expect(page.getByRole('table').first().getByRole('row', { name: 'Address' }).getByRole('cell')).toHaveText('50W. Long St.')
    await expect(page.getByRole('table').first().getByRole('row', { name: 'City' }).getByRole('cell')).toHaveText('Warsaw')
    await expect(page.getByRole('table').first().getByRole('row', { name: 'Telephone' }).getByRole('cell')).toHaveText('884000884')
    await expect(page.locator('app-pet-list')).toHaveCount(2)
    const petName = page.locator('app-pet-list').locator('dt:has-text("Name") + dd')
    await expect(petName).toContainText(['Julian', 'Zorka'])
    await expect(page.locator('app-visit-list table > tr')).toHaveCount(10)
});