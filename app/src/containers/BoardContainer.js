import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drizzle } from '../index';
import { withRouter } from 'react-router-dom'

import { Header } from 'semantic-ui-react';

import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';

/*import { showProgressBar, hideProgressBar } from '../redux/actions/userInterfaceActions';*/

const contract = "Forum";
const getNumberOfTopicsMethod = "getNumberOfTopics";

class BoardContainer extends Component {
    constructor(props) {
        super(props);

        /*this.props.store.dispatch(showProgressBar());*/

        this.handleCreateTopicClick = this.handleCreateTopicClick.bind(this);

        this.state = {
            pageLoading: true,
            pageLoaded: false
        }
    }

    handleCreateTopicClick() {
        this.props.history.push("/startTopic");
    }

    componentDidUpdate(){
        if (this.state.pageLoading && !this.state.pageLoaded && this.props.drizzleStatus['initialized']){
            this.dataKey = drizzle.contracts[contract].methods[getNumberOfTopicsMethod].cacheCall();
            this.setState({ pageLoading: false });
        }
        if (!this.state.pageLoaded && this.dataKey &&
            this.props.contracts[contract][getNumberOfTopicsMethod][this.dataKey]){
            /*this.props.store.dispatch(hideProgressBar());*/
            this.setState({ pageLoaded: true });
        }
    }

    render() {
        var boardContents;
        if (this.dataKey && this.props.contracts[contract][getNumberOfTopicsMethod][this.dataKey]){
            var numberOfTopics = this.props.contracts[contract][getNumberOfTopicsMethod][this.dataKey].value;

            if (numberOfTopics !== '0'){
                this.topicIDs = [];
                for (var i = 0; i < numberOfTopics; i++) {
                    this.topicIDs.push(i);
                }
                boardContents = ([
                    <TopicList topicIDs={this.topicIDs} key="topicList"/>,
                    <div className="bottom-overlay-pad" key="pad"></div>,
                    this.props.hasSignedUp &&
                        <FloatingButton onClick={this.handleCreateTopicClick}
                            key="createTopicButton"/>
                ]);
            } else {
                if (!this.props.hasSignedUp){
                    boardContents = (
                        <div className="vertical-center-in-parent">
                            <Header color='teal' textAlign='center' as='h2'>
                                There are no topics yet!
                            </Header>
                            <Header color='teal' textAlign='center' as='h4'>
                                Sign up to be the first to post.
                            </Header>
                        </div>
                    );
                } else {
                    boardContents = (
                        <div className="vertical-center-in-parent">
                            <Header color='teal' textAlign='center' as='h2'>
                                There are no topics yet!
                            </Header>
                            <Header color='teal' textAlign='center' as='h4'>
                                Click the add button at the bottom of the page to be the first to post.
                            </Header>
                            <FloatingButton onClick={this.handleCreateTopicClick}
                                key="createTopicButton"/>
                        </div>
                    );
                }
            }
        }

        return (
            <div className="fill">
                {boardContents}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        contracts: state.contracts,
        drizzleStatus: state.drizzleStatus,
        hasSignedUp: state.user.hasSignedUp
    }
};

export default withRouter(connect(mapStateToProps)(BoardContainer));
