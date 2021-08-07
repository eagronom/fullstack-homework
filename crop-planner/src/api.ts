import {Crop, Field, HumusBalance} from './types'

const SOIL_SERVICE_URL = 'http://localhost:3000'

export const fetchFields = async (): Promise<Array<Field>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields`).then(response => response.json())

export const fetchCrops = async (): Promise<Array<Crop>> =>
  await fetch(`${SOIL_SERVICE_URL}/crops`).then(response => response.json())

export const fetchHumusBalance = async (): Promise<Array<HumusBalance>> =>
    await fetch(`${SOIL_SERVICE_URL}/humus_balance`).then(response => response.json())

export const calculateHumusBalance = async (field: Field): Promise<HumusBalance> =>
    await fetch(`${SOIL_SERVICE_URL}/humus_balance/calculate`, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({field: field})
    }).then(response => response.json())
