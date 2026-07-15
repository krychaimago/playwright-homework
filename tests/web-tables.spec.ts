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
    await expect(page.getByRole('table')).toBeVisible()
    const ownersFromMadisonCity = page.getByRole('row').filter({ has: page.locator('td').nth(2).getByText('Madison') })
    const total = await ownersFromMadisonCity.count()
    expect(total).toEqual(4)
})

test('Validate search by Last Name', async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    const lastNameTextField = page.locator('#lastName')
    await lastNameTextField.fill('Black')
    const findOwnerButton = page.getByRole('button', { name: 'Find Owner' })
    let searchResponse = page.waitForResponse(response =>
        response.url().includes('/petclinic/api/owners?lastName=Black') && response.status() === 200
    )
    await findOwnerButton.click()
    await searchResponse
    const foundOwnerLastName = page.getByRole('table').getByRole('link').nth(0)
    expect(foundOwnerLastName).toContainText('Black')
    await lastNameTextField.fill('Davis')
    searchResponse = page.waitForResponse(response =>
        response.url().includes('/petclinic/api/owners?lastName=Davis') && response.status() === 200
    )
    await findOwnerButton.click()
    await searchResponse
    const ownerRows = page.locator('tbody > tr')
    for (let row of await ownerRows.all()) {
        const ownerFullName = await row.locator('.ownerFullName').textContent()
        expect(ownerFullName).toContain('Davis')
    }
    await lastNameTextField.fill('Es')
    searchResponse = page.waitForResponse(response =>
        response.url().includes('/petclinic/api/owners?lastName=Es') && response.status() === 200
    )
    await findOwnerButton.click()
    await searchResponse
    for (let row of await ownerRows.all()) {
        const ownerFullName = await row.locator('.ownerFullName').textContent()
        expect(ownerFullName).toContain('Es')
    }
    await lastNameTextField.fill('Playwright')
    await findOwnerButton.click()
    const noOwnersFoundMessage = page.getByText('No owners with LastName starting with "Playwright"')
    await expect(noOwnersFoundMessage).toBeVisible()
})

test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    const targetRowByTelephoneValue = page.getByRole('row').filter({ has: page.locator('td').nth(3).getByText('6085552765') })
    const petName = targetRowByTelephoneValue.locator('td').nth(4)
    await expect(petName).toHaveText('George')
    const expectedPetName = await petName.textContent()
    const ownerFullName = targetRowByTelephoneValue.getByRole('link')
    await ownerFullName.click()
    const ownerTelefonValue = page.getByRole('row', { name: 'Telephone' }).getByRole('cell')
    await expect(ownerTelefonValue).toHaveText('6085552765')
    const petsSection = page.locator('.dl-horizontal')
    const petNameValue = petsSection.locator('dt', { hasText: 'Name' }).locator('+ dd')
    await expect(petNameValue).toHaveText(expectedPetName!)
})

test('Validate pets of the Madison city', async ({ page }) => {
    await page.getByRole('button', { name: 'Owners' }).click()
    await page.getByRole('link', { name: 'Search' }).click()
    const targetRowsByCityValue = page.getByRole('row').filter({ has: page.locator('td').nth(2).getByText('Madison') })
    await page.waitForResponse(response => response.url().includes('/petclinic/api/owners') && response.status() === 200)
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
    let targetRowBySpecialtyName = page.getByRole('row', { name: 'surgery' })
    await targetRowBySpecialtyName.getByRole('button', { name: 'Edit' }).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Specialty')
    let specialtyNameTextfield = page.locator('#name')
    await expect(specialtyNameTextfield).toHaveValue('surgery')
    await specialtyNameTextfield.fill('dermatology')
    await expect(specialtyNameTextfield).toHaveValue('dermatology')
    let updateResponse = page.waitForResponse(response => response.url().includes('/petclinic/api/specialties') && response.status() === 200)
    await page.getByRole('button', { name: 'Update'}).click()
    await updateResponse
    let updatedSpecialtyCell = page.getByRole('row').nth(2).getByRole('cell').first().getByRole('textbox')
    await expect(updatedSpecialtyCell).toHaveValue('dermatology')
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    const updatedSpecialty = page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)
    await expect(updatedSpecialty).toHaveText('dermatology')
    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.getByRole('heading')).toHaveText('Specialties')
    targetRowBySpecialtyName = page.getByRole('row', { name: 'dermatology' })
    await targetRowBySpecialtyName.getByRole('button', { name: 'Edit' }).click()
    await expect(specialtyNameTextfield).toHaveValue('dermatology')
    await specialtyNameTextfield.fill('surgery')
    await expect(specialtyNameTextfield).toHaveValue('surgery')
    updateResponse = page.waitForResponse(response => response.url().includes('/petclinic/api/specialties') && response.status() === 200)
    await page.getByRole('button', { name: 'Update'}).click()
    await updateResponse
    await expect(updatedSpecialtyCell).toHaveValue('surgery')
})

test('Validate specialty lists', async ({ page }) => {
    await page.getByRole('link', { name: 'Specialties' }).click()
    await page.waitForResponse(response => response.url().includes('/petclinic/api/specialties') && response.status() === 200)
    await expect(page.getByRole('heading')).toHaveText('Specialties')
    await page.getByRole('button', { name: 'Add' }).click()
    const addNewSpecialtyTextField = page.locator('#name')
    await addNewSpecialtyTextField.fill('oncology')
    await page.getByRole('button', { name: 'Save' }).click()
    const specialties = []
    const specialtyRows = page.locator('tbody tr')
    await page.waitForResponse(response => response.url().includes('/petclinic/api/specialties') && response.status() === 201)
    for (let row of await specialtyRows.all()) {
        const specialtyNames = await row.locator('td').first().getByRole('textbox').inputValue()
        specialties.push(specialtyNames)
    }
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(page.getByRole('heading')).toHaveText('Veterinarians')
    await page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('button', { name: 'Edit Vet' }).click()
    await page.waitForResponse(response => response.url().includes('/petclinic/api/specialties') && response.status() === 200)
    const specialtiesDropdownMenu = page.locator('.dropdown-display')
    await specialtiesDropdownMenu.click()
    const dropdownContent = page.locator('.dropdown-content div label')
    const specialityValues = await dropdownContent.allTextContents()
    expect(specialityValues).toEqual(specialties)
    const oncologySpecialtyCheckbox = page.getByRole('checkbox', { name: 'oncology'})
    await oncologySpecialtyCheckbox.check()
    await specialtiesDropdownMenu.click()
    const saveVetButton = page.getByRole('button', { name: 'Save Vet'})
    await saveVetButton.click()
    let specialtyCell = page.getByRole('row', { name: 'Sharon Jenkins'}).getByRole('cell').nth(1)
    await expect(specialtyCell).toHaveText('oncology')
    await page.getByRole('link', { name: 'Specialties' }).click()
    await page.waitForResponse(response => response.url().includes('/petclinic/api/specialties') && response.status() === 200)
    const oncologySpecialtyRow = page.getByRole('row', { name: 'oncology'}).getByRole('button', { name: 'Delete'})
    await oncologySpecialtyRow.click()
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(specialtyCell).toBeEmpty()
})