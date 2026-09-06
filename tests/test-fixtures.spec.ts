import { test } from '../fixtures.ts';
import { expect } from '@playwright/test';

test('Test with fixture', async ({ page, owner }) => {
    await page.getByRole('button', { name: "OWNERS" }).click()
    await page.getByRole('link', { name: "SEARCH" }).click()
    await page.getByRole('link', { name: 'Alan King' }).click()
    await page.getByRole('button', { name: 'Delete Visit' }).click()
    await expect(page.locator('app-visit-list table > tr')).toHaveCount(0)
    await page.getByRole('button', { name: 'Delete Pet' }).click()
    await expect(page.locator('app-pet-list table > tr', { hasText: 'Max' })).toHaveCount(0)
})