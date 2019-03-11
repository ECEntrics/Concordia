import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router'
import { connect } from 'react-redux';
import { drizzle } from '../index';

import { Tab } from 'semantic-ui-react'

import ProfileInformation from '../components/ProfileInformation';
import TopicList from '../components/TopicList';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';
import { setNavBarTitle } from '../redux/actions/userInterfaceActions';

const callsInfo = [{
        contract: 'Forum',
        method: 'getUsername'
    },{
        contract: 'Forum',
        method: 'getUserTopics'
    },{
        contract: 'Forum',
        method: 'getUserPosts'
    }
];

class ProfileContainer extends Component {
    constructor(props) {
        super(props);

        this.getBlockchainData = this.getBlockchainData.bind(this);

        this.dataKey = [];
        var address = this.props.match.params.address
            ? this.props.match.params.address
            : this.props.user.address;

        this.state = {
            pageStatus: 'initialized',
            userAddress: address,
            username: '',
            topicIDs: null,
            postIDs: null
        };
    }

    getBlockchainData() {
        if (this.state.pageStatus === 'initialized' &&
            this.props.drizzleStatus['initialized']) {
            callsInfo.forEach((call, index) => {
                this.dataKey[index] = drizzle.contracts[call.contract]
                    .methods[call.method].cacheCall(this.state.userAddress);
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
            if (this.state.username === ''){
                let transaction = this.props.contracts[callsInfo[0].contract][callsInfo[0].method][this.dataKey[0]];
                if (transaction){
                    var username = transaction.value;
                    this.props.setNavBarTitle(username);
                    this.setState({ username: username });
                }
            }
            if (this.state.topicIDs === null){
                let transaction = this.props.contracts[callsInfo[1].contract][callsInfo[1].method][this.dataKey[1]];
                if (transaction){
                    this.setState({ topicIDs: transaction.value });
                }
            }
            if (this.state.postIDs === null){
                let transaction = this.props.contracts[callsInfo[2].contract][callsInfo[2].method][this.dataKey[2]];
                if (transaction){
                    this.setState({ postIDs: transaction.value });
                }
            }

            /*this.props.store.dispatch(hideProgressBar());*/
        }
    }

    render() {
        if (!this.props.user.hasSignedUp) {
            this.props.navigateTo("/signup");
            return(null);
        }

        var infoTab =
            (<ProfileInformation
                address={this.state.userAddress}
                username={this.state.username}
                numberOfTopics={this.state.topicIDs && this.state.topicIDs.length}
                numberOfPosts={this.state.postIDs && this.state.postIDs.length}
                self={this.state.userAddress === this.props.user.address}
                key="profileInfo"
                />);
        var topicsTab =
            (<div className="profile-tab">
                {this.state.topicIDs
                    ? <TopicList topicIDs={this.state.topicIDs} />
                    : <LoadingSpinner />
                }
            </div>);
        var postsTab =
            (<div className="profile-tab">
                {this.state.postIDs
                    ? <PostList postIDs={this.state.postIDs} recentToTheTop />
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

    componentDidMount() {
        this.getBlockchainData();
    }

    componentDidUpdate(){
        this.getBlockchainData();
    }

    componentWillUnmount() {
        this.props.setNavBarTitle('');
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    navigateTo: (location) => push(location),
    setNavBarTitle: (navBarTitle) => setNavBarTitle(navBarTitle)
}, dispatch);

const mapStateToProps = state => {
    return {
        user: state.user,
        drizzleStatus: state.drizzleStatus,
        contracts: state.contracts,
        orbitDB: state.orbitDB
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
