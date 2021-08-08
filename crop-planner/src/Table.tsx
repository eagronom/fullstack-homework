import { PureComponent } from 'react'
import {sortBy, find } from 'lodash'

import CropSelect from './CropSelect'
import {Crop, Field, HumusBalance, SeasonalCrop} from './types'
import { fetchCrops, fetchFields, fetchHumusBalance, calculateHumusBalance } from './api'
import buildNewFieldsState from './buildNewFieldsState'
import buildNewHumusState from "./buildNewHumusState";

type Props = {}

type State = {
  allCrops: Array<Crop>,
  fields: Array<Field>,
  humusBalance: Array<HumusBalance>
}

export default class Table extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      allCrops: [],
      fields: [],
      humusBalance: []
    }
  }

  componentDidMount = async () =>
    this.setState({
      fields: await fetchFields(),
      allCrops: await fetchCrops(),
      humusBalance: await fetchHumusBalance()
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

      <div className="table__cell table__cell--right">{find(this.state.humusBalance, humusBalance => field.id === humusBalance.field_id)?.humus_balance ?? 'Not Calculated'}</div>
    </div>

  renderCropCell = (field: Field, seasonalCrop: SeasonalCrop) =>
    <div className="table__cell table__cell--center table__cell--with-select">
      <CropSelect
        selectedCrop={seasonalCrop.crop}
        allCrops={this.state.allCrops}
        onChange={newCrop => this.changeFieldCrop(newCrop, field.id, seasonalCrop.year)}
      />
    </div>

  changeFieldCrop = (newCrop: Crop | null, fieldId: number, cropYear: number) => {
      let newFieldsState = buildNewFieldsState(this.state.fields, newCrop, fieldId, cropYear)
      this.setState(newFieldsState)
      const changedField = find(newFieldsState.fields, field => field.id === fieldId)!

      calculateHumusBalance(changedField).then((humusBalance) => {
          this.setState(buildNewHumusState(this.state.humusBalance, humusBalance))
      })

      return null
  }

}
