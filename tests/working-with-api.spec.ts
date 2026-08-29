import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json'

test.beforeEach(async ({ page }) => {
    await page.route('**/api/owners', async route => {
        await route.fulfill({
            json: owners
        })
    })
    await page.route('**/api/owners/*', async route => {
        const ownerId = Number(route.request().url().split('/').pop())
        const owner = owners.find((item) => item.id === ownerId)
        await route.fulfill({
            json: owner
        })
    })
    await page.goto('/')
})

test('mocking API request', async ({ page }) => {
    await page.getByRole('button', { name: 'OWNERS' }).click()
    await page.getByRole('link', { name: 'SEARCH' }).click()
    await expect(page.locator('#ownersTable > table > tbody > tr')).toHaveCount(owners.length)
    await page.getByRole('link', { name: 'Przemek Kowalski' }).click()
    await expect(page.getByRole('table').first().getByRole('row', { name: 'Name' }).getByRole('cell')).toHaveText('Przemek Kowalski')
    await expect(page.getByRole('table').first().getByRole('row', { name: 'Address' }).getByRole('cell')).toHaveText('50W. Long St.')
    await expect(page.getByRole('table').first().getByRole('row', { name: 'City' }).getByRole('cell')).toHaveText('Warsaw')
    await expect(page.getByRole('table').first().getByRole('row', { name: 'Telephone' }).getByRole('cell')).toHaveText('884000884')
    await expect(page.locator('app-pet-list')).toHaveCount(2)
    const petName = page.locator('app-pet-list').locator('dt:has-text("Name") + dd')
    await expect(petName).toContainText(['Julian', 'Zorka'])
    const petVisits = page.locator('app-visit-list').first().locator('tr:not(:has(th))')
    await expect(petVisits).toHaveCount(10)
});