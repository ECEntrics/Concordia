import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types'

import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';
import StartTopic from '../components/StartTopic';

const contract = "Forum";
const contractMethod = "getNumberOfTopics";

class Board extends Component {
    constructor(props, context) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.drizzle = context.drizzle;
        this.dataKey = this.drizzle.contracts[contract].methods[contractMethod].cacheCall();

        this.state = {
            startingNewTopic: false,
            transactionState: "IN_PROGRESS"
        };
    }

    handleClick(event) {
        event.preventDefault();
        this.setState(prevState => ({
          startingNewTopic: !prevState.startingNewTopic
        }));
    }

    render() {
        var boardContents;
        if (this.state.transactionState === "IN_PROGRESS") {
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
            this.state.startingNewTopic
            ?(<div>
                <StartTopic onClick={this.handleClick}/>
            </div>)
            :(<div style={{marginBottom: '100px'}}>
                {boardContents}
                <FloatingButton onClick={this.handleClick}/>
            </div>)
        );
    }

    componentWillReceiveProps() {
        if (!this.numberOfTopics) {
            let currentDrizzleState = this.drizzle.store.getState()
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
        user: state.user,
        orbitDB: state.orbitDB,
    }
};

const BoardContainer = drizzleConnect(Board, mapStateToProps);

export default BoardContainer;