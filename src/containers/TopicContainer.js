import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';

import WithBlockchainData from '../components/WithBlockchainData';
import PostList from '../components/PostList';
import NewPost from '../components/NewPost';
import FloatingButton from '../components/FloatingButton';

import { showProgressBar, hideProgressBar } from '../redux/actions/userInterfaceActions';

class Topic extends Component {
    constructor(props) {
        super(props);

        this.props.store.dispatch(showProgressBar());

        this.fetchTopicSubject = this.fetchTopicSubject.bind(this);
        this.togglePostingState = this.togglePostingState.bind(this);
        this.postCreated = this.postCreated.bind(this);

        this.state = {
            topicID: this.props.params.topicId,
            topicSubject: null,
            postFocus: this.props.params.postId && /^[0-9]+$/.test(this.props.params.postId)
                ? this.props.params.postId
                : null,
            fetchTopicSubjectStatus: null,
            posting: false
        };
    }

    async fetchTopicSubject(orbitDBAddress) {
        var orbitData =this.props.orbitDB.topicsDB.get(this.state.topicID);
        this.props.store.dispatch(hideProgressBar());
        this.setState({
            'topicSubject': orbitData['subject'],
            fetchTopicSubjectStatus: "fetched"
        });
    }

    togglePostingState(event) {
        if (event){
            event.preventDefault();
        }
        this.setState(prevState => ({
          posting: !prevState.posting
        }));
    }

    postCreated(){
        this.setState(prevState => ({
            posting: false
        }));
        //TODO reload topic
    }

    render() {
        var topicContents;
        if (this.props.blockchainData[0].status === "success") {
            topicContents = (
                (<div>
                    <PostList postIDs={this.props.blockchainData[0].returnData[4]}/>
                    {this.state.posting &&
                        <NewPost topicID={this.state.topicID}
                            subject={this.state.topicSubject}
                            postIndex={this.props.blockchainData[0].returnData[4].length}
                            onCancelClick={() => {this.togglePostingState()}}
                            onPostCreated={() => {this.postCreated()}}
                        />
                    }
                    <div className="posts-list-spacer"></div>
                    {this.props.user.hasSignedUp && !this.state.posting &&
                        <FloatingButton onClick={this.togglePostingState}/>
                    }
                </div>)
            )
        }

        return (
            <div className="fill">
                {topicContents}
                {!this.state.posting &&
                    <div className="bottom-overlay-pad"></div>
                }
            </div>
        );
    }

    componentDidUpdate() {
        if (this.props.blockchainData[0].status === "success") {
            if (this.state.fetchTopicSubjectStatus === null){
                this.setState({ fetchTopicSubjectStatus: "fetching"})
                this.fetchTopicSubject(this.props.blockchainData[0].returnData[0]);
            }
        }
    }
}

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
    }
    
    render() {
        return(
            <WithBlockchainData
                component={drizzleConnect(Topic, mapStateToProps)}
                callsInfo={[{
                    contract: 'Forum',
                    method: 'getTopic',
                    params: [this.props.params.topicId]
                }]}
                params={this.props.params}
            />
        );
    }
}

export default TopicContainer;