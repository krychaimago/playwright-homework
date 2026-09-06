import { test as base, expect } from '@playwright/test';

type FixtureType = {
    owner: void
}

export const test = base.extend<FixtureType>({
    owner: async ({ page }, use) => {
        await page.goto('/')
        const addNewOwnerResponse = await page.request.post('https://petclinic-api.bondaracademy.com/petclinic/api/owners', {
            data: { "id": null, "firstName": "Alan", "lastName": "King", "address": "Doniecka", "city": "Katowice", "telephone": "884884884" }
        })
        expect(addNewOwnerResponse.status()).toEqual(201)
        const addNewOwnerResponseJSON = await addNewOwnerResponse.json()
        const ownerId = addNewOwnerResponseJSON.id
        const addNewPetResponse = await page.request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets`, {
            data: { "id": null, "owner": { "firstName": "Alan", "lastName": "King", "address": "Doniecka", "city": "Katowice", "telephone": "884884884", "id": ownerId, "pets": [] }, "name": "Max", "birthDate": "2024-05-06", "pettype": "dog", "type": { "name": "dog", "id": 2666 } }
        })
        expect(addNewPetResponse.status()).toEqual(201)
        const getPetIdResponseJSON = await addNewPetResponse.json()
        const petId = getPetIdResponseJSON.id
        const addNewVisitResponse = await page.request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}/pets/${petId}/visits`, {
            data: { "date": "2026-08-11", "description": "dog therapy", "id": null, "pet": { "name": "Max", "birthDate": "2024-05-06", "type": { "name": "dog", "id": 2666 }, "id": petId, "ownerId": ownerId, "visits": [] } }
        })
        expect(addNewVisitResponse.status()).toEqual(201)
        await use()
        const deleteOwnerResponse = await page.request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${ownerId}`)
        expect(deleteOwnerResponse.status()).toEqual(204)
    }
})