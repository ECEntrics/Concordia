import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GetTopicResult } from '../CustomPropTypes'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ContentLoader from 'react-content-loader';
import { Card } from 'semantic-ui-react';

import TimeAgo from 'react-timeago';
import epochTimeConverter from '../helpers/EpochTimeConverter';
import { addPeerDatabase } from '../redux/actions/orbitActions';

class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      askedForReplication: false,
      fetchedSubject: false
    };
  }

  componentDidUpdate() {
    const { dispatch, topicData, topicSubject, orbitDB } = this.props;
    const { askedForReplication } = this.state;
    if(!askedForReplication && orbitDB.ipfsInitialized && orbitDB.orbitdb && dispatch && !topicSubject && topicData) {
      this.setState({ askedForReplication: true });
      dispatch(addPeerDatabase(`/orbitdb/${topicData.value[0]}/topics`));
    }
  }

  render() {
    const { history, topicID, topicData, topicSubject } = this.props;

    return (
      <Card
        link
        className="card"
        onClick={() => {
          history.push(`/topic/${topicID}`);
        }}
      >
        <Card.Content>
          <div className={`topic-subject${
            topicSubject ? '' : ' grey-text'}`}
          >
            <p>
              <strong>
                {(topicSubject) ? topicSubject
                  : (
                    <ContentLoader
                      height={5.8}
                      width={300}
                      speed={2}
                      primaryColor="#b2e8e6"
                      secondaryColor="#00b5ad"
                    >
                      <rect x="0" y="0" rx="3" ry="3" width="150" height="5.5" />
                    </ContentLoader>
                  )}
              </strong>
            </p>
          </div>
          <hr />
          <div className="topic-meta">
            <p className={`no-margin${
              topicData !== null ? '' : ' grey-text'}`}
            >
              {topicData !== null
                ? topicData.value[2]
                : 'Username'
                }
            </p>
            <p className={`no-margin${
              topicData !== null ? '' : ' grey-text'}`}
            >
              {`Number of replies: ${topicData !== null
                ? topicData.value[4].length
                : ''}`
                }
            </p>
            <p className="topic-date grey-text">
              {topicData !== null
                && (
                <TimeAgo
                  date={epochTimeConverter(topicData.value[3])}
                />
                )
                }
            </p>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

Topic.propTypes = {
  user: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  topicData: GetTopicResult.isRequired,
  orbitDB: PropTypes.object.isRequired,
  topicID: PropTypes.number.isRequired
};

function getTopicSubject(state, props){
  const {  user, orbit } = state;
  if (orbit.ipfsInitialized && orbit.orbitdb) {
    const { topicData, topicID } = props;
    if (topicData){
      if(user && topicData.value[1] === user.address) {
        const orbitData = orbit.topicsDB.get(topicID);
        if(orbitData && orbitData.subject)
          return orbitData.subject;
      }
      const db = orbit.replicatedDatabases.find(db => db.fullAddress === `/orbitdb/${topicData.value[0]}/topics`);
      if(db && db.ready && db.store){
        const localOrbitData = db.store.get(topicID);
        if (localOrbitData){
          return localOrbitData.subject;
        }
      }
    }
  }
  return null;
}



function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    orbitDB: state.orbit,
    topicSubject: getTopicSubject(state, ownProps)
  }
}


export default withRouter(connect(mapStateToProps)(Topic));
