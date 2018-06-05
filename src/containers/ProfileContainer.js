import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';

import ProfileInformation from '../components/ProfileInformation';
import PostList from '../components/PostList';

class SignUp extends Component {
    render() {
        return (
            <div className="pure-g">
                <ProfileInformation username={this.props.user.username}
                    address={this.props.user.address}
                    orbitAddress={this.props.orbitDB.id}/>
                <p className="pure-u-1-1">
                    My posts:
                </p>
                <PostList/> {/*TODO change this with actual user's posts*/}
            </div>
        );
    }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    user: state.user,
    orbitDB: state.orbitDB,
    drizzleStatus: state.drizzleStatus
  }
};

const ProfileContainer = drizzleConnect(SignUp, mapStateToProps);

export default ProfileContainer;