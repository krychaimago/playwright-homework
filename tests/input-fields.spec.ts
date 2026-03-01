import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
})

test('Update pet type', async ({page}) => {
    await page.locator('li').getByRole('link', {name: 'Pet Types'}).click()
    const petTypeTitle = await page.locator('app-pettype-list', {hasText: 'Pet Types'}).getByRole('heading', {name: 'Pet Type'}).textContent()
    expect(petTypeTitle).toEqual('Pet Types')
});

// test('', async ({page}) => {
  
// });

// test('', async ({page}) => {
// });