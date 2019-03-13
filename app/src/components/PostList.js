import React, { Component } from 'react';
import { connect } from 'react-redux';
import { drizzle } from '../index';

import Post from './Post';

const contract = 'Forum';
const getPostMethod = 'getPost';

class PostList extends Component {
  constructor(props) {
    super(props);

    this.getBlockchainData = this.getBlockchainData.bind(this);

    this.state = {
      dataKeys: []
    };
  }

  render() {
    const posts = this.props.postIDs.map((postID, index) => (
      <Post
        postData={(this.state.dataKeys[postID]
              && this.props.contracts[contract][getPostMethod][this.state.dataKeys[postID]])
          ? this.props.contracts[contract][getPostMethod][this.state.dataKeys[postID]]
          : null}
        avatarUrl=""
        postIndex={index}
        postID={postID}
        getFocus={this.props.focusOnPost === postID}
        key={postID}
      />
    ));

    return (
      <div>
        {this.props.recentToTheTop
          ? posts.slice(0).reverse()
          : posts
          }
      </div>
    );
  }

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
  }

  getBlockchainData() {
    if (this.props.drizzleStatus.initialized) {
      const dataKeysShallowCopy = this.state.dataKeys.slice();
      let fetchingNewData = false;

      this.props.postIDs.forEach((postID) => {
        if (!this.state.dataKeys[postID]) {
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
}

const mapStateToProps = state => ({
  contracts: state.contracts,
  drizzleStatus: state.drizzleStatus
});

export default connect(mapStateToProps)(PostList);
