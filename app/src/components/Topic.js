import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GetTopicResult } from '../CustomPropTypes'

import ContentLoader from 'react-content-loader';
import { Card } from 'semantic-ui-react';

import TimeAgo from 'react-timeago';
import { addPeerDatabase } from '../redux/actions/orbitActions';

class Topic extends Component {
  componentDidMount() {
    const { dispatch, userAddress, topicData } = this.props;
    if(topicData.userAddress !== userAddress )
      dispatch(addPeerDatabase(topicData.userAddress, 'topics'));
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
            <p className="no-margin">
              {topicData.userName}
            </p>
            <p className="no-margin">
              Number of Replies: {topicData.numberOfReplies}
            </p>
            <p className="topic-date grey-text">
              <TimeAgo date={topicData.timestamp}/>
            </p>
          </div>
        </Card.Content>
      </Card>
    );
  }
}

Topic.propTypes = {
  userAddress: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  topicData: GetTopicResult.isRequired,
  topicID: PropTypes.number.isRequired
};

function getTopicSubject(state, props){
  const { user: {address: userAddress}, orbit } = state;
  const { topicData, topicID } = props;
  if(userAddress === topicData.userAddress) {
    const orbitData = orbit.topicsDB.get(topicID);
    if(orbitData && orbitData.subject)
      return orbitData.subject;
  }
  else{
    const db = orbit.peerDatabases.find(db =>
      (db.userAddress === topicData.userAddress) && (db.name === 'topics'));
    if(db && db.store){
      const localOrbitData = db.store.get(topicID);
      if (localOrbitData)
        return localOrbitData.subject;
    }
  }

  return null;
}

function mapStateToProps(state, ownProps) {
  return {
    userAddress: state.user.address,
    topicSubject: getTopicSubject(state, ownProps)
  }
}

export default withRouter(connect(mapStateToProps)(Topic));
