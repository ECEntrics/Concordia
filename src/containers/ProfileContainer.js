import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import ProfileInformation from '../components/ProfileInformation';
import TopicList from '../components/TopicList';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';
import epochTimeConverter from '../helpers/EpochTimeConverter';

import '../assets/css/materialTabs.css';

const contract = "Forum";
const contractMethods = {
    getUsername: "getUsername",
    getDateOfRegister: "getUserDateOfRegister",
    getOrbitDB: "getOrbitDBId",
    getUserTopics: "getUserTopics",
    getUserPosts: "getUserPosts"
};

class Profile extends Component {
    constructor(props, context) {
        super(props);

        /*console.log(this.props.params.address);
        console.log(this.props.user.address);*/

        if (this.props.params.address == this.props.user.address){
            this.profile = {
                userAddress: this.props.params.address,
                username: this.props.params.username ? this.props.params.username : "",
                orbitId: "",
                self: false
            }
        } else {
            this.profile = {
                userAddress: this.props.user.address,
                username: this.props.user.username,
                orbitId: this.props.orbitDB.id,
                self: true
            }
        }

        this.handleTabClick = this.handleTabClick.bind(this);

        this.drizzle = context.drizzle;
        this.underlineBarRef = React.createRef();
        this.infoSelectorRef = React.createRef();
        this.topicsSelectorRef = React.createRef();
        this.postsSelectorRef = React.createRef();

        this.state = {
            viewSelected: "profile-info-tab",
            username: this.profile.username,
            userAddress: this.profile.userAddress,
            dateOfRegister: null,
            orbitDBId: this.profile.orbitId,
            getUsernameTransactionState: null,
            getDateOfRegisterTransactionState: null,
            getOrbitDBTransactionState: this.profile.orbitId ? "SUCCESS" : null,
            getTopicsTransactionState: null,
            getPostsTransactionState: null,
            topicIDs: [],
            postIDs: []
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
        var infoTab =
            (<ProfileInformation username={this.state.username}
                address={this.state.userAddress}
                orbitAddress={this.state.orbitDBId}
                numberOfTopics={this.state.topicIDs.length}
                numberOfPosts={this.state.postIDs.length}
                dateOfRegister={this.state.dateOfRegister}
                self={this.profile.self}
            />);
        var topicsTab =
            (<div className="profile-tab">
                {this.state.getTopicsTransactionState === "SUCCESS"
                    ? <TopicList topicIDs={this.state.topicIDs}/>
                    : <LoadingSpinner />
                }
            </div>);
        var postsTab =
            (<div className="profile-tab">
                {this.state.getPostsTransactionState === "SUCCESS"
                    ? <PostList postIDs={this.state.postIDs}/>
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

    componentWillReceiveProps() {
        if (this.state.getUsernameTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.usernameKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getUsername].cacheCall(this.state.userAddress);
                this.setState({'getUsernameTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getUsernameTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getUsername])[this.usernameKey];
            if (dataFetched){
                this.setState({
                    'username': dataFetched.value,
                    'getUsernameTransactionState': "SUCCESS"
                });
            }
        }

        if (this.state.getDateOfRegisterTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.dateOfRegisterKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getDateOfRegister].cacheCall(this.state.userAddress);
                this.setState({'getDateOfRegisterTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getDateOfRegisterTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getDateOfRegister])[this.dateOfRegisterKey];
            if (dataFetched){
                this.setState({
                    'dateOfRegister': epochTimeConverter(dataFetched.value),
                    'getDateOfRegisterTransactionState': "SUCCESS"
                });
            }
        }

        if (this.state.getOrbitDBTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.orbitDBIdKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getOrbitDB].cacheCall(this.state.userAddress);
                this.setState({'getOrbitDBTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getOrbitDBTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getOrbitDB])[this.orbitDBIdKey];
            if (dataFetched){
                this.setState({
                    'orbitDBId': dataFetched.value,
                    'getOrbitDBTransactionState': "SUCCESS"
                });
            }
        }

        if (this.state.getTopicsTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.getTopicsKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getUserTopics].cacheCall(this.state.userAddress);
                this.setState({'getTopicsTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getTopicsTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getUserTopics])[this.getTopicsKey];
            if (dataFetched){
                this.setState({
                    'topicIDs': dataFetched.value,
                    'getTopicsTransactionState': "SUCCESS"
                });
            }
        }

        if (this.state.getPostsTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                this.getPostsKey = this.drizzle.contracts[contract]
                    .methods[contractMethods.getUserPosts].cacheCall(this.state.userAddress);
                this.setState({'getPostsTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getPostsTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState
                .contracts[contract][contractMethods.getUserPosts])[this.getPostsKey];
            if (dataFetched){
                this.setState({
                    'postIDs': dataFetched.value,
                    'getPostsTransactionState': "SUCCESS"
                });
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
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    user: state.user,
    orbitDB: state.orbitDB,
    drizzleStatus: state.drizzleStatus
  }
};

const ProfileContainer = drizzleConnect(Profile, mapStateToProps);

export default ProfileContainer;