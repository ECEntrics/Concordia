import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'

import ContentLoader from "react-content-loader"
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

        if (this.props.topicData.value[1] === this.props.user.address) {
            let orbitData = this.props.orbitDB.topicsDB.get(topicID);
            this.topicSubject = orbitData['subject'];
            this.topicSubjectFetchStatus = "fetched";
        } else {
            const fullAddress = "/orbitdb/" + this.props.topicData.value[0] + "/topics";
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
                onClick={() => {this.props.history.push("/topic/" + this.props.topicID)}}>
                <Card.Content>
                    <div className={"topic-subject" + (this.topicSubject ? "" : " grey-text")}>
                        <p><strong>
                            {this.topicSubject !== null ? this.topicSubject
                                :<ContentLoader height={5.8} width={300} speed={2}
                                primaryColor="#b2e8e6" secondaryColor="#00b5ad" >
                                <rect x="0" y="0" rx="3" ry="3" width="150" height="5.5" />
                                </ContentLoader>}
                        </strong></p>
                    </div>
                    <hr/>
                    <div className="topic-meta">
                        <p className={"no-margin" +
                            (this.props.topicData !== null ? "" : " grey-text")}>
                            {this.props.topicData !== null
                                ?this.props.topicData.value[2]
                                :"Username"
                            }
                        </p>
                        <p className={"no-margin" +
                            (this.props.topicData !== null ? "" : " grey-text")}>
                            {"Number of replies: " + (this.props.topicData !== null
                                ?this.props.topicData.value[4].length
                                :"")
                            }
                        </p>
                        <p className="topic-date grey-text">
                            {this.props.topicData !== null &&
                                <TimeAgo date={epochTimeConverter(this.props.topicData.value[3])}/>
                            }
                        </p>
                    </div>
                </Card.Content>
            </Card>
        );
    }

    componentDidUpdate(){
        if (this.props.topicData !== null &&
            this.topicSubjectFetchStatus === "pending" &&
            this.props.orbitDB.ipfsInitialized &&
            this.props.orbitDB.orbitdb) {
            this.fetchSubject(this.props.topicID);
        }
    }
};

const mapStateToProps = state => {
    return {
        user: state.user,
        orbitDB: state.orbit,
        topicsDB: state.topicsDB
    }
}

export default withRouter(connect(mapStateToProps)(Topic));
