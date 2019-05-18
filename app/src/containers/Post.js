import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ContentLoader from 'react-content-loader';
import { Button, Divider, Grid, Icon, Label } from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

import { GetPostResult } from '../CustomPropTypes'
import { addPeerDatabase } from '../redux/actions/orbitActions';

class Post extends Component {
  constructor(props) {
    super(props);

    if (props.getFocus)
      this.postRef = React.createRef();
  }

  componentDidMount() {
    const { addPeerDB, userAddress, postData } = this.props;
    if(postData.userAddress !== userAddress )
      addPeerDB(postData.userAddress, 'posts');
  }

  render() {
    const { avatarUrl, postIndex, navigateTo, postData, postID, postSubject, postContent } = this.props;

    return (
        <div className="post" ref={this.postRef ? this.postRef : null}>
          <Divider horizontal>
            <span className="grey-text">
#
              {postIndex}
            </span>
          </Divider>
          <Grid>
            <Grid.Row columns={16} stretched>
              <Grid.Column width={1} className="user-avatar">
                <Link
                  to={`/profile/${postData.userAddress}/${postData.userName}`}
                  onClick={(event) => { event.stopPropagation(); }} >
                    <UserAvatar
                      size="52"
                      className="inline"
                      src={avatarUrl}
                      name={postData.userName}
                    />
                </Link>
              </Grid.Column>
              <Grid.Column width={15}>
                <div className="">
                  <div className="stretch-space-between">
                    <span>
                      <strong>
                        {postData.userName}
                      </strong>
                    </span>
                    <span className="grey-text">
                      <TimeAgo date={postData.timestamp} />
                    </span>
                  </div>
                  <div className="stretch-space-between">
                    <span>
                      <strong>
                        {postSubject === ''
                          ? (
                            <ContentLoader
                              height={5.8}
                              width={300}
                              speed={2}
                              primaryColor="#b2e8e6"
                              secondaryColor="#00b5ad"
                            >
                              <rect
                                x="0"
                                y="0"
                                rx="3"
                                ry="3"
                                width="75"
                                height="5.5"
                              />
                            </ContentLoader>
                          )
                          : `Subject: ${postSubject}`
                        }
                      </strong>
                    </span>
                  </div>
                  <div className="post-content">
                    {postContent !== ''
                      ? <ReactMarkdown source={postContent} />
                      : (
                        <ContentLoader
                          height={11.2}
                          width={300}
                          speed={2}
                          primaryColor="#b2e8e6"
                          secondaryColor="#00b5ad"
                        >
                          <rect
                            x="0"
                            y="0"
                            rx="3"
                            ry="3"
                            width="180"
                            height="4.0"
                          />
                          <rect
                            x="0"
                            y="6.5"
                            rx="3"
                            ry="3"
                            width="140"
                            height="4.0"
                          />
                        </ContentLoader>
                      )}
                  </div>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column floated="right" textAlign="right">
                <Button
                  icon
                  size="mini"
                  style={{
                    marginRight: '0px'
                  }}
                >
                  <Icon name="chevron up" />
                </Button>
                <Label color="teal">8000</Label>
                <Button icon size="mini">
                  <Icon name="chevron down" />
                </Button>
                <Button
                  icon
                  size="mini"
                  onClick={postData
                    ? () => {
                      navigateTo(`/topic/${
                        postData.topicID}/${
                        postID}`);
                    }
                    : () => {}}
                >
                  <Icon name="linkify" />
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
    );
  }
}

Post.propTypes = {
  getFocus: PropTypes.bool.isRequired,
  userAddress: PropTypes.string.isRequired,
  orbitDB: PropTypes.object.isRequired,
  avatarUrl: PropTypes.string,
  postIndex: PropTypes.number.isRequired,
  navigateTo: PropTypes.func.isRequired,
  postData: GetPostResult.isRequired,
  postID: PropTypes.string.isRequired
};

function getPostSubject(state, props){
  const { user: {address: userAddress}, orbit } = state;
  const { postData, postID } = props;
  if(userAddress === postData.userAddress) {
    const orbitData = orbit.postsDB.get(postID);
    if(orbitData && orbitData.subject)
      return orbitData.subject;
  }
  else{
    const db = orbit.peerDatabases.find(db =>
      (db.userAddress === postData.userAddress) && (db.name === 'posts'));
    if(db && db.store){
      const localOrbitData = db.store.get(postID);
      if (localOrbitData)
        return localOrbitData.subject;
    }
  }
  return '';
}

function getPostContent(state, props){
  const { user: {address: userAddress}, orbit } = state;
  const { postData, postID } = props;
  if(userAddress === postData.userAddress) {
    const orbitData = orbit.postsDB.get(postID);
    if(orbitData && orbitData.content)
      return orbitData.content;
  }
  else{
    const db = orbit.peerDatabases.find(db =>
      (db.userAddress === postData.userAddress) && (db.name === 'posts'));
    if(db && db.store){
      const localOrbitData = db.store.get(postID);
      if (localOrbitData)
        return localOrbitData.content;
    }
  }
  return '';
}

const mapDispatchToProps = dispatch => bindActionCreators({
  navigateTo: location => push(location),
  addPeerDB: (userAddress, name) => addPeerDatabase(userAddress, name)
}, dispatch);

function mapStateToProps(state, ownProps) {
  return {
    userAddress: state.user.address,
    orbitDB: state.orbit,
    postSubject: getPostSubject(state, ownProps),
    postContent: getPostContent(state, ownProps)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post));
