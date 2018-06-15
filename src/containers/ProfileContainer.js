import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import WithBlockchainData from '../components/WithBlockchainData';
import ProfileInformation from '../components/ProfileInformation';
import TopicList from '../components/TopicList';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';

import '../assets/css/materialTabs.css';

class Profile extends Component {
    constructor(props, context) {
        super(props);

        this.handleTabClick = this.handleTabClick.bind(this);
        this.propsToView = this.propsToView.bind(this);

        this.drizzle = context.drizzle;
        this.underlineBarRef = React.createRef();
        this.infoSelectorRef = React.createRef();
        this.topicsSelectorRef = React.createRef();
        this.postsSelectorRef = React.createRef();

        this.state = {
            viewSelected: "profile-info-tab",
            userAddress: this.props.params.address ? this.props.params.address : this.props.user.address
        };
    }

    handleTabClick(event) {
        this.setState({viewSelected: event.target.id});
        if (event.target.id === "profile-info-tab"){
            this.underlineBarRef.current.style.left = this.infoSelectorRef.current.offsetLeft + 'px';
            this.underlineBarRef.current.style.width = ReactDOM.
                findDOMNode(this.infoSelectorRef.current).getBoundingClientRect().width + 'px';
        } else if (event.target.id === "profile-topics-tab"){
            this.underlineBarRef.current.style.left = this.topicsSelectorRef.current.offsetLeft + 'px';
            this.underlineBarRef.current.style.width = ReactDOM.
                findDOMNode(this.topicsSelectorRef.current).getBoundingClientRect().width + 'px';
        } else if (event.target.id === "profile-posts-tab"){
            this.underlineBarRef.current.style.left = this.postsSelectorRef.current.offsetLeft + 'px';
            this.underlineBarRef.current.style.width = ReactDOM.
                findDOMNode(this.postsSelectorRef.current).getBoundingClientRect().width + 'px';
        }
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

        return (
            <div>
                <header>
                    <div id="material-tabs">
                        <a className={this.state.viewSelected === "profile-info-tab" ? "active" : ""}
                            id="profile-info-tab" href="#info" onClick={this.handleTabClick}
                            ref={this.infoSelectorRef}>
                            INFORMATION
                        </a>
                        <a className={this.state.viewSelected === "profile-topics-tab" ? "active" : ""}
                            id="profile-topics-tab" href="#topics" onClick={this.handleTabClick}
                            ref={this.topicsSelectorRef}>
                            TOPICS
                        </a>
                        <a className={this.state.viewSelected === "profile-posts-tab" ? "active" : ""}
                            id="profile-posts-tab" href="#posts" onClick={this.handleTabClick}
                            ref={this.postsSelectorRef}>
                            POSTS
                        </a>
                        <span ref={this.underlineBarRef} className="underline-bar"></span>
                    </div>
                </header>
                <div className="tab-content">
                    <div id="profile-info" className={
                        this.state.viewSelected === "profile-info-tab" ? "show" : "hide"
                    }>
                        {infoTab}
                    </div>
                    <div id="profile-topics" className={
                        this.state.viewSelected === "profile-topics-tab" ? "show" : "hide"
                    }>
                        {topicsTab}
                    </div>
                    <div id="profile-posts" className={
                        this.state.viewSelected === "profile-posts-tab" ? "show" : "hide"
                    }>
                        {postsTab}
                    </div>
                </div>
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

    componentDidMount() {
        this.infoSelectorRef.current.click();
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