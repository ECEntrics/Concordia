import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import Topic from './Topic';

import epochTimeConverter from '../helpers/EpochTimeConverter'

const contract = "Forum";
const contractMethod = "getTopic";

class TopicList extends Component {
    constructor(props, context) {
        super(props);

        this.fetchSubject = this.fetchSubject.bind(this);

        this.drizzle = context.drizzle;
        this.dataKeys = [];
        this.topicsData = new Array(parseInt(this.props.topicIDs.length, 10)).fill(undefined);
        this.topicsSubjects = [];
        this.topicsSubjectsFetchStatus = new Array(parseInt(this.props.topicIDs.length, 10)).fill("pending");

        for (var i = 0; i < this.props.topicIDs.length; ++i){
            this.dataKeys[i] = this.drizzle.contracts[contract].methods[contractMethod]
                .cacheCall(this.props.topicIDs[i]);
        }

        this.state = {
        };
    }

    async fetchSubject(topicIndex) {
        if (this.topicsData[topicIndex][1] === this.props.user.address){
            let som =this.props.orbitDB.topicsDB.get(this.props.topicIDs[topicIndex]);
            this.topicsSubjects[topicIndex] = som['subject'];
            this.topicsSubjectsFetchStatus[topicIndex] = "fetched";
        } else {
            const fullAddress = "/orbitdb" + this.topicsData[topicIndex][0] + "/topics";
            const store = await this.props.orbitDB.orbitdb.keyvalue(fullAddress);

            /*store.events.on('replicated', () => {
              const result = store.iterator({ limit: -1 }).collect().map(e => e.payload.value)
              console.log(result.join('\n'))
            })*/

            await store.load();
            let som = store.get(this.props.topicIDs[topicIndex]);
            this.topicsSubjects[topicIndex] = som['subject'];
            this.topicsSubjectsFetchStatus[topicIndex] = "fetched";
        }
    }

    render (){
        const topics = this.topicsData.map((topic, index) => {
            if (topic){
                return (
                    <Link to={"/topic/" + index + "/" + 
                        ((this.topicsSubjects[index] !== undefined) ? this.topicsSubjects[index] + "/" + 0 : "")}
                        key={index}>
                        <Topic topic={{
                                    topicSubject: ((this.topicsSubjects[index] !== undefined) && this.topicsSubjects[index]),
                                    topicStarter: topic[2],
                                    numberOfReplies: topic[4].length,
                                    date: epochTimeConverter(topic[3])
                                }}
                            id={index}
                            key={index}/>
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
                {topics.slice(0).reverse()}
            </div>
        );
    }

    componentWillReceiveProps() {
        for (var i = 0; i < this.props.topicIDs.length; ++i){
            if (this.topicsData[i] === undefined) {
                let currentDrizzleState = this.drizzle.store.getState();
                let dataFetched = (currentDrizzleState.contracts[contract][contractMethod])[this.dataKeys[i]];
                if (dataFetched){
                    this.topicsData[i] = dataFetched.value;
                }
            } else if (!this.topicsSubjects[i] && this.topicsSubjectsFetchStatus[i] === "pending") {
                this.topicsSubjectsFetchStatus[i] = "fetching";
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