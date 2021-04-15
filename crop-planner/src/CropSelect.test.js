import { shallow } from 'enzyme'

import CropSelect from './CropSelect'

describe('<CropSelect />', () => {
  it('renders', () => {
    expect(shallow(
      <CropSelect
        selectedCrop={{value: 1, label: 'My Crop'}}
        allCrops={[
          {value: 1, label: 'My Crop'},
          {value: 2, label: 'My Second Crop'},
        ]}
        onChange={jest.fn()}
      />
    )).toMatchSnapshot()
  })
})
