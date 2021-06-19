export type Crop = { value: number; label: string };

export type SeasonalCrop = {
  year: number;
  crop: Crop | null;
};

export type Field = {
  id: number;
  name: string;
  area: number;
  crops: Array<SeasonalCrop>;
};

export type FieldHumusBalance = {
  fieldId: number;
  currentBalance: number;
  previousBalance: number;
};

export type HumusBalanceAPIRespone = {
  field_id: number;
  humus_balance: number;
  previous_humus_balance: number;
};
