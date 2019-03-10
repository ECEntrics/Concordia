import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router'
import { connect } from 'react-redux';
import { drizzle } from '../index';

import PostList from '../components/PostList';
import NewPost from '../components/NewPost';
import FloatingButton from '../components/FloatingButton';

import { setNavBarTitle } from '../redux/actions/userInterfaceActions.js';

const contract = "Forum";
const getTopicMethod = "getTopic";

class TopicContainer extends Component {
    constructor(props) {
        super(props);

        //Topic ID should be a positive integer
        if (!/^[0-9]+$/.test(this.props.match.params.topicId)){
            this.props.navigateTo('/404');
        }

        this.fetchTopicSubject = this.fetchTopicSubject.bind(this);
        this.togglePostingState = this.togglePostingState.bind(this);
        this.postCreated = this.postCreated.bind(this);

        var pageStatus = 'initialized';
        if (this.props.drizzleStatus['initialized']) {
            this.dataKey = drizzle.contracts[contract].methods[getTopicMethod].cacheCall(this.props.match.params.topicId);
            pageStatus = 'loading';
        }
        if (this.dataKey && this.props.contracts[contract][getTopicMethod][this.dataKey]) {
            pageStatus = 'loaded';
        }

        this.state = {
            pageStatus: pageStatus,
            topicID: this.props.match.params.topicId,
            topicSubject: null,
            postFocus: this.props.match.params.postId && /^[0-9]+$/.test(this.props.match.params.postId)
                ? this.props.match.params.postId
                : null,
            fetchTopicSubjectStatus: null,
            posting: false
        };
    }

    componentDidUpdate() {
        if (this.state.pageStatus === 'initialized' &&
            this.props.drizzleStatus['initialized']) {
            this.dataKey = drizzle.contracts[contract].methods[getTopicMethod].cacheCall(this.state.topicId);
            this.setState({ pageStatus: 'loading' });
        }
        if (this.state.pageStatus === 'loading' &&
            this.props.contracts[contract][getTopicMethod][this.dataKey]) {
            this.setState({ pageStatus: 'loaded' });
            if (this.state.fetchTopicSubjectStatus === null){
                this.setState({ fetchTopicSubjectStatus: "fetching"})
                /*this.fetchTopicSubject(this.props.contracts[contract][getTopicMethod][this.dataKey].value[0]);*/
            }
        }
    }

    async fetchTopicSubject(orbitDBAddress) {
        let orbitData;
        if (this.props.contracts[contract][getTopicMethod][this.dataKey].value[1] === this.props.user.address) {
            orbitData = this.props.orbitDB.topicsDB.get(this.state.topicID);
        } else {
            const fullAddress = "/orbitdb/" + orbitDBAddress + "/topics";
            const store = await this.props.orbitDB.orbitdb.keyvalue(fullAddress);
            await store.load();

            let localOrbitData = store.get(this.state.topicID);
            if (localOrbitData) {
                orbitData = localOrbitData;
            } else {
                // Wait until we have received something from the network
                store.events.on('replicated', () => {
                    orbitData = store.get(this.state.topicID);
                })
            }
        }

        this.props.setNavBarTitle(orbitData['subject']);
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
    }

    render() {
        var topicContents;
        if (this.state.pageStatus === 'loaded') {
            topicContents = (
                (<div>
                    <PostList postIDs={this.props.contracts[contract][getTopicMethod][this.dataKey].value[4]}
                        focusOnPost={this.state.postFocus ? this.state.postFocus : null}/>
                    {this.state.posting &&
                        <NewPost topicID={this.state.topicID}
                            subject={this.state.topicSubject}
                            postIndex={this.props.contracts[contract][getTopicMethod][this.dataKey].value[4].length}
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
}

const mapDispatchToProps = dispatch => bindActionCreators({
    navigateTo: (location) => push(location),
    setNavBarTitle: (navBarTitle) => setNavBarTitle(navBarTitle)
}, dispatch);

const mapStateToProps = state => {
    return {
        user: state.user,
        contracts: state.contracts,
        drizzleStatus: state.drizzleStatus,
        orbitDB: state.orbit
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicContainer);