import { PureComponent } from 'react'
import { sortBy } from 'lodash'

import CropSelect from './CropSelect'
import HumusBalanceCell from './HumusBalanceCell'
import { Crop, Field, SeasonalCrop, HumusBalance } from './types'
import { fetchCrops, fetchFields, fetchHumusBalances } from './api'
import buildNewFieldsState from './buildNewFieldsState'

type Props = {}

type State = {
  allCrops: Array<Crop>,
  fields: Array<Field>,
  humusBalances: Array<HumusBalance>
}

export default class Table extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      allCrops: [],
      fields: [],
      humusBalances: [],
    }
  }

  componentDidMount = async () =>
    this.setState({
      fields: await fetchFields(),
      allCrops: await fetchCrops(),
      humusBalances: await fetchHumusBalances()
    })

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

      <HumusBalanceCell
        value={this.fieldHumusBalanceValue(field.id)}
      />
    </div>

  renderCropCell = (field: Field, seasonalCrop: SeasonalCrop) =>
    <div className="table__cell table__cell--center table__cell--with-select">
      <CropSelect
        selectedCrop={seasonalCrop.crop}
        allCrops={this.state.allCrops}
        onChange={newCrop => this.changeFieldCrop(newCrop, field.id, seasonalCrop.year)}
      />
    </div>

  changeFieldCrop = (newCrop: Crop | null, fieldId: number, cropYear: number) =>
    this.setState(
      buildNewFieldsState(this.state.fields, newCrop, fieldId, cropYear),
      async () => {
        const field = this.state.fields.find(field => field.id === fieldId);
        if (field) await this.updateFieldHumusBalance()
      }
    )

  fieldHumusBalanceValue = (fieldId: number) => this.state.humusBalances.find(item => item.id === fieldId )!.value

  updateFieldHumusBalance = async () => {    
    this.setState({
      humusBalances: await fetchHumusBalances(this.state.fields)
    })
  }
}
