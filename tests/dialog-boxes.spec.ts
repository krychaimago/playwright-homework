import { test, expect } from '@playwright/test';

test('Add and delete pet type', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Pet Types' }).click()
    await expect(page.getByRole('heading')).toHaveText('Pet Types')
    await expect(page.getByRole('table')).toBeVisible()
    await page.getByRole('button', { name: 'Add' }).click()
    await expect(page.locator('app-pettype-add').getByRole('heading')).toHaveText('New Pet Type')
    await expect(page.locator('.control-label')).toHaveText('Name')
    const newPetTypeNameField = page.locator('app-pettype-add').getByRole('textbox')
    await expect(newPetTypeNameField).toBeVisible()
    await newPetTypeNameField.fill('pig')
    await page.getByRole('button', { name: 'Save' }).click()
    const lastPetTypeTextbox = page.locator('[name=pettype_name]').last()
    await expect(lastPetTypeTextbox).toHaveValue('pig')
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Delete the pet type?')
        dialog.accept()
    })
    await page.getByRole('button', { name: 'Delete' }).last().click()
    await page.waitForResponse(response => response.request().method() === 'DELETE')
    await expect(lastPetTypeTextbox).not.toHaveValue('pig')
})