import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import UsernameFormContainer from '../../containers/UsernameFormContainer'

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
                        <p><strong>Username</strong>: {this.props.user.username}</p>
                        <p><strong>Account</strong>: {this.props.user.address}</p>
                        <p><strong>OrbitDB</strong>: {this.props.orbitDB.id}</p>
                        <UsernameFormContainer/>
                        <br/><br/>
                    </div>
                </div>
            </main>
        )
    }
}

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    user: state.user,
    orbitDB: state.orbitDB,
    drizzleStatus: state.drizzleStatus
  }
};

const HomeContainer = drizzleConnect(Home, mapStateToProps);

export default HomeContainer
