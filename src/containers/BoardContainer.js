import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import TopicList from '../components/TopicList';
import FloatingButton from '../components/FloatingButton';
import StartTopic from '../components/StartTopic';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startingNewTopic: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
         event.preventDefault();
        this.setState(prevState => ({
          startingNewTopic: !prevState.startingNewTopic
        }));
    }

    render() {
        return (
            this.state.startingNewTopic
            ?(<div>
                <StartTopic onClick={this.handleClick}/>
            </div>)
            :(<div style={{marginBottom: '100px'}}>
                <TopicList/>
                <FloatingButton onClick={this.handleClick}/>
            </div>)
        );
    }
}

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    Forum: state.contracts.Forum,
    user: state.user,
    orbitDB: state.orbitDB,
    drizzleStatus: state.drizzleStatus
  }
};

const BoardContainer = drizzleConnect(Board, mapStateToProps);

export default BoardContainer;