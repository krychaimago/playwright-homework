import { test, expect, request } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Validation of delete specialty', async ({ page, request }) => {
    const addingSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: { "name": "api testing expert" }
    })
    expect(addingSpecialtyResponse.status()).toEqual(201)
    await page.getByText('Specialties').click()
    const apiTestingExpertSpecialty = page.getByRole('row', { name: 'api testing expert' })
    await expect(apiTestingExpertSpecialty).toBeVisible()
    await apiTestingExpertSpecialty.getByRole('button', { name: 'Delete' }).click()
    await expect(apiTestingExpertSpecialty).not.toBeVisible()
})

test('Add and delete veterinarian', async ({ page, request }) => {
    const addNewVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: { "firstName": "Julietta", "lastName": "Nova", "id": null, "specialties": [] }
    })
    expect(addNewVetResponse.status()).toEqual(201)
    const responseJSON = await addNewVetResponse.json()
    const vetId = responseJSON.id
    expect(responseJSON.firstName).toEqual('Julietta')
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(page.getByRole('cell', { name: 'Julietta Nova' })).toBeVisible()
    await expect(page.getByRole('row', { name: 'Julietta Nova' }).getByRole('cell').nth(1)).toBeEmpty()
    await page.getByRole('row', { name: 'Julietta Nova' }).getByRole('button', { name: 'Edit Vet' }).click()
    await page.waitForResponse('**/api/vets/*')
    await page.locator('.form-group', { hasText: 'Specialties' }).locator('.dropdown').click()
    await page.getByRole('checkbox', { name: 'dentistry' }).check()
    await page.locator('.form-group', { hasText: 'Specialties' }).locator('.dropdown').click()
    await page.locator('#vet_form').getByRole('button', { name: 'Save Vet' }).click()
    await expect(page.getByRole('row', { name: 'Julietta Nova' }).getByRole('cell').nth(1)).toHaveText('dentistry')
    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetId}`)
    expect(deleteVetResponse.status()).toEqual(204)
    const vetListResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets')
    expect(vetListResponse.status()).toEqual(200)
    const responseBody: any[] = await vetListResponse.json()
    const vetIds = responseBody.map(vet => vet.id)
    expect(vetIds).not.toContain(vetId)
})

test('New specialty is displayed', async ({ page, request }) => {
    const addingSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: { "name": "api testing ninja" }
    })
    expect(addingSpecialtyResponse.status()).toEqual(201)
    const responseSpecialtyJSON = await addingSpecialtyResponse.json()
    const specialtyId = responseSpecialtyJSON.id
    const addNewVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: { "firstName": "Adam", "lastName": "Smith", "id": null, "specialties": [{ "id": 4635, "name": "surgery" }] }
    })
    expect(addNewVetResponse.status()).toEqual(201)
    const responseVetJSON = await addNewVetResponse.json()
    const vetId = responseVetJSON.id
    await page.getByRole('button', { name: 'Veterinarians' }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(page.getByRole('row', { name: 'Adam Smith' }).getByRole('cell').nth(1)).toHaveText('surgery')
    await page.getByRole('row', { name: 'Adam Smith' }).getByRole('button', { name: 'Edit Vet' }).click()
    await page.waitForResponse('**/api/vets/*')
    await page.locator('.form-group', { hasText: 'Specialties' }).locator('.dropdown').click()
    await page.getByRole('checkbox', { name: 'surgery' }).uncheck()
    await page.getByRole('checkbox', { name: 'api testing ninja' }).check()
    await page.locator('.form-group', { hasText: 'Specialties' }).locator('.dropdown').click()
    await page.locator('#vet_form').getByRole('button', { name: 'Save Vet' }).click()
    await expect(page.getByRole('row', { name: 'Adam Smith' }).getByRole('cell').nth(1)).toHaveText('api testing ninja')
    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetId}`)
    expect(deleteVetResponse.status()).toEqual(204)
    const deleteSpecialtyResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${specialtyId}`)
    expect(deleteSpecialtyResponse.status()).toEqual(204)
    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.locator('[name="spec_name"]', { hasText: 'api testing ninja' })).not.toBeVisible()
})