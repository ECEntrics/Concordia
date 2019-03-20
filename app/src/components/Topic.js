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
    const { topicSubjectFetchStatus } = this.state;
    const { topicData, orbitDB, topicID } = this.props;

    if (topicData !== null
        && topicSubjectFetchStatus === 'pending'
        && orbitDB.ipfsInitialized
        && orbitDB.orbitdb) {
      this.fetchSubject(topicID);
    }
  }

  componentDidUpdate() {
    const { topicSubjectFetchStatus } = this.state;
    const { topicData, orbitDB, topicID } = this.props;

    if (topicData !== null
        && topicSubjectFetchStatus === 'pending'
        && orbitDB.ipfsInitialized
        && orbitDB.orbitdb) {
      this.fetchSubject(topicID);
    }
  }

  async fetchSubject(topicID) {
    const { topicData, user, orbitDB } = this.props;
    let topicSubject;

    if (topicData.value[1] === user.address) {
      const orbitData = orbitDB.topicsDB.get(topicID);
      topicSubject = orbitData.subject;
    } else {
      const fullAddress = `/orbitdb/${topicData.value[0]}/topics`;
      const store = await orbitDB.orbitdb.open(fullAddress, {type: 'keyvalue'});
      await store.load();

      const localOrbitData = store.get(topicID);
      if (localOrbitData) {
        topicSubject = localOrbitData.subject;
      } else {
        // Wait until we have received something from the network
        store.events.on('replicated', () => {
          topicSubject = store.get(topicID).subject;
        });
      }
    }

    this.setState({
      topicSubject,
      topicSubjectFetchStatus: 'fetched'
    });
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
                {topicSubject !== null ? topicSubject
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
  topicID: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  orbitDB: state.orbit
});

export default withRouter(connect(mapStateToProps)(Topic));
