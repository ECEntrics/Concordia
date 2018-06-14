import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WithBlockchainData from '../components/WithBlockchainData';
import ProfileInformation from '../components/ProfileInformation';
import TopicList from '../components/TopicList';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';

class Profile extends Component {
    constructor(props, context) {
        super(props);

        this.handleTabClick = this.handleTabClick.bind(this);
        this.propsToView = this.propsToView.bind(this);

        this.drizzle = context.drizzle;

        this.state = {
            viewSelected: "topics",
            userAddress: this.props.params.address ? this.props.params.address : this.props.user.address
        };
    }

    handleTabClick(id) {
        this.setState({viewSelected: id});
    }

    render() {
        this.propsToView();
        var selectedTab = this.state.viewSelected === "topics"
            ?(<div className="profile-tab">
                {this.topicIDs
                    ? <TopicList topicIDs={this.topicIDs} />
                    : <LoadingSpinner />
                }
            </div>)
            :(<div className="profile-tab">
                {this.postIDs
                    ? <PostList postIDs={this.postIDs} recentToTheTop />
                    : <LoadingSpinner />
                }
            </div>);

        return (
            <div className="pure-g">
                <WithBlockchainData
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
                />
                <div className="pure-u-1-1 profile-tabs-header">
                    <p onClick={() => (this.handleTabClick("topics"))}
                        className={this.state.viewSelected === "topics" ? "profile-tab-selected" : ""}>
                        Topics
                    </p>
                    <p onClick={() => (this.handleTabClick("posts"))}
                        className={this.state.viewSelected === "posts" ? "profile-tab-selected" : ""}>
                        Posts
                    </p>
                </div>
                {selectedTab}
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