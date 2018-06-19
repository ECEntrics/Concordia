import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { Card } from 'semantic-ui-react'

import TimeAgo from 'react-timeago';
import epochTimeConverter from '../helpers/EpochTimeConverter'

class Topic extends Component {
    constructor(props){
        super(props);

        this.fetchSubject = this.fetchSubject.bind(this);

        this.topicSubject = null;
        this.topicSubjectFetchStatus = "pending";
    }

    async fetchSubject(topicID) {
        this.topicSubjectFetchStatus = "fetching";

        if (this.props.blockchainData[0].returnData[1] === this.props.user.address) {
            let orbitData = this.props.orbitDB.topicsDB.get(topicID);
            this.topicSubject = orbitData['subject'];
            this.topicSubjectFetchStatus = "fetched";
        } else {
            const fullAddress = "/orbitdb/" + this.props.blockchainData[0].returnData[0] + "/topics";
            const store = await this.props.orbitDB.orbitdb.keyvalue(fullAddress);
            await store.load();

            let localOrbitData =  store.get(topicID);
            if (localOrbitData) {
                this.topicSubject = localOrbitData['subject'];
            } else {
                // Wait until we have received something from the network
                store.events.on('replicated', () => {
                    this.topicSubject = store.get(topicID)['subject'];
                })
            }
            this.topicSubjectFetchStatus = "fetched";
        }
    }

    render(){
        return (
            <Card link className="card"
                onClick={() => {this.context.router.push("/topic/" + this.props.topicID)}}>
                <Card.Content>
                    <div className={"topic-subject" + (this.topicSubject ? "" : " grey-text")}>
                        <p><strong>
                            {this.topicSubject !== null ? this.topicSubject : "Subject"}
                        </strong></p>
                    </div>
                    <hr/>
                    <div className="topic-meta">
                        <p className={"no-margin" +
                            (this.props.blockchainData[0].returnData !== null ? "" : " grey-text")}>
                            {this.props.blockchainData[0].returnData !== null
                                ?this.props.blockchainData[0].returnData[2]
                                :"Username"
                            }
                        </p>
                        <p className={"no-margin" +
                            (this.props.blockchainData[0].returnData !== null ? "" : " grey-text")}>
                            {"Number of replies: " + (this.props.blockchainData[0].returnData !== null
                                ?this.props.blockchainData[0].returnData[4].length
                                :"")
                            }
                        </p>
                        <p className="topic-date grey-text">
                            {this.props.blockchainData[0].returnData !== null &&
                                <TimeAgo date={epochTimeConverter(this.props.blockchainData[0].returnData[3])}/>
                            }
                        </p>
                    </div>
                </Card.Content>
            </Card>
        );
    }

    componentDidUpdate(){
        if (this.props.blockchainData[0].returnData !== null && this.topicSubjectFetchStatus === "pending") {
            this.fetchSubject(this.props.topicID);
        }
    }
};

Topic.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user,
        orbitDB: state.orbitDB
    }
}

export default drizzleConnect(Topic, mapStateToProps);