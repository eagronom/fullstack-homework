import { Crop, Field } from './types'
import { filter, find } from 'lodash'

// Here we emulate a reducer
const buildCropState = (oldFields: Array<Field>, newCrop: Crop | null, fieldId: number, cropYear: number) => {
  const oldField = find(oldFields, field => field.id === fieldId)!

  return {
    fields: [
      ...filter(oldFields, field => field.id !== fieldId),
      {
        ...oldField,
        crops: [
          ...filter(oldField.crops, crop => crop.year !== cropYear),
          { year: cropYear, crop: newCrop },
        ],
      },
    ],
  }
}

export const updateFieldState = (oldFields: Array<Field>, fieldId: number, humus_balance: number) => {
  const oldField = find(oldFields, field => field.id === fieldId)!

  return {
    fields: [
      ...filter(oldFields, field => field.id !== fieldId),
      {
        ...oldField,
        humus_balance: humus_balance
      }
    ]
  }
}

export default buildCropState
