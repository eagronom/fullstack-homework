import {HumusBalance} from './types'
import { filter } from 'lodash'

// Here we emulate a reducer
const buildNewHumusState = (oldHumusBalances: Array<HumusBalance>, newHumusBalance: HumusBalance) => {

  return {
    humusBalance: [
      ...filter(oldHumusBalances, humusBalance => humusBalance.field_id !== newHumusBalance.field_id),
      newHumusBalance
    ],
  }
}

export default buildNewHumusState
