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
        <div className="user-info">
            {props.avatarUrl && <UserAvatar
                size="40"
                className="inline user-avatar"
                src={props.avatarUrl}
                name={username}/>}
            <table className="highlight centered responsive-table">
                <tbody>
                    <tr>
                        <td><strong>Username:</strong></td>
                        <td>{username}</td>
                    </tr>
                    <tr>
                        <td><strong>Account address:</strong></td>
                        <td>{props.address}</td>
                    </tr>
                    <tr>
                        <td><strong>OrbitDB:</strong></td>
                        <td>{orbitDBId}</td>
                    </tr>
                    <tr>
                        <td><strong>Number of topics created:</strong></td>
                        <td>{props.numberOfTopics}</td>
                    </tr>
                    <tr>
                        <td><strong>Number of posts:</strong></td>
                        <td>{props.numberOfPosts}</td>
                    </tr>
                    {dateOfRegister &&
                        <tr>
                            <td><strong>Member since:</strong></td>
                            <td>{epochTimeConverter(dateOfRegister)}</td>
                        </tr>
                    }
                </tbody>
            </table>
            {props.self && <UsernameFormContainer/>}
        </div>
    );
};

export default ProfileInformation;