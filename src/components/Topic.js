import React, { Component } from 'react';
import { Link } from 'react-router';
import { drizzleConnect } from 'drizzle-react';

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
            let som = this.props.orbitDB.topicsDB.get(topicID);
            this.topicSubject = som['subject'];
            this.topicSubjectFetchStatus = "fetched";
        } else {
            const fullAddress = "/orbitdb" + this.props.blockchainData[0].returnData[0] + "/topics";
            const store = await this.props.orbitDB.orbitdb.keyvalue(fullAddress);

            /*store.events.on('replicated', () => {
              const result = store.iterator({ limit: -1 }).collect().map(e => e.payload.value)
              console.log(result.join('\n'))
            })*/

            await store.load();
            let som = store.get(topicID);
            this.topicSubject = som['subject'];
            this.topicSubjectFetchStatus = "fetched";
        }
    }

    render(){
        return (
            <Link to={"/topic/" + this.props.topicID}>
                <div className="topic card white hoverable">
                    <div className="card-content">
                        <div className={"topic-subject" + (this.topicSubject ? "" : "grey-text")}>
                            <p>
                                {topic.topicSubject !== null ? topic.topicSubject : "Subject"}
                            </p>
                        </div>
                        <hr/>
                        <div className="topic-meta">
                            <p className={"no-margin" + (this.topicSubject ? "" : "grey-text")}>
                                {this.props.blockchainData[0].returnData !== null
                                    ?this.props.blockchainData[0].returnData[2]
                                    :"Username"
                                }
                            </p>
                            <p className={"no-margin" + (this.props.blockchainData[0].returnData !== null ? "" : "grey-text")}>
                                {"Number of replies: " + (this.props.blockchainData[0].returnData !== null
                                    ?this.props.blockchainData[0].returnData[4].length
                                    :"")
                                }
                            </p>
                            <p className="topic-date grey-text darken-3">
                                Started {this.props.blockchainData[0].returnData !== null &&
                                    <TimeAgo date={epochTimeConverter(this.props.blockchainData[0].returnData[3])}/>
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    componentDidUpdate(){
        if (this.props.blockchainData[0].returnData !== null && this.topicSubjectFetchStatus === "pending") {
            this.fetchSubject(this.props.topicID);
        }
    }
};

const mapStateToProps = state => {
    return {
        user: state.user,
        orbitDB: state.orbitDB
    }
}

export default drizzleConnect(Topic, mapStateToProps);