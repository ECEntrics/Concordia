import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Divider, Form, Grid, Icon, TextArea } from 'semantic-ui-react';

import TimeAgo from 'react-timeago';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

import { createPost } from '../redux/actions/transactionsActions';

class NewPost extends Component {
  constructor(props) {
    super(props);
    const { subject } = props;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
    this.validateAndPost = this.validateAndPost.bind(this);

    this.newPostOuterRef = React.createRef();

    this.state = {
      postSubjectInput: subject ? subject : '',
      postContentInput: '',
      postSubjectInputEmptySubmit: false,
      postContentInputEmptySubmit: false,
      previewEnabled: false,
      previewDate: ''
    };
  }

  componentDidMount() {
    this.newPostOuterRef.current.scrollIntoView(true);
  }

  getDate() {
    const currentdate = new Date();
    return (`${currentdate.getMonth() + 1} ${
      currentdate.getDate()}, ${
      currentdate.getFullYear()}, ${
      currentdate.getHours()}:${
      currentdate.getMinutes()}:${
      currentdate.getSeconds()}`);
  }

  async validateAndPost() {
    const { postSubjectInput, postContentInput } = this.state;
    const { topicID, onPostCreated, dispatch } = this.props;

    if (postSubjectInput === '' || postContentInput
        === '') {
      this.setState({
        postSubjectInputEmptySubmit: postSubjectInput === '',
        postContentInputEmptySubmit: postContentInput === ''
      });
      return;
    }

    dispatch(
      createPost(topicID,
        {
          postSubject: postSubjectInput,
          postMessage: postContentInput
        }),
    );
    onPostCreated();
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handlePreviewToggle() {
    this.setState(prevState => ({
      previewEnabled: !prevState.previewEnabled,
      previewDate: this.getDate()
    }));
  }

  render() {
    const {
      previewDate, postSubjectInputEmptySubmit, postSubjectInput, postContentInputEmptySubmit,
      postContentInput, previewEnabled
    } = this.state;
    const { postIndex, avatarUrl, user, onCancelClick } = this.props;

    return (
      <div className="post" ref={this.newPostOuterRef}>
        <Divider horizontal>
          <span className="grey-text">
#
            {postIndex}
          </span>
        </Divider>
        <Grid>
          <Grid.Row columns={16} stretched>
            <Grid.Column width={1} className="user-avatar">
              <UserAvatar
                size="52"
                className="inline user-avatar"
                src={avatarUrl}
                name={user.username}
              />
            </Grid.Column>
            <Grid.Column width={15}>
              <div className="">
                <div className="stretch-space-between">
                  <span><strong>{user.username}</strong></span>
                  <span className="grey-text">
                    {previewEnabled
                                        && <TimeAgo date={previewDate} />
                                        }
                  </span>
                </div>
                <div className="stretch-space-between">
                  <span>
                    <strong>
                      {previewEnabled
                                        && (`Subject: ${
                                          postSubjectInput}`)
                                        }
                    </strong>
                  </span>
                </div>
                <div className="post-content">
                  <div style={{
                    display: previewEnabled
                      ? 'block'
                      : 'none'
                  }}
                  >
                    <ReactMarkdown
                      source={postContentInput}
                      className="markdown-preview"
                    />
                  </div>
                  <Form className="topic-form">
                    <Form.Input
                      key="postSubjectInput"
                      style={{
                        display: previewEnabled
                          ? 'none'
                          : ''
                      }}
                      name="postSubjectInput"
                      error={postSubjectInputEmptySubmit}
                      type="text"
                      value={postSubjectInput}
                      placeholder="Subject"
                      id="postSubjectInput"
                      onChange={this.handleInputChange}
                    />
                    <TextArea
                      key="postContentInput"
                      style={{
                        display: previewEnabled
                          ? 'none'
                          : ''
                      }}
                      name="postContentInput"
                      className={postContentInputEmptySubmit
                        ? 'form-textarea-required'
                        : ''}
                      value={postContentInput}
                      placeholder="Post"
                      id="postContentInput"
                      onChange={this.handleInputChange}
                      rows={4}
                      autoHeight
                    />
                    <br />
                    <br />
                    <Button.Group>
                      <Button
                        key="submit"
                        type="button"
                        onClick={this.validateAndPost}
                        color="teal"
                        animated
                      >
                        <Button.Content visible>Post</Button.Content>
                        <Button.Content hidden>
                          <Icon name="reply" />
                        </Button.Content>
                      </Button>
                      <Button
                        type="button"
                        onClick={this.handlePreviewToggle}
                        color="yellow"
                      >
                        {previewEnabled ? 'Edit' : 'Preview'}
                      </Button>
                      <Button
                        type="button"
                        onClick={onCancelClick}
                        color="red"
                      >
                          Cancel
                      </Button>
                    </Button.Group>
                  </Form>
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

NewPost.propTypes = {
  subject: PropTypes.string,
  topicID: PropTypes.number.isRequired,
  postIndex: PropTypes.number.isRequired,
  avatarUrl: PropTypes.string,
  user: PropTypes.object.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  onPostCreated: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  orbitDB: state.orbitDB,
  user: state.user
});

export default connect(mapStateToProps)(NewPost);
