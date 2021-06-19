import { Crop, Field, HumusBalanceAPIRespone } from "./types";

const SOIL_SERVICE_URL = "http://localhost:3000";

export const fetchFields = async (): Promise<Array<Field>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields`).then((response) => response.json());

export const fetchCrops = async (): Promise<Array<Crop>> =>
  await fetch(`${SOIL_SERVICE_URL}/crops`).then((response) => response.json());

export const fetchHumusBalance = async (
  field: Field
): Promise<HumusBalanceAPIRespone> => {
  const params = `field_id=${field.id}&${field.crops
    .map((crop) => `years[${crop.year}]=${crop.crop?.value}`)
    .join("&")}`;
  return await fetch(
    `${SOIL_SERVICE_URL}/humus-balance/?${encodeURI(params)}`
  ).then((response) => response.json());
};
