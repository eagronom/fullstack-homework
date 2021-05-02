import { PureComponent } from 'react'
import { sortBy } from 'lodash'

import CropSelect from './CropSelect'
import { Crop, Field, SeasonalCrop } from './types'
import { fetchCrops, fetchFields, fetchHumusBalance } from './api'
import buildNewFieldsState from './buildNewFieldsState'

type Props = {}

type State = {
  allCrops: Array<Crop>,
  fields: Array<Field>,
  fieldIdToInitialHumusBalance: {[key: number]: number}
}

export default class Table extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)


    this.state = {
      allCrops: [],
      fields: [],
      fieldIdToInitialHumusBalance: {}
    }
  }

  componentDidMount = async () => {
    fetchFields().then(fields => {
      this.setState({fields: fields}, () =>
        fields.forEach(field => fetchHumusBalance(field.crops).then(balance => {
          field.humusBalance = balance;
          this.updateInitialHumusBalance(field, balance);
          this.setState({fields: {...fields}})
        })))
    });
    this.setState({
      allCrops: await fetchCrops()
    })
  }

  private updateInitialHumusBalance(field: Field, balance: number): void {
    const fieldIdToInitialHumusBalance = {...this.state.fieldIdToInitialHumusBalance};
    fieldIdToInitialHumusBalance[field.id] = balance;
    this.setState({fieldIdToInitialHumusBalance: fieldIdToInitialHumusBalance});
  }

  render = () =>
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

      {sortBy(this.state.fields, field => field.name).map(field => this.renderFieldRow(field))}
    </div>

  renderFieldRow = (field: Field) =>
    <div className="table__row" key={field.id}>
      <div className="table__cell">{field.name}</div>
      <div className="table__cell table__cell--right">{field.area}</div>

      {sortBy(field.crops, crop => crop.year).map(seasonalCrop => this.renderCropCell(field, seasonalCrop))}

      <div className={"table__cell table__cell--right" + this.getHumusBalanceStateClass(field)}>{field.humusBalance != null ? field.humusBalance :
        'loading...'}</div>
    </div>

  private getHumusBalanceStateClass(field: Field): string {
    if (field.humusBalance == null || this.state.fieldIdToInitialHumusBalance[field.id] === field.humusBalance) {
      return '';
    }
    return this.state.fieldIdToInitialHumusBalance[field.id] < field.humusBalance ? ' better-humus-balance' : ' worse-humus-balance';
  }

  renderCropCell = (field: Field, seasonalCrop: SeasonalCrop) =>
    <div className="table__cell table__cell--center table__cell--with-select">
      <CropSelect selectedCrop={seasonalCrop.crop}
        allCrops={this.state.allCrops}
        onChange={newCrop => this.changeFieldCrop(newCrop, field.id, seasonalCrop.year)}/>
    </div>

  changeFieldCrop = (newCrop: Crop | null, fieldId: number, cropYear: number) => {
    const updatedFields = buildNewFieldsState(this.state.fields, newCrop, fieldId, cropYear).fields
    const updatedField = updatedFields.find(field => field.id === fieldId) as Field;
    updatedField.humusBalance = undefined; // to show loading message
    this.setState({fields: updatedFields});
    fetchHumusBalance(updatedField.crops).then(balance => {
      updatedField.humusBalance = balance;
      this.setState({fields: {...updatedFields}});
    });
  }
}
