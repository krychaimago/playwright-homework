import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('/')
  await page.getByRole('button', {name: "Veterinarians"}).click()
  await page.getByRole('link', {name: "All"}).click()
  await expect(page.getByRole('heading')).toHaveText('Veterinarians')
})

test.describe('Checkboxes', () => {
    test('Validate selected specialties', async ({page}) => {
        await page.getByRole('row', {name: 'Helen Leary'}).getByRole('button', {name: 'Edit Vet'}).click()
        const specialtiesDropdown= page.locator('.selected-specialties')
        await expect(specialtiesDropdown).toHaveText('radiology')
        await specialtiesDropdown.click()
        await expect(page.getByRole('checkbox', { name: 'radiology' })).toBeChecked()
        expect(await page.getByRole('checkbox', { name: 'surgery' }).isChecked()).toBeFalsy()
        expect(await page.getByRole('checkbox', { name: 'dentistry' }).isChecked()).toBeFalsy()
        await page.getByRole('checkbox', {name: 'surgery'}).check()
        await page.getByRole('checkbox', {name: 'radiology'}).uncheck()
        await expect(specialtiesDropdown).toHaveText('surgery')
        await page.getByRole('checkbox', {name: 'dentistry'}).check()
        await expect(specialtiesDropdown).toHaveText('surgery, dentistry')
    })    
    
    test('Select all specialties', async ({page}) => {
        await page.getByRole('row', {name: 'Rafael Ortega'}).getByRole('button', {name: 'Edit Vet'}).click()
        const specialtiesDropdown = page.locator('.selected-specialties')
        await expect(specialtiesDropdown).toHaveText('surgery')
        await specialtiesDropdown.click()
        const allCheckboxes = page.getByRole('checkbox')
        for(const checkboxbox of await allCheckboxes.all()) {
            await checkboxbox.check()
            await expect(checkboxbox).toBeChecked()
        }
        await expect(specialtiesDropdown).toHaveText('surgery, radiology, dentistry')
    })

    test('Unselect all specialties', async ({page}) => {
        await page.getByRole('row', {name: 'Linda Douglas'}).getByRole('button', {name: 'Edit Vet'}).click()
        const specialtiesDropdown = page.locator('.selected-specialties')
        await expect(specialtiesDropdown).toHaveText('dentistry, surgery')
        await specialtiesDropdown.click()
        const allCheckboxes = page.getByRole('checkbox')
        for(const checkbox of await allCheckboxes.all()) {
            await checkbox.uncheck()
            expect(await checkbox.isChecked()).toBeFalsy()
        }
        await expect(specialtiesDropdown).toBeEmpty()
    })
})