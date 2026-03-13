import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
  await page.getByRole('button', {name: "Veterinarians"}).click()
  await expect(page.locator('.dropdown-menu').getByText('All')).toBeVisible()
  await page.getByRole('link', {name: "All"}).click()
  await expect(page.getByRole('heading')).toHaveText('Veterinarians')
})

test.describe('Checkboxes', () => {
    test('Validate selected specialties', async ({page}) => {
        await page.getByRole('row', {name: 'Helen Leary'}).getByRole('button', {name: 'Edit Vet'}).click()
        const dropdownVisibleSpecialties = page.locator('.selected-specialties')
        await expect(dropdownVisibleSpecialties).toHaveText('radiology')
        await dropdownVisibleSpecialties.click()
        await expect (page.getByRole('checkbox', { name: 'radiology' })).toBeChecked()
        expect(await page.getByRole('checkbox', { name: 'surgery' }).isChecked()).toBeFalsy()
        expect(await page.getByRole('checkbox', { name: 'dentistry' }).isChecked()).toBeFalsy()
        await page.getByRole('checkbox', {name: 'surgery'}).check()
        await page.getByRole('checkbox', {name: 'radiology'}).uncheck()
        await expect(dropdownVisibleSpecialties).toHaveText('surgery')
        await page.getByRole('checkbox', {name: 'dentistry'}).check()
        await expect(dropdownVisibleSpecialties).toHaveText('surgery, dentistry')
    })    
    
    test('Select all specialties', async ({page}) => {
        await page.getByRole('row', {name: 'Rafael Ortega'}).getByRole('button', {name: 'Edit Vet'}).click()
        const dropdownVisibleSpecialties = page.locator('.selected-specialties')
        await expect(dropdownVisibleSpecialties).toHaveText('surgery')
        await dropdownVisibleSpecialties.click()
        const allCheckboxes = page.getByRole('checkbox')
        let checkboxesCount = allCheckboxes.count()
        for (let i = 0; i < await checkboxesCount; i++) {
            if (!(await allCheckboxes.nth(i).isChecked()))
                await allCheckboxes.nth(i).check()
        }
        await expect (page.getByRole('checkbox', { name: 'radiology' })).toBeChecked()
        await expect (page.getByRole('checkbox', { name: 'surgery' })).toBeChecked()
        await expect (page.getByRole('checkbox', { name: 'dentistry' })).toBeChecked()
        await expect(dropdownVisibleSpecialties).toHaveText('surgery, radiology, dentistry')
    })

    test('Unselect all specialties', async ({page}) => {
        await page.getByRole('row', {name: 'Linda Douglas'}).getByRole('button', {name: 'Edit Vet'}).click()
        const dropdownVisibleSpecialties = page.locator('.selected-specialties')
        await expect(dropdownVisibleSpecialties).toHaveText('dentistry, surgery')
        await dropdownVisibleSpecialties.click()
        await page.getByRole('checkbox', {name: 'surgery'}).uncheck()
        await page.getByRole('checkbox', {name: 'dentistry'}).uncheck()
        expect(await page.getByRole('checkbox', { name: 'surgery' }).isChecked()).toBeFalsy()
        expect(await page.getByRole('checkbox', { name: 'dentistry' }).isChecked()).toBeFalsy()
        expect(await page.getByRole('checkbox', { name: 'radiology' }).isChecked()).toBeFalsy()
        await expect(dropdownVisibleSpecialties).toBeEmpty()
    })
})