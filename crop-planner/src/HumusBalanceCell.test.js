import { shallow } from 'enzyme'

import HumusBalanceCell from './HumusBalanceCell'

describe('<HumusBalanceCell />', () => {
  it('renders', () => {
    expect(shallow(
      <HumusBalanceCell value={10} />
    )).toMatchSnapshot()
  })
})
