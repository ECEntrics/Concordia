import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PostList from '../components/PostList';
import NewPost from '../components/NewPost';
import FloatingButton from '../components/FloatingButton';

class Topic extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posting: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        if (event){
            event.preventDefault();
        }
        this.setState(prevState => ({
          posting: !prevState.posting
        }));
    }

    render() {
        return (
            this.state.posting
            ?(<div style={{marginBottom: '100px'}}>
                <PostList/>
                <NewPost onCancelClick={() => {this.handleClick()}}/>
            </div>)
            :(<div style={{marginBottom: '100px'}}>
                <PostList/>
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

const TopicContainer = drizzleConnect(Topic, mapStateToProps);

export default TopicContainer;