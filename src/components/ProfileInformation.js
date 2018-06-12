import React from 'react';
import UserAvatar from 'react-user-avatar';
import UsernameFormContainer from '../containers/UsernameFormContainer';

const ProfileInformation = (props) => {
        return (
            <div className="user-info">
                {props.avatarUrl && <UserAvatar
                    size="40"
                    className="inline user-avatar"
                    src={props.avatarUrl}
                    name={props.username}/>}
                <table className="highlight centered responsive-table">
                    <tbody>
                        <tr>
                            <td><strong>Username:</strong></td>
                            <td>{props.username}</td>
                        </tr>
                        <tr>
                            <td><strong>Account address:</strong></td>
                            <td>{props.address}</td>
                        </tr>
                        <tr>
                            <td><strong>OrbitDB:</strong></td>
                            <td>{props.orbitAddress}</td>
                        </tr>
                        <tr>
                            <td><strong>Number of topics created:</strong></td>
                            <td>{props.numberOfTopics}</td>
                        </tr>
                        <tr>
                            <td><strong>Number of posts:</strong></td>
                            <td>{props.numberOfPosts}</td>
                        </tr>
                        {props.dateOfRegister &&
                            <tr>
                                <td><strong>Member since:</strong></td>
                                <td>{props.dateOfRegister}</td>
                            </tr>
                        }
                    </tbody>
                </table>
                {props.self && <UsernameFormContainer/>}
            </div>
        );
};

export default ProfileInformation;