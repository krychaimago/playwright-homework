import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Owners' }).click()
  await page.getByRole('link', { name: 'Search' }).click()
  await expect(page.getByRole('heading')).toHaveText('Owners')
})

test('Validate selected pet types from the list', async ({ page }) => {
  await page.getByRole('link', { name: 'George Franklin' }).click()
  await expect(page.locator('.ownerFullName')).toHaveText('George Franklin')
  await page.locator('app-pet-list', { hasText: 'Leo' }).getByRole('button', { name: 'Edit Pet' }).click()
  await expect(page.getByRole('heading')).toHaveText('Pet')
  await expect(page.locator('#owner_name')).toHaveValue('George Franklin')
  await expect(page.locator('#type1')).toHaveValue('cat')
  const dropdownMenu = page.getByRole('combobox')
  const pets = await dropdownMenu.locator('option').allInnerTexts()
  for (const pet of pets) {
    await dropdownMenu.selectOption(pet)
    await expect(page.locator('#type1')).toHaveValue(pet)
  }
})

test('Validate the pet type update', async ({ page }) => {
  await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()
  const rosyPetSection = page.locator('app-pet-list', { hasText: 'Rosy' })
  await rosyPetSection.getByRole('button', { name: 'Edit Pet' }).click()
  await expect(page.getByLabel('Name')).toHaveValue('Rosy')
  await expect(page.locator('#type1')).toHaveValue('dog')
  const dropdownMenu = page.getByRole('combobox')
  await dropdownMenu.selectOption('bird')
  await expect(page.locator('#type1')).toHaveValue('bird')
  await expect(dropdownMenu).toHaveValue('bird')
  await page.getByRole('button', { name: 'Update Pet' }).click()
  const rosyPetType = rosyPetSection.locator('dt:text-is("Type") + dd')
  await expect(rosyPetType).toHaveText('bird')
  await rosyPetSection.getByRole('button', { name: 'Edit Pet' }).click()
  await expect(page.locator('#type1')).toHaveValue('bird')
  await dropdownMenu.selectOption('dog')
  await expect(page.locator('#type1')).toHaveValue('dog')
  await expect(dropdownMenu).toHaveValue('dog')
  await page.getByRole('button', { name: 'Update Pet' }).click()
  await expect(rosyPetType).toHaveText('dog')
})