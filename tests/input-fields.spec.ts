import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
  await page.getByRole('link', {name: "Pet Types"}).click()
  await expect(page.getByRole('heading')).toHaveText('Pet Types')
})

test.describe('Input fields', () => {
    test('Update pet type', async ({page}) => {
        await page.getByRole('row', {name: 'cat'}).getByRole('button', { name: 'Edit' }).click()
        await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
        let petInputEdition = page.getByRole("textbox", {includeHidden: false})
        await expect(petInputEdition).toHaveValue('cat')
        await petInputEdition.fill('rabbit')
        await page.getByRole('button', {name: 'Update'}).click()
        await expect(page.getByRole('textbox').nth(0)).toHaveValue('rabbit')
        await page.getByRole('row', {name: 'rabbit'}).getByRole('button', { name: 'Edit' }).click()
        petInputEdition = page.getByRole('textbox', {includeHidden: false})
        await expect(petInputEdition).toHaveValue('rabbit')
        await petInputEdition.fill('cat')
        await page.getByRole('button', {name: 'Update'}).click()
        await expect(page.getByRole('textbox').nth(0)).toHaveValue('cat')
    })
    
    test('Cancel pet type update', async ({page}) => {
        await page.getByRole('row', {name: 'dog'}).getByRole('button', { name: 'Edit' }).click()
        let petInputEdition = page.getByRole('textbox', {includeHidden: false})
        await expect(petInputEdition).toHaveValue('dog')
        await petInputEdition.fill('moose')
        await expect(petInputEdition).toHaveValue('moose')
        await page.getByRole('button', {name: 'Cancel'}).click()
        await expect(page.getByRole('textbox').nth(1)).toHaveValue('dog')
    })

    test('Validation of Pet type name is required', async ({page}) => {
        await page.getByRole('link', {name: "Pet Types"}).click()
        await expect(page.getByRole('heading')).toHaveText('Pet Types')
        await page.getByRole('row', {name: 'lizard'}).getByRole('button', { name: 'Edit' }).click()
        let petInputEdition = page.getByRole('textbox', {includeHidden: false})
        await expect(petInputEdition).toHaveValue('lizard')
        await petInputEdition.clear()
        await expect(page.locator('.help-block')).toHaveText('Name is required')
        await page.getByRole('button', {name: 'Update'}).click()
        await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
        await page.getByRole('button', {name: 'Cancel'}).click()
        await expect(page.getByRole('heading')).toHaveText('Pet Types')
    })
})