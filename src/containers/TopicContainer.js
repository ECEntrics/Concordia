import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WithBlockchainData from '../components/WithBlockchainData';
import PostList from '../components/PostList';
import NewPost from '../components/NewPost';
import FloatingButton from '../components/FloatingButton';
import LoadingSpinner from '../components/LoadingSpinner';

class Topic extends Component {
    constructor(props, context) {
        super(props);

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

        var som =this.props.orbitDB.topicsDB.get(this.state.topicID);
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
                    {this.postList}
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
        if (this.props.blockchainData[0].status === "success") {
            if (this.state.getPostsTransactionState !== "SUCCESS"){
                this.postList = <WithBlockchainData
                    component={PostList}
                    callsInfo={this.props.blockchainData[0].returnData[4].map((postID) => {
                        return {
                            contract: 'Forum',
                            method: 'getPost',
                            params: [postID]
                        }
                    })}
                    postIDs={this.props.blockchainData[0].returnData[4]}
                />

                this.setState({'getPostsTransactionState': "SUCCESS"});
                this.fetchTopicSubject(this.props.blockchainData[0].returnData[0]);
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

class TopicContainer extends Component {
    constructor(props){
        super(props);

        if (!/^[0-9]+$/.test(props.params.topicId)){ //Topic ID should be a positive integer
            this.props.router.push("/404");
        }

        this.topic = <WithBlockchainData
            component={drizzleConnect(Topic, mapStateToProps)}
            callsInfo={[{
                    contract: 'Forum',
                    method: 'getTopic',
                    params: [this.props.params.topicId]
                }]}
            params={this.props.params}
        />;
    }
    
    render() {
        return(this.topic);
    }
}

export default TopicContainer;