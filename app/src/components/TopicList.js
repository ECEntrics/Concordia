import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import Topic from './Topic';

const contract = "Forum";
const getTopicMethod = "getTopic";

class TopicList extends Component {
    constructor(props) {
        super(props);

        this.getBlockchainData = this.getBlockchainData.bind(this);
        this.dataKeys = [];
    }

    getBlockchainData(){
        if (this.props.drizzleStatus['initialized']){
            this.props.topicIDs.forEach( topicID => {
                if (!this.dataKeys[topicID]) {
                    this.dataKeys[topicID] = drizzle.contracts[contract].methods[getTopicMethod].cacheCall(topicID);
                }
            })
        }
    }

    render() {
        const topics = this.props.topicIDs.map((topicID) => {
            return (<Topic
                topicData={(this.dataKeys[topicID] && this.props.contracts[contract][getTopicMethod][this.dataKeys[topicID]])
                    ? this.props.contracts[contract][getTopicMethod][this.dataKeys[topicID]]
                    : null}
                topicID={topicID}
                key={topicID} />)
        });

        return (
            <div className="topics-list">
                {topics.slice(0).reverse()}
            </div>
        );
    }

    componentDidMount() {
        this.getBlockchainData();
    }

    componentDidUpdate(){
        this.getBlockchainData();
    }
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts,
        drizzleStatus: state.drizzleStatus
    }
};

export default connect(mapStateToProps)(TopicList);
