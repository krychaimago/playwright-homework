import { test, expect } from '@playwright/test';

test('Select the desired date in the calendar', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', {name: "OWNERS"}).click()
    await page.getByRole('link', { name: "SEARCH"}).click()
    const targetRowByName = page.getByRole('link', { name: 'Harold Davis'})
    await targetRowByName.click()
    const addNewPetButton = page.getByRole('button', { name: 'Add New Pet'})
    await addNewPetButton.click()
    const ownerTextField = page.locator('#owner_name')
    await expect(ownerTextField).toHaveValue('Harold Davis')
    const nameTextField = page.getByRole('textbox', { name: 'Name'})
    const removeIcon = nameTextField.locator('..').locator('.glyphicon-remove')
    await expect(removeIcon).toBeVisible()
    await nameTextField.fill('Tom')
    const tickIcon = nameTextField.locator('..').locator('.glyphicon-ok')
    await expect(tickIcon).toBeVisible()
})  

// test('Select the dates of visits and validate dates order', async ({ page }) => {
 
 
// })