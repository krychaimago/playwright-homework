import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: "Owners" }).click()
  await page.getByRole('link', { name: "Search" }).click()
  await expect(page.getByRole('heading')).toHaveText("Owners")
})

test.describe('Lists and dropdowns', () => {
  test('Validate selected pet types from the list', async ({ page }) => {
    await page.getByRole('link', { name: "George Franklin" }).click()
    await expect(page.locator('.ownerFullName')).toHaveText("George Franklin")
    await page.getByRole('button', { name: "Edit Pet" }).click()
    await expect(page.getByRole('heading')).toHaveText("Pet")
    await expect(page.getByRole('textbox').first()).toHaveValue("George Franklin")
    await expect(page.getByRole('textbox').nth(3)).toHaveValue("cat")
    const dropdownMenu = page.getByRole('combobox')
    const pets = await dropdownMenu.locator('option').allInnerTexts()
    for (const pet of pets) {
      await dropdownMenu.click()
      await dropdownMenu.selectOption(pet)
      await expect(page.getByRole('textbox').nth(3)).toHaveValue(pet)
    }
  })

  test('Validate the pet type update', async ({ page }) => {
    await page.getByRole('link', { name: "Eduardo Rodriquez" }).click()
    const petRosyTable = page.locator('app-pet-list').filter({ hasText: "Rosy" })
    await petRosyTable.getByRole('button', { name: "Edit Pet" }).click()
    await expect(page.getByRole('textbox').nth(1)).toHaveValue("Rosy")
    await expect(page.getByRole('textbox').nth(3)).toHaveValue("dog")
    const dropdownMenu = page.getByRole('combobox')
    await dropdownMenu.selectOption("bird")
    await expect(page.getByRole('textbox').nth(3)).toHaveValue("bird")
    await expect(dropdownMenu).toHaveValue("bird")
    await page.getByRole('button', { name: "Update Pet" }).click()
    const typeValue = petRosyTable.locator('dd').nth(2)
    await expect(typeValue).toHaveText("bird")
    await petRosyTable.getByRole('button', { name: "Edit Pet" }).click()
    await expect(page.getByRole('textbox').nth(3)).toHaveValue("bird")
    await dropdownMenu.selectOption("dog")
    await expect(page.getByRole('textbox').nth(3)).toHaveValue("dog")
    await expect(dropdownMenu).toHaveValue("dog")
    await page.getByRole('button', { name: "Update Pet" }).click()
    await expect(typeValue).toHaveText("dog")
  })
})