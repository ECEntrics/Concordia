import React, { Component } from 'react';
import {connect} from "react-redux";

class HomeContainer extends Component {
  render() {
    return (<div className="App">
      <div className="section">
        <h1>Active Account</h1>
        {this.props.accounts[0]}
      </div>
    </div>);
  }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    drizzleStatus: state.drizzleStatus
  };
};

export default connect(mapStateToProps)(HomeContainer);
