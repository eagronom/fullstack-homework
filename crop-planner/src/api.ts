import { Crop, Field, HumusBalance } from './types'

const SOIL_SERVICE_URL = 'http://localhost:3000'

export const fetchFields = async (): Promise<Array<Field>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields`).then(response => response.json())

export const fetchCrops = async (): Promise<Array<Crop>> =>
  await fetch(`${SOIL_SERVICE_URL}/crops`).then(response => response.json())

export const fetchHumusBalances = async (fields: Array<Field> = []): Promise<Array<HumusBalance>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields/humus_balance`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({fields})
  }).then(response => response.json())

