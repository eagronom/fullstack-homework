import Select from 'react-select'

import { Crop } from './types'

type Props = {
  selectedCrop: Crop | null,
  allCrops: Array<Crop>,
  onChange: (crop: Crop | null) => void,
}

const CropSelect = (props: Props) => (
  <Select
    className="react-select react-select--table"
    classNamePrefix="react-select"
    value={props.selectedCrop}
    options={props.allCrops}
    onChange={props.onChange}
  />
)

export default CropSelect
