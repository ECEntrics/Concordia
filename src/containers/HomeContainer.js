import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import SignUpContainer from './SignUpContainer';
import BoardContainer from './BoardContainer';

class Home extends Component {
    render() {
        //This must change to routes and redirects
        const view = this.props.user.hasSignedUp
            ? (<BoardContainer/>) //This may become multiple boards
            : (<SignUpContainer/>);

        return (
            <div>
                {view}
            </div>
        );
    }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
};

const HomeContainer = drizzleConnect(Home, mapStateToProps);

export default HomeContainer;