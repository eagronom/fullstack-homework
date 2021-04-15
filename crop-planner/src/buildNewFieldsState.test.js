import buildNewFieldsState from './buildNewFieldsState'

describe('buildNewFieldsState()', () => {
  const oldFields = [
    {
      id: 1,
      name: 'Mäeotsa',
      area: 0.93,
      crops: [
        { year: 2020, crop: { value: 1, label: 'Crop 1', humus_delta: 5 } },
        { year: 2021, crop: { value: 2, label: 'Crop 2', humus_delta: 4 } },
        { year: 2022, crop: { value: 3, label: 'Crop 3', humus_delta: 3 } },
        { year: 2023, crop: { value: 4, label: 'Crop 4', humus_delta: 2 } },
        { year: 2024, crop: { value: 5, label: 'Crop 5', humus_delta: 1 } },
      ],
    },
    {
      id: 2,
      name: 'Orupealse',
      area: 3,
      crops: [
        { year: 2020, crop: { value: 1, label: 'Crop 1', humus_delta: 5 } },
        { year: 2021, crop: { value: 2, label: 'Crop 2', humus_delta: 4 } },
        { year: 2022, crop: { value: 3, label: 'Crop 3', humus_delta: 3 } },
        { year: 2023, crop: { value: 4, label: 'Crop 4', humus_delta: 2 } },
        { year: 2024, crop: { value: 5, label: 'Crop 5', humus_delta: 1 } },
      ],
    },
  ]
  const newCrop = { value: 6, label: 'Crop 6', humus_delta: 1 }
  const fieldId = 2
  const cropYear = 2022

  it('returns updated state', () => {
    expect(buildNewFieldsState(oldFields, newCrop, fieldId, cropYear)).toMatchSnapshot()
  })
})
