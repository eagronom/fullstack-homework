import { PureComponent } from 'react'

import './stylesheets/index.scss'

import Table from './Table'

class App extends PureComponent {
  render = () =>
    <div className="app">
      <Table />
    </div>
}

export default App
