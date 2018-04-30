import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import Menu from './../../containers/Menu'

class Home extends Component {
  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <h1>Apella</h1>
            <br/><br/>
          </div>
          <div className="pure-u-1-1">
            <h2>Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />
            <p><strong>Username</strong>: <ContractData contract="Forum" method="getUsername" methodArgs={[this.props.accounts[0]]}/></p>
            <ContractForm contract="Forum" method="signUp" />
            <Menu method="hasUserSignedUp" methodArgs={[this.props.accounts[0]]} />
            <br/><br/>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
