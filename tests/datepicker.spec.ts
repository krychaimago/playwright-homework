import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', {name: "OWNERS"}).click()
    await page.getByRole('link', { name: "SEARCH"}).click()
    await page.waitForResponse('**/owners')
})

test('Select the desired date in the calendar', async ({ page }) => {
    await page.getByRole('link', { name: 'Harold Davis'}).click()
    await page.waitForResponse('**/owners/2214')
    await page.getByRole('button', { name: 'Add New Pet'}).click()
    await expect(page.locator('#owner_name')).toHaveValue('Harold Davis')
    await expect(page.locator('.glyphicon-remove').first()).toBeVisible()
    await page.getByRole('textbox', {name: 'Name'}).fill('Tom')
    await expect(page.locator('.glyphicon-ok').first()).toBeVisible()
    await page.locator('.mat-datepicker-toggle').getByRole('button').click()
    
    const expectedMonthAndYear = '05 2014'
    let currentMonthAndYear = await page.locator('.mat-calendar-period-button').textContent()

    while(!currentMonthAndYear?.includes(expectedMonthAndYear)) {
        await page.locator('.mat-calendar-previous-button').click()
        currentMonthAndYear = await page.locator('.mat-calendar-period-button').textContent()
    }
    
    await page.locator('.mat-calendar-body-cell').getByText('2', {exact: true}).click()
    await expect(page.locator('[name="birthDate"]')).toHaveValue('2014/05/02')
    await page.locator('[name="pettype"]').selectOption('dog')
    await page.getByRole('button', { name: 'Save Pet'}).click()

    const petsList = page.locator('app-pet-list').filter({ hasText: 'Tom' })
    await expect(petsList.locator('dt', { hasText: 'Name' }).locator('+ dd')).toHaveText('Tom')
    await expect(petsList.locator('dt', { hasText: 'Birth Date' }).locator('+ dd')).toHaveText('2014-05-02')
    await expect(petsList.locator('dt', { hasText: 'Type' }).locator('+ dd')).toHaveText('dog')
    await petsList.getByRole('button', { name: 'Delete Pet'}).click()
    await expect(petsList).toHaveCount(0)
})  

test('Select the dates of visits and validate dates order', async ({ page }) => {
    await page.getByRole('link', { name: 'Jean Coleman'}).click()
    await page.waitForResponse('**/owners/2216')
    await page.locator('app-pet-list').filter({ hasText: 'Samantha' }).getByRole('button', { name: 'Add Visit'}).click()
    await expect(page.getByRole('heading', { name: 'New Visit'})).toBeVisible()
    
})