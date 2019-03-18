import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import Post from './Post';

const contract = 'Posting';
const getPostMethod = 'getPostInfo';

class PostList extends Component {
  constructor(props) {
    super(props);

    this.getBlockchainData = this.getBlockchainData.bind(this);

    this.state = {
      dataKeys: []
    };
  }

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
  }

  getBlockchainData() {
    const { dataKeys } = this.state;
    const { drizzleStatus, postIDs } = this.props;

    if (drizzleStatus.initialized) {
      const dataKeysShallowCopy = dataKeys.slice();
      let fetchingNewData = false;

      postIDs.forEach((postID) => {
        if (!dataKeys[postID]) {
          dataKeysShallowCopy[postID] = drizzle.contracts[contract].methods[getPostMethod].cacheCall(
            postID,
          );
          fetchingNewData = true;
        }
      });

      if (fetchingNewData) {
        this.setState({
          dataKeys: dataKeysShallowCopy
        });
      }
    }
  }

  render() {
    const { dataKeys } = this.state;
    const { postIDs, contracts, focusOnPost, recentToTheTop } = this.props;

    const posts = postIDs.map((postID, index) => (
      <Post
        postData={(dataKeys[postID]
              && contracts[contract][getPostMethod][dataKeys[postID]])
          ? contracts[contract][getPostMethod][dataKeys[postID]]
          : null}
        avatarUrl=""
        postIndex={index}
        postID={postID}
        getFocus={focusOnPost === postID}
        key={postID}
      />
    ));

    return (
      <div>
        {recentToTheTop
          ? posts.slice(0).reverse()
          : posts
          }
      </div>
    );
  }
}

PostList.propTypes = {
  drizzleStatus: PropTypes.object.isRequired,
  postIDs: PropTypes.array.isRequired,
  contracts: PropTypes.array.isRequired,
  focusOnPost: PropTypes.number,
  recentToTheTop: PropTypes.bool
};

const mapStateToProps = state => ({
  contracts: state.contracts,
  drizzleStatus: state.drizzleStatus
});

export default connect(mapStateToProps)(PostList);
