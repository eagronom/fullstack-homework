export type Crop = { value: number, label: string, humus_delta: number }

export type SeasonalCrop = {
  year: number,
  crop: Crop | null,
}

export type HumusBalance = {
  humus_balance: number
}

export type Field = {
  id: number,
  name: string,
  area: number,
  humus_balance: number,
  crops: Array<SeasonalCrop>,
}
