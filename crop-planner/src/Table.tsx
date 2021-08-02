import { PureComponent } from 'react'
import { sortBy } from 'lodash'

import CropSelect from './CropSelect'
import { Crop, Field, SeasonalCrop } from './types'
import { fetchCrops, fetchFields, reCalculateHumusBalance } from './api'
import buildNewFieldsState from './buildNewFieldsState'

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
        <div className="table__cell table__cell--right">Impact</div>
      </div>

      {sortBy(this.state.fields, field => field.name).map(field => this.renderFieldRow(field))}
    </div>

  renderFieldRow = (field: Field) => {
    return (
      <div className="table__row" key={field.name}>
        <div className="table__cell">{field.name}</div>
        <div className="table__cell table__cell--right">{field.area}</div>

        {sortBy(field.crops, crop => crop.year).map((seasonalCrop, cropIndex) => this.renderCropCell(field, seasonalCrop, cropIndex))}

        <div className="table__cell table__cell--right">{field.humus_balance}</div>
          <div className="table__cell table__cell--right">
            {
            field.humus_balance > 0 ? 
            <b style={{ color: "green" }}>&#9650;</b>
            : field.humus_balance < 0 ?
            <b style={{ color: "red" }}>&#9660;</b> :
            <b style={{ color: "grey" }}>&#65309;</b>
            }
            {field.humus_balance > 0 ? "Improving" : field.humus_balance === 0 ? "Maintaining" : "Degrading"}
          </div>
      </div>
    )
  }

  renderCropCell = (field: Field, seasonalCrop: SeasonalCrop, cropIndex: number) => {
    return (
      <div className="table__cell table__cell--center table__cell--with-select" key={field.name+cropIndex}>
        <CropSelect
          selectedCrop={seasonalCrop.crop}
          allCrops={this.state.allCrops}
          onChange={async newCrop => this.changeFieldCrop(newCrop, field.id, seasonalCrop.year)}
        />
      </div>
    )
  }

  changeFieldCrop = (newCrop: Crop | null, fieldId: number, cropYear: number) => {
    this.setState(
      buildNewFieldsState(this.state.fields, newCrop, fieldId, cropYear),
      async () => {
        const affectedField = this.state.fields.filter(field => field.id === fieldId)
        const affectedFieldIndex = this.state.fields.findIndex(field => field.id === fieldId)
        const response = await reCalculateHumusBalance(affectedField[0])
        this.setState({
          fields: this.state.fields.map((field, index) => {
            if (index === affectedFieldIndex) {
              field = response[0]
            }
            return field;
          })
        })
      })
  }
}
