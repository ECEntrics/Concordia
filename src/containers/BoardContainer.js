import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';
import LoadingSpinner from '../components/LoadingSpinner';

const contract = "Forum";
const contractMethod = "getNumberOfTopics";

class Board extends Component {
    constructor(props, context) {
        super(props);

        this.drizzle = context.drizzle;

        this.state = {
            transactionState: null
        };
    }

    render() {
        var boardContents;
        if (this.state.transactionState !== "SUCCESS") {
            boardContents = (
                <LoadingSpinner/>
            );
        } else {
            boardContents = <TopicList topicIDs={this.topicIDs}/>;
        }

        return (
            <div style={{marginBottom: '70px'}}>
                {boardContents}
                <Link to="/startTopic">
                    <FloatingButton onClick={this.handleClick}/>
                </Link>
            </div>
        );
    }

    componentWillReceiveProps() {
        if (this.state.transactionState === null){
            if (this.drizzle.contracts[contract]){ //Waits until drizzle is initialized
                //This gets called only once but should be called every time someone posts
                this.dataKey = this.drizzle.contracts[contract].methods[contractMethod].cacheCall();
                this.setState({'transactionState': "IN_PROGRESS"});
            }
        }
        if (!this.numberOfTopics) {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState.contracts[contract][contractMethod])[this.dataKey];
            if (dataFetched){
                this.numberOfTopics = dataFetched.value;
                this.topicIDs = [];
                for (var i = 0; i < this.numberOfTopics; i++) {
                    this.topicIDs.push(i);
                }
                this.setState({'transactionState': "SUCCESS"});
            }
        }
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

const BoardContainer = drizzleConnect(Board, mapStateToProps);

export default BoardContainer;