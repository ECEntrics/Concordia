import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import PostList from '../components/PostList';
import NewPost from '../components/NewPost';
import FloatingButton from '../components/FloatingButton';

import { setNavBarTitle } from '../redux/actions/userInterfaceActions.js';

const contract = 'Forum';
const getTopicMethod = 'getTopic';

class TopicContainer extends Component {
  constructor(props) {
    super(props);

    const { match, navigateTo } = props;

    // Topic ID should be a positive integer
    if (!/^[0-9]+$/.test(match.params.topicId)) {
      navigateTo('/404');
    }

    this.getBlockchainData = this.getBlockchainData.bind(this);
    this.fetchTopicSubject = this.fetchTopicSubject.bind(this);
    this.togglePostingState = this.togglePostingState.bind(this);
    this.postCreated = this.postCreated.bind(this);

    this.state = {
      pageStatus: 'initialized',
      topicID: parseInt(match.params.topicId),
      topicSubject: null,
      postFocus: match.params.postId
      && /^[0-9]+$/.test(match.params.postId)
        ? match.params.postId
        : null,
      fetchTopicSubjectStatus: 'pending',
      posting: false
    };
  }

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
  }

  componentWillUnmount() {
    const { setNavBarTitle } = this.props;
    setNavBarTitle('');
  }

  getBlockchainData() {
    const { pageStatus, topicID, fetchTopicSubjectStatus } = this.state;
    const { drizzleStatus, orbitDB, contracts } = this.props;

    if (pageStatus === 'initialized'
        && drizzleStatus.initialized) {
      this.dataKey = drizzle.contracts[contract].methods[getTopicMethod].cacheCall(
        topicID,
      );
      this.setState({
        pageStatus: 'loading'
      });
    }
    if (pageStatus === 'loading'
        && contracts[contract][getTopicMethod][this.dataKey]) {
      this.setState({
        pageStatus: 'loaded'
      });
      if (orbitDB.orbitdb !== null) {
        this.fetchTopicSubject(
          contracts[contract][getTopicMethod][this.dataKey].value[0],
        );
        this.setState({
          fetchTopicSubjectStatus: 'fetching'
        });
      }
    }
    if (pageStatus === 'loaded'
        && fetchTopicSubjectStatus === 'pending'
        && orbitDB.orbitdb !== null) {
      this.fetchTopicSubject(
        contracts[contract][getTopicMethod][this.dataKey].value[0],
      );
      this.setState({
        fetchTopicSubjectStatus: 'fetching'
      });
    }
  }

  async fetchTopicSubject(orbitDBAddress) {
    const { topicID } = this.state;
    const { contracts, user, orbitDB, setNavBarTitle } = this.props;

    let orbitData;
    if (contracts[contract][getTopicMethod][this.dataKey].value[1]
        === user.address) {
      orbitData = orbitDB.topicsDB.get(topicID);
    } else {
      const fullAddress = `/orbitdb/${orbitDBAddress}/topics`;
      const store = await orbitDB.orbitdb.keyvalue(fullAddress);
      await store.load();

      const localOrbitData = store.get(topicID);
      if (localOrbitData) {
        orbitData = localOrbitData;
      } else {
        // Wait until we have received something from the network
        store.events.on('replicated', () => {
          orbitData = store.get(topicID);
        });
      }
    }

    setNavBarTitle(orbitData.subject);
    this.setState({
      topicSubject: orbitData.subject,
      fetchTopicSubjectStatus: 'fetched'
    });
  }

  togglePostingState(event) {
    if (event) {
      event.preventDefault();
    }
    this.setState(prevState => ({
      posting: !prevState.posting
    }));
  }

  postCreated() {
    this.setState(prevState => ({
      posting: false
    }));
  }

  render() {
    const { pageStatus, postFocus, topicID, topicSubject, posting } = this.state;
    const { contracts, user } = this.props;

    let topicContents;
    if (pageStatus === 'loaded') {
      topicContents = (
        (
          <div>
            <PostList
              postIDs={contracts[contract][getTopicMethod][this.dataKey].value[4]}
              focusOnPost={postFocus
                ? postFocus
                : null}
            />
            {posting
            && (
            <NewPost
              topicID={topicID}
              subject={topicSubject}
              postIndex={contracts[contract][getTopicMethod][this.dataKey].value[4].length}
              onCancelClick={() => { this.togglePostingState(); }}
              onPostCreated={() => { this.postCreated(); }}
            />
            )
            }
            <div className="posts-list-spacer" />
            {user.hasSignedUp && !posting
            && <FloatingButton onClick={this.togglePostingState} />
            }
          </div>
        )
      );
    }

    return (
      <div className="fill">
        {topicContents}
        {!posting
          && <div className="bottom-overlay-pad" />
          }
      </div>
    );
  }
}

TopicContainer.propTypes = {
  drizzleStatus: PropTypes.object.isRequired,
  orbitDB: PropTypes.object.isRequired,
  setNavBarTitle: PropTypes.func.isRequired,
  contracts: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators({
  navigateTo: location => push(location),
  setNavBarTitle: navBarTitle => setNavBarTitle(navBarTitle)
}, dispatch);

const mapStateToProps = state => ({
  user: state.user,
  contracts: state.contracts,
  drizzleStatus: state.drizzleStatus,
  orbitDB: state.orbit
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicContainer);
