import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ContentLoader from 'react-content-loader';
import { Button, Divider, Grid, Icon, Label, Transition } from 'semantic-ui-react';

import TimeAgo from 'react-timeago';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';
import epochTimeConverter from '../helpers/EpochTimeConverter';

class Post extends Component {
  constructor(props) {
    super(props);

    const { getFocus } = props;

    this.getBlockchainData = this.getBlockchainData.bind(this);
    this.fetchPost = this.fetchPost.bind(this);
    if (getFocus) {
      this.postRef = React.createRef();
    }

    this.state = {
      fetchPostDataStatus: 'pending',
      postContent: '',
      postSubject: '',
      readyForAnimation: false,
      animateOnToggle: true
    };
  }

  componentDidMount() {
    this.getBlockchainData();
  }

  componentDidUpdate() {
    this.getBlockchainData();
    const { readyForAnimation } = this.state;
    if (readyForAnimation) {
      if (this.postRef) {
        setTimeout(() => {
          this.postRef.current.scrollIntoView(
            {
              block: 'start', behavior: 'smooth'
            },
          );
          setTimeout(() => {
            this.setState({
              animateOnToggle: false
            });
          }, 300);
        }, 100);
        this.setState({
          readyForAnimation: false
        });
      }
    }
  }

  getBlockchainData() {
    const { fetchPostDataStatus } = this.state;
    const { postData, orbitDB, postID } = this.props;

    if (postData && orbitDB.orbitdb && fetchPostDataStatus === 'pending') {
      this.setState({
        fetchPostDataStatus: 'fetching'
      });
      this.fetchPost(postID);
    }
  }

  async fetchPost(postID) {
    const { user, postData, orbitDB } = this.props;
    let orbitPostData;

    if (postData.value[1] === user.address) {
      orbitPostData = orbitDB.postsDB.get(postID);
    } else {
      const fullAddress = `/orbitdb/${postData.value[0]}/posts`;
      const store = await orbitDB.orbitdb.keyvalue(fullAddress);
      await store.load();

      const localOrbitData = store.get(postID);
      if (localOrbitData) {
        orbitPostData = localOrbitData;
      } else {
        // Wait until we have received something from the network
        store.events.on('replicated', () => {
          orbitPostData = store.get(postID);
        });
      }
    }

    this.setState({
      postContent: orbitPostData.content,
      postSubject: orbitPostData.subject,
      fetchPostDataStatus: 'fetched',
      readyForAnimation: true
    });
  }

  render() {
    const { animateOnToggle, postSubject, postContent } = this.state;
    const { avatarUrl, postIndex, navigateTo, postData, postID } = this.props;

    const avatarView = (postData
      ? (
        <UserAvatar
          size="52"
          className="inline"
          src={avatarUrl}
          name={postData.value[2]}
        />
      )
      : (
        <div className="user-avatar">
          <ContentLoader
            height={52}
            width={52}
            speed={2}
            primaryColor="#b2e8e6"
            secondaryColor="#00b5ad"
          >
            <circle cx="26" cy="26" r="26" />
          </ContentLoader>
        </div>
      )
    );

    return (
      <Transition
        animation="tada"
        duration={500}
        visible={animateOnToggle}
      >
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
                {postData !== null
                  ? (
                    <Link
                      to={`/profile/${postData.value[1]
                      }/${postData.value[2]}`}
                      onClick={(event) => { event.stopPropagation(); }}
                    >
                      {avatarView}
                    </Link>
                  )
                  : avatarView
                  }
              </Grid.Column>
              <Grid.Column width={15}>
                <div className="">
                  <div className="stretch-space-between">
                    <span className={postData
                                        !== null ? '' : 'grey-text'}
                    >
                      <strong>
                        {postData !== null
                          ? postData.value[2]
                          : 'Username'
                                                }
                      </strong>
                    </span>
                    <span className="grey-text">
                      {postData !== null
                                            && (
                                            <TimeAgo date={epochTimeConverter(
                                              postData.value[3],
                                            )}
                                            />
                                            )
                                            }
                    </span>
                  </div>
                  <div className="stretch-space-between">
                    <span
                      className={postSubject
                                            === '' ? '' : 'grey-text'}
                    >
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
                          : `Subject: ${
                            postSubject}`
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
                      )
                      }
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
                        postData.value[4]}/${
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
      </Transition>
    );
  }
}

Post.propTypes = {
  getFocus: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  orbitDB: PropTypes.object.isRequired,
  avatarUrl: PropTypes.string,
  postIndex: PropTypes.number.isRequired,
  navigateTo: PropTypes.func.isRequired,
  postData: PropTypes.object,
  postID: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators({
  navigateTo: location => push(location)
}, dispatch);

const mapStateToProps = state => ({
  user: state.user,
  orbitDB: state.orbit
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Post));
