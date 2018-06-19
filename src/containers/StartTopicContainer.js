import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import { Form, TextArea, Button, Icon } from 'semantic-ui-react'
import NewTopicPreview from '../components/NewTopicPreview'

import { createTopic } from '../redux/actions/transactionsMonitorActions';

class StartTopic extends Component {
    constructor(props, context) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePreviewToggle = this.handlePreviewToggle.bind(this);
        this.validateAndPost = this.validateAndPost.bind(this);
        this.pushToDatabase = this.pushToDatabase.bind(this);

        this.state = {
            topicSubjectInput: '',
            topicMessageInput: '',
            topicSubjectInputEmptySubmit: false,
            topicMessageInputEmptySubmit: false,
            previewEnabled: false,
            previewDate: "",
            creatingTopic: false
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

        this.props.store.dispatch(
            createTopic(((returnData) => {
                this.topicIDFetched = returnData.topicID;
                this.postIDFetched = returnData.postID;
                this.pushToDatabase();
                this.props.router.push("/topic/" + this.topicIDFetched);
            }))
        );
        this.setState({
            'creatingTopic': true
        });
    }

    async pushToDatabase() {
        await this.props.orbitDB.topicsDB.put(this.topicIDFetched, {
            subject: this.state.topicSubjectInput
        });

        await this.props.orbitDB.postsDB.put(this.postIDFetched, {
            subject: this.state.topicSubjectInput,
            content: this.state.topicMessageInput
        });
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
            this.context.router.push("/signup");
            return(null);
        }

        var previewEditText = this.state.previewEnabled ? "Edit" : "Preview";
        return (
            <div>
                {/*this.state.creatingTopic && <div id="overlay">
                        <div id="overlay-content">
                            <p><i className="fas fa-spinner fa-3x fa-spin"></i></p>
                            <br/>
                            {this.transactionProgressText}
                        </div>
                    </div>*/
                }
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

StartTopic.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = state => {
    return {
        transactions: state.transactions,
        transactionStack: state.transactionStack,
        orbitDB: state.orbitDB,
        user: state.user
    }
};

const StartTopicContainer = drizzleConnect(StartTopic, mapStateToProps)

export default StartTopicContainer;