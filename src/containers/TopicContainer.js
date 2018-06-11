import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PostList from '../components/PostList';
import NewPost from '../components/NewPost';
import FloatingButton from '../components/FloatingButton';
import LoadingSpinner from '../components/LoadingSpinner';

const contract = "Forum";
const contractMethod = "getTopic";

class Topic extends Component {
    constructor(props, context) {
        super(props);

        if (!/^[0-9]+$/.test(this.props.params.topicId)){
            this.props.router.push("/404");
        }

        this.fetchTopicSubject = this.fetchTopicSubject.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.postCreated = this.postCreated.bind(this);

        this.drizzle = context.drizzle;

        this.state = {
            topicID: this.props.params.topicId,
            topicSubject: this.props.params.topicSubject ? this.props.params.topicSubject : null,
            postFocus: this.props.params.postId && /^[0-9]+$/.test(this.props.params.postId)
                ? this.props.params.postId
                : null,
            getPostsTransactionState: null,
            posting: false
        };
    }

    async fetchTopicSubject(orbitDBAddress) {
        /*const fullAddress = this.topicsData[this.state.topicID][1];
        const store = await this.props.orbitDB.orbitdb.keyvalue(JSON.stringify(fullAddress));
        await store.load();
        var som = store.get(JSON.stringify(this.state.topicID));
        this.topicsSubjects[this.state.topicID] = som['subject'];
        this.topicsSubjectsFetchStatus[this.state.topicID] = "fetched";*/

        var som =this.props.orbitDB.topicsDB.get(JSON.stringify(this.state.topicID));
        this.setState({'topicSubject': som['subject']});
    }

    handleClick(event) {
        if (event){
            event.preventDefault();
        }
        this.setState(prevState => ({
          posting: !prevState.posting
        }));
    }

    postCreated(){
        this.setState(prevState => ({
            getPostsTransactionState: null,
            posting: false
        }));
    }

    render() {
        var topicContents;
        if (this.state.getPostsTransactionState !== "SUCCESS") {
            topicContents = (
                <LoadingSpinner/>
            );
        } else {
            topicContents = (
                (<div style={{marginBottom: '100px'}}>
                    {this.state.posting &&
                        <NewPost topicID={this.state.topicID}
                            subject={this.state.topicSubject}
                            onCancelClick={() => {this.handleClick()}}
                            onPostCreated={() => {this.postCreated()}}
                        />
                    }
                    <PostList postIDs={this.posts}/>
                    {!this.state.posting &&
                        <FloatingButton onClick={this.handleClick}/>
                    }
                </div>)
            )
        }

        return (
            <div style={{marginBottom: '70px'}}>
                {topicContents}
            </div>
        );
    }

    componentWillReceiveProps() {
        if (this.state.getPostsTransactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                //This gets called only once but should be called every time someone posts
                this.getPostsDataKey = this.drizzle.contracts[contract].methods[contractMethod]
                    .cacheCall(this.state.topicID);
                this.setState({'getPostsTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getPostsTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState.contracts[contract][contractMethod])[this.getPostsDataKey];
            if (dataFetched){
                if (dataFetched.value){
                    this.posts = dataFetched.value[4];
                    this.setState({'getPostsTransactionState': "SUCCESS"});
                    this.fetchTopicSubject(dataFetched.value[0]);
                } else if (dataFetched.error){
                    //TODO
                }
            }
        }
    }
}

Topic.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user,
        orbitDB: state.orbitDB
    }
};

const TopicContainer = drizzleConnect(Topic, mapStateToProps);

export default TopicContainer;