import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { Tab } from 'semantic-ui-react'

import WithBlockchainData from '../components/WithBlockchainData';
import ProfileInformation from '../components/ProfileInformation';
import TopicList from '../components/TopicList';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';

class Profile extends Component {
    constructor(props, context) {
        super(props);

        this.propsToView = this.propsToView.bind(this);

        this.drizzle = context.drizzle;

        this.state = {
            userAddress: this.props.params.address ? this.props.params.address : this.props.user.address
        };
    }

    render() {
        this.propsToView();
        var infoTab =
            (<WithBlockchainData
                    component={ProfileInformation}
                    callsInfo={[{
                        contract: 'Forum',
                        method: 'getUsername',
                        params: [this.state.userAddress]
                    },{
                        contract: 'Forum',
                        method: 'getUserDateOfRegister',
                        params: [this.state.userAddress]
                    },{
                        contract: 'Forum',
                        method: 'getOrbitDBId',
                        params: [this.state.userAddress]
                    }]}
                    address={this.state.userAddress}
                    numberOfTopics={this.topicIDs && this.topicIDs.length}
                    numberOfPosts={this.postIDs && this.postIDs.length}
                    self={this.state.userAddress === this.props.user.address}
                    key="profileInfo"
                />);
        var topicsTab =
            (<div className="profile-tab">
                {this.topicIDs
                    ? <TopicList topicIDs={this.topicIDs} />
                    : <LoadingSpinner />
                }
            </div>);
        var postsTab =
            (<div className="profile-tab">
                {this.postIDs
                    ? <PostList postIDs={this.postIDs} recentToTheTop />
                    : <LoadingSpinner />
                }
            </div>);

        const profilePanes = [
            {
                menuItem: 'INFORMATION',
                pane: {
                    key: 'INFORMATION',
                    content: (infoTab),
                },
            },
            {
                menuItem: 'TOPICS',
                pane: {
                    key: 'TOPICS',
                    content: (topicsTab),
                },
            },
            {
                menuItem: 'POSTS',
                pane: {
                    key: 'POSTS',
                    content: (postsTab),
                },
            },
        ]

        return (
            <div>
                <Tab
                    menu={{ secondary: true, pointing: true }}
                    panes={profilePanes}
                    renderActiveOnly={false} />
            </div>
        );
    }

    propsToView(){
        if (!this.topicIDs){
            let transaction = this.props.blockchainData
                .find(transaction => transaction.callInfo.method === "getUserTopics");
            if (transaction.returnData){
                this.topicIDs = transaction.returnData;
            }
        }
        if (!this.postIDs){
            let transaction = this.props.blockchainData
                .find(transaction => transaction.callInfo.method === "getUserPosts");
            if (transaction.returnData){
                this.postIDs = transaction.returnData;
            }
        }
    }
}

Profile.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    user: state.user,
    orbitDB: state.orbitDB
  }
};

class ProfileContainer extends Component {
    constructor(props){
        super(props);

        let userAddress;
        if (this.props.params.address){
            userAddress = this.props.params.address;
        } else {
            userAddress = this.props.user.address;
        }

        this.profile = <WithBlockchainData
            component={drizzleConnect(Profile, mapStateToProps)}
            callsInfo={[{
                contract: 'Forum',
                method: 'getUserTopics',
                params: [userAddress]
            },{
                contract: 'Forum',
                method: 'getUserPosts',
                params: [userAddress]
            }]}
            params={this.props.params}
        />
    }

    render() {
        return(this.profile);
    }
}

const containerProps = state => {
  return {
    user: state.user
  }
};

export default drizzleConnect(ProfileContainer, containerProps);