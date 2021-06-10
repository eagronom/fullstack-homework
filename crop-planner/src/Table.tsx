import { PureComponent } from 'react'
import { sortBy } from 'lodash'

import CropSelect from './CropSelect'
import { Crop, Field, SeasonalCrop } from './types'
import { fetchCrops, fetchFields, fetchHumusBalance } from './api'
import buildCropState from './buildNewFieldsState'
import { updateFieldState } from './buildNewFieldsState'

type Props = {}

type State = {
  allCrops: Array<Crop>,
  fields: Array<Field>
}

export default class Table extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      allCrops: [],
      fields: [],
    }
  }

  componentDidMount = async () =>
    this.setState({
      fields: await fetchFields(),
      allCrops: await fetchCrops(),
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

  humusBalanceIcon = (balance: number) => {
    return balance && balance > 0 ? 'table__cell--positive' : 'table__cell--negative'
  }

  renderFieldRow = (field: Field) =>
    <div className="table__row" key={field.id.toString()}>
      <div className="table__cell">{field.name}</div>
      <div className="table__cell table__cell--right">{field.area}</div>

      {sortBy(field.crops, crop => crop.year).map(seasonalCrop => this.renderCropCell(field, seasonalCrop))}

      <div className={"table__cell table__cell--right " + this.humusBalanceIcon(field.humus_balance)}>
         { field.humus_balance || '--' }
      </div>
    </div>

  renderCropCell = (field: Field, seasonalCrop: SeasonalCrop) =>
    <div className="table__cell table__cell--center table__cell--with-select" key={seasonalCrop.year.toString()}>
      <CropSelect
        selectedCrop={seasonalCrop.crop}
        allCrops={this.state.allCrops}
        onChange={newCrop => this.changeFieldCrop(newCrop, field.id, seasonalCrop.year)}
      />
    </div>

  calculateHumusBalance = async (fieldId: number) => {
    const currentField = this.state.fields.find(field => field.id === fieldId)

    if (currentField) {
      const humus_deltas = sortBy(currentField.crops, crop => crop.year)
        .map(seasonCrop => seasonCrop.crop ? seasonCrop.crop.humus_delta : 0)
      const { humus_balance } = await fetchHumusBalance(humus_deltas)
      this.setState(
        updateFieldState(this.state.fields, fieldId, humus_balance)
      )
    }
  }

  changeFieldCrop = async (newCrop: Crop | null, fieldId: number, cropYear: number) => {
    this.setState(
      buildCropState(this.state.fields, newCrop, fieldId, cropYear),
      function(this: Table) {
        this.calculateHumusBalance(fieldId)
      }
    )
  }
}
