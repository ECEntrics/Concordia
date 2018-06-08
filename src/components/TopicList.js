import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types'

import Topic from './Topic';

const contract = "Forum";
const contractMethod = "getTopic";

class TopicList extends Component {
    constructor(props, context) {
        super(props);

        this.fetchSubject = this.fetchSubject.bind(this);
        this.correctTimeFormat = this.correctTimeFormat.bind(this);

        this.drizzle = context.drizzle;
        this.dataKeys = [];
        this.topicsData = new Array(parseInt(this.props.numberOfTopics, 10)).fill(undefined);
        this.topicsSubjects = [];
        this.topicsSubjectsFetched = [];

        for (var i = 0; i < this.props.numberOfTopics; ++i){
            this.dataKeys[i] = this.drizzle.contracts[contract].methods[contractMethod].cacheCall(i);
        }

        this.state = {
        };
    }

    async fetchSubject(topicID) {
        /*const fullAddress = this.topicsData[topicID][1];
        const store = await this.props.orbitDB.orbitdb.keyvalue(JSON.stringify(fullAddress));
        await store.load();
        var som = store.get(JSON.stringify(topicID));
        this.topicsSubjects[topicID] = som['subject'];
        this.topicsSubjectsFetched[topicID] = true;*/

        var som =this.props.orbitDB.topicsDB.get(JSON.stringify(topicID));
        this.topicsSubjects[topicID] = som['subject'];
        this.topicsSubjectsFetched[topicID] = true;
    }

    correctTimeFormat(timestamp) {
        var timestampDate = new Date(0);
        timestampDate.setUTCSeconds(timestamp);
        return ((timestampDate.getMonth() + 1)  + " "
            + timestampDate.getDate() + ", "
            + timestampDate.getFullYear() + ", "
            + timestampDate.getHours() + ":"
            + timestampDate.getMinutes() + ":"
            + timestampDate.getSeconds())
    }

    render (){
        const topics = this.topicsData.slice(0).reverse().map((topic, index) => {
            if (topic){
                return (
                    <Link to={"/topic/" + index + "/" + 
                        ((this.topicsSubjects[index] !== undefined) ? this.topicsSubjects[index] : "")}
                        key={index}>
                        <Topic topic={{
                                    topicSubject: ((this.topicsSubjects[index] !== undefined) && this.topicsSubjects[index]),
                                    topicStarter: topic[2],
                                    numberOfReplies: topic[4].length,
                                    date: this.correctTimeFormat(topic[3])
                                }}
                            id={index}
                            key={index}
                            address={topic[1]}/>
                    </Link>
                );
            } else {
                return (
                    <Link to={"/topic/" + index + "/"}
                        key={index}>
                        <Topic topic={null}
                            id={index}
                            key={index}/>
                    </Link>
                );
            }
        });

        return (
            <div className="topics-list">
                {topics}
            </div>
        );
    }

    componentWillReceiveProps() {
        for (var i = 0; i < this.props.numberOfTopics; ++i){
            if (this.topicsData[i] === undefined) {
                let currentDrizzleState = this.drizzle.store.getState();
                let dataFetched = (currentDrizzleState.contracts[contract][contractMethod])[this.dataKeys[i]];
                if (dataFetched){
                    this.topicsData[i] = dataFetched.value;
                }
            } else if (!this.topicsSubjects[i] && !this.topicsSubjectsFetched[i]) {
                this.fetchSubject(i);
            }
        }
    }
};

TopicList.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user, //Needed!!
        orbitDB: state.orbitDB,
    }
};

export default drizzleConnect(TopicList, mapStateToProps);