import { Crop, Field } from './types'

const SOIL_SERVICE_URL = 'http://localhost:3000'

export const fetchFields = async (): Promise<Array<Field>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields`).then(response => response.json())

export const fetchCrops = async (): Promise<Array<Crop>> =>
  await fetch(`${SOIL_SERVICE_URL}/crops`).then(response => response.json())

export const reCalculateHumusBalance = async (newCropSelection: Field): Promise<Array<Field>> => {
  const options = {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      new_crop_selection: newCropSelection
    })
  }
  return await fetch(
    `${SOIL_SERVICE_URL}/fields/${newCropSelection.id}`, options).then(
      response => response.json()).catch(
        e => console.log(e))
}

