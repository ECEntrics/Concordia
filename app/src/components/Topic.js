import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GetTopicResult } from '../CustomPropTypes'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ContentLoader from 'react-content-loader';
import { Card } from 'semantic-ui-react';

import TimeAgo from 'react-timeago';
import epochTimeConverter from '../helpers/EpochTimeConverter';

class Topic extends Component {
  constructor(props) {
    super(props);

    this.fetchSubject = this.fetchSubject.bind(this);

    this.state = {
      topicSubject: null,
      topicSubjectFetchStatus: 'pending'
    };
  }

  componentDidMount() {
      this.fetchSubject(this.props.topicID);
  }

  componentDidUpdate() {
      this.fetchSubject(this.props.topicID);
  }

  async fetchSubject(topicID) {
    const { topicSubjectFetchStatus } = this.state;
    const { topicData, user, orbitDB } = this.props;

    if (topicData !== null
      && topicSubjectFetchStatus === 'pending'
      && orbitDB.ipfsInitialized
      && orbitDB.orbitdb) {

      let topicSubject;

      if (topicData.value[1] === user.address) {
        const orbitData = orbitDB.topicsDB.get(topicID);
        if(orbitData)
          topicSubject = orbitData.subject;
      } else {
        const fullAddress = `/orbitdb/${topicData.value[0]}/topics`;
        const store = await orbitDB.orbitdb.open(fullAddress, {type: 'keyvalue'});
        await store.load();

        const localOrbitData = store.get(topicID);
        if (localOrbitData)
          topicSubject = localOrbitData.subject;

        store.events.on('replicate', () => {
          console.log("Initiated OrbitDB data replication.");
        });

        store.events.on('replicated', () => {
          console.log("OrbitDB data replicated successfully.");
          topicSubject = store.get(topicID).subject;
        });
      }

      this.setState({
        topicSubject,
        topicSubjectFetchStatus: 'fetched'
      });
    }
  }

  render() {
    const { topicSubject } = this.state;
    const { history, topicID, topicData } = this.props;

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

const mapStateToProps = state => ({
  user: state.user,
  orbitDB: state.orbit
});

export default withRouter(connect(mapStateToProps)(Topic));
