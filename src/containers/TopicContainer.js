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

        this.fetchTopicSubject = this.fetchTopicSubject.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.postCreated = this.postCreated.bind(this);

        this.drizzle = context.drizzle;

        this.state = {
            getPostsTransactionState: null,
            posting: false,
            topicSubject: null
        };
    }

    async fetchTopicSubject(orbitDBAddress, topicID) {
        /*const fullAddress = this.topicsData[topicID][1];
        const store = await this.props.orbitDB.orbitdb.keyvalue(JSON.stringify(fullAddress));
        await store.load();
        var som = store.get(JSON.stringify(topicID));
        this.topicsSubjects[topicID] = som['subject'];
        this.topicsSubjectsFetchStatus[topicID] = "fetched";*/

        var som =this.props.orbitDB.topicsDB.get(JSON.stringify(topicID));
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
                this.state.posting
                ?(<div style={{marginBottom: '100px'}}>
                    <NewPost topicID={1}
                        subject={this.state.topicSubject}
                        onCancelClick={() => {this.handleClick()}}
                        onPostCreated={() => {this.postCreated()}}
                    />
                    <PostList postIDs={this.posts}/>
                </div>)
                :(<div style={{marginBottom: '100px'}}>
                    <PostList postIDs={this.posts}/>
                    <FloatingButton onClick={this.handleClick}/>
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
                this.getPostsDataKey = this.drizzle.contracts[contract].methods[contractMethod].cacheCall(1);
                this.setState({'getPostsTransactionState': "IN_PROGRESS"});
            }
        }
        if (this.state.getPostsTransactionState === "IN_PROGRESS") {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState.contracts[contract][contractMethod])[this.getPostsDataKey];
            if (dataFetched){
                this.posts = dataFetched.value[4];
                this.setState({'getPostsTransactionState': "SUCCESS"});
                this.fetchTopicSubject(dataFetched.value[0], 1);
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