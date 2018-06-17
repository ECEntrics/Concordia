import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WithBlockchainData from '../components/WithBlockchainData';
import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';
import LoadingSpinner from '../components/LoadingSpinner';

class Board extends Component {
    constructor(props) {
        super(props);

        this.handleCreateTopicClick = this.handleCreateTopicClick.bind(this);
    }

    handleCreateTopicClick() {
        this.context.router.push("/startTopic");
    }

    render() {
        var boardContents;
        if (!this.props.blockchainData[0].returnData) {
            boardContents = (
                <LoadingSpinner/>
            );
        } else {
            this.topicIDs = [];
            for (var i = 0; i < this.props.blockchainData[0].returnData; i++) {
                this.topicIDs.push(i);
            }
            boardContents = ([
                <TopicList topicIDs={this.topicIDs} key="topicList"/>,
                <FloatingButton onClick={this.handleCreateTopicClick}
                    key="createTopicButton"/>
            ]);
        }

        return (
            <div className="fill">
                {boardContents}
                <div className="bottom-overlay-pad"></div>
            </div>
        );
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