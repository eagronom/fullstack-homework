import { PureComponent } from 'react'

type Props = {
  value: number
}

type State = {
  previousHumusBalance: number,
  currentHumusBalance: number
  fieldQuality: string
}

export default class HumusBalanceCell extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      previousHumusBalance: this.props.value,
      currentHumusBalance: this.props.value,
      fieldQuality: ''
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {    
    state.previousHumusBalance = state.currentHumusBalance
    state.currentHumusBalance = props.value
    
    let fieldQuality = ''
    if (state.previousHumusBalance !== state.currentHumusBalance)
      fieldQuality = (state.previousHumusBalance > state.currentHumusBalance) ? 'decreased' : 'increased' 

    state.fieldQuality = fieldQuality

    return state;
  }

  classList = () => {
    const defaultClass = 'table__cell table__cell--right'
    if (this.state.fieldQuality === '') return defaultClass

    return `${defaultClass } ${this.state.fieldQuality}-field-quality`
  }

  render = () => 
    <div className={this.classList()}>
      {this.state.currentHumusBalance.toFixed(2)}
    </div>
}