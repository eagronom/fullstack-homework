import { Crop, Field, HumusBalance } from './types'

const SOIL_SERVICE_URL = 'http://localhost:3000'

export const fetchFields = async (): Promise<Array<Field>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields`).then(response => response.json())

export const fetchCrops = async (): Promise<Array<Crop>> =>
  await fetch(`${SOIL_SERVICE_URL}/crops`).then(response => response.json())

export const fetchHumusBalance = async (crops: Number[]): Promise<HumusBalance> =>
  await fetch(`${SOIL_SERVICE_URL}/field/humus_balance`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ crops })
  }).then(response => response.json())

