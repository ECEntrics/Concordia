import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button, Form, Icon, TextArea } from 'semantic-ui-react';
import NewTopicPreview from './NewTopicPreview';

import { createTopic } from '../redux/actions/transactionsActions';

class StartTopicContainer extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
    this.validateAndPost = this.validateAndPost.bind(this);

    this.state = {
      topicSubjectInput: '',
      topicMessageInput: '',
      topicSubjectInputEmptySubmit: false,
      topicMessageInputEmptySubmit: false,
      previewEnabled: false,
      previewDate: ''
    };
  }

  async validateAndPost() {
    const { topicSubjectInput, topicMessageInput } = this.state;
    const { dispatch, history } = this.props;

    if (topicSubjectInput === '' || topicMessageInput
        === '') {
      this.setState({
        topicSubjectInputEmptySubmit: topicSubjectInput === '',
        topicMessageInputEmptySubmit: topicMessageInput === ''
      });
      return;
    }

    dispatch(
      createTopic(
        {
          topicSubject: topicSubjectInput,
          topicMessage: topicMessageInput
        },
      ),
    );
    history.push('/home');
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handlePreviewToggle() {
    this.setState((prevState) => ({
      previewEnabled: !prevState.previewEnabled,
      previewDate: this.getDate()
    }));
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

  render() {
    const {
      previewDate, previewEnabled, topicSubjectInputEmptySubmit, topicSubjectInput,
      topicMessageInputEmptySubmit, topicMessageInput
    } = this.state;
    const { hasSignedUp, history } = this.props;

    if (!hasSignedUp) {
      history.push('/signup');
      return (null);
    }

    const previewEditText = previewEnabled ? 'Edit' : 'Preview';
    return (
      <div>
        {previewEnabled
          && (
          <NewTopicPreview
            date={previewDate}
            subject={topicSubjectInput}
            content={topicMessageInput}
          />
          )
          }
        <Form>
          {!previewEnabled
            && [
              <Form.Field key="topicSubjectInput">
                <Form.Input
                  name="topicSubjectInput"
                  error={topicSubjectInputEmptySubmit}
                  type="text"
                  value={topicSubjectInput}
                  placeholder="Subject"
                  id="topicSubjectInput"
                  onChange={this.handleInputChange}
                />
              </Form.Field>,
              <TextArea
                key="topicMessageInput"
                name="topicMessageInput"
                className={topicMessageInputEmptySubmit
                  ? 'form-textarea-required'
                  : ''}
                value={topicMessageInput}
                placeholder="Post"
                id="topicMessageInput"
                rows={5}
                autoheight="true"
                onChange={this.handleInputChange}
              />]
            }
          <br />
          <br />
          <Button.Group>
            <Button
              animated
              key="submit"
              type="button"
              color="teal"
              onClick={this.validateAndPost}
            >
              <Button.Content visible>Post</Button.Content>
              <Button.Content hidden>
                <Icon name="send" />
              </Button.Content>
            </Button>
            <Button
              type="button"
              color="yellow"
              onClick={this.handlePreviewToggle}
            >
              {previewEditText}
            </Button>
          </Button.Group>
        </Form>
      </div>
    );
  }
}

StartTopicContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  hasSignedUp: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  hasSignedUp: state.user.hasSignedUp
});

export default connect(mapStateToProps)(StartTopicContainer);
