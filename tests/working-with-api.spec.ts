import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json'
import specialties from '../test-data/specialties.json'

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
    await page.route('*/**/api/vets', async route => {
        const response = await route.fetch()
        const responseJSON = await response.json()
        const vetName = responseJSON.find((item: { firstName: string; lastName: string; }) => item.firstName === 'Sharon' && item.lastName === 'Jenkins')
        vetName.specialties = specialties
        await route.fulfill({
            json: responseJSON
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

test('Intercept API response', async ({ page }) => {
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(page.locator('#vets tbody tr', { hasText: 'Sharon Jenkins' }).locator('td div')).toHaveCount(10)
});