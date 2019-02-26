import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import Topic from './Topic';

const contract = "Forum";
const getTopicMethod = "getTopic";

class TopicList extends Component {
    constructor(props) {
        super(props);

        this.dataKeys = [];

        this.state = {
            topicsLoading: true
        }
    }

    componentDidUpdate(){
        if (this.state.topicsLoading && this.props.drizzleStatus['initialized']){
            var topicsLoading = false;

            this.props.topicIDs.forEach( topicID => {
                if (!this.dataKeys[topicID]) {
                    this.dataKeys[topicID] = drizzle.contracts[contract].methods[getTopicMethod].cacheCall(topicID);
                    topicsLoading = true;
                }
            })

            this.setState({ topicsLoading: topicsLoading });
        }
    }

    render() {
        const topics = this.props.topicIDs.map((topicID) => {
            return (<Topic
                topicData={(this.dataKeys[topicID] && this.props.contracts[contract][getTopicMethod][this.dataKeys[topicID]])
                    ? this.props.contracts[contract][getTopicMethod][this.dataKeys[topicID]]
                    : null}
                key={topicID} />)
        });

        return (
            <div className="topics-list">
                {topics.slice(0).reverse()}
            </div>
        );
    }
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts,
        drizzleStatus: state.drizzleStatus
    }
};

export default connect(mapStateToProps)(TopicList);
