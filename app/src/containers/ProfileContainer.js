import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Tab } from 'semantic-ui-react';
import { drizzle } from '../index';

import ProfileInformation from '../components/ProfileInformation';
import TopicList from '../components/TopicList';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';
import { setNavBarTitle } from '../redux/actions/userInterfaceActions';

const callsInfo = [
  {
    contract: 'Forum',
    method: 'getUsername'
  }, {
    contract: 'Forum',
    method: 'getUserTopics'
  }, {
    contract: 'Forum',
    method: 'getUserPosts'
  }
];

class ProfileContainer extends Component {
  constructor(props) {
    super(props);

    const { match, user } = this.props;

    this.getBlockchainData = this.getBlockchainData.bind(this);

    this.dataKey = [];
    const address = match.params.address
      ? match.params.address
      : user.address;

    this.state = {
      pageStatus: 'initialized',
      userAddress: address,
      username: '',
      topicIDs: null,
      postIDs: null
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
    const { userAddress, pageStatus, username, topicIDs, postIDs } = this.state;
    const { drizzleStatus, setNavBarTitle, contracts } = this.props;

    if (pageStatus === 'initialized'
        && drizzleStatus.initialized) {
      callsInfo.forEach((call, index) => {
        this.dataKey[index] = drizzle.contracts[call.contract].methods[call.method].cacheCall(
          userAddress,
        );
      });
      this.setState({
        pageStatus: 'loading'
      });
    }

    if (pageStatus === 'loading') {
      let pageStatusUpdate = 'loaded';
      callsInfo.forEach((call, index) => {
        if (!contracts[call.contract][call.method][this.dataKey[index]]) {
          pageStatusUpdate = 'loading';
        }
      });

      if (pageStatusUpdate === 'loaded') {
        this.setState({
          pageStatus: pageStatusUpdate
        });
      }
    }

    if (pageStatus === 'loaded') {
      if (username === '') {
        const transaction = contracts[callsInfo[0].contract][callsInfo[0].method][this.dataKey[0]];
        if (transaction) {
          const username = transaction.value;
          setNavBarTitle(username);
          this.setState({
            username
          });
        }
      }
      if (topicIDs === null) {
        const transaction = contracts[callsInfo[1].contract][callsInfo[1].method][this.dataKey[1]];
        if (transaction) {
          this.setState({
            topicIDs: transaction.value
          });
        }
      }
      if (postIDs === null) {
        const transaction = contracts[callsInfo[2].contract][callsInfo[2].method][this.dataKey[2]];
        if (transaction) {
          this.setState({
            postIDs: transaction.value
          });
        }
      }

      /* this.props.store.dispatch(hideProgressBar()); */
    }
  }

  render() {
    const { userAddress, username, topicIDs, postIDs } = this.state;
    const { navigateTo, user } = this.props;

    if (!user.hasSignedUp) {
      navigateTo('/signup');
      return (null);
    }

    const infoTab = (
      <ProfileInformation
        address={userAddress}
        username={username}
        numberOfTopics={topicIDs && topicIDs.length}
        numberOfPosts={postIDs && postIDs.length}
        self={userAddress === user.address}
        key="profileInfo"
      />
    );
    const topicsTab = (
      <div className="profile-tab">
        {topicIDs
          ? <TopicList topicIDs={topicIDs} />
          : <LoadingSpinner />
          }
      </div>
    );
    const postsTab = (
      <div className="profile-tab">
        {postIDs
          ? <PostList postIDs={postIDs} recentToTheTop />
          : <LoadingSpinner />
          }
      </div>
    );

    const profilePanes = [
      {
        menuItem: 'INFORMATION',
        pane: {
          key: 'INFORMATION',
          content: (infoTab)
        }
      },
      {
        menuItem: 'TOPICS',
        pane: {
          key: 'TOPICS',
          content: (topicsTab)
        }
      },
      {
        menuItem: 'POSTS',
        pane: {
          key: 'POSTS',
          content: (postsTab)
        }
      }
    ];

    return (
      <div>
        <Tab
          menu={{
            secondary: true, pointing: true
          }}
          panes={profilePanes}
          renderActiveOnly={false}
        />
      </div>
    );
  }
}

ProfileContainer.propTypes = {
  match: PropTypes.object.isRequired,
  drizzleStatus: PropTypes.object.isRequired,
  contracts: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setNavBarTitle: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators({
  navigateTo: location => push(location),
  setNavBarTitle: navBarTitle => setNavBarTitle(navBarTitle)
}, dispatch);

const mapStateToProps = state => ({
  user: state.user,
  drizzleStatus: state.drizzleStatus,
  contracts: state.contracts,
  orbitDB: state.orbitDB
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer);
