import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { Header } from 'semantic-ui-react';

import WithBlockchainData from '../components/WithBlockchainData';
import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';

import { showProgressBar, hideProgressBar } from '../redux/actions/userInterfaceActions';

class Board extends Component {
    constructor(props) {
        super(props);

        this.props.store.dispatch(showProgressBar());

        this.handleCreateTopicClick = this.handleCreateTopicClick.bind(this);

        this.state = {
            pageLoaded: false
        }
    }

    handleCreateTopicClick() {
        this.context.router.push("/startTopic");
    }

    render() {
        var boardContents;
        if (this.props.blockchainData[0].returnData !== '0'){
            this.topicIDs = [];
            for (var i = 0; i < this.props.blockchainData[0].returnData; i++) {
                this.topicIDs.push(i);
            }
            boardContents = ([
                <TopicList topicIDs={this.topicIDs} key="topicList"/>,
                <div className="bottom-overlay-pad" key="pad"></div>,
                this.props.user.hasSignedUp &&
                    <FloatingButton onClick={this.handleCreateTopicClick}
                        key="createTopicButton"/>
            ]);
        } else {
            if (!this.props.user.hasSignedUp){
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

        return (
            <div className="fill">
                {boardContents}
            </div>
        );
    }

    componentDidUpdate(){
        if (!this.state.pageLoaded && this.props.blockchainData[0].returnData){
            this.props.store.dispatch(hideProgressBar());
            this.setState({ pageLoaded: true });
        }
    }
}

Board.contextTypes = {
    drizzle: PropTypes.object,
    router: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

class BoardContainer extends Component {
    constructor(props){
        super(props);

        this.board = <WithBlockchainData
            component={drizzleConnect(Board, mapStateToProps)}
            callsInfo={[{
                contract: 'Forum',
                method: 'getNumberOfTopics',
                params: []
            }]}
        />;
    }
    
    render() {
        return(this.board);
    }
}

export default BoardContainer;