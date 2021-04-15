import { Crop, Field } from './types'
import { filter, find } from 'lodash'

// Here we emulate a reducer
const buildNewFieldsState = (oldFields: Array<Field>, newCrop: Crop | null, fieldId: number, cropYear: number) => {
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

export default buildNewFieldsState
