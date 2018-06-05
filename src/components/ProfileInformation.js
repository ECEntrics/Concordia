import React from 'react';
import UserAvatar from 'react-user-avatar';
import UsernameFormContainer from '../containers/UsernameFormContainer';

const ProfileInformation = (props) => {
        return (
            <div className="pure-u-1-1 user-info card">
                {props.avatarUrl && <UserAvatar
                    size="40"
                    className="inline user-avatar"
                    src={props.avatarUrl}
                    name={props.username}/>}
                <p className="no-margin inline">
                    <strong>Username</strong>: {props.username}
                </p>
                <p className="no-margin">
                    <strong>Account address:</strong> {props.address}
                </p>
                <p className="no-margin">
                    <strong>OrbitDB:</strong> {props.orbitAddress}
                </p>
                <p className="no-margin">
                    Number of posts: TODO?
                </p>
                <UsernameFormContainer/>
            </div>
        );
};

export default ProfileInformation;