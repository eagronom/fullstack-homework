export type Crop = { value: number, label: string }

export type SeasonalCrop = {
  year: number,
  crop: Crop | null,
}

export type Field = {
  id: number,
  name: string,
  area: number,
  crops: Array<SeasonalCrop>,
}

export type HumusBalance = {
  field_id: number,
  humus_balance: number
}
