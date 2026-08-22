import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Validate the pet name city of the owner', async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    const targetRowByName = page.getByRole('row', { name: 'Jeff Black' })
    const ownersCity = targetRowByName.locator('td').nth(2)
    const ownersPetName = targetRowByName.locator('td').nth(4)
    await expect(ownersCity).toHaveText('Monona')
    await expect(ownersPetName).toHaveText('Lucky')
})

test('Validate owners count of the Madison city', async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    await expect(page.getByRole('row', { name: 'Madison' })).toHaveCount(4)
})

test('Validate search by Last Name', async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    const lastNames = ["Black", "Davis", "Es", "Playwright"]

    for (let lastName of lastNames) {
        await page.locator('#lastName').fill(lastName)
        await page.getByRole('button', { name: 'Find Owner' }).click()
        await page.waitForResponse('**/api/owners?lastName=' + lastName)

        if (lastName === "Playwright") {
            await expect(page.getByText('No owners with LastName starting with "Playwright"')).toBeVisible()
        } else {
            const allOwnerRows = await page.locator('tbody > tr').all()

            for (let row of allOwnerRows) {
                await expect(row.locator('td').first()).toContainText(lastName)
            }
        }
    }
})

test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    const targetRowByTelephoneValue = page.getByRole('row', { name: '6085552765' })
    await expect(targetRowByTelephoneValue.getByRole('cell').nth(4)).toHaveText('George')
    await targetRowByTelephoneValue.getByRole('link').click()
    await expect(page.getByRole('row', { name: 'Telephone' }).getByRole('cell')).toHaveText('6085552765')
    const petsSection = page.locator('.dl-horizontal')
    await expect(petsSection.locator('dt', { hasText: 'Name' }).locator('+ dd')).toHaveText('George')
})

test('Validate pets of the Madison city', async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    const targetRowsByCityValue = page.getByRole('row', { name: 'Madison' })
    await page.waitForResponse('**/api/owners')
    const petNames = []
    for (let row of await targetRowsByCityValue.all()) {
        const petName = await row.locator('td').nth(4).textContent().then(name => name?.trim())
        petNames.push(petName)
    }
    const expectedPetNames = ['Leo', 'George', 'Mulligan', 'Freddy']
    expect(petNames).toEqual(expect.arrayContaining(expectedPetNames))
})

test('Validate specialty update', async ({ page }) => {
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    const specialtyCell = page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)
    await expect(specialtyCell).toHaveText('surgery')
    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.getByRole('heading')).toHaveText('Specialties')
    await page.getByRole('row', { name: 'surgery' }).getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Specialty')
    let specialtyNameTextfield = page.locator('#name')
    await expect(specialtyNameTextfield).toHaveValue('surgery')
    await specialtyNameTextfield.fill('dermatology')
    await expect(specialtyNameTextfield).toHaveValue('dermatology')
    let updateResponse = page.waitForResponse('**/api/specialties')
    await page.getByRole('button', { name: 'Update' }).click()
    await updateResponse
    let updatedSpecialtyCell = page.getByRole('row').nth(2).getByRole('cell').first().getByRole('textbox')
    await expect(updatedSpecialtyCell).toHaveValue('dermatology')
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    const updatedSpecialty = page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)
    await expect(updatedSpecialty).toHaveText('dermatology')
    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.getByRole('heading')).toHaveText('Specialties')
    await page.getByRole('row', { name: 'dermatology' }).getByRole('button', { name: 'Edit' }).click()
    await expect(specialtyNameTextfield).toHaveValue('dermatology')
    await specialtyNameTextfield.fill('surgery')
    await expect(specialtyNameTextfield).toHaveValue('surgery')
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(updatedSpecialtyCell).toHaveValue('surgery')
})

test('Validate specialty lists', async ({ page }) => {
    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.getByRole('heading')).toHaveText('Specialties')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.locator('#name').fill('oncology')
    await page.getByRole('button', { name: 'Save' }).click()
    const specialties = []
    const specialtyRows = page.locator('tbody tr')
    await page.waitForResponse('**/api/specialties')
    for (let row of await specialtyRows.all()) {
        const specialtyNames = await row.locator('td').first().getByRole('textbox').inputValue()
        specialties.push(specialtyNames)
    }
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')
    await page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('button', { name: 'Edit Vet' }).click()
    await page.waitForResponse(response => response.url().includes('/petclinic/api/specialties') && response.status() === 200)
    await page.locator('.dropdown-display').click()
    const dropdownContent = page.locator('.dropdown-content div label')
    await expect(dropdownContent).toHaveText(specialties)
    await page.getByRole('checkbox', { name: 'oncology' }).check()
    await page.locator('.dropdown-display').click()
    await page.getByRole('button', { name: 'Save Vet' }).click()
    let specialtyCell = page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)
    await expect(specialtyCell).toHaveText('oncology')
    await page.getByRole('link', { name: 'Specialties' }).click()
    await page.waitForResponse(response => response.url().includes('/petclinic/api/specialties') && response.status() === 200)
    await page.getByRole('row', { name: 'oncology' }).getByRole('button', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(specialtyCell).toBeEmpty()
})