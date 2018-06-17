import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';

import BoardContainer from './BoardContainer';

class Home extends Component {
    render() {
        //We can add a modal to tell the user to sign up

        /*var modal = this.props.user.hasSignedUp && (
        <Modal dimmer='blurring' open={this.state.open}>
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content image>
                <Image wrapped size='medium' src='/assets/images/avatar/large/rachel.png' />
                <Modal.Description>
                    <Header>Default Profile Image</Header>
                    <p>We've found the following gravatar image associated with your e-mail address.</p>
                    <p>Is it okay to use this photo?</p>
                </Modal.Description>
            </Modal.Content>
        </Modal>);*/

        return (<BoardContainer/>);
    }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
};

const HomeContainer = drizzleConnect(Home, mapStateToProps);

export default HomeContainer;