import { FieldHumusBalance } from "./types";

const buildNewHumusBalance = (
  oldHumusBalance: Array<FieldHumusBalance>,
  newFieldHumusBalance: FieldHumusBalance
) => {
  const previousFieldHumusBalanceIndex = oldHumusBalance.findIndex(
    (fieldHumusBalance) =>
      fieldHumusBalance.fieldId === newFieldHumusBalance.fieldId
  );
  const humusBalance = [...oldHumusBalance];
  if (previousFieldHumusBalanceIndex > -1) {
    humusBalance.splice(previousFieldHumusBalanceIndex, 1);
    humusBalance.push(newFieldHumusBalance);
  }
  return {
    humusBalance,
  };
};

export default buildNewHumusBalance;
