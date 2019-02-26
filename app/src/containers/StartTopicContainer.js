import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Form, TextArea, Button, Icon } from 'semantic-ui-react'
import NewTopicPreview from '../components/NewTopicPreview'

import { createTopic } from '../redux/actions/transactionsActions';

class StartTopicContainer extends Component {
    constructor(props, context) {
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
            previewDate: ""
        };
    }

    async validateAndPost() {
        if (this.state.topicSubjectInput === '' || this.state.topicMessageInput === ''){
            this.setState({
                topicSubjectInputEmptySubmit: this.state.topicSubjectInput === '',
                topicMessageInputEmptySubmit: this.state.topicMessageInput === ''
            });
            return;
        }

        this.props.dispatch(
            createTopic(
                {
                    topicSubject: this.state.topicSubjectInput,
                    topicMessage: this.state.topicMessageInput
                }
            )
        );
        this.props.history.push("/home");
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handlePreviewToggle() {
        this.setState((prevState, props) => ({
          previewEnabled: !prevState.previewEnabled,
          previewDate: this.getDate()
        }));
    }

    getDate() {
        const currentdate = new Date();
        return ((currentdate.getMonth() + 1)  + " "
            + currentdate.getDate() + ", "
            + currentdate.getFullYear() + ", "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds());
    }

    render() {
        if (!this.props.user.hasSignedUp) {
            this.props.history.push("/signup");
            return(null);
        }

        var previewEditText = this.state.previewEnabled ? "Edit" : "Preview";
        return (
            <div>
                {this.state.previewEnabled &&
                    <NewTopicPreview
                        date={this.state.previewDate}
                        subject={this.state.topicSubjectInput}
                        content={this.state.topicMessageInput}
                    />
                }
                <Form>
                    {!this.state.previewEnabled &&
                        [<Form.Field key={"topicSubjectInput"}>
                            <Form.Input name={"topicSubjectInput"}
                                error={this.state.topicSubjectInputEmptySubmit}
                                type="text"
                                value={this.state.topicSubjectInput}
                                placeholder="Subject"
                                id="topicSubjectInput"
                                onChange={this.handleInputChange} />
                        </Form.Field>,
                        <TextArea key={"topicMessageInput"}
                            name={"topicMessageInput"}
                            className={this.state.topicMessageInputEmptySubmit ? "form-textarea-required" : ""}
                            value={this.state.topicMessageInput}
                            placeholder="Post"
                            id="topicMessageInput"
                            rows={5}
                            autoHeight
                            onChange={this.handleInputChange} />]
                    }
                    <br/><br/>
                    <Button.Group>
                        <Button animated key="submit" type="button" color='teal'
                            onClick={this.validateAndPost}>
                            <Button.Content visible>Post</Button.Content>
                            <Button.Content hidden>
                                <Icon name='send' />
                            </Button.Content>
                        </Button>
                        <Button type="button" color='yellow'
                            onClick={this.handlePreviewToggle}>
                            {previewEditText}
                        </Button>
                    </Button.Group>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orbitDB: state.orbitDB,
        user: state.user
    }
};

export default connect(mapStateToProps)(StartTopicContainer);
