import { FieldHumusBalance, HumusBalanceAPIRespone, Field } from "./types";
import { fetchHumusBalance } from "./api";

export const serializeHumusBalanceResponse = (
  balanceResponse: HumusBalanceAPIRespone
): FieldHumusBalance => ({
  fieldId: balanceResponse.field_id,
  currentBalance: balanceResponse.humus_balance,
  previousBalance: balanceResponse.previous_humus_balance,
});

export const serializeManyHumusBalanceResponse = (
  response: HumusBalanceAPIRespone[]
) => response.map(serializeHumusBalanceResponse);

export const fetchManyFieldsHumusBalance = async (
  fields: Array<Field>
): Promise<HumusBalanceAPIRespone[]> =>
  await Promise.all(fields.map(fetchHumusBalance));
