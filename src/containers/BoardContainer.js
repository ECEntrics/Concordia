import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';

const contract = "Forum";
const contractMethod = "getNumberOfTopics";

class Board extends Component {
    constructor(props, context) {
        super(props);

        this.drizzle = context.drizzle;

        this.state = {
            startingNewTopic: false,
            transactionState: null
        };
    }

    render() {
        var boardContents;
        if (this.state.transactionState !== "SUCCESS") {
            boardContents = (
                <div className="center-in-parent">
                    <p>
                        <i className="fas fa-spinner fa-3x fa-spin"></i>
                    </p>
                </div>
            );
        } else {
            boardContents = <TopicList numberOfTopics={this.numberOfTopics}/>;
        }

        return (
            <div style={{marginBottom: '100px'}}>
                {boardContents}
                <Link to="/startTopic">
                    <FloatingButton onClick={this.handleClick}/>
                </Link>
            </div>
        );
    }

    componentWillReceiveProps() {
        if (this.state.transactionState === null){
            if (this.drizzle.contracts[contract]){
                //This gets called only once but should be called every time someone posts
                this.dataKey = this.drizzle.contracts[contract].methods[contractMethod].cacheCall();
                this.setState({'transactionState': "IN_PROGRESS"});
            }
        }
        if (!this.numberOfTopics) {
            let currentDrizzleState = this.drizzle.store.getState();
            let dataFetched = (currentDrizzleState.contracts[contract][contractMethod])[this.dataKey];
            if (dataFetched){
                this.numberOfTopics = dataFetched.value
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