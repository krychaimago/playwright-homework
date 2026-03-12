import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test.describe('Checkboxes', () => {
    test('Validate selected specialties', async ({page}) => {
        await page.getByRole('button', {name: "Veterinarians"}).click()
        await expect(page.locator('.dropdown-menu').getByText('All')).toBeVisible()
        await page.getByRole('link', {name: "All"}).click()
        await expect(page.getByRole('heading')).toHaveText('Veterinarians')
        await page.getByRole('row', {name: 'Helen Leary'}).getByRole('button', {name: 'Edit Vet'}).click()
        let dropdownVisibleSpecialties = page.locator('.selected-specialties')
        await expect(dropdownVisibleSpecialties).toHaveText('radiology')
    })    
    
    test('Select all specialties', async ({page}) => {
        
    })

    test('Unselect all specialties', async ({page}) => {
       
    })
})