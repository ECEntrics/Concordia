import React from 'react';
import UserAvatar from 'react-user-avatar';

import epochTimeConverter from '../helpers/EpochTimeConverter';

import UsernameFormContainer from '../containers/UsernameFormContainer';

const ProfileInformation = (props) => {
    let transaction = props.blockchainData
        .find(transaction => transaction.callInfo.method === "getUsername");
    let username = transaction ? transaction.returnData : "";

    transaction = props.blockchainData
        .find(transaction => transaction.callInfo.method === "getUserDateOfRegister");
    let dateOfRegister = transaction ? transaction.returnData : "";

    transaction = props.blockchainData
        .find(transaction => transaction.callInfo.method === "getOrbitDBId")
    let orbitDBId = transaction ? transaction.returnData : "";

    return (
        <div className="pure-u-1-1 user-info card">
            {props.avatarUrl && <UserAvatar
                size="40"
                className="inline user-avatar"
                src={props.avatarUrl}
                name={username}/>}
            <p className="no-margin inline">
                <strong>Username:</strong> {username}
            </p>
            <p className="no-margin">
                <strong>Account address:</strong> {props.address}
            </p>
            <p className="no-margin">
                <strong>OrbitDB:</strong> {orbitDBId}
            </p>
            <p className="no-margin">
                <strong>Number of topics created:</strong> {props.numberOfTopics}
            </p>
            <p className="no-margin">
                <strong>Number of posts:</strong> {props.numberOfPosts}
            </p>
            <p className="no-margin">
                <strong>Member since:</strong> {epochTimeConverter(dateOfRegister)}
            </p>
            {props.self && <UsernameFormContainer/>}
        </div>
    );
};

export default ProfileInformation;