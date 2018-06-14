import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WithBlockchainData from '../components/WithBlockchainData';
import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';
import LoadingSpinner from '../components/LoadingSpinner';

class Board extends Component {
    constructor(props, context) {
        super(props);
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
            boardContents = <TopicList topicIDs={this.topicIDs}/>
        }

        return (
            <div style={{marginBottom: '70px'}}>
                {boardContents}
                <FloatingButton to="/startTopic"/>
            </div>
        );
    }
}

Board.contextTypes = {
    drizzle: PropTypes.object
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