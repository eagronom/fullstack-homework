import { PureComponent } from "react";
import { sortBy } from "lodash";

import CropSelect from "./CropSelect";
import { Crop, Field, SeasonalCrop, FieldHumusBalance } from "./types";
import { fetchCrops, fetchFields, fetchHumusBalance } from "./api";
import {
  fetchManyFieldsHumusBalance,
  serializeHumusBalanceResponse,
  serializeManyHumusBalanceResponse,
} from "./api.utils";
import buildNewFieldsState from "./buildNewFieldsState";
import buildNewHumusBalance from "./buildNewHumusBalance";

type Props = {};

type State = {
  allCrops: Array<Crop>;
  fields: Array<Field>;
  humusBalance: Array<FieldHumusBalance>;
};

const humusBalanceSelector = (field: Field, state: State) =>
  state.humusBalance.find((balance) => balance.fieldId === field.id);

const fieldSelector = (fieldId: number, fields: Array<Field>) =>
  fields.find((field) => field.id === fieldId);

const getKindHumusBalance = (
  humusBalance: FieldHumusBalance
): "good" | "bad" | "same" => {
  if (humusBalance.currentBalance > humusBalance.previousBalance) return "good";
  if (humusBalance.currentBalance < humusBalance.previousBalance) return "bad";
  return "same";
};

export default class Table extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      allCrops: [],
      fields: [],
      humusBalance: [],
    };
  }

  componentDidMount = async () => {
    const fields = await fetchFields();
    const allCrops = await fetchCrops();
    const fieldsHumusBalance = await fetchManyFieldsHumusBalance(fields);
    console.log(fieldsHumusBalance, "locox");
    const humusBalance = serializeManyHumusBalanceResponse(fieldsHumusBalance);

    return this.setState({
      fields,
      allCrops,
      humusBalance,
    });
  };

  render = () => {
    return (
      <div className="table">
        <div className="table__row table__row--header">
          <div className="table__cell">Field name</div>
          <div className="table__cell table__cell--right">Field area (ha)</div>
          <div className="table__cell table__cell--center">2020 crop</div>
          <div className="table__cell table__cell--center">2021 crop</div>
          <div className="table__cell table__cell--center">2022 crop</div>
          <div className="table__cell table__cell--center">2023 crop</div>
          <div className="table__cell table__cell--center">2024 crop</div>
          <div className="table__cell table__cell--right">Humus balance</div>
        </div>

        {sortBy(this.state.fields, (field) => field.name).map((field) =>
          this.renderFieldRow(field)
        )}
      </div>
    );
  };

  renderFieldRow = (field: Field) => {
    const humusBalance = humusBalanceSelector(field, this.state);
    const kindHumusBalanceClassName = humusBalance
      ? ` table__cell--${getKindHumusBalance(humusBalance)}-balance`
      : "";

    return (
      <div className="table__row" key={field.id}>
        <div className="table__cell">{field.name}</div>
        <div className="table__cell table__cell--right">{field.area}</div>

        {sortBy(field.crops, (crop) => crop.year).map((seasonalCrop) =>
          this.renderCropCell(field, seasonalCrop)
        )}

        <div
          className={`table__cell table__cell--right${kindHumusBalanceClassName}`}
        >
          {humusBalance?.currentBalance.toFixed(2) ?? "--"}
        </div>
      </div>
    );
  };

  renderCropCell = (field: Field, seasonalCrop: SeasonalCrop) => (
    <div className="table__cell table__cell--center table__cell--with-select">
      <CropSelect
        selectedCrop={seasonalCrop.crop}
        allCrops={this.state.allCrops}
        onChange={(newCrop) =>
          this.changeFieldCrop(newCrop, field.id, seasonalCrop.year)
        }
      />
    </div>
  );

  changeFieldCrop = async (
    newCrop: Crop | null,
    fieldId: number,
    cropYear: number
  ) => {
    const newFieldsState = buildNewFieldsState(
      this.state.fields,
      newCrop,
      fieldId,
      cropYear
    );
    const fieldUpdated = fieldSelector(fieldId, newFieldsState.fields);
    let newHumusBalance: { humusBalance: Array<FieldHumusBalance> } = {
      humusBalance: [],
    };
    if (fieldUpdated) {
      newHumusBalance = buildNewHumusBalance(
        this.state.humusBalance,
        serializeHumusBalanceResponse(await fetchHumusBalance(fieldUpdated))
      );
    }
    return this.setState({ ...newFieldsState, ...newHumusBalance });
  };
}
