import {Crop, Field, SeasonalCrop} from './types'

const SOIL_SERVICE_URL = 'http://localhost:3000'

export const fetchFields = async (): Promise<Array<Field>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields`).then(response => response.json())

export const fetchCrops = async (): Promise<Array<Crop>> =>
  await fetch(`${SOIL_SERVICE_URL}/crops`).then(response => response.json())

export const fetchHumusBalance = async (seasonalCrops: SeasonalCrop[]): Promise<number> =>
  await fetch(`${SOIL_SERVICE_URL}/calc_humus_balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }, body: JSON.stringify(seasonalCrops)
  }).then(response => response.text()).then(balance => +parseFloat(balance).toFixed(2));
