import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import UserAvatar from 'react-user-avatar';
import epochTimeConverter from '../helpers/EpochTimeConverter';

import UsernameFormContainer from '../containers/UsernameFormContainer';

const callsInfo = [{
        contract: 'Forum',
        method: 'getUserDateOfRegister'
    },{
        contract: 'Forum',
        method: 'getOrbitDBId'
}]

class ProfileInformation extends Component {
    constructor(props) {
        super(props);

        this.dataKey = [];
        var pageStatus = 'initialized';
        if (this.props.drizzleStatus['initialized']) {
            callsInfo.forEach((call, index) => {
                this.dataKey[index] = drizzle.contracts[call.contract]
                    .methods[call.method].cacheCall(this.props.address);
            })
            pageStatus = 'loading';
        }
        if (this.dataKey.length !== 0) {
            pageStatus = 'loaded';
            callsInfo.forEach((call, index) => {
                if (!this.props.contracts[call.contract][call.method][this.dataKey[index]]) {
                    pageStatus = 'loading';
                    return;
                }
            })
        }
        if (pageStatus === 'loaded'){
            var dateOfRegister = '';
            var orbitDBId = '';

            let transaction = this.props.contracts[callsInfo[0].contract][callsInfo[0].method][this.dataKey[0]];
            if (transaction){
                dateOfRegister = transaction.value;
            }
            transaction = this.props.contracts[callsInfo[1].contract][callsInfo[1].method][this.dataKey[1]];
            if (transaction){
                orbitDBId = transaction.value;
            }
        }

        this.state = {
            pageStatus: pageStatus,
            dateOfRegister: dateOfRegister ? dateOfRegister : '',
            orbitDBId: orbitDBId ? orbitDBId : ''
        };
    }

    componentDidUpdate(){
        if (this.state.pageStatus === 'initialized' &&
            this.props.drizzleStatus['initialized']) {
            callsInfo.forEach((call, index) => {
                this.dataKey[index] = drizzle.contracts[call.contract]
                    .methods[call.method].cacheCall(this.props.address);
            })
            this.setState({ pageStatus: 'loading' });
        }

        if (this.state.pageStatus === 'loading') {
            var pageStatus = 'loaded';
            callsInfo.forEach((call, index) => {
                if (!this.props.contracts[call.contract][call.method][this.dataKey[index]]) {
                    pageStatus = 'loading';
                    return;
                }
            })

            if (pageStatus === 'loaded') {
                this.setState({ pageStatus: pageStatus });
            }
        }

        if (this.state.pageStatus === 'loaded'){
            if (this.state.dateOfRegister === ''){
                let transaction = this.props.contracts[callsInfo[0].contract][callsInfo[0].method][this.dataKey[0]];
                if (transaction){
                    this.setState({ dateOfRegister: transaction.value });
                }
            }
            if (this.state.orbitDBId === ''){
                let transaction = this.props.contracts[callsInfo[1].contract][callsInfo[1].method][this.dataKey[1]];
                if (transaction){
                    this.setState({ orbitDBId: transaction.value });
                }
            }
        }
    }

    render() {
        return (
            <div className="user-info">
                {this.props.avatarUrl && <UserAvatar
                    size="40"
                    className="inline user-avatar"
                    src={this.props.avatarUrl}
                    name={this.props.username}/>}
                <table className="highlight centered responsive-table">
                    <tbody>
                        <tr>
                            <td><strong>Username:</strong></td>
                            <td>{this.props.username}</td>
                        </tr>
                        <tr>
                            <td><strong>Account address:</strong></td>
                            <td>{this.props.address}</td>
                        </tr>
                        <tr>
                            <td><strong>OrbitDB:</strong></td>
                            <td>{this.state.orbitDBId}</td>
                        </tr>
                        <tr>
                            <td><strong>Number of topics created:</strong></td>
                            <td>{this.props.numberOfTopics}</td>
                        </tr>
                        <tr>
                            <td><strong>Number of posts:</strong></td>
                            <td>{this.props.numberOfPosts}</td>
                        </tr>
                        {this.state.dateOfRegister &&
                            <tr>
                                <td><strong>Member since:</strong></td>
                                <td>{epochTimeConverter(this.state.dateOfRegister)}</td>
                            </tr>
                        }
                    </tbody>
                </table>
                {this.props.self && <UsernameFormContainer/>}
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        drizzleStatus: state.drizzleStatus,
        contracts: state.contracts,
        user: state.user
    }
};

export default connect(mapStateToProps)(ProfileInformation);
